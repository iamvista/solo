# AI 教練工坊 — 數位產品實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 solo.tw 上架「AI 教練工坊」數位產品——銷售頁、付款整合、ZIP 下載、圖文教學。

**Architecture:** 新增一個 Next.js 產品頁面，擴展現有 PAYUNi 付款流程支援數位下載，新增 download API route 和 Supabase download_tokens 表。ZIP 內容包含教練 Skill（從 solopreneur-skills 複製）+ 新寫的 6 篇零基礎教學 + 3 份範例檔。

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase, PAYUNi

**Spec:** `docs/specs/2026-04-08-ai-coach-kit-design.md`

**Working Directory:** `/Users/vista/06_VibeCoding/01_Code_Products/solo`

---

## 檔案結構

```
src/app/products/ai-coach-kit/
  └── page.tsx                          — Task 1: 銷售頁面

src/app/api/payment/create/
  └── route.ts                          — Task 2: 修改，新增產品價格

src/app/api/download/ai-coach-kit/
  └── route.ts                          — Task 3: 下載 API（token 驗證 + ZIP 回傳）

src/app/payment/success/
  └── page.tsx                          — Task 4: 修改，數位產品顯示下載按鈕

supabase/migrations/
  └── XXX_download_tokens.sql           — Task 5: download_tokens 表

public/downloads/
  └── ai-coach-kit.zip                  — Task 8: 最終 ZIP 檔

ai-coach-kit-content/                   — Task 6-7: ZIP 內容準備（臨時目錄）
  ├── README.md
  ├── guide/01-06
  └── examples/3 files
```

---

## Task 1: 銷售頁面

**Files:**
- Create: `src/app/products/ai-coach-kit/page.tsx`

- [ ] **Step 1: 建立銷售頁面**

```tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Zap,
  BookOpen,
  Users,
  ArrowRight,
  Download,
  Bot,
  Target,
  BarChart3,
  Palette,
  Mic,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI 教練工坊：打造你自己的 AI 實踐教練 | solo.tw",
  description:
    "不是聊天機器人，是每天陪你執行、追蹤進度、設計實驗的教練系統。一次買斷 NT$1,499，零基礎也能上手。",
  openGraph: {
    title: "AI 教練工坊：打造你自己的 AI 實踐教練",
    description:
      "教你用 AI 建一個每天陪你執行的實踐教練。框架 + 模板 + 150 篇知識庫，一次買斷。",
    url: "https://www.solo.tw/products/ai-coach-kit",
  },
};

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-28">
      <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-amber-50/60 blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
          <Bot className="h-4 w-4" />
          數位產品・一次買斷
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
          AI 教練工坊
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 sm:text-xl">
          教你用 AI 建一個每天陪你執行的實踐教練
        </p>
        <p className="mx-auto mt-2 max-w-xl text-base text-stone-500">
          不是聊天機器人，是每天主動 check-in、設計實驗、追蹤進度的教練系統
        </p>
        <div className="mt-8">
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
          >
            立即購買 NT$1,499
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-sm text-stone-400">
            一次買斷・永久使用・零基礎教學
          </p>
        </div>
      </div>
    </section>
  );
}

function PainSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          你有沒有過這樣的經驗？
        </h2>
        <div className="mt-10 space-y-6">
          {[
            "買了課程，前三天很興奮，一個月後完全忘記自己買過",
            "知道該做什麼，但就是沒有人盯著你做",
            "用 ChatGPT 問了一堆問題，聊完就忘，什麼都沒改變",
            "想要有教練指導，但一對一教練太貴",
          ].map((pain, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg border border-stone-200 bg-stone-50 p-5"
            >
              <span className="mt-0.5 text-xl">😰</span>
              <p className="text-base text-stone-700">{pain}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-lg text-stone-600">
          問題不在你。是缺少三個東西：
          <span className="font-semibold text-stone-900">
            問責、個人化、實踐追蹤
          </span>
        </p>
      </div>
    </section>
  );
}

function CompareSection() {
  return (
    <section className="bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          AI 聊天機器人 vs AI 實踐教練
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-8">
            <div className="mb-4 text-sm font-medium text-stone-400">
              市面上的 AI 教練
            </div>
            <h3 className="text-xl font-bold text-stone-900">聊天機器人</h3>
            <ul className="mt-6 space-y-3">
              {[
                "你問它答，對話結束就結束",
                "沒有追蹤，不知道你做了沒",
                "建議千篇一律，不會個人化",
                "2-3 週後就不想用了",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-500">
                  <span className="mt-1 text-rose-400">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border-2 border-primary/30 bg-white p-8 shadow-lg shadow-primary/5">
            <div className="mb-4 text-sm font-medium text-primary">
              AI 教練工坊
            </div>
            <h3 className="text-xl font-bold text-stone-900">實踐教練</h3>
            <ul className="mt-6 space-y-3">
              {[
                "每天早晚主動 check-in，問你做了什麼",
                "設計個人化實驗，有明確的成功指標",
                "追蹤進度，根據你的數據調整建議",
                "週報歸檔，看得見自己的成長軌跡",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentSection() {
  const items = [
    {
      icon: Zap,
      title: "4 個教練 Skill",
      desc: "一鍵安裝，啟動教練、晨間覆盤、下午 check-in、週報總結",
    },
    {
      icon: BookOpen,
      title: "教練模板系統",
      desc: "用任何作者、任何領域的知識建立你自己的 AI 教練",
    },
    {
      icon: Bot,
      title: "Vista Coach 預建教練",
      desc: "150 篇知識庫（一人創業 + 內容創作 + 電子報），開箱即用",
    },
    {
      icon: Target,
      title: "6 篇零基礎圖文教學",
      desc: "從安裝 Claude Code 到自建教練，完全不需要技術背景",
    },
    {
      icon: BarChart3,
      title: "實驗設計框架",
      desc: "不是任務清單，是有假設、有指標、有追蹤的實踐迴圈",
    },
    {
      icon: Download,
      title: "3 份填好的範例檔",
      desc: "看了就懂怎麼填，不用從空白開始",
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          你會拿到什麼
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-200 bg-white p-6"
            >
              <item.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseSection() {
  const cases = [
    {
      icon: Mic,
      role: "內容創作者",
      source: "自己的文章 + 喜歡的作者",
      use: "每天追蹤寫作實驗，從分享資訊轉型為觀點型內容",
    },
    {
      icon: Users,
      role: "企業講師",
      source: "課程講義 + 教學方法論",
      use: "為學員提供課後實踐追蹤，提升課程完成率",
    },
    {
      icon: Palette,
      role: "設計師 / 接案者",
      source: "產業方法論 + 作品集策略",
      use: "追蹤個人品牌建立和接案流程優化",
    },
    {
      icon: Briefcase,
      role: "顧問 / 教練",
      source: "自己的方法論 + 產業報告",
      use: "用 AI 教練擴展服務能力，為更多客戶提供追蹤",
    },
  ];

  return (
    <section className="bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          不同產業，同一套框架
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-stone-500">
          教練的知識來自你灌入的內容——換一套知識庫，就是一個全新領域的教練
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {cases.map((c, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-200 bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900">
                  {c.role}
                </h3>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-stone-500">
                  知識來源：
                  <span className="text-stone-700">{c.source}</span>
                </p>
                <p className="text-stone-500">
                  教練用途：
                  <span className="text-stone-700">{c.use}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "需要什麼技術基礎？",
      a: "完全零基礎。附 6 篇圖文教學，從「怎麼打開終端機」開始教起。",
    },
    {
      q: "除了購買費用，還需要付什麼？",
      a: "需要 Claude 訂閱（Pro 方案 $20 USD/月）。教練對話的 API 費用約 $3-9 USD/月。Gemini Notebook 免費。",
    },
    {
      q: "Vista Coach 的知識庫包含什麼？",
      a: "150 篇文章，來自 vista.tw、solo.tw 和 Vista 電子報，涵蓋一人創業、內容創作、個人品牌三大領域。",
    },
    {
      q: "可以用在什麼產業？",
      a: "任何有文字知識庫的領域。只要你能找到 20-30 篇相關文章，就能建一個該領域的教練。",
    },
    {
      q: "macOS 和 Windows 都能用嗎？",
      a: "都能用。附雙平臺安裝腳本（install.sh 和 install.bat）。",
    },
    {
      q: "跟 AI 一人公司 Bootcamp 有什麼關係？",
      a: "教練工坊是獨立產品，專注在教練系統。Bootcamp 涵蓋完整的一人公司作業系統（10+ 個 Skill）。",
    },
    {
      q: "買了之後有更新嗎？",
      a: "未來有重大更新會透過電子報通知付費用戶。",
    },
    {
      q: "可以退費嗎？",
      a: "數位商品售出後不提供退費。購買前請確認你有意願投入時間使用。",
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          常見問題
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg border border-stone-200 bg-white p-5"
            >
              <h3 className="font-semibold text-stone-900">{faq.q}</h3>
              <p className="mt-2 text-sm text-stone-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          一次買斷，永久使用
        </h2>
        <div className="mx-auto mt-10 max-w-sm rounded-2xl border-2 border-primary/30 bg-white p-8 shadow-xl shadow-primary/10">
          <div className="text-sm font-medium text-primary">AI 教練工坊</div>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-stone-900">1,499</span>
            <span className="text-lg text-stone-500">NTD</span>
          </div>
          <p className="mt-2 text-sm text-stone-400">一次付款・不是訂閱</p>
          <ul className="mt-8 space-y-3 text-left text-sm">
            {[
              "4 個教練 Skill（一鍵安裝）",
              "教練模板系統（建你自己的教練）",
              "Vista Coach 預建教練（150 篇知識庫）",
              "6 篇零基礎圖文教學",
              "3 份填好的範例檔",
              "未來更新通知",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="text-stone-700">{item}</span>
              </li>
            ))}
          </ul>
          <form action="/api/payment/create" method="POST" className="mt-8">
            <input type="hidden" name="productType" value="product" />
            <input type="hidden" name="productId" value="ai-coach-kit" />
            <input type="hidden" name="productName" value="AI 教練工坊" />
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
            >
              立即購買
            </button>
          </form>
          <p className="mt-4 text-xs text-stone-400">
            付款後立即取得下載連結・數位商品不提供退費
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AICoachKitPage() {
  return (
    <main>
      <HeroSection />
      <PainSection />
      <CompareSection />
      <ContentSection />
      <UseCaseSection />
      <FAQSection />
      <PricingSection />
    </main>
  );
}
```

- [ ] **Step 2: 確認頁面可渲染**

Run: `cd /Users/vista/06_VibeCoding/01_Code_Products/solo && npx next build --no-lint 2>&1 | tail -5`
Expected: 頁面編譯成功

- [ ] **Step 3: Commit**

```bash
git add src/app/products/ai-coach-kit/page.tsx
git commit -m "feat: add AI Coach Kit sales page"
```

---

## Task 2: 付款流程新增產品

**Files:**
- Modify: `src/app/api/payment/create/route.ts`

- [ ] **Step 1: 在 PRODUCT_PRICES 新增產品**

在 `route.ts` 中找到 `PRODUCT_PRICES` 物件（或類似的價格對照表），新增一行：

```typescript
"product:ai-coach-kit": 1499,
```

- [ ] **Step 2: 確認 PAYUNi 付款可建立**

確認 `productType` 為 `product`、`productId` 為 `ai-coach-kit` 時，API 能正確回傳付款表單。

- [ ] **Step 3: Commit**

```bash
git add src/app/api/payment/create/route.ts
git commit -m "feat: add ai-coach-kit to payment product prices"
```

---

## Task 3: 下載 API Route

**Files:**
- Create: `src/app/api/download/ai-coach-kit/route.ts`

- [ ] **Step 1: 建立下載 API**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "缺少下載 token" }, { status: 400 });
  }

  // Verify token
  const { data: tokenRecord, error } = await supabase
    .from("download_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !tokenRecord) {
    return NextResponse.json({ error: "無效的下載連結" }, { status: 404 });
  }

  // Check expiry
  if (new Date(tokenRecord.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "下載連結已過期，請聯繫 support@solo.tw" },
      { status: 410 }
    );
  }

  // Check download count
  if (tokenRecord.download_count >= tokenRecord.max_downloads) {
    return NextResponse.json(
      { error: "已達下載次數上限，請聯繫 support@solo.tw" },
      { status: 429 }
    );
  }

  // Increment download count
  await supabase
    .from("download_tokens")
    .update({ download_count: tokenRecord.download_count + 1 })
    .eq("id", tokenRecord.id);

  // Serve ZIP file
  const zipPath = path.join(process.cwd(), "private", "ai-coach-kit.zip");

  try {
    const fileBuffer = await readFile(zipPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="ai-coach-kit.zip"',
        "Content-Length": String(fileBuffer.length),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "檔案不存在，請聯繫 support@solo.tw" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 建立 private/ 目錄**

```bash
mkdir -p private
echo "ai-coach-kit.zip" >> .gitignore
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/download/ai-coach-kit/route.ts .gitignore
git commit -m "feat: add download API route with token verification"
```

---

## Task 4: 付款成功頁顯示下載按鈕

**Files:**
- Modify: `src/app/payment/success/page.tsx`

- [ ] **Step 1: 修改成功頁面支援下載**

改寫 `success/page.tsx`，讓它讀取 URL search params 中的 `token` 和 `type` 參數。如果是數位產品，顯示下載按鈕而非課程連結。

```tsx
import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; type?: string }>;
}) {
  const params = await searchParams;
  const isDigitalProduct = params.type === "download" && params.token;

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-stone-900">付款成功！</h1>
        <p className="mt-2 text-stone-600">
          {isDigitalProduct
            ? "感謝購買！請點擊下方按鈕下載你的教練工坊套件。"
            : "感謝您的購買，我們已寄送確認信至您的信箱。"}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {isDigitalProduct ? (
            <>
              <a
                href={`/api/download/ai-coach-kit?token=${params.token}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
              >
                <Download className="h-5 w-5" />
                下載 AI 教練工坊
              </a>
              <p className="text-xs text-stone-400">
                下載連結有效 72 小時，最多可下載 3 次
              </p>
            </>
          ) : (
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
            >
              查看課程
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/"
            className="text-sm text-stone-500 underline hover:text-stone-700"
          >
            回到首頁
          </Link>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/payment/success/page.tsx
git commit -m "feat: support digital product download on payment success page"
```

---

## Task 5: Supabase download_tokens 表

**Files:**
- Create: `supabase/migrations/YYYYMMDD_download_tokens.sql`

- [ ] **Step 1: 建立 migration 檔**

```sql
-- Download tokens for digital product delivery
CREATE TABLE IF NOT EXISTS download_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL DEFAULT 'ai-coach-kit',
  token TEXT UNIQUE NOT NULL,
  email TEXT,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can access
CREATE POLICY "service_role_all" ON download_tokens
  FOR ALL USING (auth.role() = 'service_role');
```

- [ ] **Step 2: 在 payment notify webhook 中產生 token**

修改 `src/app/api/payment/notify/route.ts`，在付款成功且產品為 `ai-coach-kit` 時，自動建立 download token：

在 `payment_status` 更新為 `"paid"` 的程式碼後面加入：

```typescript
// Generate download token for digital products
if (order.product_id === "ai-coach-kit" && decryptedData.Status === "SUCCESS") {
  const downloadToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

  await supabase.from("download_tokens").insert({
    order_id: orderNumber,
    product_id: "ai-coach-kit",
    token: downloadToken,
    email: order.email || null,
    expires_at: expiresAt.toISOString(),
  });
}
```

- [ ] **Step 3: 修改 payment return route 傳遞 token**

在 `/api/payment/return/route.ts`（PAYUNi 回傳使用者的 endpoint）中，如果產品是 `ai-coach-kit`，redirect 到帶 token 的成功頁：

```typescript
// After verifying payment, check if digital product
if (order.product_id === "ai-coach-kit") {
  const { data: tokenRecord } = await supabase
    .from("download_tokens")
    .select("token")
    .eq("order_id", orderNumber)
    .single();

  if (tokenRecord) {
    return NextResponse.redirect(
      new URL(`/payment/success?type=download&token=${tokenRecord.token}`, request.url)
    );
  }
}
```

- [ ] **Step 4: 執行 migration**

```bash
npx supabase db push
```

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/ src/app/api/payment/notify/route.ts src/app/api/payment/return/route.ts
git commit -m "feat: add download_tokens table and auto-generate on payment"
```

---

## Task 6: ZIP 內容 — 圖文教學

**Files:**
- Create: `ai-coach-kit-content/guide/01-install-claude-code.md`
- Create: `ai-coach-kit-content/guide/02-install-coach.md`
- Create: `ai-coach-kit-content/guide/03-first-session.md`
- Create: `ai-coach-kit-content/guide/04-daily-loop.md`
- Create: `ai-coach-kit-content/guide/05-build-your-own.md`
- Create: `ai-coach-kit-content/guide/06-notebooklm-guide.md`

在 solo 專案根目錄建立 `ai-coach-kit-content/` 臨時目錄，撰寫 6 篇零基礎圖文教學。內容從今天寫好的 `manual-coach-complete.md`（在 solopreneur-skills 專案中）改寫，但語氣更簡單、步驟更細、假設讀者完全沒用過終端機。

每篇教學結構：
- 標題
- 這篇教你什麼（一句話）
- 步驟（每步配文字描述，標註「這裡可以截圖」的位置）
- 常見問題（1-2 個）
- 下一步（連結到下一篇）

- [ ] **Step 1: 建立目錄並撰寫 6 篇教學**

（每篇約 200-400 字，總計約 1,500-2,400 字）

- [ ] **Step 2: Commit**

```bash
git add ai-coach-kit-content/guide/
git commit -m "docs: add 6 zero-base guide articles for AI Coach Kit"
```

---

## Task 7: ZIP 內容 — 範例檔 + README

**Files:**
- Create: `ai-coach-kit-content/README.md`
- Create: `ai-coach-kit-content/examples/example-config.md`
- Create: `ai-coach-kit-content/examples/example-coach-config.md`
- Create: `ai-coach-kit-content/examples/example-progress-7days.md`

- [ ] **Step 1: 撰寫 README.md（歡迎頁 + 快速開始 3 步驟）**

- [ ] **Step 2: 撰寫 3 份範例檔**

從 solopreneur-skills 專案的 `manual-coach-complete.md` 附錄中取用範例內容，調整為獨立可讀的格式。

- [ ] **Step 3: Commit**

```bash
git add ai-coach-kit-content/README.md ai-coach-kit-content/examples/
git commit -m "docs: add README and example files for AI Coach Kit"
```

---

## Task 8: ZIP 打包

**Files:**
- Create: `private/ai-coach-kit.zip`

- [ ] **Step 1: 從 solopreneur-skills 複製核心檔案到 ai-coach-kit-content/**

```bash
SKILLS_DIR="/Users/vista/01_Writing/solopreneur-skills"
CONTENT_DIR="ai-coach-kit-content"

# Skills
mkdir -p "$CONTENT_DIR/skills"
cp "$SKILLS_DIR/skills/solo-coach.md" "$CONTENT_DIR/skills/"
cp "$SKILLS_DIR/skills/solo-coach-morning.md" "$CONTENT_DIR/skills/"
cp "$SKILLS_DIR/skills/solo-coach-checkin.md" "$CONTENT_DIR/skills/"
cp "$SKILLS_DIR/skills/solo-coach-weekly.md" "$CONTENT_DIR/skills/"

# Coach templates + Vista Coach
mkdir -p "$CONTENT_DIR/coach"
cp "$SKILLS_DIR/coach/_template.md" "$CONTENT_DIR/coach/"
cp "$SKILLS_DIR/coach/_progress-template.md" "$CONTENT_DIR/coach/"
cp "$SKILLS_DIR/coach/vista-coach.md" "$CONTENT_DIR/coach/"

# Install scripts + config
cp "$SKILLS_DIR/install.sh" "$CONTENT_DIR/"
cp "$SKILLS_DIR/install.bat" "$CONTENT_DIR/" 2>/dev/null || true
cp "$SKILLS_DIR/CLAUDE.md" "$CONTENT_DIR/"
cp "$SKILLS_DIR/config-template.md" "$CONTENT_DIR/"
```

- [ ] **Step 2: 打包 ZIP**

```bash
mkdir -p private
cd ai-coach-kit-content
zip -r ../private/ai-coach-kit.zip . -x ".*"
cd ..
```

- [ ] **Step 3: 確認 ZIP 內容**

```bash
unzip -l private/ai-coach-kit.zip
```

Expected: 看到 skills/、coach/、guide/、examples/、README.md、install.sh 等檔案

- [ ] **Step 4: Commit（不 commit ZIP 本身，只 commit .gitignore 確認）**

```bash
git add ai-coach-kit-content/
git commit -m "feat: prepare AI Coach Kit ZIP content"
```

---

## Task 9: 更新 products 總覽頁

**Files:**
- Modify: `src/app/products/page.tsx`

- [ ] **Step 1: 將 Coming Soon 替換為 AI 教練工坊卡片**

修改 `products/page.tsx`，移除 Coming Soon 佔位符，新增一張產品卡片連結到 `/products/ai-coach-kit`：

```tsx
import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";

export default function ProductsPage() {
  return (
    <main className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            模板 & 工具包
          </h1>
          <p className="mt-3 text-lg text-stone-500">
            不用從零開始，下載即用
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/products/ai-coach-kit"
            className="group rounded-xl border border-stone-200 bg-white p-6 transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-stone-900">
              AI 教練工坊
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              教你用 AI 建一個每天陪你執行的實踐教練。框架 + 模板 + 150 篇知識庫。
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                NT$1,499
              </span>
              <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/products/page.tsx
git commit -m "feat: replace Coming Soon with AI Coach Kit product card"
```

---

## 執行順序

1. Task 5：Supabase migration（先建表）
2. Task 2：付款流程新增產品價格
3. Task 3：下載 API route
4. Task 4：付款成功頁修改
5. Task 1：銷售頁面
6. Task 9：products 總覽頁更新
7. Task 6：圖文教學撰寫
8. Task 7：範例檔 + README
9. Task 8：ZIP 打包
