"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { updateOrderStatus } from "@/lib/admin/crud";

const STATUSES = [
  "received", "paid", "in_production", "personalizing", "assembling",
  "packed", "dispatched", "in_transit", "delivered", "completed", "cancelled", "refunded",
];

const labels: Record<string, string> = {
  received: "Pedido recebido", paid: "Pagamento aprovado", in_production: "Em produção",
  personalizing: "Personalização", assembling: "Montagem da caixa", packed: "Embalagem finalizada",
  dispatched: "Despachado", in_transit: "Em trânsito", delivered: "Entregue",
  completed: "Concluído", cancelled: "Cancelado", refunded: "Reembolsado",
};

export function OrderStatusControl({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function apply(next: string) {
    setValue(next);
    start(async () => {
      await updateOrderStatus(orderId, next, "/admin/pedidos");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={value}
        onChange={(e) => apply(e.target.value)}
        disabled={pending}
        className="mk-input !pl-3 appearance-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{labels[s]}</option>
        ))}
      </select>
      {pending ? (
        <Loader2 size={16} className="animate-spin text-dourado" />
      ) : saved ? (
        <Check size={16} className="text-dourado" />
      ) : null}
    </div>
  );
}
