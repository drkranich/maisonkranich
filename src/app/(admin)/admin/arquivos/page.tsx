import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

function humanSize(bytes: number | null) {
  if (!bytes) return "—";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${u[i]}`;
}

export default async function AdminArquivos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("files")
    .select("id, name, kind, size_bytes, mime_type, created_at, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Arquivos" subtitle={`${rows.length} arquivos enviados`} />
      <DataTable
        rows={rows}
        empty="Nenhum arquivo enviado pelos clientes ainda."
        columns={[
          { key: "name", label: "Arquivo", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "client", label: "Cliente", render: (r) => {
              const p = r.profiles as { full_name: string | null; email: string | null } | null;
              return <span className="text-marfim/60">{p?.full_name || p?.email || "—"}</span>;
            } },
          { key: "kind", label: "Tipo", render: (r) => (r.kind as string) ?? "—" },
          { key: "size", label: "Tamanho", render: (r) => humanSize(r.size_bytes as number) },
          { key: "created_at", label: "Data", render: (r) => dateBR(r.created_at as string) },
        ]}
      />
    </>
  );
}
