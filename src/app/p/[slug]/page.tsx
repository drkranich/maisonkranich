import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/site";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Prose } from "@/components/site/Prose";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return { title: page?.title ?? "Página" };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <PageShell>
      <PageHero kicker={page.subtitle ?? undefined} title={page.title} />
      <div className="mx-auto max-w-[760px] px-6 py-14">
        {page.body ? <Prose body={page.body} /> : <p className="text-center text-marfim/50">Conteúdo em breve.</p>}
      </div>
    </PageShell>
  );
}
