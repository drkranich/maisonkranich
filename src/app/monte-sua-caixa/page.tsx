import type { Metadata } from "next";
import { BoxBuilder } from "@/components/home/BoxBuilder";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { getPage } from "@/lib/site";

export const metadata: Metadata = { title: "Monte Sua Caixa" };
export const dynamic = "force-dynamic";

export default async function MonteSuaCaixaPage() {
  const page = await getPage("monte-sua-caixa");
  return (
    <PageShell>
      <PageHero
        kicker="Atelier digital"
        title={page?.title ?? "Monte Sua Caixa dos Sonhos"}
        subtitle={page?.subtitle ?? "Escolha cada detalhe — a caixa, o enchimento, os produtos, o laço, a tag, o cartão e os adornos. Cada escolha transforma."}
      />
      <div className="mx-auto max-w-[640px] px-6 py-12">
        <BoxBuilder />
        <p className="mt-6 text-center text-xs text-marfim/40">
          O provador completo, com visualização 3D da caixa aberta e fechada, está sendo lapidado. ♡
        </p>
      </div>
    </PageShell>
  );
}
