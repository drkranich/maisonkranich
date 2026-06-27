/**
 * Integração Stripe via API REST (fetch) — sem SDK, compatível com Cloudflare Workers.
 */

export function stripeConfigured() {
  return !!process.env.STRIPE_SECRET_KEY;
}

type SessionInput = {
  orderId: string;
  orderNumber: number;
  origin: string;
  customerEmail?: string;
  items: { name: string; unit_amount: number; quantity: number }[];
};

/** Cria uma Stripe Checkout Session (hospedada) e devolve a URL de pagamento. */
export async function createCheckoutSession(input: SessionInput): Promise<string> {
  const key = process.env.STRIPE_SECRET_KEY!;
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

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !json.url) {
    throw new Error(json.error?.message ?? "Falha ao criar sessão de pagamento.");
  }
  return json.url;
}

type SubscriptionInput = {
  priceId: string;
  origin: string;
  userId: string;
  planId: string;
  customerEmail?: string;
};

/** Cria uma Checkout Session em modo assinatura (recorrente) a partir de um price id. */
export async function createSubscriptionSession(input: SubscriptionInput): Promise<string> {
  const key = process.env.STRIPE_SECRET_KEY!;
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

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !json.url) {
    throw new Error(json.error?.message ?? "Falha ao criar assinatura.");
  }
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

    // comparação de tempo (aproximadamente) constante
    if (expected.length !== v1.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
    return diff === 0;
  } catch {
    return false;
  }
}
