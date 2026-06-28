import { getSiteSettings } from "@/lib/site";
import { HeaderClient } from "@/components/site/HeaderClient";

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <HeaderClient
      brand={{
        name: settings.brand.name,
        tagline: settings.brand.tagline,
        logo_url: settings.brand.logo_url,
      }}
    />
  );
}
