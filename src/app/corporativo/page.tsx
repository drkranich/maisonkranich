import Link from "next/link";
import type { Metadata } from "next";
import { Building2, Gift, Palette, Truck } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Corporativo" };

const perks = [
  { icon: Palette, t: "Marca da sua empresa", d: "Logo, brasão e cores aplicados com acabamento premium." },
  { icon: Gift, t: "Kits memoráveis", d: "Onboarding, datas comemorativas, clientes e parceiros." },
  { icon: Truck, t: "Volume e logística", d: "Produção em escala com a mesma curadoria artesanal." },
  { icon: Building2, t: "Gestor dedicado", d: "Atendimento concierge para todo o projeto." },
];

export default function CorporativoPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Maison Kranich Empresas"
        title="Presentes corporativos memoráveis"
        subtitle="Eleve cada relação da sua empresa com caixas que carregam intenção — e a sua marca."
      />
      <div className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {perks.map((p) => (
            <div key={p.t} className="mk-card flex gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dourado/20 bg-dourado/5 text-dourado">
                <p.icon size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-marfim">{p.t}</h3>
                <p className="text-sm text-marfim/55">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/contato" className="rounded-md bg-gradient-to-b from-dourado to-bronze px-8 py-3 text-[11px] uppercase tracking-brand text-carvao-deep">
            Falar com nossa equipe
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
