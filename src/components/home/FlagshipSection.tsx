import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Code2, Video, Mic, ArrowRight } from "lucide-react";
import { ARMY_KIT_PRICE } from "@/lib/army-kit";
import { CONSULTING_PLANS } from "@/lib/consulting-config";
import { getCourseConfig } from "@/lib/courses-config";

// 價格取自各自的單一事實來源，避免與產品頁／設定檔漂移。
const consultingFrom = Math.min(...CONSULTING_PLANS.map((p) => p.totalPrice));
const vibeCodingFrom = getCourseConfig("vibe-coding")?.regularPrice ?? 4000;

const flagships = [
  {
    icon: Users,
    tag: "數位工具包・即買即用",
    title: "無人公司 AI 軍團啟動包",
    desc: "把派工原則、角色人設、對抗式驗收流程寫成制度檔，鋪進 Claude Code 就能用。不用寫程式，也能建一支 AI 團隊。",
    price: `NT$${ARMY_KIT_PRICE.toLocaleString()}`,
    priceNote: "一次買斷",
    cta: "立即入手",
    href: "/products/solo-army-kit",
    highlight: true,
  },
  {
    icon: Mic,
    tag: "數位工具包・即買即用",
    title: "講師 AI 幕僚",
    desc: "把十階段備課流程、獨立監察 AI、客戶視角提案報價寫成制度檔，鋪進 Claude Code 就能用。給職業講師的 AI 工作流。",
    price: "籌備中",
    priceNote: "開賣時搶先通知",
    cta: "預約通知",
    href: "/products/lecturer-ai-staff",
    highlight: false,
  },
  {
    icon: Code2,
    tag: "實體工作坊",
    title: "Vibe Coding 系列工作坊",
    desc: "小班制手把手，3 小時用 AI 做出第一個能上線的數位資產。從零基礎到 Claude Code 進階，選一場適合你的。",
    price: `NT$${vibeCodingFrom.toLocaleString()} 起`,
    priceNote: "近期開班中",
    cta: "查看近期場次",
    href: "/courses",
    highlight: false,
  },
  {
    icon: Video,
    tag: "1 對 1",
    title: "諮詢 & 陪跑",
    desc: "把方向、工作流、卡關一次理清。1 小時單點諮詢到 20 小時長期陪跑套票，按你的需求選，時數越多越優惠。",
    price: `NT$${consultingFrom.toLocaleString()} 起`,
    priceNote: "1–20 小時套票",
    cta: "了解諮詢方案",
    href: "/consulting",
    highlight: false,
  },
];

export function FlagshipSection() {
  return (
    <section id="flagship" className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            熱門主力
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            想馬上開始？從這些入手
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            買了就能用的工具包、即學即用的實戰工作坊，或一對一帶你走的深度陪跑。
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-8">
          {flagships.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8 ${
                  item.highlight
                    ? "border-primary/30 shadow-primary/5 ring-1 ring-primary/10"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                {item.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    新品
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      item.highlight
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                  {item.desc}
                </p>

                <div className="mt-6 flex items-end justify-between border-t border-stone-100 pt-5">
                  <div>
                    <div className="text-xl font-bold text-stone-900">
                      {item.price}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-400">
                      {item.priceNote}
                    </div>
                  </div>
                  <Button
                    variant={item.highlight ? "default" : "outline"}
                    size="sm"
                    asChild
                    className={
                      item.highlight
                        ? "shadow-sm shadow-primary/15"
                        : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }
                  >
                    <Link href={item.href}>
                      {item.cta}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
