import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that need auth session refresh (all others skip Supabase entirely)
const AUTH_ROUTES = [
  "/dashboard",
  "/settings",
  "/admin",
  "/teach",
  "/api/my-events",
  "/api/exp",
  "/api/admin",
  "/api/teach",
  "/api/username",
  "/auth",
];

const REF_COOKIE = "solo_ref";
const REF_MAX_AGE = 60 * 60 * 24 * 30; // 30 天

// 首觸歸因：只在 cookie 尚未存在且 URL 帶 ?ref= 時寫入；不覆蓋既有來源。
function captureReferral(request: NextRequest, response: NextResponse) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref) return;
  if (request.cookies.get(REF_COOKIE)) return;
  const code = ref.trim().toUpperCase();
  if (!code || code.length > 64) return;
  response.cookies.set(REF_COOKIE, code, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: REF_MAX_AGE,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // Handle brain.solo.tw subdomain：副腦計畫已下架（2026-07-12），根路徑導去 /courses；
  // 其餘路徑（/skills、/cert/[id] 等）為已購用戶交付與證書路由，維持既有 rewrite 不可斷。
  if (host.startsWith("brain.")) {
    if (pathname === "/") {
      return NextResponse.redirect("https://www.solo.tw/courses", 307);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/brain${pathname}`;
    return NextResponse.rewrite(url);
  }

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
    const res = NextResponse.next();
    captureReferral(request, res);
    return res;
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

  captureReferral(request, supabaseResponse);
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
