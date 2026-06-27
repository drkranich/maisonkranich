import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { palette } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function AdminConfig() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const settings = Object.fromEntries((data ?? []).map((s) => [s.key as string, s.value]));

  return (
    <>
      <AdminPageHeader title="Configurações" subtitle="Identidade, contato, frete e preferências da loja" />

      <SettingsForm
        brand={(settings.brand ?? {}) as { name?: string; tagline?: string; slogan?: string }}
        contact={(settings.contact ?? {}) as { email?: string; whatsapp?: string }}
        shipping={(settings.shipping ?? {}) as { free_above_cents?: number }}
      />

      <div className="mk-card mt-6 p-6">
        <h3 className="mk-kicker mb-4">Paleta da marca</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(palette).map(([name, hex]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <span className="h-9 w-9 rounded-full border border-marfim/10" style={{ backgroundColor: hex }} />
              <span className="text-[9px] uppercase tracking-wide text-marfim/40">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
