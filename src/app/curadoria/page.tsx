import type { Metadata } from "next";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { CuradoriaWizard } from "@/components/curadoria/CuradoriaWizard";

export const metadata: Metadata = { title: "Curadoria de Presentes" };

export default function CuradoriaPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Concierge de presentes"
        title="Curadoria de Presentes"
        subtitle="Conte-nos sua história. Nós ajudaremos a transformá-la em um presente inesquecível."
      />
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <CuradoriaWizard />
      </div>
    </PageShell>
  );
}
