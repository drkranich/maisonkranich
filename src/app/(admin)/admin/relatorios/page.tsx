import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AdminPageHeader, StatStrip, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

export default async function AdminRelatorios() {
  const supabase = await createClient();
  const [orders, subs, customers] = await Promise.all([
    supabase.from("orders").select("total_cents, status, created_at"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
  ]);

  const rows = orders.data ?? [];
  const revenue = rows.reduce((s, o) => s + (o.total_cents ?? 0), 0);
  const paid = rows.filter((o) => !["cancelled", "refunded", "received"].includes(o.status as string));
  const avg = paid.length ? Math.round(revenue / paid.length) : 0;

  // receita por status
  const byStatus = new Map<string, { count: number; total: number }>();
  for (const o of rows) {
    const k = o.status as string;
    const cur = byStatus.get(k) ?? { count: 0, total: 0 };
    cur.count++;
    cur.total += o.total_cents ?? 0;
    byStatus.set(k, cur);
  }
  const statusRows = Array.from(byStatus.entries()).map(([status, v]) => ({ status, ...v }));

  return (
    <>
      <AdminPageHeader title="Relatórios" subtitle="Visão financeira e operacional" />
      <StatStrip
        items={[
          { label: "Receita total", value: brl(revenue) },
          { label: "Pedidos", value: String(rows.length) },
          { label: "Ticket médio", value: brl(avg) },
          { label: "Assinaturas ativas", value: String(subs.count ?? 0) },
        ]}
      />

      <h3 className="mk-kicker mb-3">Pedidos por status</h3>
      <DataTable
        rows={statusRows}
        empty="Sem dados de pedidos para relatório ainda."
        columns={[
          { key: "status", label: "Status", render: (r) => <Pill tone="gold">{r.status as string}</Pill> },
          { key: "count", label: "Quantidade" },
          { key: "total", label: "Valor", render: (r) => brl(r.total as number) },
        ]}
      />

      <p className="mt-4 text-xs text-marfim/40">
        Exportações (CSV/XLSX/PDF) e gráficos por categoria/coleção entram na integração de pagamentos.
      </p>
    </>
  );
}
