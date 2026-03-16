"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navigation = [
  { name: "事業健檢", href: "/diagnose" },
  { name: "成長路徑", href: "/growth" },
  { name: "工具", href: "/tools" },
  { name: "活動", href: "/events" },
  { name: "課程", href: "/courses" },
  { name: "部落格", href: "/blog" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-rose-500 sm:h-10 sm:w-10">
              <span className="text-lg font-black text-white sm:text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight text-foreground sm:text-xl">solo.tw</span>
              <span className="hidden text-[10px] font-medium leading-tight text-muted-foreground sm:block">一人事業作業系統</span>
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
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
