import Link from "next/link";
import { requireUser, getProfile } from "@/lib/auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  const profile = await getProfile();
  const name = profile?.full_name || profile?.email || "Cliente";

  return (
    <div className="bg-atelier min-h-screen">
      <Header />

      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <header className="mb-8">
          <span className="mk-kicker">Meu Baú</span>
          <h1 className="mt-1 font-serif text-4xl text-marfim">
            Olá, {name.split(" ")[0]} <span className="text-dourado">♡</span>
          </h1>
          <p className="mt-1 text-sm text-marfim/55">
            Aqui ficam guardadas suas histórias, pedidos e tesouros.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="mk-card p-3">
              <AccountSidebar />
            </div>
            <Link
              href="/monte-sua-caixa"
              className="mt-4 block rounded-md border border-dourado/30 px-4 py-3 text-center text-[11px] uppercase tracking-brand text-dourado transition hover:bg-dourado/10"
            >
              + Montar uma caixa
            </Link>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
