"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// Chaves públicas do Supabase (publishable/anon — seguras para o front).
// Fallback caso as variáveis de ambiente não estejam definidas no build.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nsbxioehvydkazvvbhgq.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_wS38W4BHm7dhv2w1Fzoa7Q_9fNrpzMd";

/** Cliente Supabase para uso no browser (Client Components). */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
