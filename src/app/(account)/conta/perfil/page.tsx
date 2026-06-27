import { getProfile } from "@/lib/auth";
import { PageTitle } from "@/components/account/AccountUI";
import { ProfileForm } from "@/components/account/ProfileForm";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const profile = await getProfile();

  return (
    <>
      <PageTitle title="Meus Dados" subtitle="Mantenha seu perfil sempre atualizado." />
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
    </>
  );
}
