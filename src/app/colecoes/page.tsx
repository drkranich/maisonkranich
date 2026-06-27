import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Coleções" };
export const dynamic = "force-dynamic";

export default async function ColecoesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collections")
    .select("slug, name, story, theme")
    .eq("active", true)
    .order("sort_order");

  return (
    <PageShell>
      <PageHero
        kicker="Curadoria"
        title="Nossas Coleções"
        subtitle="Cada coleção é um mundo — uma atmosfera, uma origem, uma memória para guardar."
      />
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {(data ?? []).map((c) => (
            <Link key={c.slug} href={`/colecoes/${c.slug}`} className="mk-card group p-8 transition-transform hover:-translate-y-1">
              <span className="mk-kicker">Coleção</span>
              <h2 className="mt-2 font-serif text-2xl text-marfim group-hover:text-dourado">{c.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-marfim/60">{c.story}</p>
              <span className="mt-5 inline-block text-[11px] uppercase tracking-brand text-dourado/80">Explorar →</span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
