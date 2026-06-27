import Link from "next/link";
import type { Metadata } from "next";
import { Box } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { brl } from "@/lib/format";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Loja" };
export const dynamic = "force-dynamic";

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, productsRes] = await Promise.all([
    supabase.from("categories").select("slug,name").eq("active", true).order("sort_order"),
    (async () => {
      let q = supabase
        .from("products")
        .select("slug,name,short_desc,price_cents,kind,category_id,images,categories(slug)")
        .eq("active", true)
        .order("featured", { ascending: false });
      return q;
    })(),
  ]);

  let products = productsRes.data ?? [];
  if (categoria) {
    products = products.filter(
      (p) => (p.categories as { slug: string } | null)?.slug === categoria
    );
  }

  return (
    <PageShell>
      <PageHero
        kicker="Empório das Caixas"
        title="A Loja"
        subtitle="Cada peça escolhida para compor histórias que merecem ser guardadas."
      />

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* filtros por categoria */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/loja"
            className={`rounded-full border px-5 py-2 text-sm transition-colors ${
              !categoria ? "border-dourado bg-dourado/10 text-dourado" : "border-dourado/25 text-marfim/70 hover:border-dourado"
            }`}
          >
            Todos
          </Link>
          {(categories ?? []).map((c) => (
            <Link
              key={c.slug}
              href={`/loja?categoria=${c.slug}`}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                categoria === c.slug ? "border-dourado bg-dourado/10 text-dourado" : "border-dourado/25 text-marfim/70 hover:border-dourado"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="py-16 text-center text-marfim/50">Nenhum produto encontrado nesta categoria.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <Link key={p.slug} href={`/loja/${p.slug}`} className="mk-card group overflow-hidden transition-transform hover:-translate-y-1">
                <div className="flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-nogueira to-carvao-deep">
                  {Array.isArray(p.images) && p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(p.images[0])} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <Box className="text-dourado/60 transition-transform group-hover:scale-110" size={40} />
                  )}
                </div>
                <div className="p-5">
                  <div className="font-serif text-lg text-marfim group-hover:text-dourado">{p.name}</div>
                  {p.short_desc && <p className="mt-1 line-clamp-2 text-sm text-marfim/55">{p.short_desc}</p>}
                  <div className="mt-3 text-dourado">{brl(p.price_cents)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
