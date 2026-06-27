import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { brl, dateBR } from "@/lib/format";
import { PageTitle } from "@/components/account/AccountUI";

export const dynamic = "force-dynamic";

export default async function CarteiraPage() {
  const supabase = await createClient();
  const user = await getUser();
  const uid = user!.id;

  const [wallet, txns] = await Promise.all([
    supabase.from("wallets").select("balance_cents, currency").eq("user_id", uid).maybeSingle(),
    supabase.from("wallet_transactions").select("id, kind, amount_cents, reason, created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(50),
  ]);

  const balance = wallet.data?.balance_cents ?? 0;
  const list = txns.data ?? [];

  return (
    <>
      <PageTitle title="Minha Carteira" subtitle="Créditos, cashback e saldo promocional." />

      <div className="mk-card mb-6 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dourado/20 bg-dourado/5 text-dourado">
            <Wallet size={22} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-brand text-marfim/50">Saldo disponível</div>
            <div className="font-serif text-3xl text-dourado">{brl(balance)}</div>
          </div>
        </div>
      </div>

      <div className="mk-card p-6">
        <h3 className="mk-kicker mb-4">Movimentações</h3>
        {list.length === 0 ? (
          <p className="py-8 text-center text-sm text-marfim/50">Nenhuma movimentação ainda.</p>
        ) : (
          <ul className="divide-y divide-dourado/8">
            {list.map((t) => {
              const credit = t.kind === "credit";
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className={credit ? "text-dourado-soft" : "text-marfim/50"}>
                      {credit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </span>
                    <div>
                      <div className="text-sm text-marfim/85">{t.reason ?? (credit ? "Crédito" : "Débito")}</div>
                      <div className="text-[11px] text-marfim/40">{dateBR(t.created_at)}</div>
                    </div>
                  </div>
                  <span className={`text-sm ${credit ? "text-dourado-soft" : "text-marfim/70"}`}>
                    {credit ? "+" : "−"}
                    {brl(t.amount_cents)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
