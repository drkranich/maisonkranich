"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// Chaves públicas do Supabase (publishable/anon — seguras para o front).
// Fallback caso as variáveis de ambiente não estejam definidas no build.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nsbxioehvydkazvvbhgq.supabase.co";
const SUPABASE_ANON_KEY =
  process.en