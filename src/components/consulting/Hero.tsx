import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          不只是教您 AI，更是陪您突破卡關瓶頸
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Google Meet 1-on-1。從 1 小時諮詢到 20 小時長期陪跑，您的問題就是這堂課。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="#lead-form">填表預約 →</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#themes">看 7 個主題包 ↓</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
