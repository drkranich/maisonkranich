"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { createOrder } from "@/lib/cart/checkout";
import { brl } from "@/lib/format";

type Address = {
  recipient: string; line1: string; line2: string | null; district: string | null;
  city: string; state: string | null; zip: string | null;
};

export function CheckoutForm({ defaultAddress }: { defaultAddress: Address | null }) {
  const router = useRouter();
  const { items, subtotalCents, clear, ready } = useCart();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Address>(
    defaultAddress ?? { recipient: "", line1: "", line2: "", district: "", city: "", state: "", zip: "" }
  );

  function set<K extends keyof Address>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError("Sua composição está vazia.");
      return;
    }
    setSaving(true);
    const res = await createOrder({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      shipping: form as unknown as Record<string, unknown>,
    });
    setSaving(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    clear();
    if (res.paymentUrl) {
      window.location.href = res.paymentUrl; // Checkout hospedado do Stripe
      return;
    }
    router.push(`/checkout/obrigado?numero=${res.number}`);
  }

  if (ready && items.length === 0) {
    return (
      <div className="mk-card mx-auto max-w-[560px] px-6 py-14 text-center">
        <p className="font-serif text-xl text-marfim">Sua composição está vazia</p>
        <Link href="/loja" className="mt-4 inline-block rounded-md bg-gradient-to-b from-dourado to-bronze px-7 py-3 text-[11px] uppercase tracking-brand text-carvao-deep">
          Explorar a loja
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="mk-card p-6">
        <h3 className="mk-kicker mb-4">Endereço de entrega</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Destinatário" className="mk-input !pl-3 sm:col-span-2" value={form.recipient} onChange={(e) => set("recipient", e.target.value)} />
          <input required placeholder="Endereço (rua, número)" className="mk-input !pl-3 sm:col-span-2" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
          <input placeholder="Complemento" className="mk-input !pl-3" value={form.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} />
          <input placeholder="Bairro" className="mk-input !pl-3" value={form.district ?? ""} onChange={(e) => set("district", e.target.value)} />
          <input required placeholder="Cidade" className="mk-input !pl-3" value={form.city} onChange={(e) => set("city", e.target.value)} />
          <input placeholder="UF" className="mk-input !pl-3" value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} />
          <input placeholder="CEP" className="mk-input !pl-3" value={form.zip ?? ""} onChange={(e) => set("zip", e.target.value)} />
        </div>

        <h3 className="mk-kicker mb-3 mt-7">Pagamento</h3>
        <div className="rounded-md border border-dourado/15 bg-carvao p-4 text-sm text-marfim/55">
          <p>O pagamento (cartão, PIX, Apple/Google Pay) via Stripe está sendo integrado.</p>
          <p className="mt-1">Seu pedido será criado com status <strong className="text-dourado">"recebido"</strong> e nossa equipe entra em contato para concluir o pagamento.</p>
        </div>
      </div>

      <aside className="mk-card h-fit p-6 lg:sticky lg:top-24">
        <h3 className="mk-kicker mb-4">Sua composição</h3>
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.productId} className="flex justify-between text-marfim/70">
              <span>{it.quantity}× {it.name}</span>
              <span className="text-marfim">{brl(it.price_cents * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-dourado/10 pt-4 font-serif text-xl">
          <span className="text-marfim/70">Total</span>
          <span className="text-dourado">{brl(subtotalCents)}</span>
        </div>

        {error && <p className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

        <button type="submit" disabled={saving} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze py-3 text-[12px] uppercase tracking-brand text-carvao-deep shadow-glow disabled:opacity-50">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
          Confirmar pedido
        </button>
      </aside>
    </form>
  );
}
