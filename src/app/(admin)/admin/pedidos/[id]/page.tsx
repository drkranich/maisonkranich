import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brl, dateBR } from "@/lib/format";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = {
  received: "Pedido recebido", paid: "Pagamento aprovado", in_production: "Em produção",
  personalizing: "Personalização", assembling: "Montagem da caixa", packed: "Embalagem finalizada",
  dispatched: "Despachado", in_transit: "Em trânsito", delivered: "Entregue",
  completed: "Concluído", cancelled: "Cancelado", refunded: "Reembolsado",
};

export default async function PedidoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, number, status, subtotal_cents, discount_cents, shipping_cents, total_cents, created_at, shipping_address, profiles(full_name, email, phone), order_items(name, kind, quantity, unit_price_cents, total_cents)")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const { data: history } = await supabase
    .from("order_status_history")
    .select("status, note, created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: false });

  const client = order.profiles as { full_name: string | null; email: string | null; phone: string | null } | null;
  const items = (order.order_items as { name: string; quantity: number; unit_price_cents: number; total_cents: number }[]) ?? [];

  return (
    <div>
      <Link href="/admin/pedidos" className="mb-4 inline-flex items-center gap-2 text-sm text-marfim/50 hover:text-dourado">
        <ArrowLeft size={15} /> Pedidos
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-marfim">Pedido #{order.number}</h2>
          <p className="text-sm text-marfim/50">{dateBR(order.created_at)}</p>
        </div>
        <OrderStatusControl orderId={order.id} current={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="mk-card p-6">
            <h3 className="mk-kicker mb-4">Itens</h3>
            <ul className="divide-y divide-dourado/8">
              {items.map((it, i) => (
                <li key={i} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-marfim/80">{it.quantity}× {it.name}</span>
                  <span className="text-marfim">{brl(it.total_cents)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-dourado/10 pt-4 text-sm">
              <Row k="Subtotal" v={brl(order.subtotal_cents)} />
              {order.discount_cents > 0 && <Row k="Desconto" v={`− ${brl(order.discount_cents)}`} />}
              <Row k="Frete" v={brl(order.shipping_cents)} />
              <div className="flex justify-between pt-1 font-serif text-lg">
                <dt className="text-marfim/60">Total</dt>
                <dd className="text-dourado">{brl(order.total_cents)}</dd>
              </div>
            </dl>
          </div>

          <div className="mk-card p-6">
            <h3 className="mk-kicker mb-4">Histórico de status</h3>
            <ol className="space-y-3">
              {(history ?? []).map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-dourado" />
                  <div>
                    <div className="text-marfim/85">{labels[h.status] ?? h.status}</div>
                    <div className="text-[11px] text-marfim/40">{dateBR(h.created_at)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mk-card h-fit p-6">
          <h3 className="mk-kicker mb-4">Cliente</h3>
          <div className="space-y-1 text-sm">
            <div className="text-marfim">{client?.full_name || "—"}</div>
            <div className="text-marfim/60">{client?.email}</div>
            {client?.phone && <div className="text-marfim/60">{client.phone}</div>}
          </div>
          {order.shipping_address ? (
            <div className="mt-4 border-t border-dourado/10 pt-4 text-sm text-marfim/60">
              <div className="mk-kicker mb-2">Entrega</div>
              <pre className="whitespace-pre-wrap font-sans text-xs">{JSON.stringify(order.shipping_address, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-marfim/50">{k}</dt>
      <dd className="text-marfim/80">{v}</dd>
    </div>
  );
}
