import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { dateBR } from "@/lib/format";
import { PageTitle, EmptyState } from "@/components/account/AccountUI";
import { NewConversation } from "@/components/chat/NewConversation";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = { open: "Aberta", pending: "Aguardando", closed: "Encerrada" };

export default async function ConversasPage() {
  const supabase = await createClient();
  const user = await getUser();
  const { data: convos } = await supabase
    .from("conversations")
    .select("id, subject, status, last_message_at")
    .eq("customer_id", user!.id)
    .order("last_message_at", { ascending: false });

  return (
    <>
      <PageTitle title="Minhas Conversas" subtitle="Ateliê de Conversas — fale com a nossa equipe." />
      <NewConversation />
      {!convos || convos.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="Nenhuma conversa ainda"
          hint="Precisa de ajuda para montar um presente? Nossa equipe está à disposição."
          cta={{ label: "Falar com a Maison", href: "/contato" }}
        />
      ) : (
        <div className="space-y-3">
          {convos.map((c) => (
            <Link key={c.id} href={`/conta/conversas/${c.id}`} className="mk-card flex items-center justify-between gap-4 p-5 transition-transform hover:-translate-y-0.5">
              <div>
                <div className="font-serif text-lg text-marfim">{c.subject || "Conversa"}</div>
                <div className="text-xs text-marfim/45">
                  Última mensagem {c.last_message_at ? dateBR(c.last_message_at) : "—"}
                </div>
              </div>
              <span className="rounded-full bg-bronze/20 px-3 py-1 text-[10px] uppercase tracking-wide text-dourado">
                {statusLabels[c.status] ?? c.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
