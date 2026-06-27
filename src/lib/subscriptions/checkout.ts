"use server";

import { headers } from "next/headers";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { stripeConfigured, createSubscriptionSession } from "@/lib/stripe";

/** Inicia o checkout de assinatura de um plano. Retorna a URL do Stripe. */
export async function startSubscription(planId: string): Promise<{ url?: string; error?: string }> {
  const user = await getUser();
  if (!user) return { error: "Faça login para assinar." };

  if (!stripeConfigured()) {
    return { error: "Pagamentos ainda não estão ativos. Tente novamente em instantes." };
  }

  const supabase = await createClient();
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("id, name, stripe_price_id, active")
    .eq("id", planId)
    .maybeSingle();

  if (!plan || !plan.active) return { error: "Plano indisponível." };
  if (!plan.stripe_price_id) return { error: "Este plano ainda não está conectado à Stripe." };

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;

  try {
    const url = await createSubscriptionSession({
      priceId: plan.stripe_price_id as string,
      origin,
      userId: user.id,
      planId: plan.id as string,
      customerEmail: user.email ?? undefined,
    });
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Não foi possível iniciar a assinatura." };
  }
}
