import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { AdminPageHeader, Pill } from "@/components/admin/AdminUI";
import { ChatThread, type ChatMessage } from "@/components/chat/ChatThread";
import { ConversationStatus } from "@/components/chat/ConversationStatus";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "neutral"> = { open: "warn", pending: "warn", closed: "neutral" };
const label: Record<string, string> = { open: "Aberta", pending: "Aguardando", closed: "Encerrada" };

export default async function AdminConversaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staff = await requireStaff();
  const supabase = await createClient();

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, subject, status, customer_id, profiles!conversations_customer_id_fkey(full_name, email)")
    .eq("id", id)
    .maybeSingle();

  if (!conv) notFound();

  const { data: msgs } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  // marca como lidas as mensagens do cliente
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", id)
    .neq("sender_id", staff.id)
    .is("read_at", null);

  const p = conv.profiles as { full_name: string | null; email: string | null } | null;
  const client = p?.full_name || p?.email || "Cliente";

  return (
    <>
      <Link href="/admin/mensagens" className="mb-4 inline-flex items-center gap-2 text-sm text-marfim/55 hover:text-dourado">
        <ArrowLeft size={16} /> Inbox
      </Link>
      <AdminPageHeader
        title={conv.subject || "Conversa"}
        subtitle={client}
        badge={label[conv.status as string] ?? (conv.status as string)}
      />
      <div className="mb-4 flex items-center gap-3">
        <Pill tone={tone[conv.status as string] ?? "neutral"}>{label[conv.status as string] ?? (conv.status as string)}</Pill>
        <ConversationStatus conversationId={id} current={conv.status as string} />
      </div>
      <ChatThread conversationId={id} currentUserId={staff.id} initialMessages={(msgs ?? []) as ChatMessage[]} />
    </>
  );
}
