import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "bad" | "neutral"> = {
  pending: "warn", in_review: "warn", approved: "good", rejected: "bad",
};
const label: Record<string, string> = {
  pending: "Pendente", in_review: "Em análise", approved: "Aprovada", rejected: "Recusada",
};

export default async function AdminPersonalizacoes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("personalizations")
    .select("id, type, status, notes, created_at, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Personalizações" subtitle={`${rows.length} solicitações`} />
      <DataTable
        rows={rows}
        empty="Nenhuma personalização solicitada."
        columns={[
          { key: "client", label: "Cliente", render: (r) => {
              const p = r.profiles as { full_name: string | null; email: string | null } | null;
              return <span className="text-marfim">{p?.full_name || p?.email || "—"}</span>;
            } },
          { key: "type", label: "Tipo", render: (r) => (r.type as string) ?? "—" },
          { key: "notes", label: "Notas", render: (r) => <span className="text-marfim/55">{(r.notes as string) ?? "—"}</span> },
          { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status as string] ?? "neutral"}>{label[r.status as string] ?? (r.status as string)}</Pill> },
          { key: "created_at", label: "Data", render: (r) => dateBR(r.created_at as string) },
        ]}
      />
    </>
  );
}
