import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { brl } from "@/lib/format";
import {
  Wallet, PackageCheck, Tag, Crown, Users, Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Dados ilustrativos para os painéis do dashboard enquanto o banco
// ainda não tem volume — substituídos automaticamente pelos reais.
const demo = {
  revenueTotal: 12845090,
  ordersToday: 56,
  avgTicket: 45990,
  subsActive: 342,
  clientsActive: 1287,
  series: [9000, 12500, 16000, 13800, 20500, 24800, 28900],
  recentOrders: [
    ["#12458", "Mariana Oliveira", 25990, "Pagamento aprovado"],
    ["#12457", "Carlos Eduardo", 18990, "Em produção"],
    ["#12456", "Juliana Mendes", 74990, "Montagem da caixa"],
    ["#12455", "Fernanda Lima", 29990, "Embalagem finalizada"],
    ["#12454", "Ricardo Santana", 15990, "Despachado"],
  ] as const,
};

const statusTone: Record<string, string> = {
  "Pagamento aprovado": "bg-musgo/40 text-dourado-soft",
  "Em produção": "bg-nogueira/50 text-kraft",
  "Montagem da caixa": "bg-bronze/25 text-dourado",
  "Embalagem finalizada": "bg-dourado/15 text-dourado",
  Despachado: "bg-madeira/40 text-pergaminho",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [orders, subs, customers] = await Promise.all([
    supabase.from("orders").select("total_cents,created_at"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
  ]);

  const orderRows = (orders.data ?? []) as Array<{
    total_cents: number | null;
    created_at: string;
  }>;
  const revenueTotal = orderRows.reduce((s, o) => s + (o.total_cents ?? 0), 0) || demo.revenueTotal;
  const subsActive = subs.count || demo.subsActive;
  const clientsActive = customers.count || demo.clientsActive;
  const ordersToday = orderRows.length || demo.ordersToday;

  return (
    <div className="space-y-6">
      {/* Cards de métricas */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={Wallet} label="Receita Total" value={revenueTotal} isMoney delta="+18,7%" hint="vs mês anterior" />
        <StatCard icon={PackageCheck} label="Pedidos do Dia" value={ordersToday} delta="+12,2%" hint="vs ontem" />
        <StatCard icon={Tag} label="Ticket Médio" value={demo.avgTicket} isMoney delta="+8,4%" hint="vs mês anterior" />
        <StatCard icon={Crown} label="Assinaturas Ativas" value={subsActive} delta="+6,1%" hint="vs mês anterior" />
        <StatCard icon={Users} label="Clientes Ativos" value={clientsActive} delta="+9,3%" hint="vs mês anterior" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Gráfico de receita */}
        <div className="mk-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="mk-kicker">Receita nos últimos 7 dias</h3>
            <span className="rounded border border-dourado/20 px-2 py-1 text-[11px] text-marfim/60">
              7 dias
            </span>
          </div>
          <RevenueChart
            data={demo.series}
            labels={["12 Mai", "13 Mai", "14 Mai", "15 Mai", "16 Mai", "17 Mai", "18 Mai"]}
          />
        </div>

        {/* Pedidos recentes */}
        <div className="mk-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="mk-kicker">Pedidos recentes</h3>
            <span className="text-[11px] text-dourado/70">Ver todas</span>
          </div>
          <ul className="space-y-3">
            {demo.recentOrders.map(([num, name, total, status]) => (
              <li key={num} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-marfim/50">{num}</span>
                  <span className="text-sm text-marfim/85">{name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-marfim">{brl(total)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] ${statusTone[status] ?? "bg-marfim/10 text-marfim/70"}`}>
                    {status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Curadoria de Presentes */}
        <div className="mk-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-dourado" />
            <h3 className="mk-kicker">Curadoria de Presentes</h3>
            <span className="rounded bg-bronze/25 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-dourado">
              Novo
            </span>
          </div>
          <div className="space-y-3 text-sm">
            <Row k="Sugestões geradas hoje" v="24" />
            <Row k="Taxa de aceitação" v="87%" />
            <Row k="Ticket médio das sugestões" v={brl(51240)} />
          </div>
          <button className="mt-5 w-full rounded-md border border-dourado/30 py-2.5 text-[11px] uppercase tracking-brand text-dourado hover:bg-dourado/10">
            Ver curadorias
          </button>
        </div>

        {/* Assinaturas */}
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Assinaturas</h3>
          <ul className="space-y-3 text-sm">
            {[
              ["Mensal Premium", "162 ativas"],
              ["Trimestral Gourmet", "48 ativas"],
              ["Semestral Empresarial", "27 ativas"],
              ["Anual Exclusivo", "105 ativas"],
            ].map(([p, n]) => (
              <li key={p} className="flex items-center justify-between border-b border-dourado/8 pb-2">
                <span className="text-marfim/80">{p}</span>
                <span className="text-dourado/80">{n} ›</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Atendimento */}
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Atendimento · Ateliê de Conversas</h3>
          <div className="space-y-3 text-sm">
            <Row k="Conversas ativas" v="8" />
            <Row k="Tempo médio de resposta" v="2m 34s" />
            <Row k="Satisfação do cliente" v="98%" />
          </div>
          <button className="mt-5 w-full rounded-md bg-gradient-to-b from-dourado to-bronze py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep">
            Abrir inbox
          </button>
        </div>
      </div>

      {/* Disputas e Cupons */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Disputas e Chargebacks</h3>
          <div className="grid grid-cols-2 gap-4">
            <Mini k="Disputas abertas" v="5" m={brl(235000)} />
            <Mini k="Aguardando evidências" v="3" m={brl(124000)} />
            <Mini k="Disputas vencidas" v="1" m={brl(48000)} />
            <Mini k="Disputas ganhas" v="7" m={brl(389000)} good />
          </div>
        </div>
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Cupons em destaque</h3>
          <ul className="space-y-3 text-sm">
            {[
              ["MAE10", "10% OFF · Dia das Mães", "Usado 245x"],
              ["FRETEGRATIS", "Frete grátis acima de R$299", "Usado 189x"],
              ["PRIMEIRACOMPRA", "15% OFF · Primeira compra", "Usado 312x"],
            ].map(([code, desc, uses]) => (
              <li key={code} className="flex items-center justify-between border-b border-dourado/8 pb-2">
                <div>
                  <div className="text-marfim">{code}</div>
                  <div className="text-[11px] text-marfim/50">{desc}</div>
                </div>
                <span className="text-[11px] text-dourado/70">{uses}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-marfim/60">{k}</span>
      <span className="font-serif text-lg text-marfim">{v}</span>
    </div>
  );
}

function Mini({ k, v, m, good }: { k: string; v: string; m: string; good?: boolean }) {
  return (
    <div className="rounded-lg border border-dourado/12 bg-carvao p-3">
      <div className="text-[11px] text-marfim/50">{k}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className={`font-serif text-xl ${good ? "text-dourado" : "text-marfim"}`}>{v}</span>
        <span className="text-[11px] text-marfim/45">{m}</span>
      </div>
    </div>
  );
}
