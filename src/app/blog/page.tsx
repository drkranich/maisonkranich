import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { getPage } from "@/lib/site";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const supabase = await createClient();
  const page = await getPage("blog");
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <PageShell>
      <PageHero kicker="Diário da Maison" title={page?.title ?? "Blog"} subtitle={page?.subtitle ?? "Histórias, inspirações e a arte de presentear com alma."} />
      <div className="mx-auto max-w-[900px] px-6 py-12">
        {!posts || posts.length === 0 ? (
          <p className="py-16 text-center text-marfim/50">
            Em breve, nossas primeiras histórias. Volte logo. ♡
          </p>
        ) : (
          <div className="space-y-5">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="mk-card block p-6 transition-transform hover:-translate-y-0.5">
                <div className="text-[11px] uppercase tracking-brand text-dourado/70">
                  {p.published_at ? dateBR(p.published_at) : ""}
                </div>
                <h2 className="mt-1 font-serif text-2xl text-marfim">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-marfim/60">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
