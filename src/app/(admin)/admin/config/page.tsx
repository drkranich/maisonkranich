import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { palette } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function AdminConfig() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const settings = Object.fromEntries((data ?? []).map((s) => [s.key as string, s.value]));
  const brand = (settings.brand ?? {}) as Record<string, string>;
  const contact = (settings.contact ?? {}) as Record<string, string>;

  return (
    <>
      <AdminPageHeader title="Configurações" subtitle="Identidade, contato e preferências da loja" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Identidade da marca</h3>
          <dl className="space-y-2 text-sm">
            <Row k="Nome" v={brand.name ?? "Maison Kranich"} />
            <Row k="Tagline" v={brand.tagline ?? "Empório das Caixas"} />
            <Row k="Slogan" v={brand.slogan ?? "Onde toda história encontra seu abrigo."} />
          </dl>
          <div className="mt-4 flex gap-2">
            {Object.entries(palette).slice(0, 8).map(([name, hex]) => (
              <span key={name} title={name} className="h-7 w-7 rounded-full border border-marfim/10" style={{ backgroundColor: hex }} />
            ))}
          </div>
        </div>

        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Contato</h3>
          <dl className="space-y-2 text-sm">
            <Row k="E-mail" v={contact.email ?? "contato@maisonkranich.com"} />
            <Row k="WhatsApp" v={contact.whatsapp || "—"} />
          </dl>
        </div>
      </div>

      <p className="mt-4 text-xs text-marfim/40">
        A edição inline das configurações (white-label, frete, e-mails) entra junto com o módulo de Conteúdo.
      </p>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dourado/8 pb-2">
      <dt className="text-marfim/50">{k}</dt>
      <dd className="text-marfim">{v}</dd>
    </div>
  );
}
