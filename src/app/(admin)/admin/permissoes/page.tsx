import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { PermissionsManager } from "@/components/admin/PermissionsManager";

export const dynamic = "force-dynamic";

export default async function AdminPermissoes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .in("role", ["owner", "admin", "curator", "support"])
    .order("created_at");

  const members = (data ?? []).map((m) => ({
    id: m.id as string,
    full_name: (m.full_name as string) ?? null,
    email: (m.email as string) ?? null,
    role: m.role as string,
  }));

  return (
    <>
      <AdminPageHeader title="Permissões" subtitle="Equipe e papéis de acesso (RBAC)" />
      <PermissionsManager initial={members} />
    </>
  );
}
