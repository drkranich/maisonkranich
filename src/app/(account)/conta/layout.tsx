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
  const avatar = (profile as { avatar_url?: string | null })?.avatar_url ?? null;

  return (
    <div className="bg-atelier min-h-screen">
      <Header />

      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <header className="mb-8 flex items-center gap-4">
          <Link href="/conta/perfil" title="Editar meus dados" className="group flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-dourado/25 bg-gradient-to-br from-dourado to-bronze text-xl font-semibold text-carvao-deep">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </span>
            <span>
              <span className="mk-kicker">Meu Baú</span>
              <span className="mt-1 block font-serif text-4xl text-marfim group-hover:text-dourado">
                Olá, {name.split(" ")[0]} <span className="text-dourado">♡</span>
              </span>
            </span>
          </Link>
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
