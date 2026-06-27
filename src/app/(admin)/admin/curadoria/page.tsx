import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill, StatStrip } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "neutral"> = {
  in_progress: "warn", suggested: "warn", accepted: "good", dismissed: "neutral",
};

export default async function AdminCuradoria() {
  const supabase = await createClient();
  const [sessions, rules, accepted] = await Promise.all([
    supabase.from("curation_sessions").select("id, answers, status, created_at, profiles(full_name, email)").order("created_at", { ascending: false }).limit(100),
    supabase.from("curation_rules").select("id", { count: "exact", head: true }),
    supabase.from("curation_sessions").select("id", { count: "exact", head: true }).eq("status", "accepted"),
  ]);

  const rows = sessions.data ?? [];

  return (
    <>
      <AdminPageHeader title="Curadoria de Presentes" badge="IA" subtitle="Sessões do concierge inteligente e regras de recomendação" action={{ label: "+ Nova regra" }} />
      <StatStrip
        items={[
          { label: "Sessões", value: String(rows.length) },
          { label: "Aceitas", value: String(accepted.count ?? 0) },
          { label: "Regras ativas", value: String(rules.count ?? 0) },
          { label: "Taxa de aceitação", value: rows.length ? `${Math.round(((accepted.count ?? 0) / rows.length) * 100)}%` : "—" },
        ]}
      />
      <DataTable
        rows={rows}
        empty="Nenhuma sessão de curadoria ainda. Quando os clientes usarem o concierge, as sessões aparecem aqui."
        columns={[
          { key: "client", label: "Cliente", render: (r) => {
              const p = r.profiles as { full_name: string | null; email: string | null } | null;
              return <span className="text-marfim">{p?.full_name || p?.email || "Visitante"}</span>;
            } },
          { key: "ocasiao", label: "Ocasião", render: (r) => String((r.answers as Record<string, unknown>)?.ocasiao ?? "—") },
          { key: "orcamento", label: "Orçamento", render: (r) => String((r.answers as Record<string, unknown>)?.orcamento ?? "—") },
          { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status as string] ?? "neutral"}>{r.status as string}</Pill> },
          { key: "created_at", label: "Data", render: (r) => dateBR(r.created_at as string) },
        ]}
      />
    </>
  );
}
