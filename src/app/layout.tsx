import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${brand.name} · ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.slogan,
  openGraph: {
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.slogan,
    type: "website",
  },
};

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
