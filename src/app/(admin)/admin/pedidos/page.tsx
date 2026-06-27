import { createClient } from "@/lib/supabase/server";
import { brl, dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable } from "@/components/admin/AdminUI";
import { StatusBadge } from "@/components/account/AccountUI";

export const dynamic = "force-dynamic";

export default async function AdminPedidos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, number, status, total_cents, created_at, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Pedidos" subtitle={`${rows.length} pedidos recentes`} />
      <DataTable
        rows={rows}
        empty="Nenhum pedido recebido ainda."
        columns={[
          { key: "number", label: "Pedido", render: (r) => <span className="font-mono text-xs text-marfim/60">#{String(r.number)}</span> },
          { key: "client", label: "Cliente", render: (r) => {
              const p = r.profiles as { full_name: string | null; email: string | null } | null;
              return <span className="text-marfim">{p?.full_name || p?.email || "—"}</span>;
            } },
          { key: "total_cents", label: "Total", render: (r) => brl(r.total_cents as number) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status as string} /> },
          { key: "created_at", label: "Data", render: (r) => <span className="text-marfim/50">{dateBR(r.created_at as string)}</span> },
        ]}
      />
    </>
  );
}
