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
  const [pages, settings] = await Promise.all([
    supabase.from("pages").select("id, title, slug, status").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("key, value"),
  ]);

  const rows = pages.data ?? [];
  const cfg = settings.data ?? [];

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

      <h3 className="mk-kicker mb-3">Configurações do site</h3>
      <div className="mk-card divide-y divide-dourado/8">
        {cfg.length === 0 ? (
          <p className="px-5 py-6 text-sm text-marfim/50">Nenhuma configuração definida.</p>
        ) : (
          cfg.map((s) => (
            <div key={s.key as string} className="flex items-start justify-between gap-4 px-5 py-3.5">
              <code className="text-xs uppercase tracking-wide text-dourado/80">{s.key as string}</code>
              <code className="max-w-md truncate text-xs text-marfim/55">{JSON.stringify(s.value)}</code>
            </div>
          ))
        )}
      </div>
    </>
  );
}
