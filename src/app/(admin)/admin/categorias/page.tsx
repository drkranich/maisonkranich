import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

export default async function AdminCategorias() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, description, active, sort_order")
    .order("sort_order");

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Categorias" subtitle={`${rows.length} categorias`} action={{ label: "+ Nova categoria", href: "/admin/categorias/novo" }} />
      <DataTable
        rows={rows}
        empty="Nenhuma categoria cadastrada."
        columns={[
          { key: "name", label: "Nome", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-dourado/70">{r.slug as string}</code> },
          { key: "description", label: "Descrição", render: (r) => <span className="text-marfim/55">{(r.description as string) ?? "—"}</span> },
          { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativa</Pill> : <Pill tone="bad">Inativa</Pill>) },
          { key: "acoes", label: "", render: (r) => <RowActions table="categories" id={r.id as string} listPath="/admin/categorias" editHref={`/admin/categorias/${r.id}/editar`} /> },
        ]}
      />
    </>
  );
}
