import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "neutral"> = { published: "good", draft: "warn", archived: "neutral" };

// onde a página aparece no site público
function publicHref(slug: string) {
  if (slug === "sobre") return "/sobre";
  if (slug === "trocas") return "/politicas/trocas";
  return `/p/${slug}`;
}

export default async function AdminConteudo() {
  const supabase = await createClient();
  const { data: pagesData } = await supabase
    .from("pages")
    .select("id, title, slug, status")
    .order("created_at", { ascending: false });

  const rows = pagesData ?? [];

  return (
    <>
      <AdminPageHeader title="Conteúdo" subtitle="Páginas institucionais e textos do site" action={{ label: "+ Nova página", href: "/admin/conteudo/novo" }} />

      <div className="mb-6">
        <DataTable
          rows={rows}
          empty="Nenhuma página criada. Use o construtor para montar páginas institucionais."
          columns={[
            { key: "title", label: "Página", render: (r) => <span className="text-marfim">{r.title as string}</span> },
            { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-dourado/70">/{r.slug as string}</code> },
            { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status as string] ?? "neutral"}>{r.status as string}</Pill> },
            { key: "ver", label: "", render: (r) => (
                <Link href={publicHref(r.slug as string)} target="_blank" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-brand text-dourado/70 hover:text-dourado">
                  <ExternalLink size={13} /> Ver
                </Link>
              ) },
            { key: "acoes", label: "", render: (r) => <RowActions table="pages" id={r.id as string} listPath="/admin/conteudo" editHref={`/admin/conteudo/${r.id}/editar`} /> },
          ]}
        />
      </div>

      <Link href="/admin/config" className="mk-card flex items-center justify-between gap-4 p-5 transition-transform hover:-translate-y-0.5">
        <div>
          <div className="font-serif text-lg text-marfim">Configurações do site</div>
          <p className="text-sm text-marfim/55">Identidade, contato, frete, favicon e seu perfil — edite tudo aqui.</p>
        </div>
        <span className="text-[11px] uppercase tracking-brand text-dourado/80">Abrir →</span>
      </Link>
    </>
  );
}
