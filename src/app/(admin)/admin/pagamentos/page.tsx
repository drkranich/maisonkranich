import { createClient } from "@/lib/supabase/server";
import { brl, dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill, StatStrip } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const disputeLabels: Record<string, string> = {
  needs_response: "Responder",
  under_review: "Em análise",
  won: "Ganha",
  lost: "Perdida",
  warning_closed: "Aviso encerrado",
  warning_needs_response: "Aviso: responder",
  warning_under_review: "Aviso em análise",
};

const disputeTone: Record<string, "neutral" | "gold" | "good" | "warn" | "bad"> = {
  needs_response: "bad",
  under_review: "warn",
  won: "good",
  lost: "bad",
  warning_closed: "neutral",
  warning_needs_response: "warn",
  warning_under_review: "warn",
};

export default async function AdminPagamentos() {
  const supabase = await createClient();
  const [{ data: paymentsData }, { data: disputesData }] = await Promise.all([
    supabase
      .from("orders")
      .select("number, total_cents, status, payment, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("disputes" as never)
      .select("id, kind, status, amount_cents, currency, reason, due_by, created_at, stripe_dispute_id, orders(number), subscriptions(subscription_plans(name))")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const rows = paymentsData ?? [];
  const disputes = (disputesData ?? []) as Record<string, unknown>[];
  const total = rows.reduce((s, o) => s + (o.total_cents ?? 0), 0);
  const openDisputes = disputes.filter((d) => !["won", "lost", "warning_closed"].includes(String(d.status)));

  return (
    <>
      <AdminPageHeader title="Pagamentos" subtitle="Transações, assinaturas e disputas Stripe" />
      <StatStrip
        items={[
          { label: "Volume", value: brl(total) },
          { label: "Transações", value: String(rows.length) },
          { label: "Disputas abertas", value: String(openDisputes.length) },
          { label: "Provedor", value: "Stripe" },
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
              return <Pill tone={st.includes("aprov") || st === "paid" ? "good" : "warn"}>{st}</Pill>;
            } },
          { key: "created_at", label: "Data", render: (r) => dateBR(r.created_at as string) },
        ]}
      />

      <section className="mt-8">
        <div className="mb-4">
          <h3 className="font-serif text-2xl text-marfim">Disputas e contestações</h3>
          <p className="text-sm text-marfim/50">Eventos vindos de charge.dispute.* para pedidos e assinaturas.</p>
        </div>
        <DataTable
          rows={disputes}
          empty="Nenhuma disputa recebida da Stripe."
          columns={[
            { key: "kind", label: "Origem", render: (r) => {
              const order = r.orders as { number?: number } | null;
              const sub = r.subscriptions as { subscription_plans?: { name?: string } | null } | null;
              if (order?.number) return <span className="font-mono text-xs text-marfim/60">Pedido #{order.number}</span>;
              if (sub?.subscription_plans?.name) return <span className="text-marfim">{sub.subscription_plans.name}</span>;
              return String(r.kind ?? "—");
            } },
            { key: "status", label: "Status", render: (r) => {
              const status = String(r.status ?? "");
              return <Pill tone={disputeTone[status] ?? "neutral"}>{disputeLabels[status] ?? status}</Pill>;
            } },
            { key: "amount_cents", label: "Valor", render: (r) => brl(Number(r.amount_cents ?? 0), String(r.currency ?? "BRL").toUpperCase()) },
            { key: "reason", label: "Motivo", render: (r) => String(r.reason ?? "—") },
            { key: "due_by", label: "Prazo", render: (r) => r.due_by ? dateBR(r.due_by as string) : "—" },
            { key: "stripe_dispute_id", label: "Stripe", render: (r) => (
              r.stripe_dispute_id ? (
                <a
                  href={`https://dashboard.stripe.com/disputes/${String(r.stripe_dispute_id)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-dourado/80 hover:text-dourado"
                >
                  {String(r.stripe_dispute_id)}
                </a>
              ) : "—"
            ) },
          ]}
        />
      </section>
    </>
  );
}
