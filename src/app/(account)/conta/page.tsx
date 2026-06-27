import Link from "next/link";
import { Package, Repeat, Wallet, Heart, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { brl } from "@/lib/format";
import { StatusBadge } from "@/components/account/AccountUI";

export const dynamic = "force-dynamic";

export default async function ContaOverview() {
  const supabase = await createClient();
  const user = await getUser();
  const uid = user!.id;

  const [orders, subs, wallet, wishlist, recent] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", uid),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("status", "active"),
    supabase.from("wallets").select("balance_cents").eq("user_id", uid).maybeSingle(),
    supabase.from("wishlist_items").select("product_id", { count: "exact", head: true }).eq("user_id", uid),
    supabase.from("orders").select("number,status,total_cents,created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(5),
  ]);

  const cards = [
    { icon: Package, label: "Pedidos", value: String(orders.count ?? 0), href: "/conta/pedidos" },
    { icon: Repeat, label: "Assinaturas ativas", value: String(subs.count ?? 0), href: "/conta/assinaturas" },
    { icon: Wallet, label: "Carteira", value: brl(wallet.data?.balance_cents ?? 0), href: "/conta/carteira" },
    { icon: Heart, label: "Lista de desejos", value: String(wishlist.count ?? 0), href: "/conta/desejos" },
  ];

  const recentOrders = recent.data ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="mk-card group p-5 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-dourado/20 bg-dourado/5 text-dourado">
                <c.icon size={18} />
              </div>
              <ArrowRight size={16} className="text-marfim/30 transition-colors group-hover:text-dourado" />
            </div>
            <div className="mt-4 text-[11px] uppercase tracking-brand text-marfim/50">{c.label}</div>
            <div className="mt-0.5 font-serif text-2xl text-marfim">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="mk-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mk-kicker">Pedidos recentes</h2>
          <Link href="/conta/pedidos" className="text-[11px] uppercase tracking-brand text-dourado/80 hover:text-dourado">
            Ver todos
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-marfim/50">
            Você ainda não tem pedidos.{" "}
            <Link href="/monte-sua-caixa" className="text-dourado hover:underline">
              Que tal montar sua primeira caixa?
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-dourado/8">
            {recentOrders.map((o) => (
              <li key={o.number} className="flex items-center justify-between gap-3 py-3">
                <span className="font-mono text-xs text-marfim/50">#{o.number}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-marfim">{brl(o.total_cents)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
