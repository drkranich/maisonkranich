import { Repeat } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { brl, dateBR } from "@/lib/format";
import { PageTitle, EmptyState } from "@/components/account/AccountUI";
import { ManageSubscriptionButton } from "@/components/subscriptions/ManageSubscriptionButton";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  active: "Ativa",
  trialing: "Período de teste",
  past_due: "Pagamento pendente",
  paused: "Pausada",
  cancelled: "Cancelada",
};

export default async function AssinaturasPage() {
  const supabase = await createClient();
  const user = await getUser();
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, status, current_period_end, cancel_at_period_end, subscription_plans(name, interval, price_cents)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageTitle title="Minhas Assinaturas" subtitle="Caixas curadas chegando até você, no seu ritmo." />
      {!subs || subs.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="Você ainda não assina"
          hint="Assine um plano e receba caixas exclusivas com curadoria da Maison Kranich."
          cta={{ label: "Ver planos", href: "/assinaturas" }}
        />
      ) : (
        <div className="space-y-4">
          {subs.map((s) => {
            const plan = s.subscription_plans as { name: string; interval: string; price_cents: number } | null;
            return (
              <div key={s.id} className="mk-card flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="font-serif text-lg text-marfim">{plan?.name ?? "Plano"}</div>
                  <div className="text-xs text-marfim/50">
                    {plan ? brl(plan.price_cents) : ""}
                    {s.current_period_end ? ` · próxima cobrança em ${dateBR(s.current_period_end)}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-musgo/40 px-3 py-1 text-[10px] uppercase tracking-wide text-dourado-soft">
                    {statusLabels[s.status] ?? s.status}
                  </span>
                  <ManageSubscriptionButton />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
