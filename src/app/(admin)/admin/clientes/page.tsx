import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

export default async function AdminClientes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Clientes" subtitle={`${rows.length} clientes cadastrados`} />
      <DataTable
        rows={rows}
        empty="Nenhum cliente cadastrado ainda."
        columns={[
          { key: "full_name", label: "Nome", render: (r) => <span className="text-marfim">{(r.full_name as string) || "—"}</span> },
          { key: "email", label: "E-mail", render: (r) => <span className="text-marfim/60">{(r.email as string) ?? "—"}</span> },
          { key: "phone", label: "Telefone", render: (r) => (r.phone as string) ?? "—" },
          { key: "created_at", label: "Desde", render: (r) => <span className="text-marfim/50">{dateBR(r.created_at as string)}</span> },
          { key: "role", label: "Papel", render: () => <Pill>Cliente</Pill> },
        ]}
      />
    </>
  );
}
