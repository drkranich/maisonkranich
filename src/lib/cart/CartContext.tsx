"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  kind: string;
  price_cents: number;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  ready: boolean;
};

const STORAGE_KEY = "mk_composicao_v1";
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // hidrata do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // persiste
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  function add(item: Omit<CartItem, "quantity">, qty = 1) {
    setItems((cur) => {
      const found = cur.find((i) => i.productId === item.productId);
      if (found) {
        return cur.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...cur, { ...item, quantity: qty }];
    });
  }

  function remove(productId: string) {
    setItems((cur) => cur.filter((i) => i.productId !== productId));
  }

  function setQty(productId: string, qty: number) {
    setItems((cur) =>
      qty <= 0
        ? cur.filter((i) => i.productId !== productId)
        : cur.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotalCents = items.reduce((s, i) => s + i.price_cents * i.quantity, 0);
    return { items, count, subtotalCents, add, remove, setQty, clear, ready };
  }, [items, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
