import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

export default async function AdminColecoes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collections")
    .select("id, name, theme, story, featured, active, sort_order")
    .order("sort_order");

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Coleções" subtitle={`${rows.length} coleções`} action={{ label: "+ Nova coleção", href: "/admin/colecoes/novo" }} />
      <DataTable
        rows={rows}
        empty="Nenhuma coleção cadastrada."
        columns={[
          { key: "name", label: "Nome", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "theme", label: "Tema", render: (r) => <Pill tone="gold">{(r.theme as string) ?? "—"}</Pill> },
          { key: "story", label: "Narrativa", className: "max-w-xs", render: (r) => <span className="line-clamp-1 text-marfim/55">{(r.story as string) ?? "—"}</span> },
          { key: "featured", label: "Destaque", render: (r) => (r.featured ? <Pill tone="gold">★</Pill> : "—") },
          { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativa</Pill> : <Pill tone="bad">Inativa</Pill>) },
          { key: "acoes", label: "", render: (r) => <RowActions table="collections" id={r.id as string} listPath="/admin/colecoes" editHref={`/admin/colecoes/${r.id}/editar`} /> },
        ]}
      />
    </>
  );
}
