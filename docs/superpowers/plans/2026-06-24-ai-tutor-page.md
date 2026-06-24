# AI 家教班招生頁 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 solo.tw 新增 `/ai-tutor` 高價一對一「AI 家教班」獨立招生頁，公開三級套餐、走「預約免費諮詢」成交，預約 lead 寫進既有 `consulting_leads` 表並沿用既有寄信與後台。

**Architecture:** 新 bespoke landing page，所有文案集中在 `src/lib/ai-tutor-config.ts`（DRY，頁面只 render config）。預約表單改寫自 `consulting/LeadForm.tsx`，POST 到新的薄 adapter route `/api/ai-tutor/leads`：它把家教班專屬 payload 映射成既有 `leadSchema`（`topics` 帶 `ai-tutor:` 前綴、`plan="undecided"`），重用 `validateLeadPayload`／`insertLead`／`sendEmail`／既有兩個 email 元件，唯一差異是內部通知信主旨帶「AI 家教班」字樣。零新增 Supabase 表、零新增 email 範本。

**Tech Stack:** Next.js 16 App Router、TypeScript、Tailwind 4、shadcn/ui、Lucide、Zod、Supabase（service client）、Resend（既有 `sendEmail`）。

## Global Constraints

- 正體中文撰寫；一律用「臺」取代「台」（臺灣、臺北）。
- 臺灣慣用語，避免大陸用語（試點→試辦、批量→批次、視頻→影片、質量→品質、信息→資訊、網絡→網路、軟件→軟體、海量→大量、拐點→轉折點）。
- 不放線上刷卡按鈕；所有 CTA 導向頁內預約表單。
- 學員情境去識別化：無姓名、無真人照片。
- 設計系統沿用 solo.tw：primary 紅 `#E63946`、Geist 字體、shadcn/ui 元件、Lucide 圖示。
- 不修改既有 `consulting_leads` schema、不新增 Supabase migration、不新增 email 範本。
- 不把本產品加入 `src/lib/workshops.ts` 或 `/courses` 列表。
- solo.tw 部署＝push `main` → Vercel 自動 build production。本任務在 `feat/ai-tutor-page` 分支開發，驗證後再合併。

---

### Task 1: 家教班內容設定檔（所有文案的單一來源）

**Files:**
- Create: `src/lib/ai-tutor-config.ts`

**Interfaces:**
- Produces:
  - `AI_TUTOR_TIERS: AiTutorTier[]`（`slug: "starter"|"advanced"|"deep"`, `name`, `hours`, `price`, `pricePerHour`, `highlight?`, `suitedFor`）
  - `AI_TUTOR_DIRECTIONS: AiTutorDirection[]`（`slug`, `emoji`, `title`, `oneLiner`）
  - `AI_TUTOR_LEVELS`（重用 `CONSULTING_LEVELS` re-export）
  - `AI_TUTOR_PAIN_POINTS`, `AI_TUTOR_COMPARISON`, `AI_TUTOR_PROCESS`, `AI_TUTOR_PERSONAS`, `AI_TUTOR_FAQS`
  - `AI_TUTOR_TIER_INTEREST`（表單用：tiers + `{value:"undecided", label:"還沒決定，想先聊聊"}`）

- [ ] **Step 1: 建立設定檔，貼入下列完整內容**

```ts
// src/lib/ai-tutor-config.ts
import { CONSULTING_LEVELS, CONSULTING_ATTRIBUTION, CONSULTING_DESIRED_START } from "./consulting-config";

export interface AiTutorTier {
  slug: "starter" | "advanced" | "deep";
  name: string;
  hours: number;
  price: number;
  pricePerHour: number;
  highlight?: boolean;
  suitedFor: string;
}

export const AI_TUTOR_TIERS: AiTutorTier[] = [
  { slug: "starter", name: "啟航", hours: 6, price: 19800, pricePerHour: 3300, suitedFor: "想先試、有單一明確目標" },
  { slug: "advanced", name: "進階", hours: 12, price: 34800, pricePerHour: 2900, highlight: true, suitedFor: "完整帶上手、做出可用成果" },
  { slug: "deep", name: "深掘陪跑", hours: 24, price: 64800, pricePerHour: 2700, suitedFor: "長期陪跑、團隊或多專案" },
];

export interface AiTutorDirection {
  slug: string;
  emoji: string;
  title: string;
  oneLiner: string;
}

export const AI_TUTOR_DIRECTIONS: AiTutorDirection[] = [
  { slug: "build-tools", emoji: "💻", title: "用 AI 做出自己的工具", oneLiner: "把重複的工作變成一個能用的小程式" },
  { slug: "content", emoji: "✍️", title: "AI 內容與行銷", oneLiner: "研究、撰稿、去 AI 味、多平臺分發" },
  { slug: "decision", emoji: "🎯", title: "AI 輔助決策與簡報", oneLiner: "用 AI 整理資料、做分析、生出能上場的簡報" },
  { slug: "knowledge", emoji: "🧠", title: "第二大腦與知識管理", oneLiner: "把散落的資料變成隨問隨答的知識庫" },
  { slug: "workflow", emoji: "🎛", title: "工作流自動化", oneLiner: "把現有工具串成能自己運作的系統" },
  { slug: "custom", emoji: "🌀", title: "我有別的需求", oneLiner: "把你的真實業務帶來，課綱為你客製" },
];

export const AI_TUTOR_PAIN_POINTS = [
  {
    emoji: "⏳",
    title: "沒時間從零摸索",
    body: "你的時間很貴。網路教學一大堆，但你需要的是有人直接幫你篩掉雜訊，只教你現在用得上的。",
  },
  {
    emoji: "🎯",
    title: "通用課程學不到自己要的",
    body: "團體課照顧的是多數人。你的產業、你的決策場景、你的資料，需要為你量身設計的課綱。",
  },
  {
    emoji: "🔒",
    title: "想用自己的真實業務練",
    body: "你不想用罐頭範例，而是想把公司真實的問題拿來練。一對一才能放心談、放心做。",
  },
];

export const AI_TUTOR_COMPARISON = [
  { dimension: "課綱", group: "團體課 / 線上課", tutor: "依你的目標與產業客製" },
  { dimension: "練習素材", group: "罐頭範例", tutor: "你自己的真實專案與資料" },
  { dimension: "進度", group: "跟著全班走", tutor: "你決定快慢與深淺" },
  { dimension: "隱私", group: "公開課堂", tutor: "一對一，放心談機密" },
  { dimension: "產出", group: "聽完就忘", tutor: "帶走可直接用的成果" },
];

export const AI_TUTOR_PROCESS = [
  { step: 1, title: "預約免費諮詢", body: "填一份簡單表單，我會親自回信，約 30 分鐘聊你的目標與卡關。" },
  { step: 2, title: "客製你的課綱", body: "依你的程度、產業與想達成的成果，設計專屬的學習路徑與時數。" },
  { step: 3, title: "一對一陪學", body: "線上或實體，用你自己的真實業務邊做邊學，進度你決定。" },
  { step: 4, title: "帶走可用成果", body: "每堂都有具體產出：一個工具、一套流程、一份能上場的成品。" },
];

export const AI_TUTOR_PERSONAS = [
  {
    emoji: "🛒",
    role: "電商公司創辦人",
    took: "把每天耗時的選品、文案、客服回覆，變成一套 AI 輔助流程，團隊跟著一起用。",
  },
  {
    emoji: "🏛",
    role: "上市公司獨立董事",
    took: "學會用 AI 快速讀懂財報與產業資料、為董事會議題做足功課，判斷更有底氣。",
  },
  {
    emoji: "🧩",
    role: "心理諮商師",
    took: "用 AI 整理個案筆記與文獻、產出衛教素材，把更多時間留給真正重要的對話。",
  },
];

export const AI_TUTOR_FAQS = [
  { q: "為什麼要先預約諮詢，不能直接報名？", a: "因為這是完全客製的一對一服務，課綱與時數會依你的目標調整。先聊 30 分鐘，我才能為你設計對的內容，你也能確認我是不是對的人。" },
  { q: "上課是線上還是實體？", a: "都可以。多數學員選線上（更彈性），大臺北地區可談實體。時間一對一彈性安排。" },
  { q: "我完全不會寫程式 / 不太會用 AI，可以嗎？", a: "可以。學員從完全新手到工程師都有，課綱會從你現在的程度開始。" },
  { q: "時數有效期多久？", a: "套餐自購買日起 6 個月內使用，必要時可延長 3 個月。實際以諮詢後的方案為準。" },
  { q: "可以開公司發票 / 報公司帳嗎？", a: "可以，諮詢時告知抬頭與統編即可。" },
  { q: "費用怎麼算？", a: "頁面上三個方案是參考價，實際課綱與時數於免費諮詢後客製確認，無隱藏費用。" },
];

// 表單重用既有常數
export const AI_TUTOR_LEVELS = CONSULTING_LEVELS;
export const AI_TUTOR_ATTRIBUTION = CONSULTING_ATTRIBUTION;
export const AI_TUTOR_DESIRED_START = CONSULTING_DESIRED_START;

export const AI_TUTOR_TIER_INTEREST = [
  ...AI_TUTOR_TIERS.map((t) => ({
    value: t.slug as string,
    label: `${t.name}（${t.hours} 小時・NT$${t.price.toLocaleString()}）`,
  })),
  { value: "undecided", label: "還沒決定，想先聊聊" },
];
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 無新錯誤（既有 baseline 以外不新增）。

- [ ] **Step 3: Commit**

```bash
git add src/lib/ai-tutor-config.ts
git commit -m "feat(ai-tutor): add content config (tiers, directions, copy)"
```

---

### Task 2: 薄 adapter API route（映射成既有 leadSchema + 客製內部信主旨）

**Files:**
- Create: `src/app/api/ai-tutor/leads/route.ts`

**Interfaces:**
- Consumes: `validateLeadPayload`, `insertLead`（`@/lib/consulting-db`）；`sendEmail`（`@/lib/email`）；`ConsultingLeadReceivedEmail`、`ConsultingLeadInternalEmail`（`@/components/emails/*`）。
- Produces: `POST /api/ai-tutor/leads` 接受 body：
  `{ name, email, contactMethod: "email"|"line"|"ig", contactId?, directions: string[](min1), tierInterest: "starter"|"advanced"|"deep"|"undecided", specificProblem: string(min30), expectedOutcome?, level, desiredStart?, attribution?, consentTerms: true, subscribeNewsletter? }`
  回傳 `{ ok: true, leadId }` 或 `{ ok:false, error, fieldErrors? }`。

- [ ] **Step 1: 建立 route，貼入完整內容**

```ts
import { NextResponse, after } from "next/server";
import { validateLeadPayload, insertLead } from "@/lib/consulting-db";
import { sendEmail } from "@/lib/email";
import { ConsultingLeadReceivedEmail } from "@/components/emails/consulting-lead-received";
import { ConsultingLeadInternalEmail } from "@/components/emails/consulting-lead-internal";

// Rate limit: 5 / 10min per IP（沿用 consulting route 寫法）
const RATE_LIMIT_BUCKET = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function ipFromReq(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() ?? "unknown";
}

function rateLimitExceeded(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_LIMIT_BUCKET.get(ip);
  if (!bucket || bucket.resetAt < now) {
    RATE_LIMIT_BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > LIMIT;
}

export async function POST(req: Request) {
  const ip = ipFromReq(req);
  if (rateLimitExceeded(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limit_exceeded" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // 把家教班 payload 映射成既有 consulting leadSchema
  const directions = Array.isArray(body.directions) ? (body.directions as string[]) : [];
  const tierInterest = typeof body.tierInterest === "string" ? body.tierInterest : "undecided";
  const topics = [
    ...directions.map((d) => `ai-tutor:${d}`),
    ...(tierInterest && tierInterest !== "undecided" ? [`ai-tutor-tier:${tierInterest}`] : []),
  ];

  const mapped = {
    name: body.name,
    email: body.email,
    contactMethod: body.contactMethod,
    contactId: body.contactId,
    topics,
    specificProblem: body.specificProblem,
    expectedOutcome: body.expectedOutcome,
    level: body.level,
    desiredStart: body.desiredStart,
    plan: "undecided" as const,
    attribution: body.attribution,
    consentTerms: body.consentTerms,
    subscribeNewsletter: body.subscribeNewsletter,
  };

  const validation = validateLeadPayload(mapped);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error, fieldErrors: validation.fieldErrors },
      { status: 422 },
    );
  }

  const payload = validation.data;

  try {
    const lead = await insertLead(payload);

    after(async () => {
      const received = await sendEmail({
        to: payload.email,
        subject: "AI 家教班諮詢收到了 — Vista",
        react: ConsultingLeadReceivedEmail({
          name: payload.name,
          plan: payload.plan,
          topics: payload.topics,
        }),
      });
      if (!received.success) {
        console.error("[ai-tutor/leads POST] lead-received send failed", received.error);
      }

      const internal = await sendEmail({
        to: "iamvista@gmail.com",
        subject: `🎓 新 AI 家教班 lead：${payload.name}`,
        react: ConsultingLeadInternalEmail({ lead }),
      });
      if (!internal.success) {
        console.error("[ai-tutor/leads POST] lead-internal send failed", internal.error);
      }
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (err) {
    console.error("[ai-tutor/leads] insertLead failed", err);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: 啟動 dev server**

Run: `npm run dev`（背景），等待 `Ready`。

- [ ] **Step 3: 端對端 — 送一筆合法測試 lead（驗證寫入成功）**

Run:
```bash
curl -s -X POST http://localhost:3000/api/ai-tutor/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"測試家教Lead","email":"ai-tutor-test@example.com","contactMethod":"email","directions":["build-tools","decision"],"tierInterest":"advanced","specificProblem":"我想用AI把公司每天重複的報表整理工作自動化，但不知道從哪裡開始比較好。","level":"basic","consentTerms":true}'
```
Expected: `{"ok":true,"leadId":"..."}`

- [ ] **Step 4: 驗證缺必填會被擋（specificProblem 太短）**

Run:
```bash
curl -s -X POST http://localhost:3000/api/ai-tutor/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"x","email":"x@example.com","contactMethod":"email","directions":["build-tools"],"tierInterest":"undecided","specificProblem":"太短","level":"basic","consentTerms":true}'
```
Expected: HTTP 422，body 含 `fieldErrors.specificProblem`。

- [ ] **Step 5: DB 讀回驗證 topics 前綴正確，然後刪掉測試列**

用 admin 後台 `/admin/consulting/leads` 或 Supabase 確認 Step 3 那筆：`topics` = `["ai-tutor:build-tools","ai-tutor:decision","ai-tutor-tier:advanced"]`、`plan="undecided"`。確認後刪除該測試列（避免污染真實名單）。

> 若沒有便捷 SQL 通道，於 `/admin/consulting/leads` 頁面找到 email 為 `ai-tutor-test@example.com` 的列，用既有刪除按鈕（`DELETE /api/admin/...`，若有）或記錄 leadId 之後由 Vista 刪。務必清掉測試資料。

- [ ] **Step 6: Commit**

```bash
git add src/app/api/ai-tutor/leads/route.ts
git commit -m "feat(ai-tutor): add lead API adapter mapping to consulting_leads"
```

---

### Task 3: 預約表單元件（改寫自 consulting LeadForm）

**Files:**
- Create: `src/components/ai-tutor/AiTutorLeadForm.tsx`

**Interfaces:**
- Consumes: `AI_TUTOR_DIRECTIONS`, `AI_TUTOR_LEVELS`, `AI_TUTOR_TIER_INTEREST`, `AI_TUTOR_DESIRED_START`, `AI_TUTOR_ATTRIBUTION`（`@/lib/ai-tutor-config`）；shadcn `Button/Input/Label/Textarea/Checkbox`。POST 到 `/api/ai-tutor/leads`。
- Produces: `export function AiTutorLeadForm()`，成功後 `router.push("/ai-tutor/thanks?lead_id=...")`。

- [ ] **Step 1: 建立元件，貼入完整內容**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AI_TUTOR_DIRECTIONS,
  AI_TUTOR_LEVELS,
  AI_TUTOR_TIER_INTEREST,
  AI_TUTOR_DESIRED_START,
  AI_TUTOR_ATTRIBUTION,
} from "@/lib/ai-tutor-config";

type ContactMethod = "email" | "line" | "ig";

interface FormState {
  name: string;
  email: string;
  contactMethod: ContactMethod;
  contactId: string;
  directions: string[];
  tierInterest: string;
  specificProblem: string;
  expectedOutcome: string;
  level: string;
  desiredStart: string;
  attribution: string;
  consentTerms: boolean;
  subscribeNewsletter: boolean;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  contactMethod: "email",
  contactId: "",
  directions: [],
  tierInterest: "",
  specificProblem: "",
  expectedOutcome: "",
  level: "",
  desiredStart: "",
  attribution: "",
  consentTerms: false,
  subscribeNewsletter: false,
};

const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: "email", label: "E-mail" },
  { value: "line", label: "LINE" },
  { value: "ig", label: "Facebook / Instagram 私訊" },
];

export function AiTutorLeadForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const toggleDirection = (slug: string) =>
    setState((s) => ({
      ...s,
      directions: s.directions.includes(slug)
        ? s.directions.filter((d) => d !== slug)
        : [...s.directions, slug],
    }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const reqErrors: Record<string, string> = {};
    if (!state.name.trim()) reqErrors.name = "請填姓名";
    if (!state.email.trim()) reqErrors.email = "請填 E-mail";
    if (state.contactMethod !== "email" && !state.contactId.trim())
      reqErrors.contactId = `請填寫 ${state.contactMethod.toUpperCase()} ID`;
    if (state.directions.length === 0) reqErrors.directions = "請至少勾一個方向";
    if (state.specificProblem.trim().length < 30)
      reqErrors.specificProblem = "請至少描述 30 字";
    if (!state.level) reqErrors.level = "請選擇程度";
    if (!state.tierInterest) reqErrors.tierInterest = "請選一個感興趣的方案";
    if (!state.consentTerms) reqErrors.consentTerms = "需勾選同意條款";
    if (Object.keys(reqErrors).length > 0) {
      setErrors(reqErrors);
      setSubmitting(false);
      return;
    }

    const payload = {
      name: state.name.trim(),
      email: state.email.trim(),
      contactMethod: state.contactMethod,
      contactId: state.contactId.trim() || undefined,
      directions: state.directions,
      tierInterest: state.tierInterest,
      specificProblem: state.specificProblem.trim(),
      expectedOutcome: state.expectedOutcome.trim() || undefined,
      level: state.level,
      desiredStart: state.desiredStart || undefined,
      attribution: state.attribution || undefined,
      consentTerms: true as const,
      subscribeNewsletter: state.subscribeNewsletter,
    };

    try {
      const res = await fetch("/api/ai-tutor/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        else setErrors({ _form: data.error ?? "送出失敗，請稍後再試。" });
        setSubmitting(false);
        return;
      }
      router.push(`/ai-tutor/thanks?lead_id=${data.leadId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "未知錯誤";
      setErrors({ _form: `送出時出錯：${msg}` });
      setSubmitting(false);
    }
  }

  return (
    <form id="booking-form" onSubmit={handleSubmit} className="space-y-10" noValidate>
      {/* 一、聯絡方式 */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">一、聯絡方式</legend>
        <div className="space-y-1.5">
          <Label htmlFor="name">姓名 <span className="text-rose-600">*</span></Label>
          <Input id="name" value={state.name} onChange={(e) => update("name", e.target.value)} placeholder="王大明" />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail <span className="text-rose-600">*</span></Label>
          <Input id="email" type="email" value={state.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label>偏好聯絡方式 <span className="text-rose-600">*</span></Label>
          <div className="flex flex-wrap gap-4">
            {CONTACT_METHODS.map((m) => (
              <label key={m.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" name="contactMethod" value={m.value} checked={state.contactMethod === m.value} onChange={() => update("contactMethod", m.value)} className="h-4 w-4 accent-primary" />
                <span>{m.label}</span>
              </label>
            ))}
          </div>
          {state.contactMethod !== "email" && (
            <div className="mt-2 space-y-1.5">
              <Label htmlFor="contactId">{state.contactMethod === "line" ? "LINE" : "IG"} ID <span className="text-rose-600">*</span></Label>
              <Input id="contactId" value={state.contactId} onChange={(e) => update("contactId", e.target.value)} placeholder={state.contactMethod === "line" ? "@your_line_id 或顯示名稱" : "@your_ig_handle"} />
              {errors.contactId && <p className="mt-1 text-sm text-destructive">{errors.contactId}</p>}
            </div>
          )}
        </div>
      </fieldset>

      {/* 二、想學的方向 */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">二、想學的方向</legend>
        <div className="space-y-2">
          <Label>方向（可複選）<span className="text-rose-600">*</span></Label>
          <p className="text-sm text-muted-foreground">勾選一個或多個，最終課綱會依諮詢為你客製。</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {AI_TUTOR_DIRECTIONS.map((d) => {
              const checked = state.directions.includes(d.slug);
              return (
                <label key={d.slug} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${checked ? "border-primary bg-rose-50/50" : "border-stone-200 bg-card hover:border-stone-300"}`}>
                  <Checkbox checked={checked} onCheckedChange={() => toggleDirection(d.slug)} className="mt-0.5" />
                  <span className="flex-1 text-sm"><span className="mr-1">{d.emoji}</span><span className="font-medium">{d.title}</span></span>
                </label>
              );
            })}
          </div>
          {errors.directions && <p className="mt-1 text-sm text-destructive">{errors.directions}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="specificProblem">想解決的問題 / 想達成的目標 <span className="text-rose-600">*</span><span className="ml-1 text-xs text-muted-foreground">（至少 30 字）</span></Label>
          <Textarea id="specificProblem" rows={5} value={state.specificProblem} onChange={(e) => update("specificProblem", e.target.value)} placeholder="例如：我想用 AI 把公司每天的報表整理自動化，但不知道從哪開始。" />
          <p className="text-xs text-muted-foreground">已填 {state.specificProblem.trim().length} 字</p>
          {errors.specificProblem && <p className="mt-1 text-sm text-destructive">{errors.specificProblem}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expectedOutcome">期待帶走什麼成果（選填）</Label>
          <Textarea id="expectedOutcome" rows={3} value={state.expectedOutcome} onChange={(e) => update("expectedOutcome", e.target.value)} placeholder="例如：一套團隊能直接用的 AI 工作流程。" />
        </div>
      </fieldset>

      {/* 三、了解你 */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">三、了解你</legend>
        <div className="space-y-2">
          <Label>目前的 AI / Coding 程度 <span className="text-rose-600">*</span></Label>
          <div className="space-y-2">
            {AI_TUTOR_LEVELS.map((opt) => (
              <label key={opt.value} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${state.level === opt.value ? "border-primary bg-rose-50/50" : "border-stone-200 bg-card hover:border-stone-300"}`}>
                <input type="radio" name="level" value={opt.value} checked={state.level === opt.value} onChange={() => update("level", opt.value)} className="h-4 w-4 accent-primary" />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.level && <p className="mt-1 text-sm text-destructive">{errors.level}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desiredStart">預計開始時間（選填）</Label>
          <select id="desiredStart" value={state.desiredStart} onChange={(e) => update("desiredStart", e.target.value)} className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] md:text-sm">
            <option value="">請選擇…</option>
            {AI_TUTOR_DESIRED_START.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>
      </fieldset>

      {/* 四、感興趣的方案 */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">四、感興趣的方案</legend>
        <div className="space-y-2">
          <Label>哪個方案比較接近你的需求 <span className="text-rose-600">*</span></Label>
          <p className="text-sm text-muted-foreground">只是初步意向，實際時數於諮詢後客製。</p>
          <div className="space-y-2">
            {AI_TUTOR_TIER_INTEREST.map((opt) => (
              <label key={opt.value} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${state.tierInterest === opt.value ? "border-primary bg-rose-50/50" : "border-stone-200 bg-card hover:border-stone-300"}`}>
                <input type="radio" name="tierInterest" value={opt.value} checked={state.tierInterest === opt.value} onChange={() => update("tierInterest", opt.value)} className="h-4 w-4 accent-primary" />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.tierInterest && <p className="mt-1 text-sm text-destructive">{errors.tierInterest}</p>}
        </div>
      </fieldset>

      {/* 五、其他 */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">五、其他</legend>
        <div className="space-y-1.5">
          <Label htmlFor="attribution">怎麼知道 solo.tw（選填）</Label>
          <select id="attribution" value={state.attribution} onChange={(e) => update("attribution", e.target.value)} className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] md:text-sm">
            <option value="">請選擇…</option>
            {AI_TUTOR_ATTRIBUTION.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
        </div>
        <div className="flex items-start gap-3 rounded-lg border bg-stone-50 p-4">
          <Checkbox id="consentTerms" checked={state.consentTerms} onCheckedChange={(c) => update("consentTerms", !!c)} className="mt-0.5" />
          <div className="flex-1">
            <Label htmlFor="consentTerms" className="cursor-pointer text-sm font-normal leading-relaxed">我了解這是預約諮詢，實際方案與費用將於諮詢後確認 <span className="text-rose-600">*</span></Label>
            {errors.consentTerms && <p className="mt-1 text-sm text-destructive">{errors.consentTerms}</p>}
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border bg-stone-50 p-4">
          <Checkbox id="subscribeNewsletter" checked={state.subscribeNewsletter} onCheckedChange={(c) => update("subscribeNewsletter", !!c)} className="mt-0.5" />
          <Label htmlFor="subscribeNewsletter" className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground">訂閱《Vista 電子報》接收後續更新（選填）</Label>
        </div>
      </fieldset>

      {errors._form && (<div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{errors._form}</div>)}

      <Button type="submit" disabled={submitting} size="lg" className="w-full">
        {submitting ? "送出中…" : "送出，預約免費諮詢"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 無新錯誤。

- [ ] **Step 3: Commit**

```bash
git add src/components/ai-tutor/AiTutorLeadForm.tsx
git commit -m "feat(ai-tutor): add booking lead form component"
```

---

### Task 4: 預約成功頁 /ai-tutor/thanks

**Files:**
- Create: `src/app/ai-tutor/thanks/page.tsx`

**Interfaces:**
- Produces: 路由 `/ai-tutor/thanks`。`searchParams` 在 Next 16 為 Promise，需 `await`。

- [ ] **Step 1: 建立頁面，貼入完整內容**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/ai-tutor/thanks/page.tsx
git commit -m "feat(ai-tutor): add booking thanks page"
```

---

### Task 5: 招生主頁 /ai-tutor（render config）

**Files:**
- Create: `src/app/ai-tutor/page.tsx`

**Interfaces:**
- Consumes: 全部 `@/lib/ai-tutor-config` 常數、`AiTutorLeadForm`、shadcn `Button`、Lucide 圖示。
- Produces: 路由 `/ai-tutor`，含 SEO metadata。

- [ ] **Step 1: 建立頁面，貼入完整內容**

```tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiTutorLeadForm } from "@/components/ai-tutor/AiTutorLeadForm";
import {
  AI_TUTOR_TIERS,
  AI_TUTOR_DIRECTIONS,
  AI_TUTOR_PAIN_POINTS,
  AI_TUTOR_COMPARISON,
  AI_TUTOR_PROCESS,
  AI_TUTOR_PERSONAS,
  AI_TUTOR_FAQS,
} from "@/lib/ai-tutor-config";

export const metadata: Metadata = {
  title: "AI 家教班 — 給資深決策者的一對一 AI 私人家教 | solo.tw",
  description:
    "不是聽課，是有人坐在你旁邊，用你自己的真實業務，把你從不會帶到會用。已陪伴電商創辦人、上市公司獨董、心理諮商師等資深決策者。預約免費諮詢，洽談客製課綱。",
  openGraph: {
    title: "AI 家教班 — 給資深決策者的一對一 AI 私人家教",
    description: "用你自己的真實業務，把你從不會帶到會用。預約免費諮詢，洽談客製課綱。",
    images: ["/images/ai-tutor/hero.webp"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AI_TUTOR_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AiTutorPage() {
  return (
    <main className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-rose-50/60 to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <p className="mb-3 inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-primary">一對一・完全客製</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">AI 家教班</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              給資深決策者的一對一 AI 私人家教。不是聽課，是有人坐在你旁邊，
              用你自己的真實業務，把你從不會帶到會用。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="#booking-form">預約免費諮詢 <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="#pricing">看課程方案</Link></Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              已陪伴電商創辦人、上市公司獨立董事、心理諮商師等資深決策者
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-stone-100">
            <Image src="/images/ai-tutor/hero.webp" alt="AI 家教班一對一教學" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* 痛點 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">為什麼資深決策者選一對一</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {AI_TUTOR_PAIN_POINTS.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-card p-6">
              <div className="text-3xl">{p.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 對照表 */}
      <section className="border-y bg-stone-50/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">這不是課程，是私人家教</h2>
          <div className="mt-10 overflow-hidden rounded-2xl border bg-card">
            <div className="grid grid-cols-3 border-b bg-stone-100 text-sm font-semibold">
              <div className="p-4" />
              <div className="p-4 text-center text-muted-foreground">團體課 / 線上課</div>
              <div className="p-4 text-center text-primary">AI 家教班</div>
            </div>
            {AI_TUTOR_COMPARISON.map((row) => (
              <div key={row.dimension} className="grid grid-cols-3 border-b text-sm last:border-0">
                <div className="p-4 font-medium">{row.dimension}</div>
                <div className="flex items-center gap-2 p-4 text-muted-foreground"><X className="h-4 w-4 shrink-0 text-stone-400" />{row.group}</div>
                <div className="flex items-center gap-2 p-4"><Check className="h-4 w-4 shrink-0 text-primary" />{row.tutor}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 流程 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">怎麼上</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {AI_TUTOR_PROCESS.map((s) => (
            <div key={s.step} className="rounded-2xl border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">{s.step}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 適合誰 */}
      <section className="border-y bg-stone-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">他們帶走了什麼</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {AI_TUTOR_PERSONAS.map((p) => (
              <div key={p.role} className="rounded-2xl border bg-card p-6">
                <div className="text-3xl">{p.emoji}</div>
                <h3 className="mt-3 text-lg font-semibold">{p.role}</h3>
                <p className="mt-2 text-muted-foreground">{p.took}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 客製方向 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">課綱是為你客製的</h2>
        <p className="mt-3 text-center text-muted-foreground">以下是常見方向，最終依你的目標量身設計。</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_TUTOR_DIRECTIONS.map((d) => (
            <div key={d.slug} className="rounded-2xl border bg-card p-6">
              <div className="text-2xl">{d.emoji}</div>
              <h3 className="mt-2 font-semibold">{d.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.oneLiner}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 定價 */}
      <section id="pricing" className="border-y bg-stone-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">方案與定價</h2>
          <p className="mt-3 text-center text-muted-foreground">以下為參考方案，實際課綱與時數於免費諮詢後客製。</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {AI_TUTOR_TIERS.map((t) => (
              <div key={t.slug} className={`flex flex-col rounded-2xl border bg-card p-8 ${t.highlight ? "border-primary ring-2 ring-primary/20" : ""}`}>
                {t.highlight && <p className="mb-3 inline-block self-start rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">最多人選</p>}
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.hours} 小時</p>
                <p className="mt-4 text-3xl font-bold">NT${t.price.toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted-foreground">約每小時 NT${t.pricePerHour.toLocaleString()}</p>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">{t.suitedFor}</p>
                <Button asChild className="mt-6 w-full" variant={t.highlight ? "default" : "outline"}><Link href="#booking-form">預約諮詢</Link></Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">常見問題</h2>
        <div className="mt-10 space-y-4">
          {AI_TUTOR_FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border bg-card p-6">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">{f.q}</summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 預約表單 */}
      <section className="border-t bg-stone-50/60">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">預約免費諮詢</h2>
          <p className="mt-3 text-center text-muted-foreground">填好表單，我會親自回信，約 30 分鐘聊聊你的目標。</p>
          <div className="mt-10 rounded-2xl border bg-card p-6 sm:p-8">
            <AiTutorLeadForm />
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 建一張暫用 hero 佔位圖（避免 Image 破圖，正式圖在 Task 7 換）**

Run:
```bash
mkdir -p public/images/ai-tutor
# 暫用既有任一圖複製為佔位（Task 7 會以正式生成圖覆蓋）
cp public/images/courses/ai-monetization-institute/hero.webp public/images/ai-tutor/hero.webp 2>/dev/null || echo "找不到來源圖，Task 7 生成前先用任一 .webp 佔位"
```
Expected: `public/images/ai-tutor/hero.webp` 存在。

- [ ] **Step 3: Typecheck + 開頁目視**

Run: `npx tsc --noEmit` → 無新錯誤。
開 `http://localhost:3000/ai-tutor`，目視確認：Hero、痛點三卡、對照表、流程四步、學員三卡、客製方向、定價三卡（進階卡有「最多人選」高亮）、FAQ 可展開、表單渲染。行動裝置寬度（375px）不溢出。

- [ ] **Step 4: Commit**

```bash
git add src/app/ai-tutor/page.tsx public/images/ai-tutor/hero.webp
git commit -m "feat(ai-tutor): add landing page rendering from config"
```

---

### Task 6: 導覽列加入「AI 家教班」入口

**Files:**
- Modify: `src/components/layout/Header.tsx:9-17`

**Interfaces:**
- Consumes: 無。Produces: 導覽列多一項連到 `/ai-tutor`。

- [ ] **Step 1: 修改 navigation 陣列**

把：
```tsx
const navigation = [
  { name: "事業健檢", href: "/diagnose" },
  { name: "諮詢", href: "/consulting" },
  { name: "課程", href: "/courses" },
```
改為：
```tsx
const navigation = [
  { name: "事業健檢", href: "/diagnose" },
  { name: "AI 家教班", href: "/ai-tutor" },
  { name: "諮詢", href: "/consulting" },
  { name: "課程", href: "/courses" },
```

- [ ] **Step 2: 目視確認**

開任一頁，桌機導覽列出現「AI 家教班」並可點進 `/ai-tutor`；行動裝置漢堡選單同樣出現（同一個 `navigation` 陣列驅動，無需另改）。

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(ai-tutor): add nav entry to header"
```

---

### Task 7: 生成正式 Hero 視覺

**Files:**
- Overwrite: `public/images/ai-tutor/hero.webp`

**Interfaces:** 無程式介面，純素材。

- [ ] **Step 1: 用既有生圖慣例產圖**

沿用 `scripts/generate-covers.py`（OpenRouter，model `openai/gpt-5-image-mini`，品牌色 solo 紅 `#E63946`）的同款管線。prompt 方向：一位資深專業人士與導師並肩看著筆電／白板，暖色調、專業、信任感、無文字、橫幅 4:3。輸出存 `public/images/ai-tutor/hero.webp`（約 1400×1050 或 1400×788）。

> 若 `scripts/generate-covers.py` 需參數，比照 ai-monetization-institute 既有用法；金鑰沿用既有環境變數。產不出來時，先用 Task 5 Step 2 的佔位圖上線，把本步驟列為待辦由 Vista 補。

- [ ] **Step 2: 目視確認 + Commit**

開 `/ai-tutor` 確認 Hero 圖正常。
```bash
git add public/images/ai-tutor/hero.webp
git commit -m "feat(ai-tutor): add hero image"
```

---

### Task 8: 端對端驗證 + production build

**Files:** 無新增。

- [ ] **Step 1: 用字檢查（臺灣用語 + 禁用字）**

Run:
```bash
grep -rn "台\|試點\|批量\|視頻\|質量\|信息\|網絡\|軟件\|海量\|拐點" src/app/ai-tutor src/components/ai-tutor src/lib/ai-tutor-config.ts || echo "PASS: 無違規用字"
```
Expected: `PASS`（若有命中，逐一改為臺灣用語；「台」改「臺」，除非是量詞「一臺」之類已正確）。

- [ ] **Step 2: 表單端對端（真送一筆 → 確認導向 thanks → 清資料）**

在瀏覽器 `/ai-tutor` 填完表單送出：
- 預期導向 `/ai-tutor/thanks`，顯示成功訊息。
- 預期 `/admin/consulting/leads` 出現該筆，`topics` 含 `ai-tutor:` 前綴與 `ai-tutor-tier:` 標記。
- 預期收到兩封信（學員確認 + iamvista@gmail.com 內部信，內部信主旨為 `🎓 新 AI 家教班 lead：…`）。
- 驗證後刪除該測試列。

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build 成功，`/ai-tutor` 與 `/ai-tutor/thanks` 出現在路由清單，無型別 / lint 錯誤。

- [ ] **Step 4: 合併與部署（由 Vista 確認後執行）**

```bash
git checkout main
git merge --no-ff feat/ai-tutor-page
git push origin main   # Vercel 自動 build production
```
部署後開 `https://www.solo.tw/ai-tutor` 線上回讀，確認頁面渲染、導覽列入口、表單可送出。

---

## Self-Review

**1. Spec coverage**
- §3 定位命名 → Task 1（config 文案）、Task 5（Hero copy）。✅
- §4 路由與 IA（/ai-tutor、/ai-tutor/thanks、導覽列、不進 workshops）→ Task 5、Task 4、Task 6。✅
- §5 頁面九大區塊 → Task 5（全部 render config）。✅
- §6 三級定價 → Task 1（AI_TUTOR_TIERS）、Task 5（定價區）。✅
- §7 預約流程與後端共用（adapter、topics 前綴、plan=undecided、共用表/信/後台）→ Task 2。✅
- §8 表單欄位 → Task 3。✅
- §9 視覺素材 → Task 5 Step 2（佔位）、Task 7（正式）。✅
- §10 檔案清單 → Task 1–7 全覆蓋。✅
- §11 部署 → Task 8。✅
- §13 成功標準 → Task 8 Step 2/3/4。✅

**2. Placeholder scan:** 無 TBD/TODO 殘留於程式碼步驟；每個程式步驟都附完整 code。Task 7 生圖有「產不出來則用佔位」的明確降級路徑，非佔位文字。✅

**3. Type consistency:**
- Form payload 欄位（`directions`、`tierInterest`）↔ Task 2 route 讀取的欄位名一致。✅
- Route 映射出的 `mapped` 物件欄位 ↔ `leadSchema`（Task 2 引用既有 `validateLeadPayload`）：`plan:"undecided"` 在 enum 內、`topics` 為 string[]、`consentTerms` literal true。✅
- `AI_TUTOR_TIER_INTEREST` 的 value（starter/advanced/deep/undecided）↔ route 對 `tierInterest!=="undecided"` 的判斷一致。✅
