import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteSettings();
  return {
    title: {
      default: `${brand.name} · ${brand.tagline}`,
      template: `%s · ${brand.name}`,
    },
    description: brand.slogan,
    // Se houver favicon_url nas configurações, usa-o; senão cai no app/icon.svg padrão
    icons: brand.favicon_url ? { icon: brand.favicon_url } : undefined,
    openGraph: {
      title: `${brand.name} · ${brand.tagline}`,
      description: brand.slogan,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
