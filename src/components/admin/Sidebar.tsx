"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, Box, Layers, FolderTree,
  Users, Repeat, Crown, CreditCard, BadgePercent, Sparkles, MessagesSquare,
  FolderOpen, Wand2, FileText, Newspaper, BarChart3, Megaphone,
  Settings, ShieldCheck, ScrollText,
} from "lucide-react";
import { Crest } from "@/components/ui/Logo";
import { brand } from "@/lib/brand";

const groups: { items: { label: string; href: string; icon: React.ElementType; tag?: string }[] }[] = [
  {
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
      { label: "Produtos", href: "/admin/produtos", icon: Package },
      { label: "Caixas", href: "/admin/caixas", icon: Box },
      { label: "Coleções", href: "/admin/colecoes", icon: Layers },
      { label: "Categorias", href: "/admin/categorias", icon: FolderTree },
      { label: "Clientes", href: "/admin/clientes", icon: Users },
      { label: "Assinaturas", href: "/admin/assinaturas", icon: Repeat },
      { label: "Planos", href: "/admin/planos", icon: Crown },
      { label: "Pagamentos", href: "/admin/pagamentos", icon: CreditCard },
      { label: "Cupons", href: "/admin/cupons", icon: BadgePercent },
      { label: "Curadoria de Presentes", href: "/admin/curadoria", icon: Sparkles, tag: "NOVO" },
      { label: "Mensagens", href: "/admin/mensagens", icon: MessagesSquare },
      { label: "Arquivos", href: "/admin/arquivos", icon: FolderOpen },
      { label: "Personalizações", href: "/admin/personalizacoes", icon: Wand2 },
      { label: "Conteúdo", href: "/admin/conteudo", icon: FileText },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
      { label: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
      { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
      { label: "Configurações", href: "/admin/config", icon: Settings },
      { label: "Permissões", href: "/admin/permissoes", icon: ShieldCheck },
      { label: "Logs do Sistema", href: "/admin/logs", icon: ScrollText },
    ],
  },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-dourado/12 bg-carvao-deep">
      <div className="flex flex-col items-center gap-2 border-b border-dourado/12 px-6 py-6">
        <Crest size={44} />
        <div className="text-center">
          <div className="font-serif text-lg tracking-brand text-marfim">
            {brand.name.toUpperCase()}
          </div>
          <div className="text-[9px] uppercase tracking-wide2 text-dourado/70">
            {brand.tagline}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups[0].items.map((i) => {
          const active = path === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`mb-0.5 flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors ${
                active
                  ? "bg-dourado/12 text-dourado shadow-inset"
                  : "text-marfim/60 hover:bg-marfim/[0.04] hover:text-marfim"
              }`}
            >
              <i.icon size={17} className={active ? "text-dourado" : "text-marfim/45"} />
              <span className="flex-1">{i.label}</span>
              {i.tag && (
                <span className="rounded bg-bronze/25 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-dourado">
                  {i.tag}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-dourado/12 px-6 py-4 text-center text-[10px] uppercase tracking-brand text-marfim/35">
        © {new Date().getFullYear()} {brand.name}
      </div>
    </aside>
  );
}
