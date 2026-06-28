"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

type Result = { ok?: true; error?: string };

/** Salva (upsert) uma configuração do site (chave/valor JSON). Somente staff. */
export async function saveSetting(key: string, value: unknown): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value: value as never, updated_at: new Date().toISOString() } as never);
  if (error) return { error: error.message };
  revalidatePath("/admin/config");
  if (key === "brand") {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/entrar");
    revalidatePath("/cadastro");
  }
  return { ok: true };
}

/** Atualiza o papel de um usuário (RBAC). Somente staff. */
export async function setUserRole(userId: string, role: string): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: role as never })
    .eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/permissoes");
  return { ok: true };
}

/** Promove/ajusta papel buscando pelo e-mail (usuário precisa já ter conta). */
export async function setRoleByEmail(email: string, role: string): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email.trim())
    .maybeSingle();
  if (!profile) return { error: "Nenhuma conta encontrada com esse e-mail. Peça para a pessoa se cadastrar primeiro." };
  const { error } = await supabase
    .from("profiles")
    .update({ role: role as never })
    .eq("id", (profile as { id: string }).id);
  if (error) return { error: error.message };
  revalidatePath("/admin/permissoes");
  return { ok: true };
}
