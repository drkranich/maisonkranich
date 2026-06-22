import { brl } from "@/lib/format";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  hint,
  isMoney,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  delta?: string;
  hint?: string;
  isMoney?: boolean;
}) {
  return (
    <div className="mk-card group p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-dourado/20 bg-dourado/5 text-dourado">
          <Icon size={18} />
        </div>
        {delta && (
          <span className="rounded-full bg-musgo/40 px-2 py-0.5 text-[10px] font-medium text-dourado-soft">
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 text-[11px] uppercase tracking-brand text-marfim/50">
        {label}
      </div>
      <div className="mt-1 font-serif text-2xl text-marfim">
        {isMoney && typeof value === "number" ? brl(value) : value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-marfim/40">{hint}</div>}
    </div>
  );
}
