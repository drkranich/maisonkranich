import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { getPage } from "@/lib/site";
import { SubscribeButton } from "@/components/subscriptions/SubscribeButton";

export const metadata: Metadata = { title: "Assinaturas" };
export const dynamic = "force-dynamic";

const intervalLabel: Record<string, string> = {
  monthly: "/mês", quarterly: "/trimestre", semiannual: "/semestre", annual: "/ano",
};

export default async function AssinaturasPage() {
  const supabase = await createClient();
  const page = await getPage("assinaturas");
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("id, slug, name, description, interval, price_cents, features, highlight, stripe_price_id")
    .eq("active", true)
    .order("sort_order");

  return (
    <PageShell>
      <PageHero
        kicker="Clube Maison Kranich"
        title={page?.title ?? "Assinaturas"}
        subtitle={page?.subtitle ?? "Receba caixas curadas com carinho, no seu ritmo. Cada entrega, uma nova história."}
      />
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {(plans ?? []).map((p) => {
            const feats = (p.features as string[]) ?? [];
            return (
              <div key={p.slug} className={`mk-card flex flex-col p-6 ${p.highlight ? "ring-1 ring-dourado/40" : ""}`}>
                {p.highlight && (
                  <span className="mb-3 self-start rounded-full bg-dourado/15 px-3 py-1 text-[9px] uppercase tracking-wide text-dourado">
                    Mais escolhido
                  </span>
                )}
                <h2 className="font-serif text-2xl text-marfim">{p.name}</h2>
                <div className="mt-2 font-serif text-3xl text-dourado">
                  {brl(p.price_cents)}
                  <span className="text-sm text-marfim/50">{intervalLabel[p.interval as string] ?? ""}</span>
                </div>
                {p.description && <p className="mt-3 text-sm text-marfim/55">{p.description}</p>}
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {feats.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-marfim/70">
                      <Check size={15} className="mt-0.5 shrink-0 text-dourado" /> {f}
                    </li>
                  ))}
                </ul>
                <SubscribeButton planId={p.id as string} />
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-marfim/40">
          Cobrança recorrente segura via Stripe. Cancele quando quiser pelo Meu Baú.
        </p>
      </div>
    </PageShell>
  );
}
