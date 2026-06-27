import type { Metadata } from "next";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Minha Composição" };

export default function ComposicaoPage() {
  return (
    <PageShell>
      <PageHero kicker="Sua história em construção" title="Minha Composição" />
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <CartView />
      </div>
    </PageShell>
  );
}
