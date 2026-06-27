"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Package, Repeat, MessagesSquare, FolderOpen,
  Wallet, BadgePercent, MapPin, Heart, Wand2, LogOut,
} from "lucide-react";

const items = [
  { label: "Visão Geral", href: "/conta", icon: LayoutGrid },
  { label: "Meus Pedidos", href: "/conta/pedidos", icon: Package },
  { label: "Minhas Assinaturas", href: "/conta/assinaturas", icon: Repeat },
  { label: "Minhas Conversas", href: "/conta/conversas", icon: MessagesSquare },
  { label: "Meus Arquivos", href: "/conta/arquivos", icon: FolderOpen },
  { label: "Minha Carteira", href: "/conta/carteira", icon: Wallet },
  { label: "Meus Cupons", href: "/conta/cupons", icon: BadgePercent },
  { label: "Meus Endereços", href: "/conta/enderecos", icon: MapPin },
  { label: "Lista de Desejos", href: "/conta/desejos", icon: Heart },
  { label: "Personalizações", href: "/conta/personalizacoes", icon: Wand2 },
];

export function AccountSidebar() {
  const path = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {items.map((i) => {
        const active = path === i.href;
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors ${
              active
                ? "bg-dourado/12 text-dourado shadow-inset"
                : "text-marfim/65 hover:bg-marfim/[0.04] hover:text-marfim"
            }`}
          >
            <i.icon size={17} className={active ? "text-dourado" : "text-marfim/45"} />
            {i.label}
          </Link>
        );
      })}

      <form action="/auth/sair" method="post" className="mt-2 border-t border-dourado/12 pt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-marfim/55 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={17} />
          Sair
        </button>
      </form>
    </nav>
  );
}
