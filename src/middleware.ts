import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that need auth session refresh (all others skip Supabase entirely)
const AUTH_ROUTES = [
  "/dashboard",
  "/settings",
  "/admin",
  "/api/my-events",
  "/api/exp",
  "/api/admin",
  "/api/username",
  "/auth",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /@username → /u/username rewrite
  if (pathname.startsWith("/@")) {
    const username = pathname.slice(2).split("/")[0];
    if (username && /^[a-z0-9_]{3,20}$/.test(username)) {
      const url = request.nextUrl.clone();
      url.pathname = `/u/${username}${pathname.slice(2 + username.length)}`;
      return NextResponse.rewrite(url);
    }
  }

  // Skip Supabase auth refresh for public routes (saves ~50ms per request)
  const needsAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (!needsAuth) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

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
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired — only for auth-required routes
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
