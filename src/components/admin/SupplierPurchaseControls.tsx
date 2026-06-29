"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, PackagePlus, X } from "lucide-react";
import { cancelPurchaseOrder, createPurchaseOrder, receivePurchaseOrder } from "@/lib/admin/suppliers";

type SupplierOption = { id: string; name: string; product_type: string };
type ProductOption = { id: string; name: string; stock: number | null };

export function PurchaseOrderForm({
  suppliers,
  products,
}: {
  suppliers: SupplierOption[];
  products: ProductOption[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    start(async () => {
      const res = await createPurchaseOrder(formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="mk-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-dourado/12 text-dourado">
          <PackagePlus size={18} />
        </span>
        <div>
          <h3 className="font-serif text-2xl text-marfim">Pedido para estoque</h3>
          <p className="text-sm text-marfim/50">Crie um pedido de compra vinculado ao fornecedor.</p>
        </div>
      </div>

      {error && <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Fornecedor</span>
          <select name="supplier_id" required className="mk-input !pl-3">
            <option value="">Selecione</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} · {supplier.product_type}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Produto do catálogo</span>
          <select name="product_id" className="mk-input !pl-3">
            <option value="">Item avulso / ainda não cadastrado</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} · estoque {product.stock ?? 0}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Descrição do item</span>
          <input name="product_name" className="mk-input !pl-3" placeholder="Use se o item ainda não estiver no catálogo" />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Quantidade</span>
          <input name="quantity" required min="1" inputMode="numeric" defaultValue="1" className="mk-input !pl-3" />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Custo un. (R$)</span>
          <input name="unit_cost" inputMode="decimal" placeholder="0,00" className="mk-input !pl-3" />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Previsão de chegada</span>
          <input name="expected_at" type="date" className="mk-input !pl-3" />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Observações</span>
          <textarea name="notes" rows={3} className="mk-input !pl-3" />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending || suppliers.length === 0}
        className="mt-5 flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-5 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep shadow-glow disabled:opacity-50"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <PackagePlus size={15} />}
        Criar pedido
      </button>
    </form>
  );
}

export function PurchaseOrderActions({
  orderId,
  canReceive,
}: {
  orderId: string;
  canReceive: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: "receive" | "cancel") {
    setError(null);
    start(async () => {
      const res = action === "receive" ? await receivePurchaseOrder(orderId) : await cancelPurchaseOrder(orderId);
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center justify-end gap-1.5">
        {canReceive && (
          <button
            type="button"
            onClick={() => run("receive")}
            disabled={pending}
            className="rounded p-1.5 text-marfim/45 hover:bg-dourado/10 hover:text-dourado"
            title="Receber e somar ao estoque"
          >
            {pending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          </button>
        )}
        <button
          type="button"
          onClick={() => run("cancel")}
          disabled={pending || !canReceive}
          className="rounded p-1.5 text-marfim/45 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
          title="Cancelar pedido"
        >
          <X size={15} />
        </button>
      </div>
      {error && <span className="max-w-44 text-right text-[11px] text-red-300">{error}</span>}
    </div>
  );
}
