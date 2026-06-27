"use server";

import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/** Reúne todos os dados pessoais do usuário (portabilidade — LGPD art. 18). */
export async function exportMyData(): Promise<{ data?: Record<string, unknown>; error?: string }> {
  const user = await getUser();
  if (!user) return { error: "Faça login para exportar seus dados." };
  const s = await createClient();

  const [profile, addresses, orders, conversations, messages, curations, wishlist] = await Promise.all([
    s.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    s.from("addresses").select("*").eq("user_id", user.id),
    s.from("orders").select("*").eq("user_id", user.id),
    s.from("conversations").select("*").eq("customer_id", user.id),
    s.from("messages").select("*").eq("sender_id", user.id),
    s.from("curation_sessions").select("*").eq("user_id", user.id),
    s.from("wishlist_items").select("*").eq("user_id", user.id),
  ]);

  return {
    data: {
      exported_at: new Date().toISOString(),
      account: { id: user.id, email: user.email, created_at: user.created_at },
      profile: profile.data ?? null,
      addresses: addresses.data ?? [],
      orders: orders.data ?? [],
      conversations: conversations.data ?? [],
      messages: messages.data ?? [],
      curation_sessions: curations.data ?? [],
      wishlist: wishlist.data ?? [],
    },
  };
}

/** Exclui definitivamente a conta e os dados pessoais (LGPD art. 18, V). */
export async function deleteMyAccount(): Promise<{ ok?: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { error: "Faça login." };

  const svc = createServiceClient();
  if (!svc) {
    return { error: "Exclusão indisponível: a chave de serviço não está configurada no servidor. Fale com o suporte." };
  }

  const uid = user.id;
  // remove dados dependentes (service role ignora RLS)
  await svc.from("messages").delete().eq("sender_id", uid);
  await svc.from("conversations").delete().eq("customer_id", uid);
  await svc.from("wishlist_items").delete().eq("user_id", uid);
  await svc.from("curation_sessions").delete().eq("user_id", uid);
  await svc.from("addresses").delete().eq("user_id", uid);
  await svc.from("orders").delete().eq("user_id", uid);

  // remove o usuário de auth (cascata no profile)
  const { error } = await svc.auth.admin.deleteUser(uid);
  if (error) return { error: "Não foi possível excluir a conta. Tente novamente ou fale com o suporte." };

  // encerra a sessão local
  const s = await createClient();
  await s.auth.signOut();
  return { ok: true };
}
