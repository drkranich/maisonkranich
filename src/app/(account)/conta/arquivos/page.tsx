import { FolderOpen, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { dateBR } from "@/lib/format";
import { PageTitle, EmptyState } from "@/components/account/AccountUI";

export const dynamic = "force-dynamic";

function humanSize(bytes: number | null) {
  if (!bytes) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${u[i]}`;
}

export default async function ArquivosPage() {
  const supabase = await createClient();
  const user = await getUser();
  const { data: files } = await supabase
    .from("files")
    .select("id, name, kind, size_bytes, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageTitle title="Meus Arquivos" subtitle="Artes, logos e fotos que você enviou para personalizar presentes." />
      {!files || files.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nenhum arquivo enviado"
          hint="Ao personalizar um presente, seus arquivos (logos, artes, fotos) ficam guardados aqui."
        />
      ) : (
        <div className="mk-card divide-y divide-dourado/8">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-dourado/70" />
                <div>
                  <div className="text-sm text-marfim">{f.name}</div>
                  <div className="text-[11px] text-marfim/40">
                    {f.kind ?? "arquivo"} · {humanSize(f.size_bytes)} · {dateBR(f.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
