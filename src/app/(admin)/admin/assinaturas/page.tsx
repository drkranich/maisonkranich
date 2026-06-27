import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "bad" | "neutral"> = {
  active: "good", trialing: "warn", past_due: "bad", paused: "neutral", cancelled: "bad",
};

export default async function AdminAssinaturas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("id, status, current_period_end, profiles(full_name, email), subscription_plans(name)")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Assinaturas" subtitle={`${rows.length} assinaturas`} />
      <DataTable
        rows={rows}
        empty="Nenhuma assinatura ativa ainda."
        columns={[
          { key: "client", label: "Cliente", render: (r) => {
              const p = r.profiles as { full_name: string | null; email: string | null } | null;
              return <span className="text-marfim">{p?.full_name || p?.email || "—"}</span>;
            } },
          { key: "plan", label: "Plano", render: (r) => (r.subscription_plans as { name: string } | null)?.name ?? "—" },
          { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status as string] ?? "neutral"}>{r.status as string}</Pill> },
          { key: "current_period_end", label: "Próxima cobrança", render: (r) => (r.current_period_end ? dateBR(r.current_period_end as string) : "—") },
        ]}
      />
    </>
  );
}
