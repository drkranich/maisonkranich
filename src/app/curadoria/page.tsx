import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, MessageCircleHeart, Gift, Wand2 } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Curadoria de Presentes" };

const steps = [
  { icon: MessageCircleHeart, t: "Conte sua história", d: "Para quem é? Qual a ocasião? Qual o estilo da pessoa?" },
  { icon: Wand2, t: "Nós interpretamos", d: "Nossa anfitriã digital entende o sentimento por trás do presente." },
  { icon: Gift, t: "Montamos sua caixa", d: "Caixa, enchimento, produtos, laços e cartão — tudo combinando." },
];

export default function CuradoriaPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Concierge de presentes"
        title="Curadoria de Presentes"
        subtitle="Conte-nos sua história. Nós ajudaremos a transformá-la em um presente inesquecível."
      />
      <div className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.t} className="mk-card p-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-dourado/25 bg-dourado/5 text-dourado">
                <s.icon size={24} />
              </div>
              <h3 className="font-serif text-xl text-marfim">{s.t}</h3>
              <p className="mt-2 text-sm text-marfim/55">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mk-card mt-10 flex flex-col items-center gap-4 p-10 text-center">
          <Sparkles className="text-dourado" size={28} />
          <h2 className="font-serif text-2xl text-marfim">Em breve, a experiência completa</h2>
          <p className="max-w-lg text-sm text-marfim/55">
            Estamos ensinando nossa anfitriã digital a recomendar a composição perfeita para cada
            história. Enquanto isso, monte você mesmo a sua caixa dos sonhos.
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
