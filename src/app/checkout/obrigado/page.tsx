import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Pedido confirmado" };

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string }>;
}) {
  const { numero } = await searchParams;

  return (
    <PageShell>
      <div className="mx-auto max-w-[640px] px-6 py-24">
        <div className="mk-card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <CheckCircle2 className="text-dourado" size={48} />
          <h1 className="font-serif text-3xl text-marfim">Sua história foi guardada ♡</h1>
          {numero && (
            <p className="text-marfim/60">
              Pedido <span className="font-mono text-dourado">#{numero}</span> criado com sucesso.
            </p>
          )}
          <p className="max-w-md text-sm text-marfim/55">
            Já estamos cuidando de cada detalhe. Acompanhe o status no seu Baú — avisaremos a cada etapa.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/conta/pedidos" className="rounded-md bg-gradient-to-b from-dourado to-bronze px-7 py-3 text-[11px] uppercase tracking-brand text-carvao-deep">
              Ver meus pedidos
            </Link>
            <Link href="/loja" className="rounded-md border border-dourado/45 px-7 py-3 text-[11px] uppercase tracking-brand text-marfim hover:border-dourado hover:bg-dourado/10">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
