import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Minha Composição" };

export default function ComposicaoPage() {
  return (
    <PageShell>
      <PageHero kicker="Sua história em construção" title="Minha Composição" />
      <div className="mx-auto max-w-[700px] px-6 py-16">
        <div className="mk-card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dourado/25 bg-dourado/5 text-dourado">
            <ShoppingBag size={24} />
          </div>
          <p className="font-serif text-xl text-marfim">Sua composição está vazia</p>
          <p className="max-w-sm text-sm text-marfim/55">
            Comece a montar sua caixa dos sonhos e guarde aqui cada peça da sua história.
          </p>
          <Link
            href="/monte-sua-caixa"
            className="mt-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-7 py-3 text-[11px] uppercase tracking-brand text-carvao-deep"
          >
            Montar minha caixa
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
