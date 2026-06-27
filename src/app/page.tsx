import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { BoxBuilder } from "@/components/home/BoxBuilder";
import {
  Gem,
  Sparkles,
  Award,
  HeartHandshake,
  Cake,
  HeartHandshake as Wed,
  Briefcase,
  Baby,
  CalendarHeart,
} from "lucide-react";

export const revalidate = 60;

const differentials = [
  { icon: Gem, title: "Personalização", desc: "Com nome, logo ou mensagem" },
  { icon: Sparkles, title: "Materiais Selecionados", desc: "Qualidade que encanta" },
  { icon: Award, title: "Experiência Premium", desc: "Do início ao último detalhe" },
  { icon: HeartHandshake, title: "Presentes Memoráveis", desc: "Mais que um presente, uma lembrança" },
];

const occasions = [
  { icon: Cake, label: "Aniversário", href: "/loja?ocasiao=aniversario" },
  { icon: Wed, label: "Casamento", href: "/loja?ocasiao=casamento" },
  { icon: CalendarHeart, label: "Dia das Mães", href: "/loja?ocasiao=dia-das-maes" },
  { icon: Briefcase, label: "Empresariais", href: "/corporativo" },
  { icon: Baby, label: "Maternidade", href: "/loja?ocasiao=maternidade" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: collections }] = await Promise.all([
    supabase.from("categories").select("slug,name,description").eq("active", true).order("sort_order").limit(6),
    supabase.from("collections").select("slug,name,story,theme").eq("active", true).order("sort_order").limit(3),
  ]);

  return (
    <div className="bg-atelier">
      <Header />

      {/* HERO + Configurador lado a lado (como a referência) */}
      <Hero aside={<BoxBuilder />} />

      {/* Faixa de diferenciais */}
      <section className="border-y border-dourado/12 bg-musgo/30">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-6 py-7 md:grid-cols-4">
          {differentials.map((d) => (
            <div key={d.title} className="flex items-start gap-3">
              <d.icon className="mt-0.5 text-dourado" size={24} />
              <div>
                <div className="text-sm text-marfim">{d.title}</div>
                <div className="text-xs text-marfim/55">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compre por ocasião + inspirações */}
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <div>
            <h3 className="mk-kicker mb-5">Compre por ocasião</h3>
            <ul className="space-y-3">
              {occasions.map((o) => (
                <li key={o.label}>
                  <Link
                    href={o.href}
                    className="flex items-center gap-3 text-marfim/75 transition-colors hover:text-dourado"
                  >
                    <o.icon size={18} className="text-dourado/70" />
                    <span className="font-serif text-lg">{o.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-3xl text-marfim">Inspirações para você</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Para Ela", img: "1549465220-1a8b9238cd48" },
                { t: "Cestas & Gourmet", img: "1481391319762-47dff72954d9" },
                { t: "Empresariais", img: "1607344645866-009c320b63e0" },
                { t: "Maternidade", img: "1515488042361-ee00e0ddd4e4" },
              ].map((c) => (
                <Link
                  key={c.t}
                  href="/loja"
                  className="group relative overflow-hidden rounded-xl border border-dourado/12"
                >
                  <div
                    className="h-56 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-${c.img}?q=80&w=800&auto=format&fit=crop')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carvao-deep via-carvao-deep/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="font-serif text-xl text-marfim">{c.t}</div>
                    <div className="text-[11px] uppercase tracking-brand text-dourado/80">
                      Ver opções →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coleções */}
      <section className="border-t border-dourado/12 bg-carvao-deep/60">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <div className="mk-rule mb-3" />
          <h3 className="text-center font-serif text-3xl text-marfim">
            Nossas Coleções
          </h3>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(collections ?? []).map((c) => (
              <Link
                key={c.slug}
                href={`/colecoes/${c.slug}`}
                className="mk-card group p-8 transition-transform hover:-translate-y-1"
              >
                <span className="mk-kicker">Coleção</span>
                <h4 className="mt-2 font-serif text-2xl text-marfim group-hover:text-dourado">
                  {c.name}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-marfim/60">
                  {c.story}
                </p>
                <span className="mt-5 inline-block text-[11px] uppercase tracking-brand text-dourado/80">
                  Explorar →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias (chips) */}
      <section className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="flex flex-wrap justify-center gap-3">
          {(categories ?? []).map((c) => (
            <Link
              key={c.slug}
              href={`/loja?categoria=${c.slug}`}
              className="rounded-full border border-dourado/25 px-5 py-2 text-sm text-marfim/75 transition-colors hover:border-dourado hover:text-dourado"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
