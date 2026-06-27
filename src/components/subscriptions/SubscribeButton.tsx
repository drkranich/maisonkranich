"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { startSubscription } from "@/lib/subscriptions/checkout";

export function SubscribeButton({ planId }: { planId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function go() {
    setError(null);
    start(async () => {
      const r = await startSubscription(planId);
      if (r.url) {
        window.location.href = r.url;
      } else if (r.error && /login/i.test(r.error)) {
        window.location.href = "/entrar?next=/assinaturas";
      } else {
        setError(r.error ?? "Não foi possível iniciar a assinatura.");
      }
    });
  }

  return (
    <div className="mt-6">
      <button
        onClick={go}
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze py-3 text-[11px] uppercase tracking-brand text-carvao-deep disabled:opacity-50"
      >
        {pending && <Loader2 size={14} className="animate-spin" />} Assinar
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-300">{error}</p>}
    </div>
  );
}
