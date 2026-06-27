import { createClient } from "@/lib/supabase/server";
import { brl, dateBR } from "@/lib/format";
import { AdminPageHeader, DataTable, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

function value(c: Record<string, unknown>) {
  if (c.kind === "percent") return `${Number(c.percent ?? 0)}%`;
  if (c.kind === "free_shipping") return "Frete grátis";
  return brl(Number(c.value_cents ?? 0));
}

export default async function AdminCupons() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coupons")
    .select("id, code, kind, percent, value_cents, used_count, max_uses, active, ends_at")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <>
      <AdminPageHeader title="Cupons" subtitle={`${rows.length} cupons`} action={{ label: "+ Novo cupom" }} />
      <DataTable
        rows={rows}
        empty="Nenhum cupom criado."
        columns={[
          { key: "code", label: "Código", render: (r) => <code className="text-dourado">{r.code as string}</code> },
          { key: "value", label: "Desconto", render: (r) => value(r) },
          { key: "used", label: "Usos", render: (r) => `${r.used_count ?? 0}${r.max_uses ? ` / ${r.max_uses}` : ""}` },
          { key: "ends_at", label: "Validade", render: (r) => (r.ends_at ? dateBR(r.ends_at as string) : "Sem prazo") },
          { key: "active", label: "Status", render: (r) => (r.active ? <Pill tone="good">Ativo</Pill> : <Pill tone="bad">Inativo</Pill>) },
        ]}
      />
    </>
  );
}
