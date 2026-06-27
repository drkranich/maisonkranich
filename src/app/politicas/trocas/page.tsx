import type { Metadata } from "next";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Trocas e Devoluções" };

export default function TrocasPage() {
  return (
    <PageShell>
      <PageHero kicker="Políticas" title="Trocas e Devoluções" />
      <div className="mx-auto max-w-[760px] space-y-5 px-6 py-14 text-sm leading-relaxed text-marfim/70">
        <p>
          Queremos que cada presente chegue perfeito. Se algo não estiver como você esperava, estamos
          aqui para resolver com carinho.
        </p>
        <h3 className="font-serif text-lg text-marfim">Prazo de arrependimento</h3>
        <p>
          Você pode solicitar a devolução em até 7 dias corridos após o recebimento, conforme o Código
          de Defesa do Consumidor, para produtos sem personalização.
        </p>
        <h3 className="font-serif text-lg text-marfim">Produtos personalizados</h3>
        <p>
          Itens com gravação, brasão ou arte exclusiva não são elegíveis para devolução por
          arrependimento, exceto em caso de defeito de fabricação.
        </p>
        <h3 className="font-serif text-lg text-marfim">Como solicitar</h3>
        <p>
          Acesse <strong className="text-dourado">Meu Baú → Meus Pedidos</strong> ou fale com nosso
          atendimento. Cuidaremos de cada etapa: solicitação, análise, aprovação e reembolso.
        </p>
      </div>
    </PageShell>
  );
}
