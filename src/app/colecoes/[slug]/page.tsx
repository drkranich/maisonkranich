import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Box } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const dynamic = "force-dynamic";

export default async function ColecaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: col } = await supabase
    .from("collections")
    .select("id, name, story, description, cover_url")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!col) notFound();

  const { data: links } = await supabase
    .from("product_collections")
    .select("products(slug, name, short_desc, price_cents, active, images)")
    .eq("collection_id", col.id);

  const products = (links ?? [])
    .map((l) => l.products as { slug: string; name: string; short_desc: string | null; price_cents: number; active: boolean; images: string[] | null } | null)
    .filter((p) => p && p.active) as { slug: string; name: string; short_desc: string | null; price_cents: number; images: string[] | null }[];

  return (
    <PageShell>
      <PageHero kicker="Coleção" title={col.name} subtitle={col.story ?? col.description ?? undefined} />
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <Link href="/colecoes" className="mb-6 inline-flex items-center gap-2 text-sm text-marfim/55 hover:text-dourado">
          <ArrowLeft size={16} /> Todas as coleções
        </Link>

        {col.cover_url && (
          <div className="mb-8 h-64 overflow-hidden rounded-xl border border-dourado/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={col.cover_url} alt={col.name} className="h-full w-full object-cover" />
          </div>
        )}

        {products.length === 0 ? (
          <p className="py-12 text-center text-marfim/50">Em breve, peças desta coleção.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <Link key={p.slug} href={`/loja/${p.slug}`} className="mk-card group overflow-hidden transition-transform hover:-translate-y-1">
                <div className="flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-nogueira to-carvao-deep">
                  {Array.isArray(p.images) && p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(p.images[0])} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <Box className="text-dourado/60" size={36} />
                  )}
                </div>
                <div className="p-5">
                  <div className="font-serif text-lg text-marfim group-hover:text-dourado">{p.name}</div>
                  <div className="mt-2 text-dourado">{brl(p.price_cents)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
