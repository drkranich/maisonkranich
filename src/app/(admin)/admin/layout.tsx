import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { MessageSquare, Search, Store, LogOut } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const roleLabels: Record<string, string> = {
  owner: "Superadministrador",
  admin: "Administrador",
  curator: "Curador(a)",
  support: "Atendimento",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireStaff();
  const name = profile.full_name || profile.email || "Equipe";
  const roleLabel = roleLabels[profile.role as string] ?? "Administrador";
  const avatar = (profile as { avatar_url?: string | null }).avatar_url ?? null;

  return (
    <div className="flex bg-atelier">
      <div className="sticky top-0 hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-dourado/12 bg-carvao-deep/70 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="font-serif text-2xl text-marfim">Dashboard</h1>
            <p className="text-xs text-marfim/50">
              Bem-vindo(a) de volta, Equipe Maison Kranich.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Search className="text-marfim/50" size={18} />
            <NotificationBell allHref="/admin/pedidos" />
            <Link href="/admin/mensagens" className="relative text-marfim/60 hover:text-dourado">
              <MessageSquare size={18} />
            </Link>
            <Link href="/admin/config" title="Minha conta e configurações" className="group flex items-center gap-3 border-l border-dourado/12 pl-5">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-dourado to-bronze text-xs font-semibold text-carvao-deep">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </span>
              <span className="leading-tight">
                <span className="block text-sm text-marfim group-hover:text-dourado">{name.split(" ")[0]}</span>
                <span className="block text-[10px] uppercase tracking-brand text-dourado/70">
                  {roleLabel}
                </span>
              </span>
            </Link>

              <Link
                href="/"
                title="Ir para a loja"
                className="ml-1 flex items-center gap-1.5 rounded-md border border-dourado/25 px-3 py-1.5 text-[10px] uppercase tracking-brand text-marfim/70 transition hover:border-dourado hover:text-dourado"
              >
                <Store size={14} /> Ver loja
              </Link>

              <form action="/auth/sair" method="post">
                <button
                  type="submit"
                  title="Sair da conta"
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] uppercase tracking-brand text-marfim/55 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut size={14} /> Sair
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-7">{children}</main>
      </div>
    </div>
  );
}
