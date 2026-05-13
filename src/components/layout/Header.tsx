"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navigation = [
  { name: "事業健檢", href: "/diagnose" },
  { name: "1-on-1 諮詢", href: "/consulting" },
  { name: "課程", href: "/courses" },
  { name: "成長路徑", href: "/growth" },
  { name: "工具", href: "/tools" },
  { name: "部落格", href: "/blog" },
];

interface UserProfile {
  level: number;
  exp: number;
  username: string | null;
  avatar_url: string | null;
  display_name: string | null;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("level, exp, username, avatar_url, display_name")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const level = profile?.level || 1;
  const exp = profile?.exp || 0;
  const expForNext = level * 200;
  const expProgress = Math.min((exp / expForNext) * 100, 100);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-rose-500 sm:h-10 sm:w-10">
              <span className="text-lg font-bold text-white sm:text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight text-foreground sm:text-xl">solo.tw</span>
              <span className="hidden text-[10px] font-medium leading-tight text-muted-foreground sm:block">AI × 一人事業</span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground"
          >
            <span className="sr-only">開啟選單</span>
            {mobileMenuOpen ? (
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-3">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
              {/* Level badge + progress */}
              <Link href="/dashboard" className="group flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 transition-colors hover:bg-stone-200">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-600">
                    {(profile?.display_name || user.email)?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-700">Lv.{level}</span>
                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-stone-300">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${expProgress}%` }}
                    />
                  </div>
                </div>
              </Link>
              <Button variant="ghost" asChild className="h-10 px-4 text-base">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="h-10 px-4 text-base">
                登出
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="h-10 px-4 text-base">
                <Link href="/auth/login">登入</Link>
              </Button>
              <Button asChild className="h-10 px-5 text-base bg-gradient-to-r from-primary to-rose-500">
                <Link href="/auth/signup">免費加入</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-4 py-3 text-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-2">
              {user ? (
                <>
                  {/* Mobile level display */}
                  <div className="flex items-center gap-3 rounded-lg bg-stone-100 px-4 py-3">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-300 text-sm font-bold text-stone-600">
                        {(profile?.display_name || user.email)?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-900">
                        {profile?.display_name || user.email?.split("@")[0]}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-600">Lv.{level}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-300">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${expProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-stone-500">{exp}/{expForNext}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="h-12 w-full text-base">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout} className="h-12 w-full text-base">
                    登出
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="h-12 w-full text-base">
                    <Link href="/auth/login">登入</Link>
                  </Button>
                  <Button asChild className="h-12 w-full text-base bg-gradient-to-r from-primary to-rose-500">
                    <Link href="/auth/signup">免費加入</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
