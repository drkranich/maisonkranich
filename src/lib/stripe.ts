/**
 * Integracao Stripe via API REST (fetch), compativel com Cloudflare Workers.
 */

const STRIPE_API_VERSION = "2026-02-25.clover";

export function stripeConfigured() {
  return !!process.env.STRIPE_SECRET_KEY;
}

async function stripePost<T>(path: string, params: URLSearchParams): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY!;
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": STRIPE_API_VERSION,
    },
    body: params.toString(),
  });

  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message ?? "Falha na comunicacao com a Stripe.");
  }
  return json;
}

export async function stripeGet<T>(path: string): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY!;
  const res = await fetch(`https://api.stripe.com${path}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Stripe-Version": STRIPE_API_VERSION,
    },
  });

  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message ?? "Falha na comunicacao com a Stripe.");
  }
  return json;
}

type SessionInput = {
  orderId: string;
  orderNumber: number;
  origin: string;
  customerEmail?: string;
  items: { name: string; unit_amount: number; quantity: number }[];
};

/** Cria uma Stripe Checkout Session hospedada e devolve a URL de pagamento. */
export async function createCheckoutSession(input: SessionInput): Promise<string> {
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${input.origin}/checkout/obrigado?numero=${input.orderNumber}`);
  params.set("cancel_url", `${input.origin}/checkout`);
  params.set("client_reference_id", input.orderId);
  params.set("metadata[order_id]", input.orderId);
  params.set("metadata[order_number]", String(input.orderNumber));
  if (input.customerEmail) params.set("customer_email", input.customerEmail);
  params.set("locale", "pt-BR");

  input.items.forEach((it, i) => {
    params.set(`line_items[${i}][quantity]`, String(it.quantity));
    params.set(`line_items[${i}][price_data][currency]`, "brl");
    params.set(`line_items[${i}][price_data][unit_amount]`, String(it.unit_amount));
    params.set(`line_items[${i}][price_data][product_data][name]`, it.name);
  });

  const json = await stripePost<{ url?: string; error?: { message?: string } }>("/v1/checkout/sessions", params);
  if (!json.url) throw new Error(json.error?.message ?? "Falha ao criar sessao de pagamento.");
  return json.url;
}

type SubscriptionInput = {
  priceId: string;
  origin: string;
  userId: string;
  planId: string;
  customerEmail?: string;
};

/** Cria uma Checkout Session em modo assinatura a partir de um price id. */
export async function createSubscriptionSession(input: SubscriptionInput): Promise<string> {
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("success_url", `${input.origin}/conta/assinaturas?ok=1`);
  params.set("cancel_url", `${input.origin}/assinaturas`);
  params.set("client_reference_id", input.userId);
  params.set("metadata[user_id]", input.userId);
  params.set("metadata[plan_id]", input.planId);
  params.set("subscription_data[metadata][user_id]", input.userId);
  params.set("subscription_data[metadata][plan_id]", input.planId);
  if (input.customerEmail) params.set("customer_email", input.customerEmail);
  params.set("locale", "pt-BR");
  params.set("line_items[0][price]", input.priceId);
  params.set("line_items[0][quantity]", "1");

  const json = await stripePost<{ url?: string; error?: { message?: string } }>("/v1/checkout/sessions", params);
  if (!json.url) throw new Error(json.error?.message ?? "Falha ao criar assinatura.");
  return json.url;
}

export async function createCustomerPortalSession(input: {
  customerId: string;
  returnUrl: string;
}): Promise<string> {
  const params = new URLSearchParams();
  params.set("customer", input.customerId);
  params.set("return_url", input.returnUrl);

  const json = await stripePost<{ url?: string; error?: { message?: string } }>("/v1/billing_portal/sessions", params);
  if (!json.url) throw new Error(json.error?.message ?? "Falha ao abrir o portal da assinatura.");
  return json.url;
}

/** Verifica a assinatura do webhook do Stripe usando Web Crypto (HMAC-SHA256). */
export async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((kv) => {
        const idx = kv.indexOf("=");
        return [kv.slice(0, idx), kv.slice(idx + 1)];
      })
    ) as Record<string, string>;

    const t = parts["t"];
    const v1 = parts["v1"];
    if (!t || !v1) return false;

    const enc = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(`${t}.${payload}`));
    const expected = [...new Uint8Array(sig)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expected.length !== v1.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
    return diff === 0;
  } catch {
    return false;
  }
}
