"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

const brl = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Lembrete flutuante para retomar a composição em andamento. */
export function CartRecoveryBanner() {
  const { count, subtotalCents, ready } = useCart();
  const path = usePathname();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("mk_cart_banner_dismissed") === "1");
  }, []);

  const hideOn = path?.startsWith("/composicao") || path?.startsWith("/checkout") || path?.startsWith("/admin");
  if (!ready || count === 0 || dismissed || hideOn) return null;

  function dismiss() {
    sessionStorage.setItem("mk_cart_banner_dismissed", "1");
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl border border-dourado/25 bg-carvao-deep/90 p-3 pr-2 shadow-2xl backdrop-blur-xl">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-dourado to-bronze text-carvao-deep">
          <ShoppingBag size={18} />
        </span>
        <div className="flex-1 leading-tight">
          <p className="text-sm text-marfim">Sua composição espera por você</p>
          <p className="text-xs text-marfim/55">{count} {count === 1 ? "item" : "itens"} · {brl(subtotalCents)}</p>
        </div>
        <Link
          href="/composicao"
          className="rounded-md bg-gradient-to-b from-dourado to-bronze px-4 py-2 text-[11px] uppercase tracking-brand text-carvao-deep"
        >
          Retomar
        </Link>
        <button onClick={dismiss} className="p-1.5 text-marfim/40 hover:text-marfim" aria-label="Dispensar">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
