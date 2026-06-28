import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { brand } from "@/lib/brand";
import { getSiteSettings } from "@/lib/site";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="bg-atelier flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8">
        <Logo
          stacked
          size={64}
          imageUrl={settings.brand.logo_url}
          name={settings.brand.name}
          tagline={settings.brand.tagline}
        />
      </Link>

      {children}

      <p className="mt-8 max-w-xs text-center font-serif text-sm italic text-marfim/40">
        "{settings.brand.slogan || brand.slogan}"
      </p>
    </div>
  );
}
