import { Wand2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { dateBR } from "@/lib/format";
import { PageTitle, EmptyState } from "@/components/account/AccountUI";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  in_review: "Em análise",
  approved: "Aprovada",
  rejected: "Recusada",
};

export default async function PersonalizacoesPage() {
  const supabase = await createClient();
  const user = await getUser();
  const { data } = await supabase
    .from("personalizations")
    .select("id, type, status, notes, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageTitle title="Minhas Personalizações" subtitle="Gravações, brasões e artes que tornam cada caixa única." />
      {!data || data.length === 0 ? (
        <EmptyState
          icon={Wand2}
          title="Nenhuma personalização"
          hint="Adicione gravações, logos ou mensagens especiais ao montar sua caixa."
          cta={{ label: "Montar minha caixa", href: "/monte-sua-caixa" }}
        />
      ) : (
        <div className="space-y-3">
          {data.map((p) => (
            <div key={p.id} className="mk-card flex items-center justify-between gap-4 p-5">
              <div>
                <div className="font-serif text-lg text-marfim">{p.type ?? "Personalização"}</div>
                {p.notes && <p className="text-sm text-marfim/55">{p.notes}</p>}
                <div className="text-[11px] text-marfim/40">{dateBR(p.created_at)}</div>
              </div>
              <span className="rounded-full bg-bronze/20 px-3 py-1 text-[10px] uppercase tracking-wide text-dourado">
                {statusLabels[p.status] ?? p.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
