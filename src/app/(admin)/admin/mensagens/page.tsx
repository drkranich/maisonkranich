import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const tone: Record<string, "good" | "warn" | "neutral"> = { open: "warn", pending: "warn", closed: "neutral" };
const label: Record<string, string> = { open: "Aberta", pending: "Aguardando", closed: "Encerrada" };

export default async function AdminMensagens() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id, subject, status, last_message_at, profiles!conversations_customer_id_fkey(full_name, email)")
    .order("last_message_at", { ascending: false })
    .limit(100);

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Mensagens" subtitle="Ateliê de Conversas — atendimento concierge" badge="Inbox" />
      <DataTable
        rows={rows}
        empty="Nenhuma conversa ainda."
        columns={[
          { key: "client", label: "Cliente", render: (r) => {
              const p = r.profiles as { full_name: string | null; email: string | null } | null;
              return <span className="text-marfim">{p?.full_name || p?.email || "—"}</span>;
            } },
          { key: "subject", label: "Assunto", render: (r) => (r.subject as string) || "Conversa" },
          { key: "status", label: "Status", render: (r) => <Pill tone={tone[r.status as string] ?? "neutral"}>{label[r.status as string] ?? (r.status as string)}</Pill> },
          { key: "last_message_at", label: "Última msg", render: (r) => (r.last_message_at ? dateBR(r.last_message_at as string) : "—") },
          { key: "abrir", label: "", render: (r) => (
            <Link href={`/admin/mensagens/${r.id}`} className="rounded-md border border-dourado/30 px-3 py-1.5 text-[10px] uppercase tracking-brand text-dourado hover:bg-dourado/10">
              Abrir
            </Link>
          ) },
        ]}
      />
    </>
  );
}
