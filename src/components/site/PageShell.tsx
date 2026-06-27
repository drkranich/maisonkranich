import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-atelier min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export function PageHero({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-dourado/12 bg-carvao-deep/40">
      <div className="mx-auto max-w-[1400px] px-6 py-16 text-center">
        {kicker && <span className="mk-kicker">{kicker}</span>}
        <h1 className="mt-3 font-serif text-4xl text-marfim md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-marfim/60">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
