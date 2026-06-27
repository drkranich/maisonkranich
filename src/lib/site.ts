import { createClient } from "@/lib/supabase/server";
import { brand as defaults } from "@/lib/brand";

export type SiteSettings = {
  brand: { name: string; tagline: string; slogan: string };
  contact: { email: string; whatsapp: string };
  shipping: { free_above_cents: number };
};

const FALLBACK: SiteSettings = {
  brand: { name: defaults.name, tagline: defaults.tagline, slogan: defaults.slogan },
  contact: { email: "contato@maisonkranich.com", whatsapp: "" },
  shipping: { free_above_cents: 29900 },
};

/** Lê as configurações do site do banco, com fallback para os padrões da marca. */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map = Object.fromEntries((data ?? []).map((s) => [s.key as string, s.value]));
    return {
      brand: { ...FALLBACK.brand, ...((map.brand as object) ?? {}) },
      contact: { ...FALLBACK.contact, ...((map.contact as object) ?? {}) },
      shipping: { ...FALLBACK.shipping, ...((map.shipping as object) ?? {}) },
    };
  } catch {
    return FALLBACK;
  }
}

export type CmsPage = {
  title: string;
  subtitle: string | null;
  body: string | null;
};

/** Busca uma página publicada pelo slug (para conteúdo editável do site). */
export async function getPage(slug: string): Promise<CmsPage | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("pages")
      .select("title, subtitle, body, status")
      .eq("slug", slug)
      .maybeSingle();
    if (!data || (data as { status: string }).status !== "published") return null;
    return data as CmsPage;
  } catch {
    return null;
  }
}
