"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

type Result = { ok?: true; error?: string };

function moneyToCents(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return 0;
  const normalized = raw.replace(/\./g, "").replace(",", ".");
  return Math.max(0, Math.round(Number(normalized) * 100));
}

export async function createPurchaseOrder(formData: FormData): Promise<Result> {
  const profile = await requireStaff();
  const supabase = await createClient();

  const supplierId = String(formData.get("supplier_id") ?? "");
  const productId = String(formData.get("product_id") ?? "");
  const typedProductName = String(formData.get("product_name") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 0);
  const unitCostCents = moneyToCents(formData.get("unit_cost"));
  const expectedAt = String(formData.get("expected_at") ?? "") || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!supplierId) return { error: "Escolha um fornecedor." };
  if (!quantity || quantity < 1) return { error: "Informe uma quantidade válida." };

  let productName = typedProductName;
  if (productId) {
    const { data, error } = await supabase
      .from("products")
      .select("name")
      .eq("id", productId)
      .maybeSingle();
    if (error) return { error: error.message };
    const product = data as { name?: string | null } | null;
    productName = String(product?.name ?? typedProductName);
  }

  if (!productName) return { error: "Informe o item do pedido." };

  const totalCents = quantity * unitCostCents;
  const { data: order, error: orderError } = await supabase
    .from("supplier_purchase_orders" as never)
    .insert({
      supplier_id: supplierId,
      status: "ordered",
      expected_at: expectedAt,
      total_cents: totalCents,
      notes,
      created_by: profile.id,
    } as never)
    .select("id")
    .single();

  if (orderError) return { error: orderError.message };

  const orderId = (order as { id: string }).id;
  const { error: itemError } = await supabase
    .from("supplier_purchase_order_items" as never)
    .insert({
      purchase_order_id: orderId,
      product_id: productId || null,
      product_name: productName,
      quantity,
      unit_cost_cents: unitCostCents,
    } as never);

  if (itemError) {
    await supabase
      .from("supplier_purchase_orders" as never)
      .delete()
      .eq("id", orderId);
    return { error: itemError.message };
  }

  revalidatePath("/admin/fornecedores");
  return { ok: true };
}

export async function receivePurchaseOrder(orderId: string): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("supplier_purchase_orders" as never)
    .select("id, status")
    .eq("id", orderId)
    .maybeSingle();
  if (orderError) return { error: orderError.message };
  if (!order) return { error: "Pedido de compra não encontrado." };
  if ((order as { status: string }).status === "received") return { ok: true };

  const { data: items, error: itemsError } = await supabase
    .from("supplier_purchase_order_items" as never)
    .select("id, product_id, quantity")
    .eq("purchase_order_id", orderId);
  if (itemsError) return { error: itemsError.message };

  for (const item of (items ?? []) as { id: string; product_id: string | null; quantity: number }[]) {
    if (!item.product_id) continue;

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.product_id)
      .maybeSingle();
    if (productError) return { error: productError.message };

    const productRow = product as { stock?: number | null } | null;
    const currentStock = Number(productRow?.stock ?? 0);
    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: currentStock + item.quantity } as never)
      .eq("id", item.product_id);
    if (stockError) return { error: stockError.message };

    const { error: itemError } = await supabase
      .from("supplier_purchase_order_items" as never)
      .update({ received_quantity: item.quantity } as never)
      .eq("id", item.id);
    if (itemError) return { error: itemError.message };
  }

  const { error: receiveError } = await supabase
    .from("supplier_purchase_orders" as never)
    .update({ status: "received", received_at: new Date().toISOString() } as never)
    .eq("id", orderId);
  if (receiveError) return { error: receiveError.message };

  revalidatePath("/admin/fornecedores");
  revalidatePath("/admin/produtos");
  return { ok: true };
}

export async function cancelPurchaseOrder(orderId: string): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("supplier_purchase_orders" as never)
    .update({ status: "cancelled" } as never)
    .eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath("/admin/fornecedores");
  return { ok: true };
}
