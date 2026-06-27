import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { brand } from "@/lib/brand";
import { getSiteSettings } from "@/lib/site";
import { brl } from "@/lib/format";
import { Truck, ShieldCheck, MessageCircleHeart, Sparkles } from "lucide-react";

export async function Footer() {
  const settings = await getSiteSettings();
  const perks = [
    { icon: Truck, title: "Frete Grátis", desc: `Acima de ${brl(settings.shipping.free_above_cents)}` },
    { icon: ShieldCheck, title: "Embalagem Segura", desc: "Chega perfeita até você" },
    { icon: MessageCircleHeart, title: "Atendimento Premium", desc: "Fale com nossa equipe" },
    { icon: Sparkles, title: "Presente com Mensagem", desc: "Inclua seu carinho" },
  ];

  return (
    <footer className="bg-atelier">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 border-y border-dourado/12 px-6 py-8 md:grid-cols-4">
        {perks.map((p) => (
          <div key={p.title} className="flex items-center gap-3">
            <p.icon className="text-dourado" size={22} />
            <div>
              <div className="text-sm text-marfim">{p.title}</div>
              <div className="text-xs text-marfim/55">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo stacked={false} size={46} />
          <p className="mt-5 max-w-xs font-serif text-lg leading-relaxed text-marfim/70">
            “{settings.brand.slogan}”
          </p>
        </div>
        <FooterCol
          title="A Casa"
          links={[
            ["Sobre Nós", "/sobre"],
            ["Coleções", "/colecoes"],
            ["Curadoria de Presentes", "/curadoria"],
            ["Blog", "/blog"],
          ]}
        />
        <FooterCol
          title="Comprar"
          links={[
            ["Loja", "/loja"],
            ["Monte Sua Caixa", "/monte-sua-caixa"],
            ["Assinaturas", "/assinaturas"],
            ["Corporativo", "/corporativo"],
          ]}
        />
        <FooterCol
          title="Atendimento"
          links={[
            ["Meu Baú", "/conta"],
            ["Meus Pedidos", "/conta/pedidos"],
            ["Contato", "/contato"],
            ["Trocas e Devoluções", "/politicas/trocas"],
          ]}
        />
      </div>

      <div className="border-t border-dourado/12 px-6 py-6 text-center text-[11px] uppercase tracking-brand text-marfim/40">
        © {new Date().getFullYear()} {brand.name} · {brand.tagline} · Todos os
        direitos reservados
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mk-kicker mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-marfim/65 transition-colors hover:text-dourado"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
