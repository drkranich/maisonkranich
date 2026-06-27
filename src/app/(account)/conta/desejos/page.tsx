import Link from "next/link";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { brl } from "@/lib/format";
import { PageTitle, EmptyState } from "@/components/account/AccountUI";

export const dynamic = "force-dynamic";

export default async function DesejosPage() {
  const supabase = await createClient();
  const user = await getUser();
  const { data } = await supabase
    .from("wishlist_items")
    .select("product_id, products(slug, name, price_cents, short_desc)")
    .eq("user_id", user!.id);

  const items = (data ?? []).map((d) => d.products).filter(Boolean) as {
    slug: string; name: string; price_cents: number; short_desc: string | null;
  }[];

  return (
    <>
      <PageTitle title="Lista de Desejos" subtitle="Os tesouros que você quer guardar para depois." />
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Sua lista está vazia"
          hint="Toque no coração dos produtos que você ama e eles ficam guardados aqui."
          cta={{ label: "Explorar a loja", href: "/loja" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <Link key={p.slug} href={`/loja/${p.slug}`} className="mk-card group p-5 transition-transform hover:-translate-y-0.5">
              <div className="font-serif text-lg text-marfim group-hover:text-dourado">{p.name}</div>
              {p.short_desc && <p className="mt-1 text-sm text-marfim/55">{p.short_desc}</p>}
              <div className="mt-3 text-dourado">{brl(p.price_cents)}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
