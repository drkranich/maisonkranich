import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

export default async function AdminCaixas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price_cents, stock, active, attributes, images, measurements, package_use, compatible_product_types, special_occasions")
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
          { key: "thumb", label: "", render: (r) => {
            const imgs = r.images as string[] | null;
            return imgs && imgs[0]
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={imgs[0]} alt="" className="h-10 w-10 rounded-md object-cover" />
              : <span className="flex h-10 w-10 items-center justify-center rounded-md bg-nogueira/40 text-dourado/40">—</span>;
          } },
          { key: "name", label: "Modelo", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "measurements", label: "Medidas", render: (r) => String(r.measurements ?? "—") },
          { key: "compatible_product_types", label: "Combina com", render: (r) => {
            const items = Array.isArray(r.compatible_product_types) ? r.compatible_product_types as string[] : [];
            return items.length ? items.slice(0, 2).join(", ") : "—";
          } },
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
