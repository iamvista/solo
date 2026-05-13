import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "需求表單已送出 | solo.tw",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <section className="py-32">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-4xl font-bold">表單已送出 🎯</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          我會在 24 小時內回信，若評估彼此合適，會附上付款連結。
          合適與否都會誠實告訴您，請留意收件匣（含垃圾信件匣）。
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">回首頁</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
