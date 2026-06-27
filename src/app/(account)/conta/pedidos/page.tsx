import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { brl, dateBR } from "@/lib/format";
import { PageTitle, EmptyState, StatusBadge } from "@/components/account/AccountUI";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const supabase = await createClient();
  const user = await getUser();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, number, status, total_cents, created_at, order_items(name, quantity)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageTitle title="Meus Pedidos" subtitle="Acompanhe cada história a caminho." />
      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum pedido ainda"
          hint="Quando você montar e finalizar uma caixa, ela aparece aqui com o status em tempo real."
          cta={{ label: "Montar minha caixa", href: "/monte-sua-caixa" }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = (o.order_items as { name: string; quantity: number }[]) ?? [];
            return (
              <div key={o.id} className="mk-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs text-marfim/50">Pedido #{o.number}</span>
                    <div className="text-xs text-marfim/40">{dateBR(o.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-dourado">{brl(o.total_cents)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
                {items.length > 0 && (
                  <p className="mt-3 border-t border-dourado/8 pt-3 text-sm text-marfim/60">
                    {items.map((i) => `${i.quantity}× ${i.name}`).join(" · ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
