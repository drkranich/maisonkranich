"use client";

import { useState, useTransition } from "react";
import { setConversationStatus } from "@/lib/chat/actions";

const opts = [
  { v: "open", l: "Aberta" },
  { v: "pending", l: "Aguardando" },
  { v: "closed", l: "Encerrada" },
];

export function ConversationStatus({ conversationId, current }: { conversationId: string; current: string }) {
  const [val, setVal] = useState(current);
  const [pending, start] = useTransition();
  return (
    <select
      value={val}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value;
        setVal(v);
        start(() => setConversationStatus(conversationId, v));
      }}
      className="mk-input !pl-3 max-w-[180px] appearance-none"
    >
      {opts.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  );
}
