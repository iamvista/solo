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
          Google Meet 1-on-1。從 1 小時諮詢到 20 小時長期陪跑，針對您的問題與需求提供服務。
        </p>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          <strong className="text-foreground">1-on-1 量身陪跑</strong>是 Vista Cheng 親自帶的線上一對一諮詢；
          整堂課的時間都用來處理您的具體問題，不是看著錄影檔自學。NT$3,000 起，方案有 5 種，買越多單價越優惠。
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
