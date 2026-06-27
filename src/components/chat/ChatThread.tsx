"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type ChatMessage = {
  id: string;
  sender_id: string | null;
  body: string | null;
  created_at: string;
};

function timeBR(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function ChatThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`conv:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const m = payload.new as ChatMessage;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    const { data, error: insErr } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: currentUserId, body: text, attachments: [] })
      .select("id, sender_id, body, created_at")
      .single();
    if (insErr) {
      setError("Não foi possível enviar. Tente novamente.");
    } else {
      setInput("");
      if (data) setMessages((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data as ChatMessage]));
    }
    setSending(false);
  }

  return (
    <div className="mk-card flex h-[60vh] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-marfim/40">Nenhuma mensagem ainda. Escreva a primeira.</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  mine
                    ? "bg-gradient-to-br from-dourado to-bronze text-carvao-deep"
                    : "border border-dourado/15 bg-carvao-deep/60 text-marfim"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <span className={`mt-1 block text-[10px] ${mine ? "text-carvao-deep/60" : "text-marfim/40"}`}>
                  {timeBR(m.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-dourado/12 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua mensagem…"
          className="mk-input !pl-3"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-b from-dourado to-bronze text-carvao-deep disabled:opacity-50"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
      {error && <p className="px-4 pb-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}
