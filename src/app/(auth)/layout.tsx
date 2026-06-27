import Link from "next/link";
import { Crest } from "@/components/ui/Logo";
import { brand } from "@/lib/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-atelier flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8 flex flex-col items-center gap-2">
        <Crest size={56} />
        <div className="text-center">
          <div className="font-serif text-xl tracking-brand text-marfim">
            {brand.name.toUpperCase()}
          </div>
          <div className="text-[10px] uppercase tracking-wide2 text-dourado/80">
            {brand.tagline}
          </div>
        </div>
      </Link>

      {children}

      <p className="mt-8 max-w-xs text-center font-serif text-sm italic text-marfim/40">
        “{brand.slogan}”
      </p>
    </div>
  );
}
