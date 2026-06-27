import type { Metadata } from "next";
import { getPage } from "@/lib/site";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Trocas e Devoluções" };
export const dynamic = "force-dynamic";

const FALLBACK = `Queremos que cada presente chegue perfeito. Se algo não estiver como você esperava, estamos aqui para resolver com carinho.

Prazo de arrependimento: você pode solicitar a devolução em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor, para produtos sem personalização.

Produtos personalizados: itens com gravação, brasão ou arte exclusiva não são elegíveis para devolução por arrependimento, exceto em caso de defeito de fabricação.

Como solicitar: acesse Meu Baú → Meus Pedidos ou fale com nosso atendimento.`;

export default async function TrocasPage() {
  const page = await getPage("trocas");
  return (
    <PageShell>
      <PageHero kicker={page?.subtitle ?? "Políticas"} title={page?.title ?? "Trocas e Devoluções"} />
      <div className="mx-auto max-w-[760px] px-6 py-14">
        <Prose body={page?.body || FALLBACK} />
      </div>
    </PageShell>
  );
}
