import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const kindLabels: Record<string, string> = {
  box: "Caixa", filling: "Enchimento", ribbon: "Laço", tag: "Tag",
  card: "Cartão", adornment: "Adorno", gift: "Presente",
};

export default async function AdminProdutos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, kind, price_cents, stock, active, featured")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader
        title="Produtos"
        subtitle={`${rows.length} itens no catálogo`}
        action={{ label: "+ Novo produto" }}
      />
      <DataTable
        rows={rows}
        empty="Nenhum produto cadastrado ainda."
        columns={[
          { key: "name", label: "Nome", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "kind", label: "Tipo", render: (r) => <Pill tone="gold">{kindLabels[r.kind as string] ?? (r.kind as string)}</Pill> },
          { key: "price_cents", label: "Preço", render: (r) => brl(r.price_cents as number) },
          { key: "stock", label: "Estoque", render: (r) => (Number(r.stock) <= 5 ? <span className="text-red-300">{String(r.stock)}</span> : String(r.stock)) },
          { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativo</Pill> : <Pill tone="bad">Inativo</Pill>) },
          { key: "featured", label: "Destaque", render: (r) => (r.featured ? <Pill tone="gold">★</Pill> : "—") },
        ]}
      />
    </>
  );
}
