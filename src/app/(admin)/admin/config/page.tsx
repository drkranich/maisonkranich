import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ProfileForm } from "@/components/account/ProfileForm";
import { palette } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function AdminConfig() {
  const supabase = await createClient();
  const profile = await getProfile();
  const { data } = await supabase.from("site_settings").select("key, value");
  const settings = Object.fromEntries((data ?? []).map((s) => [s.key as string, s.value]));

  return (
    <>
      <AdminPageHeader title="Configurações" subtitle="Seu perfil, identidade da loja, contato, frete e ícone do site" />

      <h3 className="mk-kicker mb-3">Meu perfil</h3>
      <div className="mb-8">
        <ProfileForm
          initial={{
            id: profile!.id as string,
            full_name: (profile as { full_name: string | null }).full_name ?? null,
            email: (profile as { email: string | null }).email ?? null,
            phone: (profile as { phone?: string | null }).phone ?? null,
            instagram: (profile as { instagram?: string | null }).instagram ?? null,
            avatar_url: (profile as { avatar_url: string | null }).avatar_url ?? null,
          }}
        />
      </div>

      <h3 className="mk-kicker mb-3">Configurações do site</h3>
      <SettingsForm
        brand={(settings.brand ?? {}) as { name?: string; tagline?: string; slogan?: string; favicon_url?: string; logo_url?: string }}
        contact={(settings.contact ?? {}) as { email?: string; whatsapp?: string; instagram?: string }}
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
