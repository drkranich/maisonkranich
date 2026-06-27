"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

type Input = {
  items: { productId: string; quantity: number }[];
  shipping: Record<string, unknown>;
};

type Out = { ok?: true; number?: number; error?: string };

const FREE_SHIPPING_ABOVE = 29900; // R$ 299

/**
 * Cria um pedido a partir da composição.
 * Os preços são SEMPRE revalidados no servidor (nunca confia no cliente).
 */
export async function createOrder(input: Input): Promise<Out> {
  const user = await getUser();
  if (!user) return { error: "Faça login para finalizar o pedido." };

  const ids = [...new Set(input.items.map((i) => i.productId))];
  if (ids.length === 0) return { error: "Sua composição está vazia." };

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, kind, price_cents, active")
    .in("id", ids);

  const map = new Map((products ?? []).map((p) => [p.id as string, p]));
  let subtotal = 0;
  const lineItems: Record<string, unknown>[] = [];

  for (const it of input.items) {
    const p = map.get(it.productId) as
      | { id: string; name: string; kind: string; price_cents: number; active: boolean }
      | undefined;
    if (!p || !p.active) continue;
    const qty = Math.max(1, Math.floor(it.quantity));
    const total = p.price_cents * qty;
    subtotal += total;
    lineItems.push({
      product_id: p.id,
      name: p.name,
      kind: p.kind,
      quantity: qty,
      unit_price_cents: p.price_cents,
      total_cents: total,
    });
  }

  if (lineItems.length === 0) return { error: "Itens indisponíveis no momento." };

  const shipping_cents = subtotal >= FREE_SHIPPING_ABOVE ? 0 : 0; // frete a integrar
  const total_cents = subtotal + shipping_cents;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      subtotal_cents: subtotal,
      discount_cents: 0,
      shipping_cents,
      total_cents,
      status: "received",
      shipping_address: input.shipping,
      payment: { method: "pendente", status: "pendente" },
    } as never)
    .select("id, number")
    .single();

  if (error || !order) return { error: error?.message ?? "Não foi possível criar o pedido." };

  const { error: itErr } = await supabase
    .from("order_items")
    .insert(lineItems.map((li) => ({ ...li, order_id: (order as { id: string }).id })) as never);

  if (itErr) return { error: itErr.message };

  revalidatePath("/conta/pedidos");
  return { ok: true, number: (order as { number: number }).number };
}
