import Link from "next/link";

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl text-marfim">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-marfim/55">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  hint,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  hint?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mk-card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dourado/25 bg-dourado/5 text-dourado">
        <Icon size={24} />
      </div>
      <p className="font-serif text-lg text-marfim">{title}</p>
      {hint && <p className="max-w-sm text-sm text-marfim/55">{hint}</p>}
      {cta && (
        <Link
          href={cta.href}
          className="mt-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-6 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

const orderStatusLabels: Record<string, string> = {
  received: "Pedido recebido",
  paid: "Pagamento aprovado",
  in_production: "Em produção",
  personalizing: "Personalização",
  assembling: "Montagem da caixa",
  packed: "Embalagem finalizada",
  dispatched: "Despachado",
  in_transit: "Em trânsito",
  delivered: "Entregue",
  completed: "Concluído",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export function StatusBadge({ status }: { status: string }) {
  const label = orderStatusLabels[status] ?? status;
  const tone =
    status === "delivered" || status === "completed" || status === "paid"
      ? "bg-musgo/40 text-dourado-soft"
      : status === "cancelled" || status === "refunded"
      ? "bg-red-500/15 text-red-300"
      : "bg-bronze/20 text-dourado";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide ${tone}`}>
      {label}
    </span>
  );
}
