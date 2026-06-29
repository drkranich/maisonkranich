"use client";

import { useState, useTransition } from "react";
import { Loader2, Settings } from "lucide-react";
import { openSubscriptionPortal } from "@/lib/subscriptions/checkout";

export function ManageSubscriptionButton() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openPortal() {
    setError(null);
    start(async () => {
      const res = await openSubscriptionPortal();
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      setError(res.error ?? "Não foi possível abrir o portal.");
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={openPortal}
        disabled={pending}
        className="flex items-center gap-2 rounded-md border border-dourado/30 px-3 py-2 text-[10px] uppercase tracking-brand text-dourado hover:bg-dourado/10 disabled:opacity-50"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Settings size={14} />}
        Gerenciar
      </button>
      {error && <span className="max-w-52 text-right text-[11px] text-red-300">{error}</span>}
    </div>
  );
}
