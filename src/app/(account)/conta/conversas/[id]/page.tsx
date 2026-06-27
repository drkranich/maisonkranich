import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { PageTitle } from "@/components/account/AccountUI";
import { ChatThread, type ChatMessage } from "@/components/chat/ChatThread";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = { open: "Aberta", pending: "Aguardando", closed: "Encerrada" };

export default async function ConversaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getUser();

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, subject, status, customer_id")
    .eq("id", id)
    .maybeSingle();

  if (!conv || conv.customer_id !== user!.id) notFound();

  const { data: msgs } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  // marca como lidas as mensagens da equipe
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", id)
    .neq("sender_id", user!.id)
    .is("read_at", null);

  return (
    <>
      <Link href="/conta/conversas" className="mb-4 inline-flex items-center gap-2 text-sm text-marfim/55 hover:text-dourado">
        <ArrowLeft size={16} /> Minhas conversas
      </Link>
      <PageTitle
        title={conv.subject || "Conversa"}
        subtitle={`Ateliê de Conversas · ${statusLabels[conv.status] ?? conv.status}`}
      />
      <ChatThread conversationId={id} currentUserId={user!.id} initialMessages={(msgs ?? []) as ChatMessage[]} />
    </>
  );
}
