import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

export default async function AdminLogs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, entity, entity_id, created_at, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Logs do Sistema" subtitle="Trilha de auditoria (LGPD/GDPR)" />
      <DataTable
        rows={rows}
        empty="Nenhum evento registrado ainda."
        columns={[
          { key: "created_at", label: "Quando", render: (r) => <span className="text-marfim/50">{dateBR(r.created_at as string)}</span> },
          { key: "actor", label: "Autor", render: (r) => {
              const p = r.profiles as { full_name: string | null; email: string | null } | null;
              return p?.full_name || p?.email || "Sistema";
            } },
          { key: "action", label: "Ação", render: (r) => <code className="text-xs text-dourado/80">{r.action as string}</code> },
          { key: "entity", label: "Entidade", render: (r) => `${(r.entity as string) ?? "—"}${r.entity_id ? ` #${String(r.entity_id).slice(0, 8)}` : ""}` },
        ]}
      />
    </>
  );
}
