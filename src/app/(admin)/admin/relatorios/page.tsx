import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { AdminPageHeader, StatStrip } from "@/components/admin/AdminUI";
import { ReportCharts } from "@/components/admin/ReportCharts";

export const dynamic = "force-dynamic";

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (key: string) => {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
};

export default async function AdminRelatorios() {
  const supabase = await createClient();
  const [ordersRes, itemsRes, productsRes, subs, customers] = await Promise.all([
    supabase.from("orders").select("total_cents, status, created_at"),
    supabase.from("order_items").select("total_cents, products(category_id, categories(name))"),
    supabase.from("products").select("price_cents, categories(name)").eq("active", true),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
  ]);

  const orders = ordersRes.data ?? [];
  const revenue = orders.reduce((s, o) => s + (o.total_cents ?? 0), 0);
  const paid = orders.filter((o) => !["cancelled", "refunded", "received"].includes(o.status as string));
  const avg = paid.length ? Math.round(revenue / paid.length) : 0;

  // por status
  const byStatus = new Map<string, { count: number; total: number }>();
  for (const o of orders) {
    const k = o.status as string;
    const cur = byStatus.get(k) ?? { count: 0, total: 0 };
    cur.count++; cur.total += o.total_cents ?? 0;
    byStatus.set(k, cur);
  }
  const statusRows = Array.from(byStatus.entries()).map(([status, v]) => ({ status, ...v }));

  // catálogo por categoria
  const catMap = new Map<string, { count: number; value: number }>();
  for (const p of productsRes.data ?? []) {
    const name = ((p.categories as { name?: string } | null)?.name) ?? "Sem categoria";
    const cur = catMap.get(name) ?? { count: 0, value: 0 };
    cur.count++; cur.value += (p.price_cents as number) ?? 0;
    catMap.set(name, cur);
  }
  const categoryCatalog = Array.from(catMap.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.count - a.count);

  // receita por categoria (a partir de itens vendidos)
  const revMap = new Map<string, number>();
  for (const it of itemsRes.data ?? []) {
    const prod = it.products as { categories?: { name?: string } | null } | null;
    const name = prod?.categories?.name ?? "Sem categoria";
    revMap.set(name, (revMap.get(name) ?? 0) + ((it.total_cents as number) ?? 0));
  }
  const revenueByCategory = Array.from(revMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // receita por mês (últimos 6 meses)
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) months.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  const monthAgg = new Map<string, number>(months.map((m) => [m, 0]));
  for (const o of orders) {
    const k = monthKey(new Date(o.created_at as string));
    if (monthAgg.has(k)) monthAgg.set(k, (monthAgg.get(k) ?? 0) + (o.total_cents ?? 0));
  }
  const monthRevenue = months.map((m) => ({ name: monthLabel(m), value: monthAgg.get(m) ?? 0 }));

  return (
    <>
      <AdminPageHeader title="Relatórios" subtitle="Visão financeira e operacional · exporte em CSV, Excel ou PDF" />
      <StatStrip
        items={[
          { label: "Receita total", value: brl(revenue) },
          { label: "Pedidos", value: String(orders.length) },
          { label: "Ticket médio", value: brl(avg) },
          { label: "Assinaturas ativas", value: String(subs.count ?? 0) },
        ]}
      />
      <div className="mt-6">
        <ReportCharts
          summary={{ revenue, orders: orders.length, avg, subs: subs.count ?? 0, customers: customers.count ?? 0 }}
          categoryCatalog={categoryCatalog}
          revenueByCategory={revenueByCategory}
          statusRows={statusRows}
          monthRevenue={monthRevenue}
        />
      </div>
    </>
  );
}
