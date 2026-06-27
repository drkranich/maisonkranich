"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Send, Loader2, X } from "lucide-react";
import { startConversation } from "@/lib/chat/actions";

export function NewConversation() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setError(null);
    start(async () => {
      const r = await startConversation(subject, msg);
      if (r.id) router.push(`/conta/conversas/${r.id}`);
      else setError(r.error ?? "Não foi possível abrir a conversa.");
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-5 inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-5 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep"
      >
        <Plus size={15} /> Nova conversa
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mk-card mb-5 space-y-3 p-5">
      <div className="flex items-center justify-between">
        <span className="mk-kicker">Falar com a Maison</span>
        <button type="button" onClick={() => setOpen(false)} className="text-marfim/40 hover:text-marfim">
          <X size={16} />
        </button>
      </div>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Assunto (opcional)"
        className="mk-input !pl-3"
      />
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Como podemos ajudar?"
        rows={3}
        className="mk-input !pl-3"
        style={{ fontFamily: "inherit" }}
      />
      {error && <p className="text-xs text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={pending || !msg.trim()}
        className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-5 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep disabled:opacity-50"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Enviar
      </button>
    </form>
  );
}
