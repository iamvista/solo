# Legacy: /consulting page (snapshot 2026-05-13)

> 取代原因：升級為 1-on-1 量身陪跑服務（spec: docs/superpowers/specs/2026-05-13-consulting-1on1-redesign.md）。
> 取代後新方案在語意上 supersede 此處 4 方案。
>
> Implementation plan: `docs/superpowers/plans/2026-05-13-consulting-1on1-implementation.md`
> Branch: `feature/consulting-1on1-redesign`
> Snapshot taken: 2026-05-13

## 取代前的 page.tsx

來源：`src/app/consulting/page.tsx`（commit 點為 `feature/consulting-1on1-redesign` 起始狀態）

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { CalEmbed } from "@/components/consulting/CalEmbed";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "1-on-1 諮詢 & 陪跑 | solo.tw",
  description:
    "不知道下一步該怎麼走？一小時的深度對話，幫你理清方向、制定行動計畫。",
  alternates: {
    canonical: "https://www.solo.tw/consulting",
  },
};


const consultingTypes = [
  {
    icon: MessageCircle,
    title: "免費初談",
    duration: "30 分鐘",
    originalPrice: null,
    promoPrice: "免費",
    isFree: true,
    badge: null,
    desc: "不確定適不適合？先聊 30 分鐘，了解你的狀況，看看我能怎麼幫你。零風險、零壓力。",
    includes: ["了解你目前的事業狀況", "初步方向建議", "推薦適合你的下一步"],
  },
  {
    icon: Calendar,
    title: "事業方向諮詢",
    duration: "60 分鐘",
    originalPrice: "NT$5,000",
    promoPrice: "NT$2,490",
    saving: "省 NT$2,510",
    isFree: false,
    badge: "最多人選",
    desc: "適合剛起步或正在轉型的一人事業者，幫你釐清定位、制定行動計畫，不再原地打轉。",
    includes: [
      "60 分鐘深度一對一",
      "現況分析與盲點診斷",
      "個人化行動計畫（書面交付）",
      "課後 30 天 Email 追蹤",
    ],
  },
  {
    icon: Clock,
    title: "AI 工具導入",
    duration: "90 分鐘",
    originalPrice: "NT$8,000",
    promoPrice: "NT$3,990",
    saving: "省 NT$4,010",
    isFree: false,
    badge: null,
    desc: "針對你的事業場景，手把手帶你設定 AI 工作流。不是教你理論，是幫你設定好、立刻能用。",
    includes: [
      "90 分鐘實作 + 螢幕共享",
      "客製 AI 工作流設定",
      "工具選擇與串接建議",
      "設定完成可立即使用",
    ],
  },
  {
    icon: Calendar,
    title: "陪跑教練",
    duration: "60 分鐘 × 4 次",
    originalPrice: "NT$20,000",
    promoPrice: "NT$9,900",
    saving: "省 NT$10,100",
    isFree: false,
    badge: "最超值",
    desc: "一個月的持續陪伴，每週一次深度對話。不只給方向，還盯你落地執行。",
    includes: [
      "四次 60 分鐘深度對話",
      "每週進度追蹤與回饋",
      "LINE 即時問答支援",
      "結業後贈一次免費回顧諮詢",
    ],
  },
];

export default function ConsultingPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "1-on-1 事業方向諮詢", description: "60 分鐘深度一對一諮詢，幫你釐清定位、制定行動計畫", url: "https://www.solo.tw/consulting", price: 2490 })} />
      <JsonLd data={breadcrumbSchema([{ name: "首頁", href: "/" }, { name: "諮詢", href: "/consulting" }])} />
      <JsonLd data={faqSchema([
        { question: "諮詢是線上還是線下？", answer: "以 Google Meet 線上進行為主，也可依需求安排臺北線下面談。" },
        { question: "我還在很前期，適合預約嗎？", answer: "完全適合。越早釐清方向，越少走冤枉路。建議先做免費事業健檢，帶著結果來諮詢更有效率。" },
        { question: "和工作坊有什麼不同？", answer: "工作坊是小班教學特定主題，諮詢是完全針對你的狀況一對一深入討論。兩者互補——工作坊學方法，諮詢解決你的個別問題。" },
        { question: "如何付款？", answer: "確認預約後會提供付款連結，支援信用卡和 ATM 轉帳。" },
      ])} />
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              1-on-1 諮詢 & 陪跑
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              先聊聊，不收費
            </h1>
            <p className="mt-4 text-lg text-stone-500 sm:text-xl">
              30 分鐘免費初談，了解你的狀況、看看我能怎麼幫你。
              <br className="hidden sm:block" />
              覺得適合，再選擇付費方案深入合作。
            </p>
          </div>
        </div>
      </section>

      {/* 方案卡片 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 開站優惠提示 */}
          <div className="mx-auto mb-10 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-center">
            <p className="text-sm font-medium text-amber-800">
              🎉 <span className="font-bold">開站限定優惠</span> — 所有付費方案享 <span className="font-bold text-primary">5 折起</span>，名額有限，額滿恢復原價
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {consultingTypes.map((item) => {
              const Icon = item.icon;
              const isPopular = item.badge === "最多人選";
              return (
                <div
                  key={item.title}
                  className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-7 ${
                    item.isFree
                      ? "border-primary/30 ring-1 ring-primary/10"
                      : isPopular
                        ? "border-primary/30 ring-2 ring-primary/10"
                        : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {/* 標籤 */}
                  {item.isFree && (
                    <span className="absolute -top-3 right-5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                      推薦先從這裡開始
                    </span>
                  )}
                  {item.badge && (
                    <span className={`absolute -top-3 right-5 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      isPopular ? "bg-primary" : "bg-amber-500"
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isPopular ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-400">{item.duration}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-500">
                    {item.desc}
                  </p>

                  {/* 包含內容 */}
                  <div className="mt-4 space-y-2 border-t border-stone-100 pt-4">
                    {item.includes.map((inc) => (
                      <div
                        key={inc}
                        className="flex items-center gap-2 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {inc}
                      </div>
                    ))}
                  </div>

                  {/* 價格區 */}
                  <div className="mt-5">
                    {item.isFree ? (
                      <p className="text-2xl font-bold text-emerald-600">免費</p>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-stone-900">
                            {item.promoPrice}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-stone-400 line-through">
                              {item.originalPrice}
                            </span>
                          )}
                        </div>
                        {item.saving && (
                          <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            開站優惠 {item.saving}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 深度系統建構導流 */}
      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-stone-50 p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    更深度的合作
                  </p>
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                  想把研究與寫作，串成一套你自己的 AI 系統？
                </h3>
                <p className="mt-3 text-base leading-relaxed text-stone-500">
                  上面的 90 分鐘工具導入幫你跑通一個工具。如果你要的是一套可以
                  <strong className="text-stone-700">長期累積、會自動化、串好整條工作流</strong>
                  的個人系統，從 1 週藍圖到 8 週完整建構都有。
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                    NT$ 8,800 起
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                    Prompt 庫 + Skill + 結構藍圖
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                    NotebookLM × MCP 串接
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 lg:flex-col">
                <Button asChild size="lg" className="w-full lg:w-auto">
                  <Link href="/consulting/ai-research-system">
                    了解 AI 研究系統
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 預約區塊 */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              預約諮詢時段
            </h2>
            <p className="mt-2 text-base text-stone-500">
              選擇你方便的時間，30 分鐘免費初談。覺得適合再聊付費方案。
            </p>
          </div>

          {/* Cal.com 嵌入 */}
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div style={{ minHeight: 500 }}>
              <CalEmbed calLink="vista/consulting" />
            </div>
          </div>

          {/* 無 JS 時的後備連結 */}
          <noscript>
            <div className="mx-auto mt-6 text-center">
              <a
                href="https://cal.com/vista/consulting"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                前往 Cal.com 預約
              </a>
            </div>
          </noscript>
        </div>
      </section>

      {/* 常見問題 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            常見問題
          </h2>

          <div className="mt-10 space-y-6">
            {[
              {
                q: "諮詢是線上還是線下？",
                a: "以 Google Meet 線上進行為主，也可依需求安排臺北線下面談。",
              },
              {
                q: "我還在很前期，適合預約嗎？",
                a: "完全適合。越早釐清方向，越少走冤枉路。建議先做免費事業健檢，帶著結果來諮詢更有效率。",
              },
              {
                q: "和工作坊有什麼不同？",
                a: "工作坊是小班教學特定主題，諮詢是完全針對你的狀況一對一深入討論。兩者互補——工作坊學方法，諮詢解決你的個別問題。",
              },
              {
                q: "如何付款？",
                a: "確認預約後會提供付款連結，支援信用卡和 ATM 轉帳。",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-stone-100 bg-stone-50/50 p-5"
              >
                <h3 className="text-base font-semibold text-stone-900">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
```

## 取代前的 4 方案

- 免費初談（30 min, 免費）
- 事業方向諮詢（60 min, NT$2,490，原價 NT$5,000）— badge: 最多人選
- AI 工具導入（90 min, NT$3,990，原價 NT$8,000）
- 陪跑教練（60min × 4, NT$9,900，原價 NT$20,000）— badge: 最超值

開站限定優惠：所有付費方案 5 折起，名額有限。

## CalEmbed 串接（vista/consulting）

- 元件：`src/components/consulting/CalEmbed.tsx`
- Cal link：`vista/consulting`
- 無 JS fallback：`https://cal.com/vista/consulting`

## 相關周邊（未在此檔取代範圍內，但提及供溯源）

- `/consulting/ai-research-system` — 深度系統建構導流的目標頁，目前 CTA 從本頁底部「了解 AI 研究系統」連出。新版設計是否續用此導流，由 spec 決定。
- JSON-LD：本頁帶 `serviceSchema` / `breadcrumbSchema` / `faqSchema`，price=2490。新方案落地後需重新評估 serviceSchema 的 price 欄位。

## Prod HTML snapshot

完整 HTML：`docs/archive/consulting-legacy-2026-05-13-screenshots/prod-snapshot.html`（95,135 bytes，minified single-line，HTTP 200，抓取於 2026-05-13）

抓取指令：

```bash
curl -sS -H "Cache-Control: no-cache" https://www.solo.tw/consulting
```

頁首片段（前 ~1.8KB，含 metadata）：

```html
<!DOCTYPE html><html data-dpl-id="dpl_4CY91RofRuHNpTDx6kJjZktx8YeG" lang="zh-TW"><head>
<meta charSet="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="stylesheet" href="/_next/static/chunks/01f92t6rms-53.css?dpl=dpl_4CY91RofRuHNpTDx6kJjZktx8YeG" data-precedence="next"/>
<link rel="stylesheet" href="/_next/static/chunks/0qtiznew9zcp3.css?dpl=dpl_4CY91RofRuHNpTDx6kJjZktx8YeG" data-precedence="next"/>
<!-- ...preload + async script tags... -->
<title>1-on-1 諮詢 &amp; 陪跑 | solo.tw</title>
<meta name="description" content="不知道下一步該怎麼走？一小時的深度對話，幫你理清方向、制定行動計畫。"/>
```

頁尾片段（含 OG / Twitter meta）：

```html
"og:url" → "https://www.solo.tw"
"og:site_name" → "solo.tw"
"og:image" → "https://www.solo.tw/og" (1200x630, alt: "solo.tw — AI × 一人事業")
"og:image" → "https://www.solo.tw/solo-icon.png" (512x512)
"og:type" → "website"
"twitter:card" → "summary_large_image"
"twitter:title" → "solo.tw | 用 AI 放大你的一人事業"
"twitter:image" → "https://www.solo.tw/og"
```

驗證 metadata 跟 `page.tsx` 一致（title、description、canonical 經 layout 合併產出符合預期）。完整內容請見同目錄 `prod-snapshot.html`。

## Screenshots

桌機與行動版全頁截圖（Playwright headless Chromium，於 2026-05-13 抓取）：

- 桌機（1440×900 viewport，full page）：`docs/archive/consulting-legacy-2026-05-13-screenshots/desktop-1440.png`（~561 KB）
- 行動（390×844 viewport，DPR 2，full page）：`docs/archive/consulting-legacy-2026-05-13-screenshots/mobile-390.png`（~1014 KB）

抓取腳本（已自 /tmp 移除，僅供後續重抓參考）：

```js
// /tmp/screenshot-consulting.cjs — Playwright 11.x
const { chromium } = require('playwright');
const browser = await chromium.launch();
const dCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dPage = await dCtx.newPage();
await dPage.goto('https://www.solo.tw/consulting', { waitUntil: 'networkidle' });
await dPage.screenshot({ path: 'desktop-1440.png', fullPage: true });

const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const mPage = await mCtx.newPage();
await mPage.goto('https://www.solo.tw/consulting', { waitUntil: 'networkidle' });
await mPage.screenshot({ path: 'mobile-390.png', fullPage: true });
```
