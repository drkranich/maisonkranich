import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill, StatStrip } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "neutral"> = {
  in_progress: "warn", suggested: "warn", accepted: "good", dismissed: "neutral",
};

export default async function AdminCuradoria() {
  const supabase = await createClient();
  const [sessions, rules, accepted] = await Promise.all([
    supabase.from("curation_sessions").select("id, answers, status, created_at, profiles(full_name, email)").order("created_at", { ascending: false }).limit(100),
    supabase.from("curation_rules").select("id, name, priority, seasonal, active").order("priority", { ascending: false }),
    supabase.from("curation_sessions").select("id", { count: "exact", head: true }).eq("status", "accepted"),
  ]);

  const rows = sessions.data ?? [];
  const ruleRows = rules.data ?? [];

  return (
    <>
      <AdminPageHeader title="Curadoria de Presentes" badge="IA" subtitle="Sessões do concierge inteligente e regras de recomendação" action={{ label: "+ Nova regra", href: "/admin/curadoria/regras/novo" }} />
      <StatStrip
        items={[
          { label: "Sessões", value: String(rows.length) },
          { label: "Aceitas", value: String(accepted.count ?? 0) },
          { label: "Regras ativas", value: String(ruleRows.filter((r) => r.active).length) },
          { label: "Taxa de aceitação", value: rows.length ? `${Math.round(((accepted.count ?? 0) / rows.length) * 100)}%` : "—" },
        ]}
      />

      <h3 className="mk-kicker mb-3">Sessões recentes</h3>
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

      <h3 className="mk-kicker mb-3 mt-8">Regras de recomendação</h3>
      <DataTable
        rows={ruleRows}
        empty="Nenhuma regra criada. Use 'Nova regra' para priorizar produtos/coleções por ocasião e estilo."
        columns={[
          { key: "name", label: "Regra", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "priority", label: "Prioridade" },
          { key: "seasonal", label: "Sazonal", render: (r) => (r.seasonal ? <Pill tone="gold">Sazonal</Pill> : "—") },
          { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativa</Pill> : <Pill tone="bad">Inativa</Pill>) },
          { key: "acoes", label: "", render: (r) => <RowActions table="curation_rules" id={r.id as string} listPath="/admin/curadoria" editHref={`/admin/curadoria/regras/${r.id}/editar`} /> },
        ]}
      />
    </>
  );
}
