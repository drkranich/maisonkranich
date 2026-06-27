"use server";

import { revalidatePath } from "next/cache";
import { requireStaff, getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function setConversationStatus(id: string, status: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("conversations").update({ status }).eq("id", id);
  revalidatePath(`/admin/mensagens/${id}`);
  revalidatePath("/admin/mensagens");
}

/** Cliente abre uma nova conversa e retorna o id. */
export async function startConversation(subject: string, firstMessage: string): Promise<{ id?: string; error?: string }> {
  const user = await getUser();
  if (!user) return { error: "Faça login para falar com a Maison." };
  const supabase = await createClient();

  const { data: conv, error } = await supabase
    .from("conversations")
    .insert({ customer_id: user.id, subject: subject.trim() || "Conversa", status: "open" })
    .select("id")
    .single();
  if (error || !conv) return { error: "Não foi possível abrir a conversa." };

  const body = firstMessage.trim();
  if (body) {
    await supabase.from("messages").insert({ conversation_id: conv.id, sender_id: user.id, body, attachments: [] });
  }
  revalidatePath("/conta/conversas");
  return { id: conv.id as string };
}
