import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { lexicon } from "@/lib/brand";
import { PageShell } from "@/components/site/PageShell";

export const dynamic = "force-dynamic";

const kindLabels: Record<string, string> = {
  box: "Caixa", filling: "Enchimento", ribbon: "Laço", tag: "Tag",
  card: "Cartão", adornment: "Adorno", gift: "Presente",
};

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase
    .from("products")
    .select("name, short_desc, description, price_cents, kind, attributes, stock")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!p) notFound();

  const attrs = (p.attributes as Record<string, unknown>) ?? {};

  return (
    <PageShell>
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <Link href="/loja" className="mb-6 inline-flex items-center gap-2 text-sm text-marfim/55 hover:text-dourado">
          <ArrowLeft size={16} /> Voltar à loja
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="mk-card flex h-[380px] items-center justify-center bg-gradient-to-br from-nogueira to-carvao-deep">
            <Box className="text-dourado/60" size={72} />
          </div>

          <div>
            <span className="mk-kicker">{kindLabels[p.kind as string] ?? "Produto"}</span>
            <h1 className="mt-2 font-serif text-4xl text-marfim">{p.name}</h1>
            {p.short_desc && <p className="mt-2 text-marfim/60">{p.short_desc}</p>}
            <div className="mt-5 font-serif text-3xl text-dourado">{brl(p.price_cents)}</div>

            {p.description && (
              <p className="mt-6 leading-relaxed text-marfim/70">{p.description}</p>
            )}

            {Object.keys(attrs).length > 0 && (
              <dl className="mt-6 space-y-2 border-t border-dourado/10 pt-4 text-sm">
                {Object.entries(attrs).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="capitalize text-marfim/50">{k}</dt>
                    <dd className="text-marfim/80">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-md bg-gradient-to-b from-dourado to-bronze px-7 py-3 text-[12px] uppercase tracking-brand text-carvao-deep shadow-glow">
                {lexicon.addToBox}
              </button>
              <Link href="/monte-sua-caixa" className="rounded-md border border-dourado/45 px-7 py-3 text-[12px] uppercase tracking-brand text-marfim hover:border-dourado hover:bg-dourado/10">
                {lexicon.buildStory}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
