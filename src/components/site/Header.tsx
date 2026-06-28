"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/lib/cart/CartContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { createClient } from "@/lib/supabase/client";

type HeaderBrand = {
  name?: string;
  tagline?: string;
  logo_url?: string;
};

const nav = [
  { label: "Home", href: "/" },
  { label: "Loja", href: "/loja" },
  { label: "Monte Sua Caixa", href: "/monte-sua-caixa" },
  { label: "Coleções", href: "/colecoes" },
  { label: "Curadoria", href: "/curadoria" },
  { label: "Empresas", href: "/corporativo" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [siteBrand, setSiteBrand] = useState<HeaderBrand | null>(null);
  const { count } = useCart();

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "brand")
      .maybeSingle()
      .then((result) => {
        if (!active) return;
        const row = result.data as { value?: HeaderBrand } | null;
        setSiteBrand(row?.value ?? null);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-dourado/12 bg-carvao-deep/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Maison Kranich">
          <Logo
            size={40}
            imageUrl={siteBrand?.logo_url}
            name={siteBrand?.name}
            tagline={siteBrand?.tagline}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="text-[12px] uppercase tracking-brand text-marfim/75 transition-colors hover:text-dourado"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/conta"
            className="hidden items-center gap-2 text-[11px] uppercase tracking-brand text-marfim/75 hover:text-dourado md:flex"
          >
            <User size={16} /> Minha Conta
          </Link>
          <NotificationBell />
          <Link href="/conta/desejos" className="text-marfim/75 hover:text-dourado">
            <Heart size={18} />
          </Link>
          <Link
            href="/composicao"
            className="relative text-marfim/75 hover:text-dourado"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-dourado text-[9px] font-semibold text-carvao-deep">
                {count}
              </span>
            )}
          </Link>
          <button
            className="text-marfim lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-dourado/12 bg-carvao-deep px-6 py-4 lg:hidden">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm uppercase tracking-brand text-marfim/80 hover:text-dourado"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
