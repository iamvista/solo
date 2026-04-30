import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "副腦計畫 Skills｜輸入密碼",
  description: "副腦計畫 Skills 教學手冊需要訓練營密碼解鎖。",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function UnlockPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-stone-50">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900/60 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-amber-400">BRAIN +1 LAB</span>
          <span className="text-stone-500">|</span>
          <span className="text-sm text-stone-300">Skills 教學手冊</span>
        </div>

        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          請輸入訓練營密碼
        </h1>

        <p className="mt-4 text-center text-stone-400">
          副腦計畫｜Brain+1 Lab 學員專屬資源
          <br />
          密碼會在報名信中提供
        </p>

        <form
          method="post"
          action="/skills/api/unlock"
          className="mt-10 w-full rounded-xl border border-stone-700 bg-stone-900/60 p-6 backdrop-blur-sm"
        >
          <label className="block text-sm font-medium text-stone-300">
            密碼
            <input
              type="password"
              name="password"
              required
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="mt-2 block w-full rounded-lg border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="輸入密碼"
            />
          </label>

          {hasError && (
            <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              密碼錯誤，請重新輸入。
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full bg-amber-500 text-stone-900 hover:bg-amber-400"
          >
            進入
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-stone-500">
          沒有密碼？
          <a
            href="https://brain.solo.tw"
            className="ml-1 underline decoration-amber-500/40 underline-offset-2 hover:text-amber-400"
          >
            到 brain.solo.tw 報名訓練營
          </a>
        </p>
      </div>
    </div>
  );
}
