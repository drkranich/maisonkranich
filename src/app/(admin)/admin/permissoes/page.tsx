import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = {
  owner: "Superadmin", admin: "Administrador", curator: "Curador(a)", support: "Atendimento",
};
const roleTone: Record<string, "gold" | "good" | "warn"> = {
  owner: "gold", admin: "good", curator: "warn", support: "warn",
};

export default async function AdminPermissoes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .in("role", ["owner", "admin", "curator", "support"])
    .order("created_at");

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Permissões" subtitle="Equipe e papéis de acesso (RBAC)" action={{ label: "+ Convidar membro" }} />
      <DataTable
        rows={rows}
        empty="Apenas o superadministrador tem acesso por enquanto."
        columns={[
          { key: "full_name", label: "Membro", render: (r) => <span className="text-marfim">{(r.full_name as string) || (r.email as string)}</span> },
          { key: "email", label: "E-mail", render: (r) => <span className="text-marfim/60">{r.email as string}</span> },
          { key: "role", label: "Papel", render: (r) => <Pill tone={roleTone[r.role as string] ?? "good"}>{roleLabel[r.role as string] ?? (r.role as string)}</Pill> },
          { key: "created_at", label: "Desde", render: (r) => dateBR(r.created_at as string) },
        ]}
      />
    </>
  );
}
