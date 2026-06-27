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

  // Stripe → enum local de status de assinatura
  const mapSubStatus = (s: string): string => {
    switch (s) {
      case "active": return "active";
      case "trialing": return "trialing";
      case "past_due":
      case "unpaid":
      case "incomplete": return "past_due";
      case "paused": return "paused";
      case "canceled":
      case "incomplete_expired": return "cancelled";
      default: return "active";
    }
  };

  if (event.type === "checkout.session.completed") {
    const session = (event.data?.object ?? {}) as Record<string, unknown>;
    const meta = (session.metadata as Record<string, string> | undefined) ?? {};
    const orderId = meta.order_id;
    const isSubscription = String(session.mode ?? "") === "subscription" || !!meta.plan_id;

    // --- PEDIDO (pagamento único) ---
    if (orderId && !isSubscription) {
      const paymentStatus = String(session.payment_status ?? "paid");
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

    // --- ASSINATURA ---
    if (isSubscription && meta.user_id) {
      const db = createServiceClient();
      if (db) {
        const subId = String(session.subscription ?? "");
        const { data: existing } = await db
          .from("subscriptions")
          .select("id")
          .eq("stripe_subscription_id", subId)
          .maybeSingle();

        if (!existing) {
          await db.from("subscriptions").insert({
            user_id: meta.user_id,
            plan_id: meta.plan_id ?? null,
            status: "active",
            stripe_subscription_id: subId,
            started_at: new Date().toISOString(),
          } as never);
        }
        await db.from("notifications").insert({
          user_id: meta.user_id,
          type: "subscription",
          title: "Assinatura ativada",
          body: "Bem-vindo(a) ao Clube Maison Kranich! Sua curadoria começa agora.",
          link: "/conta/assinaturas",
        } as never);
      }
    }
  }

  // --- Atualização / cancelamento de assinatura ---
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = (event.data?.object ?? {}) as Record<string, unknown>;
    const subId = String(sub.id ?? "");
    const status = event.type === "customer.subscription.deleted" ? "cancelled" : mapSubStatus(String(sub.status ?? ""));
    const db = createServiceClient();
    if (db && subId) {
      await db
        .from("subscriptions")
        .update({
          status,
          cancel_at_period_end: Boolean(sub.cancel_at_period_end),
          current_period_end: sub.current_period_end
            ? new Date(Number(sub.current_period_end) * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("stripe_subscription_id", subId);
    }
  }

  return NextResponse.json({ received: true });
}
