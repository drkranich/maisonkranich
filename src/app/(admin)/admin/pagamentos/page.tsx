import { createClient } from "@/lib/supabase/server";
import { brl, dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill, StatStrip } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

export default async function AdminPagamentos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("number, total_cents, status, payment, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];
  const total = rows.reduce((s, o) => s + (o.total_cents ?? 0), 0);

  return (
    <>
      <AdminPageHeader title="Pagamentos" subtitle="Transações dos pedidos (Stripe a integrar)" />
      <StatStrip
        items={[
          { label: "Volume", value: brl(total) },
          { label: "Transações", value: String(rows.length) },
          { label: "Provedor", value: "Stripe" },
          { label: "Métodos", value: "Cartão · PIX · Wallets" },
        ]}
      />
      <DataTable
        rows={rows}
        empty="Nenhuma transação ainda. Ao conectar o Stripe, os pagamentos aparecem aqui."
        columns={[
          { key: "number", label: "Pedido", render: (r) => <span className="font-mono text-xs text-marfim/60">#{String(r.number)}</span> },
          { key: "method", label: "Método", render: (r) => String((r.payment as Record<string, unknown>)?.method ?? "—") },
          { key: "total_cents", label: "Valor", render: (r) => brl(r.total_cents as number) },
          { key: "pstatus", label: "Pagamento", render: (r) => {
              const st = String((r.payment as Record<string, unknown>)?.status ?? (r.status === "received" ? "pendente" : "aprovado"));
              return <Pill tone={st.includes("aprov") ? "good" : "warn"}>{st}</Pill>;
            } },
          { key: "created_at", label: "Data", render: (r) => dateBR(r.created_at as string) },
        ]}
      />
    </>
  );
}
