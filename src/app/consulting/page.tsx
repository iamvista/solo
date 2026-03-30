import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1-on-1 諮詢 & 陪跑 | solo.tw",
  description:
    "不知道下一步該怎麼走？一小時的深度對話，幫你理清方向、制定行動計畫。",
};

const consultingTypes = [
  {
    icon: MessageCircle,
    title: "事業方向諮詢",
    duration: "60 分鐘",
    price: "NT$3,000",
    desc: "適合剛起步或正在轉型的一人事業者，幫你釐清定位、找到切入點。",
  },
  {
    icon: Calendar,
    title: "陪跑教練",
    duration: "60 分鐘 × 4 次",
    price: "NT$10,000",
    desc: "為期一個月的持續陪伴，每週一次深度對話，確保你不只有方向，還能落地執行。",
  },
  {
    icon: Clock,
    title: "AI 工具導入",
    duration: "90 分鐘",
    price: "NT$5,000",
    desc: "針對你的事業場景，手把手帶你設定 AI 工作流，讓你一個人做到一個團隊的產出。",
  },
];

export default function ConsultingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          1-on-1 諮詢
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          一小時，幫你省半年的摸索
        </h1>
        <p className="mt-4 text-lg text-stone-500">
          不是給你一堆理論，而是根據你的狀況，一起制定可執行的下一步。
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-16 sm:grid-cols-3 sm:gap-8">
        {consultingTypes.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-stone-900">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-stone-400">{item.duration}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-500">
                {item.desc}
              </p>
              <p className="mt-4 text-xl font-bold text-stone-900">
                {item.price}
              </p>
            </div>
          );
        })}
      </div>

      {/* 預約 CTA — 之後會嵌入 Cal.com */}
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:mt-16">
        <h2 className="text-xl font-bold text-stone-900">
          準備好預約諮詢了嗎？
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          預約系統即將上線，目前請直接透過以下方式聯繫：
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button size="lg" asChild>
            <Link href="mailto:vista@solo.tw">
              來信預約
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/diagnose">先做免費健檢</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
