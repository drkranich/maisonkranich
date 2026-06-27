import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Sobre Nós" };

export default function SobrePage() {
  return (
    <PageShell>
      <PageHero kicker={brand.tagline} title="Uma casa de memórias" />
      <div className="mx-auto max-w-[760px] px-6 py-14">
        <div className="space-y-6 font-serif text-lg leading-relaxed text-marfim/75">
          <p>
            A <strong className="text-dourado">Maison Kranich</strong> nasceu de uma ideia simples e
            teimosa: a de que um presente é, antes de tudo, um gesto que merece ser guardado.
          </p>
          <p>
            Inspirados nos armazéns históricos de Minas, nas boutiques artesanais da Europa e nos baús
            de segredos do Báltico, criamos um empório onde cada caixa é montada como quem escreve uma
            carta — com tempo, com cuidado, com alma.
          </p>
          <p>
            Aqui você não compra uma embalagem. Você cria uma história. Escolhe a caixa, o enchimento,
            os produtos, o laço, a tag, o cartão e os adornos. Cada detalhe importa. Cada escolha,
            transforma.
          </p>
          <p className="text-dourado">“{brand.slogan}”</p>
        </div>
      </div>
    </PageShell>
  );
}
