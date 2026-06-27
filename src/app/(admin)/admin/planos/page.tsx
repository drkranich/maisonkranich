import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

const intervalLabel: Record<string, string> = {
  monthly: "Mensal", quarterly: "Trimestral", semiannual: "Semestral", annual: "Anual",
};

export default async function AdminPlanos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("id, name, interval, price_cents, highlight, active")
    .order("sort_order");

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Planos de Assinatura" subtitle={`${rows.length} planos`} action={{ label: "+ Novo plano", href: "/admin/planos/novo" }} />
      <DataTable
        rows={rows}
        empty="Nenhum plano cadastrado."
        columns={[
          { key: "name", label: "Plano", render: (r) => <span className="text-marfim">{r.name as string}</span> },
          { key: "interval", label: "Intervalo", render: (r) => intervalLabel[r.interval as string] ?? (r.interval as string) },
          { key: "price_cents", label: "Preço", render: (r) => brl(r.price_cents as number) },
          { key: "highlight", label: "Destaque", render: (r) => (r.highlight ? <Pill tone="gold">★</Pill> : "—") },
          { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativo</Pill> : <Pill tone="bad">Inativo</Pill>) },
          { key: "acoes", label: "", render: (r) => <RowActions table="subscription_plans" id={r.id as string} listPath="/admin/planos" editHref={`/admin/planos/${r.id}/editar`} /> },
        ]}
      />
    </>
  );
}
