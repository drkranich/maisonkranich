import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

export default async function AdminCaixas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price_cents, stock, active, attributes")
    .eq("kind", "box")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Caixas" subtitle={`${rows.length} modelos de caixa`} action={{ label: "+ Nova caixa", href: "/admin/caixas/novo" }} />
      <DataTable
        rows={rows}
        empty="Nenhuma caixa cadastrada."
        columns={[
          { key: "name", label: "Modelo", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "material", label: "Material", render: (r) => String((r.attributes as Record<string, unknown>)?.material ?? "—") },
          { key: "price_cents", label: "Preço", render: (r) => brl(r.price_cents as number) },
          { key: "stock", label: "Estoque" },
          { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativa</Pill> : <Pill tone="bad">Inativa</Pill>) },
          { key: "acoes", label: "", render: (r) => <RowActions table="products" id={r.id as string} listPath="/admin/caixas" editHref={`/admin/caixas/${r.id}/editar`} /> },
        ]}
      />
    </>
  );
}
