import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: addr } = await supabase
    .from("addresses")
    .select("recipient, line1, line2, district, city, state, zip")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <PageShell>
      <PageHero kicker="Quase lá" title="Finalizar" subtitle="Confirme a entrega e crie seu pedido." />
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <CheckoutForm defaultAddress={addr ?? null} />
      </div>
    </PageShell>
  );
}
