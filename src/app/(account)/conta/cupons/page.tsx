import { BadgePercent } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageTitle, EmptyState } from "@/components/account/AccountUI";
import { brl } from "@/lib/format";

export const dynamic = "force-dynamic";

function couponValue(c: { kind: string; percent: number | null; value_cents: number | null }) {
  if (c.kind === "percent") return `${Number(c.percent ?? 0)}% OFF`;
  if (c.kind === "free_shipping") return "Frete grátis";
  return `${brl(c.value_cents ?? 0)} OFF`;
}

export default async function CuponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("id, code, kind, percent, value_cents, description, ends_at")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageTitle title="Meus Cupons" subtitle="Mimos e descontos para suas próximas histórias." />
      {!coupons || coupons.length === 0 ? (
        <EmptyState icon={BadgePercent} title="Nenhum cupom disponível" hint="Fique de olho — enviamos cupons especiais em datas comemorativas." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {coupons.map((c) => (
            <div key={c.id} className="mk-card flex items-center justify-between gap-4 p-5">
              <div>
                <div className="font-serif text-lg text-dourado">{couponValue(c)}</div>
                <div className="text-sm text-marfim/60">{c.description}</div>
              </div>
              <code className="rounded-md border border-dourado/30 bg-dourado/5 px-3 py-1.5 text-xs tracking-wider text-dourado">
                {c.code}
              </code>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
