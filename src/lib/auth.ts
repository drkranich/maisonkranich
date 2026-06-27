import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Usuário atual (ou null). */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Exige sessão; redireciona para /entrar se não houver. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/entrar");
  return user;
}

const STAFF_ROLES = ["owner", "admin", "curator", "support"];

/** Exige que o usuário seja staff (acesso ao /admin). */
export async function requireStaff() {
  const profile = await getProfile();
  if (!profile) redirect("/entrar");
  if (!STAFF_ROLES.includes(profile.role as string)) redirect("/conta");
  return profile;
}

/** Perfil + papel do usuário atual. */
export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role")
    .eq("id", user.id)
    .single();

  return data ?? { id: user.id, email: user.email ?? null, full_name: null, avatar_url: null, role: "customer" as const };
}
