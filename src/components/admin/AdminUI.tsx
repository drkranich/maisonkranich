import Link from "next/link";

export function AdminPageHeader({
  title,
  subtitle,
  badge,
  action,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: { label: string; href?: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-3xl text-marfim">{title}</h2>
          {badge && (
            <span className="rounded bg-bronze/25 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-dourado">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-sm text-marfim/55">{subtitle}</p>}
      </div>
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="rounded-md bg-gradient-to-b from-dourado to-bronze px-5 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep shadow-glow"
          >
            {action.label}
          </Link>
        ) : (
          <button className="rounded-md bg-gradient-to-b from-dourado to-bronze px-5 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep shadow-glow">
            {action.label}
          </button>
        ))}
    </div>
  );
}

export function StatStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="mk-card p-5">
          <div className="text-[11px] uppercase tracking-brand text-marfim/50">{s.label}</div>
          <div className="mt-1 font-serif text-2xl text-marfim">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "gold" | "good" | "warn" | "bad" }) {
  const tones: Record<string, string> = {
    neutral: "bg-marfim/10 text-marfim/70",
    gold: "bg-dourado/15 text-dourado",
    good: "bg-musgo/40 text-dourado-soft",
    warn: "bg-bronze/25 text-dourado",
    bad: "bg-red-500/15 text-red-300",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

type Column<T> = { key: string; label: string; render?: (row: T) => React.ReactNode; className?: string };

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: React.ReactNode;
}) {
  if (!rows || rows.length === 0) {
    return (
      <div className="mk-card px-6 py-16 text-center text-sm text-marfim/50">
        {empty ?? "Nenhum registro encontrado."}
      </div>
    );
  }
  return (
    <div className="mk-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dourado/12 text-[10px] uppercase tracking-wide2 text-marfim/45">
              {columns.map((c) => (
                <th key={c.key} className="px-5 py-3 font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-dourado/8 transition-colors hover:bg-marfim/[0.03]">
                {columns.map((c) => (
                  <td key={c.key} className={`px-5 py-3.5 text-marfim/80 ${c.className ?? ""}`}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="mk-card px-6 py-20 text-center">
      <p className="text-sm text-marfim/55">{children}</p>
    </div>
  );
}
