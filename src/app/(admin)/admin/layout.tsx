import { Sidebar } from "@/components/admin/Sidebar";
import { Bell, MessageSquare, Search } from "lucide-react";
import { requireStaff } from "@/lib/auth";

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
            <button className="relative text-marfim/60 hover:text-dourado">
              <Bell size={18} />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-dourado text-[9px] text-carvao-deep">
                12
              </span>
            </button>
            <button className="relative text-marfim/60 hover:text-dourado">
              <MessageSquare size={18} />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-dourado text-[9px] text-carvao-deep">
                5
              </span>
            </button>
            <div className="flex items-center gap-3 border-l border-dourado/12 pl-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-dourado to-bronze text-xs font-semibold text-carvao-deep">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="text-sm text-marfim">{name.split(" ")[0]}</div>
                <div className="text-[10px] uppercase tracking-brand text-dourado/70">
                  {roleLabel}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-7">{children}</main>
      </div>
    </div>
  );
}
