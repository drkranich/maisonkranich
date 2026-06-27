import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nsbxioehvydkazvvbhgq.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_wS38W4BHm7dhv2w1Fzoa7Q_9fNrpzMd";

/**
 * Atualiza a sessão do Supabase em cada request (refresh de token via cookies)
 * e protege as rotas privadas (/conta).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Rotas privadas → exige login
  if (!user && path.startsWith("/conta")) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Já logado tentando acessar telas de auth → manda pro Baú
  if (user && (path === "/entrar" || path === "/cadastro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/conta";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
