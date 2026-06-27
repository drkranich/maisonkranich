import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!secret || !sig) {
    return NextResponse.json({ error: "webhook não configurado" }, { status: 400 });
  }

  const valid = await verifyStripeSignature(payload, sig, secret);
  if (!valid) {
    return NextResponse.json({ error: "assinatura inválida" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = (event.data?.object ?? {}) as Record<string, unknown>;
    const orderId = (session.metadata as Record<string, string> | undefined)?.order_id;
    const paymentStatus = String(session.payment_status ?? "paid");

    if (orderId) {
      const db = createServiceClient();
      if (db) {
        const { data: updated } = await db
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent: String(session.payment_intent ?? ""),
            payment: {
              provider: "stripe",
              method: "stripe_checkout",
              status: paymentStatus,
              session_id: String(session.id ?? ""),
              amount_total: Number(session.amount_total ?? 0),
            },
          } as never)
          .eq("id", orderId)
          .select("user_id, number")
          .single();

        const o = updated as { user_id: string | null; number: number } | null;
        if (o?.user_id) {
          await db.from("notifications").insert({
            user_id: o.user_id,
            type: "payment",
            title: `Pagamento aprovado · Pedido #${o.number}`,
            body: "Recebemos seu pagamento. Já começamos a montar sua caixa!",
            link: "/conta/pedidos",
          } as never);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
