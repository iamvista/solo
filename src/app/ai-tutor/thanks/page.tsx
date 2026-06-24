import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "預約已收到 — AI 家教班 | solo.tw",
  robots: { index: false },
};

export default async function AiTutorThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ lead_id?: string }>;
}) {
  await searchParams; // lead_id 目前僅用於追蹤，頁面不需顯示
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl">🎓</div>
      <h1 className="text-3xl font-bold sm:text-4xl">預約收到了，謝謝你！</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        我會親自看過你的需求，並在 1～2 個工作天內用 E-mail 回覆，
        和你約一段 30 分鐘的免費諮詢時間。
      </p>
      <p className="mt-2 text-muted-foreground">記得留意信箱（含垃圾信匣）。</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg"><Link href="/">回首頁</Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/blog">逛逛部落格</Link></Button>
      </div>
    </main>
  );
}
