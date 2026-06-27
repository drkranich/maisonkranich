import { PageTitle } from "@/components/account/AccountUI";
import { PrivacyPanel } from "@/components/account/PrivacyPanel";

export const dynamic = "force-dynamic";

export default function PrivacidadePage() {
  return (
    <>
      <PageTitle title="Privacidade & Dados" subtitle="Seus direitos sobre seus dados (LGPD)." />
      <PrivacyPanel />
    </>
  );
}
