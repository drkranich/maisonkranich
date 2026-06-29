import { NextResponse } from "next/server";
import { stripeGet, verifyStripeSignature } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type StripeObject = Record<string, unknown>;
type ServiceDb = NonNullable<ReturnType<typeof createServiceClient>>;

function stripeId(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "id" in value) return String((value as { id?: string }).id ?? "");
  return "";
}

function stripeTimestamp(value: unknown) {
  const n = Number(value ?? 0);
  return n > 0 ? new Date(n * 1000).toISOString() : null;
}

function mapSubStatus(status: string) {
  switch (status) {
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
}

function mapDisputeStatus(status: string) {
  const allowed = new Set([
    "needs_response",
    "under_review",
    "won",
    "lost",
    "warning_closed",
    "warning_needs_response",
    "warning_under_review",
  ]);
  return allowed.has(status) ? status : "needs_response";
}

async function notifyStaff(db: ServiceDb, title: string, body: string, link: string) {
  const { data: staff } = await db
    .from("profiles")
    .select("id")
    .in("role", ["owner", "admin", "support"]);

  const rows = ((staff ?? []) as { id: string }[]).map((p) => ({
    user_id: p.id,
    type: "payment",
    title,
    body,
    link,
  }));

  if (rows.length) await db.from("notifications").insert(rows as never);
}

async function handleCheckoutSessionCompleted(db: ServiceDb, session: StripeObject) {
  const meta = (session.metadata as Record<string, string> | undefined) ?? {};
  const orderId = meta.order_id;
  const isSubscription = String(session.mode ?? "") === "subscription" || !!meta.plan_id;

  if (orderId && !isSubscription) {
    const paymentStatus = String(session.payment_status ?? "paid");
    const { data: updated } = await db
      .from("orders")
      .update({
        status: "paid",
        stripe_payment_intent: stripeId(session.payment_intent),
        payment: {
          provider: "stripe",
          method: "stripe_checkout",
          status: paymentStatus,
          session_id: stripeId(session.id),
          customer_id: stripeId(session.customer),
          amount_total: Number(session.amount_total ?? 0),
        },
      } as never)
      .eq("id", orderId)
      .select("user_id, number")
      .single();

    const order = updated as { user_id: string | null; number: number } | null;
    if (order?.user_id) {
      await db.from("notifications").insert({
        user_id: order.user_id,
        type: "payment",
        title: `Pagamento aprovado · Pedido #${order.number}`,
        body: "Recebemos seu pagamento. Já começamos a montar sua caixa.",
        link: "/conta/pedidos",
      } as never);
    }
  }

  if (isSubscription && meta.user_id) {
    const subId = stripeId(session.subscription);
    const customerId = stripeId(session.customer);
    const { data: existing } = await db
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", subId)
      .maybeSingle();

    const subscriptionPatch = {
      user_id: meta.user_id,
      plan_id: meta.plan_id ?? null,
      status: "active",
      stripe_subscription_id: subId,
      stripe_customer_id: customerId || null,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await db
        .from("subscriptions")
        .update(subscriptionPatch as never)
        .eq("stripe_subscription_id", subId);
    } else {
      await db.from("subscriptions").insert(subscriptionPatch as never);
    }

    await db.from("notifications").insert({
      user_id: meta.user_id,
      type: "subscription",
      title: "Assinatura ativada",
      body: "Bem-vindo(a) ao Clube Maison Kranich. Sua curadoria começa agora.",
      link: "/conta/assinaturas",
    } as never);
  }
}

async function handleSubscriptionChanged(db: ServiceDb, eventType: string, sub: StripeObject) {
  const subId = stripeId(sub.id);
  if (!subId) return;

  const status = eventType === "customer.subscription.deleted"
    ? "cancelled"
    : mapSubStatus(String(sub.status ?? ""));

  await db
    .from("subscriptions")
    .update({
      status,
      stripe_customer_id: stripeId(sub.customer) || null,
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      current_period_end: stripeTimestamp(sub.current_period_end),
      updated_at: new Date().toISOString(),
    } as never)
    .eq("stripe_subscription_id", subId);
}

function invoiceSubscriptionId(invoice: StripeObject) {
  const direct = stripeId(invoice.subscription);
  if (direct) return direct;
  const parent = invoice.parent as StripeObject | undefined;
  const details = parent?.subscription_details as StripeObject | undefined;
  return stripeId(details?.subscription);
}

async function handleInvoice(db: ServiceDb, eventType: string, invoice: StripeObject) {
  const subId = invoiceSubscriptionId(invoice);
  const customerId = stripeId(invoice.customer);
  if (!subId && !customerId) return;

  const status = eventType === "invoice.payment_failed" ? "past_due" : "active";
  const lines = (invoice.lines as { data?: StripeObject[] } | undefined)?.data ?? [];
  const firstPeriod = lines[0]?.period as StripeObject | undefined;
  const periodEnd = stripeTimestamp(firstPeriod?.end) ?? stripeTimestamp(invoice.period_end);

  let query = db
    .from("subscriptions")
    .update({
      status,
      stripe_customer_id: customerId || null,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    } as never);

  if (subId) query = query.eq("stripe_subscription_id", subId);
  else query = query.eq("stripe_customer_id", customerId);

  const { data: updated } = await query.select("user_id").maybeSingle();
  const sub = updated as { user_id?: string | null } | null;

  if (sub?.user_id) {
    await db.from("notifications").insert({
      user_id: sub.user_id,
      type: "subscription",
      title: eventType === "invoice.payment_failed" ? "Falha na cobrança da assinatura" : "Assinatura renovada",
      body: eventType === "invoice.payment_failed"
        ? "A Stripe não conseguiu cobrar sua assinatura. Atualize o método de pagamento pelo portal."
        : "Sua assinatura foi renovada com sucesso.",
      link: "/conta/assinaturas",
    } as never);
  }
}

async function fetchChargeAndInvoice(dispute: StripeObject) {
  const chargeId = stripeId(dispute.charge);
  let charge: StripeObject | null = null;
  let invoice: StripeObject | null = null;

  if (chargeId) {
    try {
      charge = await stripeGet<StripeObject>(`/v1/charges/${chargeId}`);
    } catch {
      charge = null;
    }
  }

  const invoiceId = stripeId(charge?.invoice);
  if (invoiceId) {
    try {
      invoice = await stripeGet<StripeObject>(`/v1/invoices/${invoiceId}`);
    } catch {
      invoice = null;
    }
  }

  return { charge, invoice };
}

async function handleDispute(db: ServiceDb, eventType: string, dispute: StripeObject) {
  const { charge, invoice } = await fetchChargeAndInvoice(dispute);

  const disputeId = stripeId(dispute.id);
  const chargeId = stripeId(dispute.charge);
  const paymentIntentId = stripeId(dispute.payment_intent) || stripeId(charge?.payment_intent);
  const invoiceId = stripeId(charge?.invoice);
  const customerId = stripeId(charge?.customer) || stripeId(invoice?.customer);
  const subId = invoice ? invoiceSubscriptionId(invoice) : "";

  const { data: order } = paymentIntentId
    ? await db
      .from("orders")
      .select("id, number, user_id")
      .eq("stripe_payment_intent", paymentIntentId)
      .maybeSingle()
    : { data: null };

  const { data: subscription } = subId
    ? await db
      .from("subscriptions")
      .select("id, user_id")
      .eq("stripe_subscription_id", subId)
      .maybeSingle()
    : customerId
      ? await db
        .from("subscriptions")
        .select("id, user_id")
        .eq("stripe_customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      : { data: null };

  const orderRow = order as { id: string; number: number; user_id: string | null } | null;
  const subRow = subscription as { id: string; user_id: string | null } | null;
  const status = mapDisputeStatus(String(dispute.status ?? ""));
  const isClosed = eventType === "charge.dispute.closed" || ["won", "lost", "warning_closed"].includes(status);
  const evidence = (dispute.evidence as StripeObject | undefined) ?? {};
  const evidenceDetails = (dispute.evidence_details as StripeObject | undefined) ?? {};

  await db
    .from("disputes")
    .upsert({
      order_id: orderRow?.id ?? null,
      subscription_id: subRow?.id ?? null,
      kind: orderRow ? "order" : subRow ? "subscription" : "unknown",
      stripe_dispute_id: disputeId,
      stripe_charge_id: chargeId || null,
      stripe_payment_intent: paymentIntentId || null,
      stripe_invoice_id: invoiceId || null,
      stripe_customer_id: customerId || null,
      reason: String(dispute.reason ?? ""),
      amount_cents: Number(dispute.amount ?? 0),
      currency: String(dispute.currency ?? "brl"),
      status,
      evidence,
      due_by: stripeTimestamp(evidenceDetails.due_by),
      livemode: Boolean(dispute.livemode),
      event_type: eventType,
      payload: dispute,
      opened_at: stripeTimestamp(dispute.created),
      closed_at: isClosed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    } as never, { onConflict: "stripe_dispute_id" });

  const label = orderRow ? `pedido #${orderRow.number}` : subRow ? "assinatura" : "pagamento";
  await notifyStaff(
    db,
    isClosed ? "Disputa atualizada na Stripe" : "Nova disputa na Stripe",
    `Existe uma disputa em ${label}: ${status}.`,
    "/admin/pagamentos"
  );
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("stripe-signature");
  const payload = await request.text();

  if (!secret || !sig) {
    return NextResponse.json({ error: "webhook nao configurado" }, { status: 400 });
  }

  const valid = await verifyStripeSignature(payload, sig, secret);
  if (!valid) {
    return NextResponse.json({ error: "assinatura invalida" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: StripeObject } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "payload invalido" }, { status: 400 });
  }

  const db = createServiceClient();
  if (!db) {
    return NextResponse.json({ error: "service role nao configurado" }, { status: 500 });
  }

  const object = event.data?.object ?? {};

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(db, object);
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionChanged(db, event.type, object);
      break;
    case "invoice.paid":
    case "invoice.payment_failed":
      await handleInvoice(db, event.type, object);
      break;
    case "charge.dispute.created":
    case "charge.dispute.updated":
    case "charge.dispute.closed":
      await handleDispute(db, event.type, object);
      break;
  }

  return NextResponse.json({ received: true });
}
