import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { brl, dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill, StatStrip } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";
import { PurchaseOrderActions, PurchaseOrderForm } from "@/components/admin/SupplierPurchaseControls";

export const dynamic = "force-dynamic";

type Supplier = {
  id: string;
  name: string;
  product_type: string;
  contact_name: string | null;
  social_url: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
};

type Product = {
  id: string;
  name: string;
  stock: number | null;
};

type PurchaseOrder = {
  id: string;
  status: string;
  expected_at: string | null;
  ordered_at: string;
  total_cents: number;
  notes: string | null;
  suppliers: { name: string | null } | null;
  supplier_purchase_order_items: {
    product_name: string;
    quantity: number;
    received_quantity: number;
    unit_cost_cents: number;
    product_id: string | null;
  }[];
};

const statusLabel: Record<string, string> = {
  draft: "Rascunho",
  ordered: "Pedido",
  received: "Recebido",
  cancelled: "Cancelado",
};

const statusTone: Record<string, "neutral" | "gold" | "good" | "warn" | "bad"> = {
  draft: "neutral",
  ordered: "warn",
  received: "good",
  cancelled: "bad",
};

function linkOrDash(value: string | null, label?: string) {
  if (!value) return "—";
  const href = value.startsWith("http") ? value : `https://${value}`;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-dourado/80 hover:text-dourado">
      {label ?? value}
    </a>
  );
}

export default async function AdminFornecedores() {
  const supabase = await createClient();

  const [{ data: suppliersData }, { data: productsData }, { data: ordersData }] = await Promise.all([
    supabase
      .from("suppliers" as never)
      .select("id, name, product_type, contact_name, social_url, website_url, phone, email, active")
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("id, name, stock")
      .order("name", { ascending: true }),
    supabase
      .from("supplier_purchase_orders" as never)
      .select("id, status, expected_at, ordered_at, total_cents, notes, suppliers(name), supplier_purchase_order_items(product_name, quantity, received_quantity, unit_cost_cents, product_id)")
      .order("ordered_at", { ascending: false })
      .limit(50),
  ]);

  const suppliers = (suppliersData ?? []) as Supplier[];
  const products = (productsData ?? []) as Product[];
  const orders = (ordersData ?? []) as PurchaseOrder[];
  const openOrders = orders.filter((order) => order.status === "ordered" || order.status === "draft");
  const pendingValue = openOrders.reduce((sum, order) => sum + Number(order.total_cents ?? 0), 0);

  return (
    <>
      <AdminPageHeader
        title="Fornecedores"
        subtitle="Cadastro, contatos e pedidos de compra para reposição de estoque"
        action={{ label: "+ Novo fornecedor", href: "/admin/fornecedores/novo" }}
      />

      <StatStrip
        items={[
          { label: "Fornecedores ativos", value: String(suppliers.filter((supplier) => supplier.active).length) },
          { label: "Tipos atendidos", value: String(new Set(suppliers.map((supplier) => supplier.product_type)).size) },
          { label: "Pedidos em aberto", value: String(openOrders.length) },
          { label: "Valor pendente", value: brl(pendingValue) },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section>
          <DataTable
            rows={suppliers}
            empty="Nenhum fornecedor cadastrado ainda."
            columns={[
              { key: "name", label: "Fornecedor", render: (r) => <span className="text-marfim">{r.name as string}</span> },
              { key: "product_type", label: "Tipo", render: (r) => <Pill tone="gold">{r.product_type as string}</Pill> },
              { key: "contact_name", label: "Contato", render: (r) => String(r.contact_name ?? "—") },
              { key: "phone", label: "Fone", render: (r) => String(r.phone ?? "—") },
              { key: "email", label: "E-mail", render: (r) => String(r.email ?? "—") },
              { key: "links", label: "Links", render: (r) => (
                <div className="flex flex-col gap-1 text-xs">
                  {linkOrDash(r.social_url as string | null, "Rede social")}
                  {linkOrDash(r.website_url as string | null, "Site")}
                </div>
              ) },
              { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativo</Pill> : <Pill tone="bad">Inativo</Pill>) },
              { key: "acoes", label: "", render: (r) => <RowActions table="suppliers" id={r.id as string} listPath="/admin/fornecedores" editHref={`/admin/fornecedores/${r.id}/editar`} /> },
            ]}
          />
        </section>

        <PurchaseOrderForm
          suppliers={suppliers.map((supplier) => ({ id: supplier.id, name: supplier.name, product_type: supplier.product_type }))}
          products={products.map((product) => ({ id: product.id, name: product.name, stock: product.stock }))}
        />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl text-marfim">Pedidos de compra</h3>
            <p className="text-sm text-marfim/50">Receba um pedido para somar os itens vinculados ao estoque.</p>
          </div>
          <Link href="/admin/produtos" className="text-[11px] uppercase tracking-brand text-dourado/80 hover:text-dourado">
            Ver estoque →
          </Link>
        </div>

        <DataTable
          rows={orders}
          empty="Nenhum pedido de compra criado ainda."
          columns={[
            { key: "supplier", label: "Fornecedor", render: (r) => <span className="text-marfim">{(r.suppliers as { name?: string } | null)?.name ?? "—"}</span> },
            { key: "items", label: "Itens", render: (r) => {
              const items = (r.supplier_purchase_order_items ?? []) as PurchaseOrder["supplier_purchase_order_items"];
              return (
                <div className="space-y-1">
                  {items.map((item, index) => (
                    <div key={`${item.product_name}-${index}`} className="text-marfim/70">
                      {item.quantity}x {item.product_name}
                    </div>
                  ))}
                </div>
              );
            } },
            { key: "total_cents", label: "Total", render: (r) => brl(r.total_cents as number) },
            { key: "status", label: "Status", render: (r) => <Pill tone={statusTone[r.status as string] ?? "neutral"}>{statusLabel[r.status as string] ?? String(r.status)}</Pill> },
            { key: "expected_at", label: "Previsão", render: (r) => r.expected_at ? dateBR(r.expected_at as string) : "—" },
            { key: "ordered_at", label: "Criado em", render: (r) => <span className="text-marfim/50">{dateBR(r.ordered_at as string)}</span> },
            { key: "acoes", label: "", render: (r) => (
              <PurchaseOrderActions
                orderId={r.id as string}
                canReceive={r.status === "ordered" || r.status === "draft"}
              />
            ) },
          ]}
        />
      </section>
    </>
  );
}
