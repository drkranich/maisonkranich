"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart/CartContext";

export function AddToCartButton({
  product,
  label = "Adicionar à Composição",
  variant = "gold",
}: {
  product: Omit<CartItem, "quantity">;
  label?: string;
  variant?: "gold" | "outline";
}) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  function onAdd() {
    add(product);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-7 py-3 text-[12px] uppercase tracking-brand transition";
  const styles =
    variant === "gold"
      ? "bg-gradient-to-b from-dourado to-bronze text-carvao-deep shadow-glow"
      : "border border-dourado/45 text-marfim hover:border-dourado hover:bg-dourado/10";

  return (
    <button onClick={onAdd} className={`${base} ${styles}`}>
      {done ? <Check size={15} /> : <Plus size={15} />}
      {done ? "Guardado na composição" : label}
    </button>
  );
}
