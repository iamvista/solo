import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Explorer 探索者",
    price: "免費",
    period: "",
    description: "先來玩玩看，體驗核心功能",
    features: [
      "事業健檢（快速 + 完整版）",
      "全部部落格文章",
      "免費活動報名",
      "工具試用（有限制）",
      "基礎 Dashboard",
    ],
    cta: "免費開始",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro 實踐者",
    price: "NT$399",
    period: "/月",
    originalPrice: "創始會員 NT$199/月",
    description: "工具＋內容，雙重價值",
    features: [
      "所有 Explorer 功能",
      "名單磁鐵系統（3 頁）",
      "活動報名系統（3 場/月）",
      "問卷系統（3 份/月）",
      "社群動態牆 + LINE 群",
      "Pro 專屬文章 & 課程回放",
      "完整 Dashboard + SOLO 指引",
    ],
    cta: "成為實踐者",
    ctaHref: "/auth/signup",
    highlighted: true,
  },
  {
    name: "Premium 事業家",
    price: "NT$999",
    period: "/月",
    originalPrice: "創始會員 NT$599/月",
    description: "無限工具＋專屬服務",
    features: [
      "所有 Pro 功能",
      "工具全部無限使用",
      "移除 solo.tw 浮水印",
      "付費票種（收費辦活動）",
      "每季 1-on-1 諮詢（30 分鐘）",
      "Mastermind 小組",
      "營收數據追蹤面板",
    ],
    cta: "成為事業家",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
];

export function PricingPreviewSection() {
  return (
    <section className="bg-background py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary sm:text-base">
            會員方案
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            選擇你的成長速度
          </h2>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            免費開始，隨時升級。創始會員享終身優惠價。
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-16 sm:grid-cols-3 lg:mt-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                    最受歡迎
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mt-5">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-base text-muted-foreground">
                    {plan.period}
                  </span>
                )}
                {plan.originalPrice && (
                  <p className="mt-1 text-sm font-medium text-emerald-600">
                    ⚡ {plan.originalPrice}
                  </p>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  variant={plan.highlighted ? "default" : "outline"}
                  className={`h-12 w-full text-base ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-primary to-rose-500 shadow-md"
                      : ""
                  }`}
                >
                  <Link href={plan.ctaHref}>{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-8 text-center text-sm text-muted-foreground sm:mt-12">
          所有方案皆可隨時取消。年繳享 85 折優惠。
        </p>
      </div>
    </section>
  );
}
