import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de confirmação de e-mail / OAuth.
 * O Supabase redireciona para cá com ?code=... e nós trocamos por sessão.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/conta";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?erro=link_invalido`);
}
