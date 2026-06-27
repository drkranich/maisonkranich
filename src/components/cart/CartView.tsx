"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { brl } from "@/lib/format";

export function CartView() {
  const { items, subtotalCents, setQty, remove, ready } = useCart();

  if (!ready) {
    return <div className="py-20 text-center text-marfim/40">Carregando sua composição…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mk-card mx-auto flex max-w-[640px] flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dourado/25 bg-dourado/5 text-dourado">
          <ShoppingBag size={24} />
        </div>
        <p className="font-serif text-xl text-marfim">Sua composição está vazia</p>
        <p className="max-w-sm text-sm text-marfim/55">Comece a montar sua caixa dos sonhos e guarde aqui cada peça.</p>
        <Link href="/loja" className="mt-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-7 py-3 text-[11px] uppercase tracking-brand text-carvao-deep">
          Explorar a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.productId} className="mk-card flex items-center gap-4 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-nogueira to-carvao-deep">
              <ShoppingBag className="text-dourado/60" size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-lg text-marfim">{it.name}</div>
              <div className="text-sm text-dourado">{brl(it.price_cents)}</div>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-dourado/20">
              <button onClick={() => setQty(it.productId, it.quantity - 1)} className="p-2 text-marfim/60 hover:text-dourado"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm text-marfim">{it.quantity}</span>
              <button onClick={() => setQty(it.productId, it.quantity + 1)} className="p-2 text-marfim/60 hover:text-dourado"><Plus size={14} /></button>
            </div>
            <div className="w-24 text-right text-sm text-marfim">{brl(it.price_cents * it.quantity)}</div>
            <button onClick={() => remove(it.productId)} className="p-2 text-marfim/40 hover:text-red-300"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <aside className="mk-card h-fit p-6 lg:sticky lg:top-24">
        <h3 className="mk-kicker mb-4">Resumo</h3>
        <div className="flex justify-between text-sm text-marfim/70">
          <span>Subtotal</span>
          <span className="text-marfim">{brl(subtotalCents)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-marfim/50">
          <span>Frete</span>
          <span>{subtotalCents >= 29900 ? "Grátis" : "Calculado no checkout"}</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-dourado/10 pt-4 font-serif text-xl">
          <span className="text-marfim/70">Total</span>
          <span className="text-dourado">{brl(subtotalCents)}</span>
        </div>
        <Link href="/checkout" className="mt-6 block rounded-md bg-gradient-to-b from-dourado to-bronze py-3 text-center text-[12px] uppercase tracking-brand text-carvao-deep shadow-glow">
          Finalizar minha história
        </Link>
        <Link href="/loja" className="mt-3 block text-center text-[11px] uppercase tracking-brand text-marfim/50 hover:text-dourado">
          Continuar comprando
        </Link>
      </aside>
    </div>
  );
}
