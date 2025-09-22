import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "@/utils/utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Bloqueia todas as rotas protegidas para usuários não autenticados
  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (!user && !isAuthPage && pathname !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 🔐 Protegendo rotas específicas por role
  const protectedByRole: Record<string, string[]> = {
    "/post/new": ["admin", "mod"],
    "/admin": ["admin"],
  };

  // Se a rota estiver protegida por role
  if (user && pathname in protectedByRole) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      const url = request.nextUrl.clone();
      url.pathname = "/not-authorized";
      return NextResponse.redirect(url);
    }

    const allowedRoles = protectedByRole[pathname];
    if (!allowedRoles.includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/not-authorized";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}