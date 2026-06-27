"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { exportMyData, deleteMyAccount } from "@/lib/account/lgpd";

export function PrivacyPanel() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function onExport() {
    setBusy(true);
    setError(null);
    const r = await exportMyData();
    setBusy(false);
    if (r.error || !r.data) { setError(r.error ?? "Erro ao exportar."); return; }
    const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maison-kranich-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function onDelete() {
    setError(null);
    start(async () => {
      const r = await deleteMyAccount();
      if (r.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(r.error ?? "Erro ao excluir.");
        setConfirm(false);
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="mk-card flex items-start gap-4 p-6">
        <ShieldCheck className="mt-0.5 shrink-0 text-dourado" size={22} />
        <div className="flex-1">
          <h3 className="font-serif text-lg text-marfim">Portabilidade dos dados</h3>
          <p className="mt-1 text-sm text-marfim/55">
            Baixe uma cópia de tudo que guardamos sobre você — perfil, endereços, pedidos, conversas e curadorias — em formato JSON.
          </p>
          <button
            onClick={onExport}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-dourado/30 px-5 py-2.5 text-[11px] uppercase tracking-brand text-dourado hover:bg-dourado/10 disabled:opacity-50"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} Exportar meus dados
          </button>
        </div>
      </div>

      <div className="mk-card flex items-start gap-4 border-red-500/20 p-6">
        <AlertTriangle className="mt-0.5 shrink-0 text-red-300/80" size={22} />
        <div className="flex-1">
          <h3 className="font-serif text-lg text-marfim">Excluir minha conta</h3>
          <p className="mt-1 text-sm text-marfim/55">
            Remove permanentemente sua conta e seus dados pessoais. Esta ação é irreversível.
          </p>

          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-red-500/30 px-5 py-2.5 text-[11px] uppercase tracking-brand text-red-300 hover:bg-red-500/10"
            >
              <Trash2 size={15} /> Excluir conta
            </button>
          ) : (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/[0.06] p-4">
              <p className="text-sm text-marfim/80">Tem certeza? Tudo será apagado e não há como desfazer.</p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={onDelete}
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-md bg-red-500/80 px-5 py-2.5 text-[11px] uppercase tracking-brand text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Sim, excluir tudo
                </button>
                <button onClick={() => setConfirm(false)} className="text-[11px] uppercase tracking-brand text-marfim/50 hover:text-marfim">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
