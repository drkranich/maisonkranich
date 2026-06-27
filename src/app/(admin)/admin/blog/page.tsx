import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "neutral"> = { published: "good", draft: "warn", archived: "neutral" };
const label: Record<string, string> = { published: "Publicado", draft: "Rascunho", archived: "Arquivado" };

export default async function AdminBlog() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Blog" subtitle={`${rows.length} artigos`} action={{ label: "+ Novo artigo", href: "/admin/blog/novo" }} />
      <DataTable
        rows={rows}
        empty="Nenhum artigo escrito ainda."
        columns={[
          { key: "title", label: "Título", render: (r) => <span className="text-marfim">{r.title as string}</span> },
          { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-dourado/70">{r.slug as string}</code> },
          { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status as string] ?? "neutral"}>{label[r.status as string] ?? (r.status as string)}</Pill> },
          { key: "published_at", label: "Publicação", render: (r) => (r.published_at ? dateBR(r.published_at as string) : "—") },
          { key: "acoes", label: "", render: (r) => <RowActions table="blog_posts" id={r.id as string} listPath="/admin/blog" editHref={`/admin/blog/${r.id}/editar`} /> },
        ]}
      />
    </>
  );
}
