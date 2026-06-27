import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { getPage } from "@/lib/site";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Sobre Nós" };
export const dynamic = "force-dynamic";

const FALLBACK = `A ${brand.name} nasceu de uma ideia simples e teimosa: a de que um presente é, antes de tudo, um gesto que merece ser guardado.

Inspirados nos armazéns históricos de Minas, nas boutiques artesanais da Europa e nos baús de segredos do Báltico, criamos um empório onde cada caixa é montada como quem escreve uma carta — com tempo, com cuidado, com alma.

Aqui você não compra uma embalagem. Você cria uma história. Cada detalhe importa. Cada escolha, transforma.

“${brand.slogan}”`;

export default async function SobrePage() {
  const page = await getPage("sobre");

  return (
    <PageShell>
      <PageHero
        kicker={page?.subtitle ?? brand.tagline}
        title={page?.title ?? "Uma casa de memórias"}
      />
      <div className="mx-auto max-w-[760px] px-6 py-14">
        <Prose body={page?.body || FALLBACK} />
      </div>
    </PageShell>
  );
}
