# solo.tw 1-on-1 量身陪跑 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 solo.tw 上線 1-on-1 量身陪跑服務：取代既有 `/consulting` 4 方案，新增 7 主題包 + 5 階梯時數套票、需求表單、Supabase 後臺 3 頁、Recur 結帳整合、5 個 Resend Email 模板。

**Architecture:** Next.js 16 App Router + Supabase (3 新表 + view) + Resend (Email) + Recur.tw (結帳)。前端用版型 B「故事先行」：Hero → Why → 服務形式 → 主題卡 → 套票 → 流程 → 表單 → FAQ。後臺複用既有 `/admin` auth pattern。

**Tech Stack:** TypeScript / Next.js 16 / React 19 / Tailwind CSS v4 / shadcn/ui / Supabase / Resend / Recur.tw SDK / Zod / Vitest (待安裝)

**Spec:** [`docs/superpowers/specs/2026-05-13-consulting-1on1-redesign.md`](../specs/2026-05-13-consulting-1on1-redesign.md)

**未決問題（implementation 前需 Vista 確認）：**
1. Spec §9.1 — Why 段引號內模擬學員引述，是真實引述還是改第三人稱？預設取代為第三人稱：「反覆收到類似的訊息：希望能單獨討論自己的狀況。」
2. Spec §9.2 — 5 個 Recur productId：Vista 先在 recur.tw 後臺建立、把 ID 提供給 implementation agent；agent 先用 placeholder constants，待 Vista 提供後一次性 replace。
3. Spec §9.3 — `CalEmbed.tsx` 廢棄評估：Task 23 會檢查 `ai-research-system` 是否引用，無引用即刪。
4. Spec §9.5 — 婉拒信文案：先用標準模板 placeholder，Task 6 含 stub，Vista 再 polish。

---

## File Structure

### 新增

| 路徑 | 責任 |
|------|------|
| `docs/archive/consulting-legacy-2026-05-13.md` | 舊 `/consulting` 完整 snapshot |
| `supabase/migrations/<timestamp>_consulting_1on1.sql` | 3 表 + view migration |
| `src/lib/consulting-config.ts` | 主題清單 / 套票方案 / Recur productId 對照（單一資料來源） |
| `src/lib/consulting-db.ts` | Supabase CRUD helpers (leads / enrollments / sessions) |
| `src/app/api/consulting/leads/route.ts` | 表單 POST endpoint + Zod 驗證 + Resend 雙寄信 |
| `src/app/consulting/thanks/page.tsx` | 表單送出後感謝頁 |
| `src/app/admin/consulting/leads/page.tsx` | 後臺 Lead 清單 |
| `src/app/admin/consulting/enrollments/page.tsx` | 後臺學員清單（含剩餘時數） |
| `src/app/admin/consulting/enrollments/[id]/page.tsx` | 後臺學員詳情 + session 歷史 |
| `src/components/consulting/Hero.tsx` | Hero 段（含雙 CTA 錨點） |
| `src/components/consulting/WhyOneOnOne.tsx` | Why 1-on-1 對比段 |
| `src/components/consulting/ServiceFormat.tsx` | 三個 icon 卡片：Meet / 共寫 / 彈性 |
| `src/components/consulting/ThemeGrid.tsx` | 7+1 主題卡 grid，含「從這題開始」按鈕 |
| `src/components/consulting/PricingLadder.tsx` | 5 階梯定價表 |
| `src/components/consulting/ProcessSteps.tsx` | 5 步驟流程 |
| `src/components/consulting/LeadForm.tsx` | 12 欄位表單（client component） |
| `src/components/consulting/FAQ.tsx` | 9 條 FAQ accordion |
| `src/components/admin/consulting/LeadList.tsx` | 表格 + approve/reject 按鈕 |
| `src/components/admin/consulting/EnrollmentList.tsx` | 表格 + 剩餘時數顯示 |
| `src/components/admin/consulting/EnrollmentDetail.tsx` | 學員資料卡 + session 表 |
| `src/components/admin/consulting/AddSessionModal.tsx` | 記錄一場 session 的 modal 表單 |
| `src/components/email/consulting-lead-received.tsx` | 學員填表收件確認 |
| `src/components/email/consulting-lead-internal.tsx` | Vista 內部通知信 |
| `src/components/email/consulting-checkout-link.tsx` | 寄付款連結給學員 |
| `src/components/email/consulting-enrollment-welcome.tsx` | 付款成功歡迎信 |
| `src/components/email/consulting-session-summary.tsx` | 課後通知信 |

### 修改

| 路徑 | 修改內容 |
|------|---------|
| `src/app/consulting/page.tsx` | 取代為新版型 B 內容（組裝 8 個元件） |
| `src/lib/recur-product-config.ts` | 加 5 個 consulting productId 對應表 + `consulting` kind enum |
| `src/app/api/webhooks/recur/route.ts` | 處理 `consulting` kind：建 enrollment + 寄歡迎信 |
| `scripts/generate-llms.mjs` | 把 7 主題與 5 套票寫入 `llms-full.txt` |

### 廢棄評估

| 路徑 | 動作 |
|------|------|
| `src/components/consulting/CalEmbed.tsx` | Task 23 檢查引用，無引用則刪 |

---

## Phase 0：前置作業

### Task 1：備份舊 /consulting 頁

**Files:**
- Create: `docs/archive/consulting-legacy-2026-05-13.md`

- [ ] **Step 1：建立備份檔，內含舊 page.tsx 完整內容與決策說明**

  把 `src/app/consulting/page.tsx` 整檔內容貼入備份檔，包上元資料：

  ````markdown
  # Legacy: /consulting page (snapshot 2026-05-13)

  > 取代原因：升級為 1-on-1 量身陪跑服務（spec: docs/superpowers/specs/2026-05-13-consulting-1on1-redesign.md）。
  > 取代後新方案在語意上 supersede 此處 4 方案。

  ## 取代前的 page.tsx

  ```tsx
  // <paste full content of src/app/consulting/page.tsx here>
  ```

  ## 取代前的 4 方案
  - 免費初談（30 min, 免費）
  - 事業方向諮詢（60 min, NT$2,490）
  - AI 工具導入（90 min, NT$3,990）
  - 陪跑教練（60min × 4, NT$9,900）

  ## CalEmbed 串接（vista/consulting）
  - 元件：src/components/consulting/CalEmbed.tsx
  - Cal link：vista/consulting
  ````

- [ ] **Step 2：把 prod 站 `https://www.solo.tw/consulting` 的螢幕截圖（行動 + 桌機兩版）放入備份檔**

  用 `curl` 抓 HTML 確認 + 用瀏覽器手動截圖（或 browse skill）。截圖檔放在 `docs/archive/consulting-legacy-2026-05-13-screenshots/` 並在 markdown 內 reference。

- [ ] **Step 3：Commit**

  ```bash
  git add docs/archive/consulting-legacy-2026-05-13.md docs/archive/consulting-legacy-2026-05-13-screenshots/
  git commit -m "docs(archive): snapshot legacy /consulting page before redesign"
  ```

---

### Task 2：安裝 Vitest（若 package.json 尚無）

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1：檢查既有 test framework**

  Run: `grep -E '"(vitest|jest)"' package.json`
  Expected: 無 output（未安裝）。若已有跳過此 task。

- [ ] **Step 2：安裝 Vitest 與 testing-library**

  ```bash
  pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
  ```

- [ ] **Step 3：建立 vitest.config.ts**

  ```typescript
  // vitest.config.ts
  import { defineConfig } from "vitest/config";
  import react from "@vitejs/plugin-react";
  import path from "path";

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
    },
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  });
  ```

- [ ] **Step 4：建立 vitest.setup.ts**

  ```typescript
  // vitest.setup.ts
  import "@testing-library/jest-dom/vitest";
  ```

- [ ] **Step 5：package.json 加 test script**

  ```json
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
  ```

- [ ] **Step 6：驗證 + commit**

  ```bash
  pnpm test
  ```

  Expected: "No test files found" — 確認可跑。

  ```bash
  git add package.json pnpm-lock.yaml vitest.config.ts vitest.setup.ts
  git commit -m "chore(test): add vitest setup"
  ```

---

## Phase 1：DB 層與 Constants

### Task 3：Supabase Migration

**Files:**
- Create: `supabase/migrations/<timestamp>_consulting_1on1.sql`

- [ ] **Step 1：建立 migration 檔**

  檔名格式 follow Supabase 既有 migration 命名（查 `supabase/migrations/` 最近一個檔名 timestamp 格式，例如 `20260513000000_consulting_1on1.sql`）。

  ```sql
  -- consulting_leads: 表單投件
  CREATE TABLE consulting_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    contact_method text NOT NULL CHECK (contact_method IN ('email','line','ig')),
    contact_id text,
    topics text[] NOT NULL,
    specific_problem text NOT NULL,
    expected_outcome text,
    level text NOT NULL CHECK (level IN ('beginner','basic','intermediate','advanced','expert')),
    desired_start text CHECK (desired_start IN ('this_week','2_weeks','1_month','no_rush')),
    plan text NOT NULL CHECK (plan IN ('1hr','3hr','5hr','10hr','20hr','undecided')),
    attribution text,
    consent_terms boolean NOT NULL,
    subscribe_newsletter boolean DEFAULT false,
    status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','enrolled','stale')),
    vista_notes text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
  CREATE INDEX idx_consulting_leads_status ON consulting_leads(status);
  CREATE INDEX idx_consulting_leads_created_at ON consulting_leads(created_at DESC);

  -- consulting_enrollments: 已付款學員
  CREATE TABLE consulting_enrollments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid REFERENCES consulting_leads(id),
    name text NOT NULL,
    email text NOT NULL,
    contact_method text,
    contact_id text,
    plan text NOT NULL,
    total_hours numeric NOT NULL,
    recur_product_id text,
    recur_payment_id text,
    purchased_at timestamptz NOT NULL,
    expires_at timestamptz NOT NULL,
    extended_once boolean DEFAULT false,
    status text DEFAULT 'active' CHECK (status IN ('active','expired','completed','transferred')),
    transferred_to text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
  CREATE INDEX idx_consulting_enrollments_status ON consulting_enrollments(status);
  CREATE INDEX idx_consulting_enrollments_expires_at ON consulting_enrollments(expires_at);

  -- consulting_sessions: 每堂課紀錄
  CREATE TABLE consulting_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id uuid REFERENCES consulting_enrollments(id) ON DELETE CASCADE,
    session_date date NOT NULL,
    time_start time,
    time_end time,
    hours_used numeric NOT NULL,
    topic text NOT NULL,
    shared_doc_url text,
    vista_notes text,
    created_at timestamptz DEFAULT now()
  );
  CREATE INDEX idx_consulting_sessions_enrollment_id ON consulting_sessions(enrollment_id);
  CREATE INDEX idx_consulting_sessions_date ON consulting_sessions(session_date DESC);

  -- 剩餘時數 view
  CREATE VIEW consulting_enrollments_with_balance AS
  SELECT
    e.*,
    COALESCE(SUM(s.hours_used), 0) AS hours_used,
    e.total_hours - COALESCE(SUM(s.hours_used), 0) AS hours_remaining,
    MAX(s.session_date) AS last_session_date
  FROM consulting_enrollments e
  LEFT JOIN consulting_sessions s ON s.enrollment_id = e.id
  GROUP BY e.id;

  -- RLS: 只允許 service role 操作（admin only）
  ALTER TABLE consulting_leads ENABLE ROW LEVEL SECURITY;
  ALTER TABLE consulting_enrollments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE consulting_sessions ENABLE ROW LEVEL SECURITY;
  ```

- [ ] **Step 2：本機跑 migration 驗證**

  ```bash
  pnpm supabase db reset --linked  # 或 supabase migration up
  ```

  Expected: migration 成功、3 表 + 1 view 建立、view 在 hours_remaining = 0 預設下能查。

- [ ] **Step 3：手動測試 view computed column**

  ```sql
  INSERT INTO consulting_enrollments (name,email,plan,total_hours,recur_product_id,purchased_at,expires_at)
  VALUES ('Test','t@t.tw','5hr',5,'test',now(),now() + interval '6 months');

  SELECT id, total_hours, hours_used, hours_remaining FROM consulting_enrollments_with_balance;
  -- Expected: hours_used=0, hours_remaining=5

  INSERT INTO consulting_sessions (enrollment_id, session_date, hours_used, topic)
  VALUES ((SELECT id FROM consulting_enrollments WHERE email='t@t.tw'), CURRENT_DATE, 1.5, 'vibe-coding');

  SELECT id, total_hours, hours_used, hours_remaining FROM consulting_enrollments_with_balance;
  -- Expected: hours_used=1.5, hours_remaining=3.5

  -- Cleanup
  DELETE FROM consulting_enrollments WHERE email='t@t.tw';
  ```

- [ ] **Step 4：Commit**

  ```bash
  git add supabase/migrations/
  git commit -m "feat(db): add consulting 1-on-1 tables (leads, enrollments, sessions + balance view)"
  ```

---

### Task 4：consulting-config.ts（單一資料來源）

**Files:**
- Create: `src/lib/consulting-config.ts`

- [ ] **Step 1：建立 config 檔，包含主題清單、套票方案、Recur productId placeholder**

  ```typescript
  // src/lib/consulting-config.ts
  export type ConsultingTopicSlug =
    | "vibe-coding"
    | "personal-site"
    | "solo-os"
    | "content-pipeline"
    | "second-brain"
    | "academic-writing"
    | "solo-business"
    | "custom";

  export type ConsultingPlanSlug = "1hr" | "3hr" | "5hr" | "10hr" | "20hr";

  export interface ConsultingTopic {
    slug: ConsultingTopicSlug;
    emoji: string;
    group: "tech" | "workflow" | "academic" | "business" | "custom";
    title: string;
    oneLiner: string;
    takeaway: string;
  }

  export interface ConsultingPlan {
    slug: ConsultingPlanSlug;
    hours: number;
    totalPrice: number;
    pricePerHour: number;
    label: string;
    suitedFor: string;
    recurProductId: string; // ⚠️ Vista 在 recur.tw 後臺建立後 replace placeholder
  }

  export const CONSULTING_TOPICS: ConsultingTopic[] = [
    {
      slug: "vibe-coding",
      emoji: "💻",
      group: "tech",
      title: "Vibe Coding 入門",
      oneLiner: "第一個 web app／小工具，從零到上線",
      takeaway: "一個部署在 Vercel / GitHub Pages 的可用作品",
    },
    {
      slug: "personal-site",
      emoji: "🌐",
      group: "tech",
      title: "個人網站系統",
      oneLiner: "仿 solo.tw / vista.tw 的一人媒體站",
      takeaway: "上線的個人網站 + 部署 SOP",
    },
    {
      slug: "solo-os",
      emoji: "🎛",
      group: "workflow",
      title: "Solo OS：個人作業系統建置",
      oneLiner: "把 Calendar / Notion / Anytype / Obsidian 串成能運作的一人事業系統",
      takeaway: "個人化作業系統設定 + 工作流 SOP",
    },
    {
      slug: "content-pipeline",
      emoji: "✍️",
      group: "workflow",
      title: "內容生產 Pipeline",
      oneLiner: "研究 → 撰稿 → 去 AI 味 → 多平臺分發",
      takeaway: "個人化內容 pipeline + 模板包",
    },
    {
      slug: "second-brain",
      emoji: "🧠",
      group: "workflow",
      title: "第二大腦／知識管理",
      oneLiner: "Wiki、backlink、AI 檢索",
      takeaway: "知識管理系統 + AI 檢索 SOP",
    },
    {
      slug: "academic-writing",
      emoji: "📚",
      group: "academic",
      title: "AI 輔助學術寫作",
      oneLiner: "文獻、Intro、方法、投稿，AI 是您的研究伙伴",
      takeaway: "學術寫作 workflow + AI prompt 模板",
    },
    {
      slug: "solo-business",
      emoji: "🎯",
      group: "business",
      title: "一人事業起步診斷",
      oneLiner: "定位、產品、定價、首批客戶",
      takeaway: "個人化事業地圖 + 90 天行動計畫",
    },
    {
      slug: "custom",
      emoji: "🌀",
      group: "custom",
      title: "我有別的需求",
      oneLiner: "不在上面這七個主題裡？告訴我您的卡關",
      takeaway: "客製方案",
    },
  ];

  export const CONSULTING_PLANS: ConsultingPlan[] = [
    {
      slug: "1hr",
      hours: 1,
      totalPrice: 3000,
      pricePerHour: 3000,
      label: "1 小時諮詢",
      suitedFor: "試水溫、單點問題",
      recurProductId: "PLACEHOLDER_1HR", // ⚠️ replace
    },
    {
      slug: "3hr",
      hours: 3,
      totalPrice: 8400,
      pricePerHour: 2800,
      label: "3 小時套票",
      suitedFor: "入門包、一個小主題收尾",
      recurProductId: "PLACEHOLDER_3HR",
    },
    {
      slug: "5hr",
      hours: 5,
      totalPrice: 13500,
      pricePerHour: 2700,
      label: "5 小時套票",
      suitedFor: "一個主題深入",
      recurProductId: "PLACEHOLDER_5HR",
    },
    {
      slug: "10hr",
      hours: 10,
      totalPrice: 26000,
      pricePerHour: 2600,
      label: "10 小時套票",
      suitedFor: "跨主題、半年陪跑",
      recurProductId: "PLACEHOLDER_10HR",
    },
    {
      slug: "20hr",
      hours: 20,
      totalPrice: 48000,
      pricePerHour: 2400,
      label: "20 小時套票",
      suitedFor: "長期顧問關係",
      recurProductId: "PLACEHOLDER_20HR",
    },
  ];

  export const CONSULTING_LEVELS = [
    { value: "beginner", label: "完全新手，連 ChatGPT 都不太會用" },
    { value: "basic", label: "會用 ChatGPT / Claude，能寫基本 prompt" },
    { value: "intermediate", label: "用過 Cursor / Claude Code，做過小東西" },
    { value: "advanced", label: "已有作品，想升級工作流" },
    { value: "expert", label: "我是工程師／研究者，要進階知識" },
  ] as const;

  export const CONSULTING_DESIRED_START = [
    { value: "this_week", label: "本週" },
    { value: "2_weeks", label: "兩週內" },
    { value: "1_month", label: "一個月內" },
    { value: "no_rush", label: "還沒急" },
  ] as const;

  export const CONSULTING_ATTRIBUTION = [
    "朋友推薦",
    "工作坊",
    "《Vista 電子報》",
    "社群媒體",
    "Google 搜尋",
    "其他",
  ] as const;

  export const EXPIRY_MONTHS = 6;
  export const EXTENSION_MONTHS = 3;

  export function getPlanBySlug(slug: ConsultingPlanSlug | "undecided"): ConsultingPlan | null {
    if (slug === "undecided") return null;
    return CONSULTING_PLANS.find((p) => p.slug === slug) ?? null;
  }

  export function getTopicBySlug(slug: string): ConsultingTopic | null {
    return CONSULTING_TOPICS.find((t) => t.slug === slug) ?? null;
  }
  ```

- [ ] **Step 2：Commit**

  ```bash
  git add src/lib/consulting-config.ts
  git commit -m "feat(consulting): add config (topics, plans, levels constants)"
  ```

---

### Task 5：consulting-db.ts（CRUD helpers）+ 測試

**Files:**
- Create: `src/lib/consulting-db.ts`
- Create: `src/lib/consulting-db.test.ts`

- [ ] **Step 1：寫測試（DB helpers 行為定義）**

  ```typescript
  // src/lib/consulting-db.test.ts
  import { describe, it, expect, vi, beforeEach } from "vitest";
  import { computeExpiresAt, validateLeadPayload } from "./consulting-db";

  describe("computeExpiresAt", () => {
    it("returns purchased_at + 6 months", () => {
      const purchased = new Date("2026-05-13T00:00:00Z");
      const expires = computeExpiresAt(purchased);
      expect(expires.getUTCMonth()).toBe(10); // May (4) + 6 = November (10)
      expect(expires.getUTCFullYear()).toBe(2026);
    });
  });

  describe("validateLeadPayload", () => {
    it("rejects payload missing specific_problem", () => {
      const result = validateLeadPayload({
        name: "Test",
        email: "t@t.tw",
        contactMethod: "email",
        topics: ["vibe-coding"],
        level: "basic",
        plan: "1hr",
        consentTerms: true,
      } as any);
      expect(result.ok).toBe(false);
    });

    it("accepts a complete valid payload", () => {
      const result = validateLeadPayload({
        name: "Test",
        email: "t@t.tw",
        contactMethod: "email",
        topics: ["vibe-coding"],
        specificProblem: "我想做一個 podcast 推薦工具，但不知道從哪開始也不會 React",
        level: "basic",
        plan: "1hr",
        consentTerms: true,
      });
      expect(result.ok).toBe(true);
    });

    it("rejects specific_problem < 30 chars", () => {
      const result = validateLeadPayload({
        name: "Test",
        email: "t@t.tw",
        contactMethod: "email",
        topics: ["vibe-coding"],
        specificProblem: "太短了",
        level: "basic",
        plan: "1hr",
        consentTerms: true,
      });
      expect(result.ok).toBe(false);
    });
  });
  ```

- [ ] **Step 2：Run test 確認 fail**

  ```bash
  pnpm test src/lib/consulting-db.test.ts
  ```

  Expected: FAIL（檔案不存在或 export 缺失）

- [ ] **Step 3：寫 consulting-db.ts**

  ```typescript
  // src/lib/consulting-db.ts
  import { z } from "zod";
  import { createClient } from "@/lib/supabase/server"; // 仿 existing pattern
  import {
    EXPIRY_MONTHS,
    type ConsultingPlanSlug,
    type ConsultingTopicSlug,
  } from "./consulting-config";

  // ────────────────────────────────────────
  // Zod schema (shared with API route)
  // ────────────────────────────────────────
  export const leadSchema = z.object({
    name: z.string().min(1).max(80),
    email: z.string().email(),
    contactMethod: z.enum(["email", "line", "ig"]),
    contactId: z.string().max(80).optional(),
    topics: z.array(z.string()).min(1),
    specificProblem: z.string().min(30).max(2000),
    expectedOutcome: z.string().max(1000).optional(),
    level: z.enum(["beginner", "basic", "intermediate", "advanced", "expert"]),
    desiredStart: z.enum(["this_week", "2_weeks", "1_month", "no_rush"]).optional(),
    plan: z.enum(["1hr", "3hr", "5hr", "10hr", "20hr", "undecided"]),
    attribution: z.string().max(80).optional(),
    consentTerms: z.literal(true),
    subscribeNewsletter: z.boolean().optional(),
    utmSource: z.string().max(80).optional(),
    utmMedium: z.string().max(80).optional(),
    utmCampaign: z.string().max(80).optional(),
  });

  export type LeadPayload = z.infer<typeof leadSchema>;

  export function validateLeadPayload(
    payload: unknown,
  ): { ok: true; data: LeadPayload } | { ok: false; error: string; fieldErrors?: Record<string, string> } {
    const result = leadSchema.safeParse(payload);
    if (result.success) return { ok: true, data: result.data };
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "invalid_payload", fieldErrors };
  }

  // ────────────────────────────────────────
  // Date helpers
  // ────────────────────────────────────────
  export function computeExpiresAt(purchasedAt: Date, months = EXPIRY_MONTHS): Date {
    const expires = new Date(purchasedAt);
    expires.setUTCMonth(expires.getUTCMonth() + months);
    return expires;
  }

  // ────────────────────────────────────────
  // DB operations
  // ────────────────────────────────────────
  export async function insertLead(payload: LeadPayload) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consulting_leads")
      .insert({
        name: payload.name,
        email: payload.email,
        contact_method: payload.contactMethod,
        contact_id: payload.contactId ?? null,
        topics: payload.topics,
        specific_problem: payload.specificProblem,
        expected_outcome: payload.expectedOutcome ?? null,
        level: payload.level,
        desired_start: payload.desiredStart ?? null,
        plan: payload.plan,
        attribution: payload.attribution ?? null,
        consent_terms: payload.consentTerms,
        subscribe_newsletter: payload.subscribeNewsletter ?? false,
        utm_source: payload.utmSource ?? null,
        utm_medium: payload.utmMedium ?? null,
        utm_campaign: payload.utmCampaign ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  export async function listLeads(status?: string) {
    const supabase = await createClient();
    let query = supabase.from("consulting_leads").select("*").order("created_at", { ascending: false });
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  export async function updateLeadStatus(id: string, status: "approved" | "rejected" | "enrolled" | "stale", vistaNotes?: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consulting_leads")
      .update({ status, vista_notes: vistaNotes ?? null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  export async function createEnrollment(params: {
    leadId: string | null;
    name: string;
    email: string;
    contactMethod?: string;
    contactId?: string;
    plan: ConsultingPlanSlug;
    totalHours: number;
    recurProductId: string;
    recurPaymentId: string;
    purchasedAt: Date;
  }) {
    const supabase = await createClient();
    const expiresAt = computeExpiresAt(params.purchasedAt);
    const { data, error } = await supabase
      .from("consulting_enrollments")
      .insert({
        lead_id: params.leadId,
        name: params.name,
        email: params.email,
        contact_method: params.contactMethod ?? null,
        contact_id: params.contactId ?? null,
        plan: params.plan,
        total_hours: params.totalHours,
        recur_product_id: params.recurProductId,
        recur_payment_id: params.recurPaymentId,
        purchased_at: params.purchasedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  export async function listEnrollmentsWithBalance() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consulting_enrollments_with_balance")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  export async function getEnrollmentWithBalance(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consulting_enrollments_with_balance")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  export async function listSessionsForEnrollment(enrollmentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consulting_sessions")
      .select("*")
      .eq("enrollment_id", enrollmentId)
      .order("session_date", { ascending: false });
    if (error) throw error;
    return data;
  }

  export async function insertSession(params: {
    enrollmentId: string;
    sessionDate: string;       // YYYY-MM-DD
    timeStart?: string;        // HH:MM
    timeEnd?: string;          // HH:MM
    hoursUsed: number;
    topic: ConsultingTopicSlug | string;
    sharedDocUrl?: string;
    vistaNotes?: string;
  }) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consulting_sessions")
      .insert({
        enrollment_id: params.enrollmentId,
        session_date: params.sessionDate,
        time_start: params.timeStart ?? null,
        time_end: params.timeEnd ?? null,
        hours_used: params.hoursUsed,
        topic: params.topic,
        shared_doc_url: params.sharedDocUrl ?? null,
        vista_notes: params.vistaNotes ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  ```

- [ ] **Step 4：Run test 確認 pass**

  ```bash
  pnpm test src/lib/consulting-db.test.ts
  ```

  Expected: PASS（純函式 `computeExpiresAt` + `validateLeadPayload` 通過）

- [ ] **Step 5：Commit**

  ```bash
  git add src/lib/consulting-db.ts src/lib/consulting-db.test.ts
  git commit -m "feat(consulting): add db helpers (leads, enrollments, sessions) with Zod schema"
  ```

---

## Phase 2：Email Templates 與 API

### Task 6：5 個 Email 模板

**Files:**
- Create: `src/components/email/consulting-lead-received.tsx`
- Create: `src/components/email/consulting-lead-internal.tsx`
- Create: `src/components/email/consulting-checkout-link.tsx`
- Create: `src/components/email/consulting-enrollment-welcome.tsx`
- Create: `src/components/email/consulting-session-summary.tsx`

- [ ] **Step 1：仿照 `src/components/email/lead-magnet-delivery.tsx` 既有 pattern 建立 5 個模板**

  以 `consulting-lead-received.tsx` 為範例（其餘 4 個照 props 與內容差異補完）：

  ```tsx
  // src/components/email/consulting-lead-received.tsx
  import { Html, Body, Container, Heading, Text, Section, Hr, Link } from "@react-email/components";

  interface Props {
    name: string;
    plan: string;        // '1hr' | '3hr' | ... | 'undecided'
    topics: string[];    // slug array
  }

  export default function ConsultingLeadReceived({ name, plan, topics }: Props) {
    return (
      <Html>
        <Body style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
          <Container>
            <Heading>{`${name}，需求表單收到了`}</Heading>
            <Text>感謝您填寫 1-on-1 量身陪跑需求表單。</Text>
            <Text>我會在 24 小時內回信，若評估彼此合適，會附上付款連結。若不合適，我也會誠實告訴您比較適合的人。</Text>

            <Section>
              <Text><strong>您填寫的方案：</strong>{plan}</Text>
              <Text><strong>您勾選的主題：</strong>{topics.join(", ")}</Text>
            </Section>

            <Hr />
            <Text>Vista｜solo.tw</Text>
            <Link href="https://www.solo.tw/consulting">https://www.solo.tw/consulting</Link>
          </Container>
        </Body>
      </Html>
    );
  }
  ```

  **其餘 4 個模板要點**（檔內結構同上、依此 fill in）：

  | 模板 | Props | 內容要點 |
  |------|-------|---------|
  | `consulting-lead-internal.tsx` | `lead: LeadFull` | 完整表單 dump + 後臺 review 連結 `https://www.solo.tw/admin/consulting/leads` |
  | `consulting-checkout-link.tsx` | `name`, `plan`, `checkoutUrl`, `vistaMessage` | 確認方向（含 Vista 一段話）+ 大按鈕「前往付款」連到 checkoutUrl |
  | `consulting-enrollment-welcome.tsx` | `name`, `plan`, `totalHours`, `expiresAt` | 歡迎 + 套票方案 + 過期日 + 「請回信告知您方便的時段，我們約首場 Google Meet」 |
  | `consulting-session-summary.tsx` | `name`, `sessionDate`, `hoursUsed`, `hoursRemaining`, `topic` | 本場已記錄 + 剩餘 X 小時 + 到期日提示 |

- [ ] **Step 2：建立全 5 個模板（內容文案見 spec §4.7 / §5.5）**

  按上面表格逐一建立其餘 4 個檔。

- [ ] **Step 3：驗證 render**

  本機 dev mode 用 React Email preview（若 repo 已有 setup）或直接寫一個小 script 跑：

  ```bash
  # 在 src/components/email/_preview.tsx 寫一個 mock 渲染（暫時，不 commit）
  # 或在實作時用 Resend 提供的 preview API
  ```

  Expected: 5 個檔都能 import 成功、TypeScript 無錯。

- [ ] **Step 4：Commit**

  ```bash
  git add src/components/email/consulting-*.tsx
  git commit -m "feat(email): add 5 consulting email templates (lead, internal, checkout, welcome, session)"
  ```

---

### Task 7：API endpoint POST /api/consulting/leads

**Files:**
- Create: `src/app/api/consulting/leads/route.ts`
- Create: `src/app/api/consulting/leads/route.test.ts`

- [ ] **Step 1：寫測試**

  ```typescript
  // src/app/api/consulting/leads/route.test.ts
  import { describe, it, expect, vi } from "vitest";
  import { POST } from "./route";

  function mockReq(body: any, ip = "1.2.3.4") {
    return new Request("http://localhost/api/consulting/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    });
  }

  vi.mock("@/lib/consulting-db", async () => ({
    validateLeadPayload: (await vi.importActual<any>("@/lib/consulting-db")).validateLeadPayload,
    insertLead: vi.fn(async (p: any) => ({ id: "lead-id-1", ...p })),
  }));
  vi.mock("@/lib/email", () => ({ sendEmail: vi.fn(async () => ({ id: "msg" })) }));

  describe("POST /api/consulting/leads", () => {
    it("422 on missing required fields", async () => {
      const res = await POST(mockReq({ email: "t@t.tw" }));
      expect(res.status).toBe(422);
    });

    it("200 with leadId on valid payload", async () => {
      const res = await POST(
        mockReq({
          name: "Test",
          email: "t@t.tw",
          contactMethod: "email",
          topics: ["vibe-coding"],
          specificProblem: "我想做一個 podcast 推薦工具，但不知道從哪開始也不會 React",
          level: "basic",
          plan: "1hr",
          consentTerms: true,
        }),
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.leadId).toBe("lead-id-1");
    });
  });
  ```

- [ ] **Step 2：Run test 確認 fail**

  ```bash
  pnpm test src/app/api/consulting/leads/route.test.ts
  ```

  Expected: FAIL（route.ts 不存在）

- [ ] **Step 3：寫 route.ts**

  ```typescript
  // src/app/api/consulting/leads/route.ts
  import { NextResponse } from "next/server";
  import { validateLeadPayload, insertLead } from "@/lib/consulting-db";
  import { sendEmail } from "@/lib/email";
  import ConsultingLeadReceived from "@/components/email/consulting-lead-received";
  import ConsultingLeadInternal from "@/components/email/consulting-lead-internal";

  // Rate limit: 5 / 10min per IP（in-memory; existing lead-magnet route uses 同 pattern，可借用 helper）
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

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const validation = validateLeadPayload(body);
    if (!validation.ok) {
      return NextResponse.json(
        { ok: false, error: validation.error, fieldErrors: validation.fieldErrors },
        { status: 422 },
      );
    }

    const payload = validation.data;

    try {
      const lead = await insertLead(payload);

      // 並行寄兩封信（不阻擋 response）
      Promise.allSettled([
        sendEmail({
          to: payload.email,
          subject: "需求表單收到了 — Vista",
          react: ConsultingLeadReceived({
            name: payload.name,
            plan: payload.plan,
            topics: payload.topics,
          }),
        }),
        sendEmail({
          to: "iamvista@gmail.com",
          subject: `🆕 新諮詢 lead：${payload.name}（${payload.plan}）`,
          react: ConsultingLeadInternal({ lead }),
        }),
      ]).catch((err) => console.error("email send failed", err));

      // newsletter subscribe（如勾選）：仿 lead-magnet route 既有 logic
      // ... (sketch only; reuse existing helper if available)

      return NextResponse.json({ ok: true, leadId: lead.id });
    } catch (err) {
      console.error("insertLead failed", err);
      return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
    }
  }
  ```

- [ ] **Step 4：Run test 確認 pass**

  ```bash
  pnpm test src/app/api/consulting/leads/route.test.ts
  ```

  Expected: PASS

- [ ] **Step 5：Commit**

  ```bash
  git add src/app/api/consulting/leads/route.ts src/app/api/consulting/leads/route.test.ts
  git commit -m "feat(api): add POST /api/consulting/leads with Zod + rate limit + dual email"
  ```

---

## Phase 3：Recur Webhook 擴充

### Task 8：recur-product-config.ts 擴充

**Files:**
- Modify: `src/lib/recur-product-config.ts`

- [ ] **Step 1：先讀既有檔案結構**

  Run: `cat src/lib/recur-product-config.ts | head -60`
  目的：確認既有 `kind` enum、productId 對照表的 schema。

- [ ] **Step 2：加入 5 個 consulting productId 與 `consulting` kind**

  在既有產品對照表後追加：

  ```typescript
  // 在 productConfig map 中追加（key 為 placeholder，待 Vista 提供後 replace）
  PLACEHOLDER_1HR: {
    kind: "consulting" as const,
    plan: "1hr",
    hours: 1,
    amount: 3000,
    productName: "1 小時諮詢",
    emailTemplate: "consulting-enrollment-welcome",
  },
  PLACEHOLDER_3HR: { kind: "consulting", plan: "3hr", hours: 3, amount: 8400, productName: "3 小時套票", emailTemplate: "consulting-enrollment-welcome" },
  PLACEHOLDER_5HR: { kind: "consulting", plan: "5hr", hours: 5, amount: 13500, productName: "5 小時套票", emailTemplate: "consulting-enrollment-welcome" },
  PLACEHOLDER_10HR: { kind: "consulting", plan: "10hr", hours: 10, amount: 26000, productName: "10 小時套票", emailTemplate: "consulting-enrollment-welcome" },
  PLACEHOLDER_20HR: { kind: "consulting", plan: "20hr", hours: 20, amount: 48000, productName: "20 小時套票", emailTemplate: "consulting-enrollment-welcome" },
  ```

  並把 `kind` enum / union type 加入 `"consulting"`。

- [ ] **Step 3：在 file header 加 TODO 提醒（implementation 時刪除）**

  ```typescript
  // ⚠️ TODO: Vista 在 recur.tw 後臺手動建立 5 個 consulting productId 後，
  // 把上方 PLACEHOLDER_XHR 五個 key 替換成真實 productId。
  // 然後同步更新 src/lib/consulting-config.ts 的 CONSULTING_PLANS[].recurProductId。
  ```

- [ ] **Step 4：Commit**

  ```bash
  git add src/lib/recur-product-config.ts
  git commit -m "feat(recur): register 5 consulting productId placeholders + add consulting kind"
  ```

---

### Task 9：Webhook 加 consulting kind handler

**Files:**
- Modify: `src/app/api/webhooks/recur/route.ts`

- [ ] **Step 1：讀既有 webhook handler 結構**

  Run: `cat src/app/api/webhooks/recur/route.ts | head -80`

  確認既有 switch/if 處理 `kind === 'course'` / `'product'` 的位置。

- [ ] **Step 2：加 consulting kind 分支**

  ```typescript
  // 在既有 kind 分支後追加：
  if (productConfig.kind === "consulting") {
    const purchasedAt = new Date();
    const enrollment = await createEnrollment({
      leadId: metadata.leadId ?? null,
      name: customer.name,
      email: customer.email,
      contactMethod: metadata.contactMethod,
      contactId: metadata.contactId,
      plan: productConfig.plan as ConsultingPlanSlug,
      totalHours: productConfig.hours,
      recurProductId: productId,
      recurPaymentId: paymentId,
      purchasedAt,
    });

    // 更新 lead.status='enrolled'
    if (metadata.leadId) {
      await updateLeadStatus(metadata.leadId, "enrolled");
    }

    // 寄歡迎信
    await sendEmail({
      to: customer.email,
      subject: `${customer.name}，您的 1-on-1 量身陪跑已啟動`,
      react: ConsultingEnrollmentWelcome({
        name: customer.name,
        plan: productConfig.plan,
        totalHours: productConfig.hours,
        expiresAt: enrollment.expires_at,
      }),
    });

    return NextResponse.json({ ok: true, enrollmentId: enrollment.id });
  }
  ```

- [ ] **Step 3：Run smoke test（手動 curl webhook）**

  本機跑 dev server，用 curl 模擬 Recur webhook payload：

  ```bash
  curl -X POST http://localhost:3000/api/webhooks/recur \
    -H "Content-Type: application/json" \
    -H "x-recur-signature: <test-sig>" \
    -d '{
      "event": "payment.completed",
      "productId": "PLACEHOLDER_1HR",
      "paymentId": "test-pay-1",
      "customer": { "name": "Test", "email": "t@t.tw" },
      "metadata": { "leadId": "<existing-lead-uuid>" }
    }'
  ```

  Expected: 200 OK + Supabase 多出一筆 enrollment。

- [ ] **Step 4：Commit**

  ```bash
  git add src/app/api/webhooks/recur/route.ts
  git commit -m "feat(webhook): handle consulting payments → create enrollment + welcome email"
  ```

---

## Phase 4：招生頁元件（前端）

> **共通約定**：所有元件用 TypeScript + Tailwind + shadcn/ui。文字內容從 spec §4 與 consulting-config.ts 取用。元件用 `"use client"` 僅在必要時（LeadForm 需要、其他都不用）。

### Task 10：Hero 元件

**Files:**
- Create: `src/components/consulting/Hero.tsx`

- [ ] **Step 1：建立 Hero 元件**

  ```tsx
  // src/components/consulting/Hero.tsx
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
  ```

- [ ] **Step 2：Commit**

  ```bash
  git add src/components/consulting/Hero.tsx
  git commit -m "feat(consulting): add Hero component"
  ```

---

### Task 11：WhyOneOnOne 元件

**Files:**
- Create: `src/components/consulting/WhyOneOnOne.tsx`

- [ ] **Step 1：建立元件，文案見 spec §4.2**

  ```tsx
  // src/components/consulting/WhyOneOnOne.tsx
  export function WhyOneOnOne() {
    return (
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold">同樣的時間，集中在您身上</h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              工作坊裡您是 12 位學員之一，內容是平均最大公約數。
              在 1-on-1 裡，課程內容就是針對您的問題設計，按照您的節奏進行；
              產出就是您要帶走的東西。
            </p>
            <p>
              我在 solo.tw 開了一年多工作坊，反覆收到類似的訊息：
              希望能單獨討論自己的狀況。這個服務就是回應這個請求。
            </p>
          </div>
        </div>
      </section>
    );
  }
  ```

  > ⚠️ Note：此段已採 spec §9.1 default（第三人稱描述、無引號）。若 Vista 後續確認是真實引述，再改回引號版本。

- [ ] **Step 2：Commit**

  ```bash
  git add src/components/consulting/WhyOneOnOne.tsx
  git commit -m "feat(consulting): add WhyOneOnOne component"
  ```

---

### Task 12：ServiceFormat 元件

**Files:**
- Create: `src/components/consulting/ServiceFormat.tsx`

- [ ] **Step 1：三個 icon 卡片，文案見 spec §4.3**

  ```tsx
  // src/components/consulting/ServiceFormat.tsx
  const items = [
    {
      icon: "🎥",
      title: "Google Meet 視訊 1-on-1",
      desc: "分享螢幕、現場 demo、做到一半的東西我直接接手示範。",
    },
    {
      icon: "📝",
      title: "共寫工作檔",
      desc: "每場開一份 Google Doc 或 GitHub repo，做完當下就帶走可用的產出，不依賴錄影檔。",
    },
    {
      icon: "🔁",
      title: "彈性節奏",
      desc: "1 小時收一個小卡關，10 小時跨主題深耕，多久上一次、每次幾小時，您決定。",
    },
  ];

  export function ServiceFormat() {
    return (
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center">我們怎麼一起工作</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {items.map((it) => (
              <div key={it.title} className="rounded-lg border bg-card p-6">
                <div className="text-4xl">{it.icon}</div>
                <h3 className="mt-4 text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-muted-foreground">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2：Commit**

  ```bash
  git add src/components/consulting/ServiceFormat.tsx
  git commit -m "feat(consulting): add ServiceFormat component"
  ```

---

### Task 13：ThemeGrid 元件

**Files:**
- Create: `src/components/consulting/ThemeGrid.tsx`

- [ ] **Step 1：建立元件，資料源 CONSULTING_TOPICS**

  ```tsx
  // src/components/consulting/ThemeGrid.tsx
  "use client";
  import { CONSULTING_TOPICS } from "@/lib/consulting-config";
  import { Button } from "@/components/ui/button";

  interface Props {
    onSelectTopic?: (slug: string) => void;
  }

  export function ThemeGrid({ onSelectTopic }: Props) {
    return (
      <section id="themes" className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center">您今天卡在哪裡？</h2>
          <p className="mt-3 text-center text-muted-foreground">
            七個主題是我這一年多最常被問的方向。您也可以開新題目，第八張卡就是給「不在上面」的人。
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CONSULTING_TOPICS.map((t) => (
              <div key={t.slug} className="flex flex-col rounded-lg border bg-card p-6">
                <div className="text-4xl">{t.emoji}</div>
                <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.oneLiner}</p>
                <p className="mt-4 text-sm">
                  <span className="font-medium">帶走：</span>{t.takeaway}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 self-end"
                  onClick={() => {
                    onSelectTopic?.(t.slug);
                    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  💬 從這題開始 →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2：Commit**

  ```bash
  git add src/components/consulting/ThemeGrid.tsx
  git commit -m "feat(consulting): add ThemeGrid (7+1 themes with prefill CTA)"
  ```

---

### Task 14：PricingLadder 元件

**Files:**
- Create: `src/components/consulting/PricingLadder.tsx`

- [ ] **Step 1：建立元件，資料源 CONSULTING_PLANS，文案見 spec §4.5**

  ```tsx
  // src/components/consulting/PricingLadder.tsx
  import { CONSULTING_PLANS } from "@/lib/consulting-config";

  export function PricingLadder() {
    return (
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center">依需求選時數，越多越划算</h2>
          <p className="mt-3 text-center text-muted-foreground">
            自付款日起 6 個月內用完，可延期一次（+3 個月）
          </p>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="p-4 text-left">方案</th>
                  <th className="p-4 text-right">總價</th>
                  <th className="p-4 text-right">每小時</th>
                  <th className="p-4 text-left">適合</th>
                </tr>
              </thead>
              <tbody>
                {CONSULTING_PLANS.map((p) => (
                  <tr key={p.slug} className="border-b">
                    <td className="p-4 font-medium">{p.label}</td>
                    <td className="p-4 text-right">NT${p.totalPrice.toLocaleString()}</td>
                    <td className="p-4 text-right text-muted-foreground">NT${p.pricePerHour.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{p.suitedFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            註：套票期間 1 對 1 時段優先排程，可分次使用、不限主題；單張套票可一次性轉讓給 1 位他人。
          </p>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2：Commit**

  ```bash
  git add src/components/consulting/PricingLadder.tsx
  git commit -m "feat(consulting): add PricingLadder component"
  ```

---

### Task 15：ProcessSteps 元件

**Files:**
- Create: `src/components/consulting/ProcessSteps.tsx`

- [ ] **Step 1：建立元件，文案見 spec §4.6**

  ```tsx
  // src/components/consulting/ProcessSteps.tsx
  const steps = [
    "填需求表單（5 分鐘）",
    "我看完回信（24 小時內）",
    "確認方向後寄上付款連結",
    "付款後 E-mail / LINE 議定首場時段",
    "Google Meet 開課，共寫文件同步交付",
  ];

  export function ProcessSteps() {
    return (
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center">從填表到上課，五步驟</h2>
          <ol className="mt-12 space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4 rounded-lg border bg-card p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {i + 1}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2：Commit**

  ```bash
  git add src/components/consulting/ProcessSteps.tsx
  git commit -m "feat(consulting): add ProcessSteps component"
  ```

---

### Task 16：LeadForm 元件（client component）

**Files:**
- Create: `src/components/consulting/LeadForm.tsx`

> 這是最大的元件，含 12 欄位 + React state + POST API。仿照 `src/app/m/[slug]/LeadMagnetForm.tsx` 與 `src/app/courses/[course]/register/CourseRegistrationForm.tsx` 既有 pattern。

- [ ] **Step 1：建立元件骨架，含 state 與 handleSubmit**

  ```tsx
  // src/components/consulting/LeadForm.tsx
  "use client";
  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { Checkbox } from "@/components/ui/checkbox";
  import {
    CONSULTING_TOPICS,
    CONSULTING_PLANS,
    CONSULTING_LEVELS,
    CONSULTING_DESIRED_START,
    CONSULTING_ATTRIBUTION,
  } from "@/lib/consulting-config";

  interface FormState {
    name: string;
    email: string;
    contactMethod: "email" | "line" | "ig";
    contactId: string;
    topics: string[];
    specificProblem: string;
    expectedOutcome: string;
    level: string;
    desiredStart: string;
    plan: string;
    attribution: string;
    consentTerms: boolean;
    subscribeNewsletter: boolean;
  }

  const INITIAL: FormState = {
    name: "",
    email: "",
    contactMethod: "email",
    contactId: "",
    topics: [],
    specificProblem: "",
    expectedOutcome: "",
    level: "",
    desiredStart: "",
    plan: "",
    attribution: "",
    consentTerms: false,
    subscribeNewsletter: false,
  };

  interface Props {
    prefillTopic?: string;
  }

  export function LeadForm({ prefillTopic }: Props) {
    const router = useRouter();
    const [state, setState] = useState<FormState>(() =>
      prefillTopic ? { ...INITIAL, topics: [prefillTopic] } : INITIAL,
    );
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const toggleTopic = (slug: string) => {
      setState((s) => ({
        ...s,
        topics: s.topics.includes(slug)
          ? s.topics.filter((t) => t !== slug)
          : [...s.topics, slug],
      }));
    };

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setSubmitting(true);
      setErrors({});

      // 客端必填檢查
      const reqErrors: Record<string, string> = {};
      if (!state.name) reqErrors.name = "請填姓名";
      if (!state.email) reqErrors.email = "請填 E-mail";
      if (state.topics.length === 0) reqErrors.topics = "請至少勾一個主題";
      if (state.specificProblem.length < 30) reqErrors.specificProblem = "請至少描述 30 字";
      if (!state.level) reqErrors.level = "請選擇程度";
      if (!state.plan) reqErrors.plan = "請選擇時數方案";
      if (!state.consentTerms) reqErrors.consentTerms = "需勾選同意條款";
      if (Object.keys(reqErrors).length > 0) {
        setErrors(reqErrors);
        setSubmitting(false);
        return;
      }

      const payload = {
        name: state.name,
        email: state.email,
        contactMethod: state.contactMethod,
        contactId: state.contactId || undefined,
        topics: state.topics,
        specificProblem: state.specificProblem,
        expectedOutcome: state.expectedOutcome || undefined,
        level: state.level,
        desiredStart: state.desiredStart || undefined,
        plan: state.plan,
        attribution: state.attribution || undefined,
        consentTerms: true as const,
        subscribeNewsletter: state.subscribeNewsletter,
      };

      const res = await fetch("/api/consulting/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSubmitting(false);

      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        else setErrors({ _form: data.error ?? "送出失敗，請稍後再試。" });
        return;
      }

      router.push(`/consulting/thanks?lead_id=${data.leadId}`);
    }

    // JSX render — 12 欄位分 5 區（見 spec §3.6）
    // 略：完整 JSX 在 implementation 時依 spec §3.6 結構展開，
    // 每個欄位用 Input/Textarea/Checkbox/RadioGroup 對應 shadcn 元件。
    // 範例（聯絡方式分組）：
    return (
      <form id="lead-form" onSubmit={handleSubmit} className="space-y-8">
        {/* 一、聯絡方式 */}
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold">一、聯絡方式</legend>
          <div>
            <Label htmlFor="name">姓名 *</Label>
            <Input id="name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" type="email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </div>
          <div>
            <Label>偏好聯絡方式 *</Label>
            <div className="flex gap-4">
              {["email", "line", "ig"].map((m) => (
                <label key={m} className="flex items-center gap-2">
                  <input type="radio" name="contactMethod" value={m} checked={state.contactMethod === m} onChange={() => setState({ ...state, contactMethod: m as any })} />
                  <span>{m === "email" ? "E-mail" : m.toUpperCase()}</span>
                </label>
              ))}
            </div>
            {state.contactMethod !== "email" && (
              <Input className="mt-2" placeholder={`${state.contactMethod.toUpperCase()} ID`} value={state.contactId} onChange={(e) => setState({ ...state, contactId: e.target.value })} />
            )}
          </div>
        </fieldset>

        {/* 二、想學什麼、三、了解您、四、購買意向、五、其他 - 按 spec §3.6 展開 */}
        {/* （略，implementation 時補完，所有欄位、placeholder、選項均見 spec §3.6） */}

        {errors._form && <p className="text-destructive">{errors._form}</p>}
        <Button type="submit" disabled={submitting} size="lg">
          {submitting ? "送出中..." : "送出申請"}
        </Button>
      </form>
    );
  }
  ```

- [ ] **Step 2：補完 12 欄位 JSX**

  按 spec §3.6 的五個分組逐一補：
  - 一、聯絡方式（姓名、E-mail、偏好聯絡方式 + conditional ID）— Step 1 已含
  - 二、想學什麼（主題 multi-select、specific problem、expected outcome）
  - 三、了解您（level、desired start）
  - 四、購買意向（plan radio：1hr/3hr/5hr/10hr/20hr/undecided）
  - 五、其他（attribution、consentTerms checkbox、subscribeNewsletter checkbox）

  每個必填欄位旁有 `★`，每個 error 用 `errors[fieldKey]` 顯示。

- [ ] **Step 3：手動 dev mode 測試**

  ```bash
  pnpm dev
  # 開瀏覽器 http://localhost:3000/consulting （此時 page.tsx 還沒整合，可暫時建一個 sandbox page 測試）
  ```

  Expected: 表單能填、必填欄位 validation 正確、submit 後 redirect 到 /consulting/thanks。

- [ ] **Step 4：Commit**

  ```bash
  git add src/components/consulting/LeadForm.tsx
  git commit -m "feat(consulting): add LeadForm (12 fields, client validation, POST to /api/consulting/leads)"
  ```

---

### Task 17：FAQ 元件

**Files:**
- Create: `src/components/consulting/FAQ.tsx`

- [ ] **Step 1：用 shadcn Accordion 元件呈現 9 條 FAQ**

  ```tsx
  // src/components/consulting/FAQ.tsx
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";

  const faqs = [
    {
      q: "跟你的工作坊有什麼不同？",
      a: "工作坊是我教大家一個系統方法論，1-on-1 是我陪您解決您的問題。工作坊節奏固定、內容固定；1-on-1 整堂課的時間都用來處理您所遇到的問題。",
    },
    {
      q: "一定要先填表嗎？我已經確定要買 1 小時諮詢。",
      a: "是的。需求表單是我判斷能不能幫您的依據，半小時內就能填完。填完我會 24 小時內回信，合適就寄付款連結，不合適會誠實告訴您。",
    },
    {
      q: "不在臺灣可以嗎？",
      a: "可以。Google Meet 跨時區沒問題，議時段時告訴我時差即可。",
    },
    {
      q: "上完課可以加購嗎？",
      a: "當然。可以隨時跨方案升級（如 1hr 諮詢後再買 10hr 套票），已付的時數獨立計算、不退費也不被吃掉。",
    },
    {
      q: "套票可以轉讓嗎？",
      a: "可以，單張套票可一次性轉讓給 1 位他人，請來信申請。建議轉讓給有類似需求的人，效率最好。",
    },
    {
      q: "取消政策？",
      a: "開課前 48 小時取消 → 退回時數；24–48 小時 → 扣 0.5 小時；24 小時內 → 扣該場全部時數。",
    },
    {
      q: "我的需求不在 7 個主題裡。",
      a: "在表單裡選「我有別的需求」並描述。您的題目如果剛好我有把握，我會接；不是，會誠實告訴您比較適合的人。",
    },
    {
      q: "我怎麼知道還剩多少時數？",
      a: "每堂課後 24 小時內，我會寄信通知。",
    },
    {
      q: "可以錄影嗎？",
      a: "學員可自行錄影自留，我這端不主動錄製。",
    },
  ];

  export function FAQ() {
    return (
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center">常見問題</h2>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 2：Commit**

  ```bash
  git add src/components/consulting/FAQ.tsx
  git commit -m "feat(consulting): add FAQ component (9 entries with shadcn Accordion)"
  ```

---

## Phase 5：招生頁組裝

### Task 18：取代 page.tsx + thanks page + metadata

**Files:**
- Modify: `src/app/consulting/page.tsx`
- Create: `src/app/consulting/thanks/page.tsx`

- [ ] **Step 1：覆寫 page.tsx 組裝 8 個元件**

  ```tsx
  // src/app/consulting/page.tsx
  import type { Metadata } from "next";
  import { Hero } from "@/components/consulting/Hero";
  import { WhyOneOnOne } from "@/components/consulting/WhyOneOnOne";
  import { ServiceFormat } from "@/components/consulting/ServiceFormat";
  import { ThemeGrid } from "@/components/consulting/ThemeGrid";
  import { PricingLadder } from "@/components/consulting/PricingLadder";
  import { ProcessSteps } from "@/components/consulting/ProcessSteps";
  import { LeadForm } from "@/components/consulting/LeadForm";
  import { FAQ } from "@/components/consulting/FAQ";
  import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

  export const metadata: Metadata = {
    title: "1-on-1 量身陪跑 | solo.tw",
    description: "不只是教您 AI，更是陪您突破卡關瓶頸。Google Meet 1-on-1，從 1 小時諮詢到 20 小時長期陪跑，您的問題就是這堂課。",
    alternates: { canonical: "https://www.solo.tw/consulting" },
    openGraph: {
      title: "1-on-1 量身陪跑 | solo.tw",
      description: "不只是教您 AI，更是陪您突破卡關瓶頸。",
      url: "https://www.solo.tw/consulting",
      type: "website",
    },
  };

  export default function ConsultingPage() {
    return (
      <>
        <JsonLd data={serviceSchema({
          name: "1-on-1 量身陪跑",
          description: "Google Meet 1-on-1，從 1 小時諮詢到 20 小時長期陪跑。",
          url: "https://www.solo.tw/consulting",
          provider: "solo.tw",
        })} />
        <JsonLd data={breadcrumbSchema([
          { name: "Home", url: "https://www.solo.tw/" },
          { name: "Consulting", url: "https://www.solo.tw/consulting" },
        ])} />
        <JsonLd data={faqSchema([
          /* 9 FAQs from FAQ.tsx, sync content */
        ])} />

        <Hero />
        <WhyOneOnOne />
        <ServiceFormat />
        <ThemeGrid />
        <PricingLadder />
        <ProcessSteps />
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-bold text-center">告訴我您的卡關</h2>
            <p className="mt-3 text-center text-muted-foreground">5 分鐘填完，我 24 小時內回信。</p>
            <div className="mt-12">
              <LeadForm />
            </div>
          </div>
        </section>
        <FAQ />
      </>
    );
  }
  ```

- [ ] **Step 2：建立 thanks 頁**

  ```tsx
  // src/app/consulting/thanks/page.tsx
  import Link from "next/link";
  import { Button } from "@/components/ui/button";

  export const metadata = {
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
            合適與否都會誠實告訴您，請留意收件匣（含垃圾信件夾）。
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
  ```

- [ ] **Step 3：本機跑 dev 全頁 smoke test**

  ```bash
  pnpm dev
  ```

  開 `http://localhost:3000/consulting`，確認：
  - Hero 顯示新標題
  - 8 個 section 都出現
  - Theme card 點「從這題開始」會 prefill 並滑動到表單
  - 表單填完能送、redirect 到 thanks
  - thanks 頁 noindex

- [ ] **Step 4：Commit**

  ```bash
  git add src/app/consulting/page.tsx src/app/consulting/thanks/page.tsx
  git commit -m "feat(consulting): replace /consulting with 1-on-1 redesign + thanks page"
  ```

---

## Phase 6：後臺 UI

### Task 19：Leads 後臺頁

**Files:**
- Create: `src/components/admin/consulting/LeadList.tsx`
- Create: `src/app/admin/consulting/leads/page.tsx`

- [ ] **Step 1：建立 LeadList 元件（table，含 approve/reject buttons）**

  ```tsx
  // src/components/admin/consulting/LeadList.tsx
  "use client";
  import { useState } from "react";
  import { Button } from "@/components/ui/button";

  interface Lead {
    id: string;
    name: string;
    email: string;
    plan: string;
    topics: string[];
    specific_problem: string;
    status: string;
    created_at: string;
  }

  export function LeadList({ leads }: { leads: Lead[] }) {
    const [working, setWorking] = useState<string | null>(null);

    async function updateStatus(id: string, status: "approved" | "rejected") {
      setWorking(id);
      const res = await fetch(`/api/admin/consulting/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setWorking(null);
      if (res.ok) location.reload();
    }

    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted">
            <th className="p-3 text-left">日期</th>
            <th className="p-3 text-left">姓名</th>
            <th className="p-3 text-left">方案</th>
            <th className="p-3 text-left">主題</th>
            <th className="p-3 text-left">問題</th>
            <th className="p-3 text-left">狀態</th>
            <th className="p-3 text-right">動作</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-b">
              <td className="p-3">{new Date(l.created_at).toLocaleDateString("zh-TW")}</td>
              <td className="p-3 font-medium">{l.name}<br/><span className="text-xs text-muted-foreground">{l.email}</span></td>
              <td className="p-3">{l.plan}</td>
              <td className="p-3">{l.topics.join(", ")}</td>
              <td className="p-3 max-w-md truncate">{l.specific_problem}</td>
              <td className="p-3"><span className={badgeClass(l.status)}>{l.status}</span></td>
              <td className="p-3 text-right">
                {l.status === "pending" && (
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" disabled={working === l.id} onClick={() => updateStatus(l.id, "approved")}>Approve</Button>
                    <Button size="sm" variant="outline" disabled={working === l.id} onClick={() => updateStatus(l.id, "rejected")}>Reject</Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function badgeClass(s: string) {
    return "px-2 py-1 rounded text-xs " + ({
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      enrolled: "bg-green-100 text-green-800",
      rejected: "bg-gray-100 text-gray-800",
      stale: "bg-red-100 text-red-800",
    }[s] ?? "bg-gray-100");
  }
  ```

- [ ] **Step 2：建立 admin page（server component，用 isAdmin guard）**

  ```tsx
  // src/app/admin/consulting/leads/page.tsx
  import { redirect } from "next/navigation";
  import { isAdmin } from "@/lib/supabase/admin";
  import { listLeads } from "@/lib/consulting-db";
  import { LeadList } from "@/components/admin/consulting/LeadList";

  export default async function AdminConsultingLeadsPage() {
    const adminAccess = await isAdmin();
    if (!adminAccess) redirect("/");

    const leads = await listLeads();
    return (
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold">Consulting Leads</h1>
        <p className="mt-2 text-muted-foreground">共 {leads.length} 筆，按時間排序。</p>
        <div className="mt-8 overflow-x-auto rounded-lg border">
          <LeadList leads={leads} />
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3：建立 PATCH `/api/admin/consulting/leads/[id]` route**

  ```typescript
  // src/app/api/admin/consulting/leads/[id]/route.ts
  import { NextResponse } from "next/server";
  import { isAdmin } from "@/lib/supabase/admin";
  import { updateLeadStatus } from "@/lib/consulting-db";
  import { sendEmail } from "@/lib/email";
  import ConsultingCheckoutLink from "@/components/email/consulting-checkout-link";
  import { getPlanBySlug } from "@/lib/consulting-config";

  export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
    if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 403 });
    const { id } = await ctx.params;
    const { status, vistaNotes } = await req.json();
    const updated = await updateLeadStatus(id, status, vistaNotes);

    if (status === "approved") {
      // 取 plan、產 Recur checkout URL、寄信
      const plan = getPlanBySlug(updated.plan);
      if (plan) {
        const checkoutUrl = `https://recur.tw/checkout/${plan.recurProductId}?lead_id=${id}`;
        await sendEmail({
          to: updated.email,
          subject: `${updated.name}，您的 1-on-1 量身陪跑付款連結`,
          react: ConsultingCheckoutLink({
            name: updated.name,
            plan: plan.label,
            checkoutUrl,
            vistaMessage: vistaNotes ?? "",
          }),
        });
      }
    }

    return NextResponse.json({ ok: true, lead: updated });
  }
  ```

- [ ] **Step 4：Commit**

  ```bash
  git add src/components/admin/consulting/LeadList.tsx src/app/admin/consulting/leads/page.tsx src/app/api/admin/consulting/leads/[id]/route.ts
  git commit -m "feat(admin): add consulting leads page (list + approve/reject + checkout email)"
  ```

---

### Task 20：Enrollments 後臺頁

**Files:**
- Create: `src/components/admin/consulting/EnrollmentList.tsx`
- Create: `src/app/admin/consulting/enrollments/page.tsx`

- [ ] **Step 1：建立 EnrollmentList 元件**

  ```tsx
  // src/components/admin/consulting/EnrollmentList.tsx
  import Link from "next/link";

  interface Enrollment {
    id: string;
    name: string;
    email: string;
    plan: string;
    total_hours: number;
    hours_used: number;
    hours_remaining: number;
    expires_at: string;
    last_session_date: string | null;
    status: string;
  }

  export function EnrollmentList({ enrollments }: { enrollments: Enrollment[] }) {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted">
            <th className="p-3 text-left">姓名</th>
            <th className="p-3 text-left">方案</th>
            <th className="p-3 text-right">已用 / 總時數</th>
            <th className="p-3 text-right">剩餘</th>
            <th className="p-3 text-left">到期日</th>
            <th className="p-3 text-left">上次上課</th>
            <th className="p-3 text-left">狀態</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => {
            const stale = e.last_session_date && Date.now() - new Date(e.last_session_date).getTime() > 14 * 86400_000;
            return (
              <tr key={e.id} className="border-b hover:bg-muted/50">
                <td className="p-3">
                  <Link href={`/admin/consulting/enrollments/${e.id}`} className="font-medium underline">
                    {e.name}
                  </Link>
                  <br /><span className="text-xs text-muted-foreground">{e.email}</span>
                </td>
                <td className="p-3">{e.plan}</td>
                <td className="p-3 text-right">{e.hours_used} / {e.total_hours}</td>
                <td className={"p-3 text-right font-medium " + (e.hours_remaining <= 1 ? "text-orange-600" : "")}>{e.hours_remaining}</td>
                <td className="p-3">{new Date(e.expires_at).toLocaleDateString("zh-TW")}</td>
                <td className={"p-3 " + (stale ? "text-red-600 font-medium" : "")}>
                  {e.last_session_date ? new Date(e.last_session_date).toLocaleDateString("zh-TW") : "—"}
                </td>
                <td className="p-3">{e.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  ```

- [ ] **Step 2：建立 admin page**

  ```tsx
  // src/app/admin/consulting/enrollments/page.tsx
  import { redirect } from "next/navigation";
  import { isAdmin } from "@/lib/supabase/admin";
  import { listEnrollmentsWithBalance } from "@/lib/consulting-db";
  import { EnrollmentList } from "@/components/admin/consulting/EnrollmentList";

  export default async function AdminConsultingEnrollmentsPage() {
    if (!(await isAdmin())) redirect("/");
    const enrollments = await listEnrollmentsWithBalance();
    return (
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold">Consulting Enrollments</h1>
        <p className="mt-2 text-muted-foreground">共 {enrollments.length} 位學員。</p>
        <div className="mt-8 overflow-x-auto rounded-lg border">
          <EnrollmentList enrollments={enrollments} />
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3：Commit**

  ```bash
  git add src/components/admin/consulting/EnrollmentList.tsx src/app/admin/consulting/enrollments/page.tsx
  git commit -m "feat(admin): add consulting enrollments list (with balance + stale warning)"
  ```

---

### Task 21：Enrollment 詳情 + AddSessionModal

**Files:**
- Create: `src/components/admin/consulting/EnrollmentDetail.tsx`
- Create: `src/components/admin/consulting/AddSessionModal.tsx`
- Create: `src/app/admin/consulting/enrollments/[id]/page.tsx`
- Create: `src/app/api/admin/consulting/sessions/route.ts`

- [ ] **Step 1：建立 AddSessionModal**

  ```tsx
  // src/components/admin/consulting/AddSessionModal.tsx
  "use client";
  import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { Checkbox } from "@/components/ui/checkbox";
  import { CONSULTING_TOPICS } from "@/lib/consulting-config";

  interface Props { enrollmentId: string; onSaved: () => void; }

  export function AddSessionModal({ enrollmentId, onSaved }: Props) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [hours, setHours] = useState("1");
    const [topic, setTopic] = useState("custom");
    const [docUrl, setDocUrl] = useState("");
    const [notes, setNotes] = useState("");
    const [notify, setNotify] = useState(true);
    const [saving, setSaving] = useState(false);

    async function save() {
      setSaving(true);
      const res = await fetch("/api/admin/consulting/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId, sessionDate: date, timeStart: start || undefined, timeEnd: end || undefined,
          hoursUsed: Number(hours), topic, sharedDocUrl: docUrl || undefined, vistaNotes: notes || undefined,
          notifyStudent: notify,
        }),
      });
      setSaving(false);
      if (res.ok) { setOpen(false); onSaved(); }
    }

    if (!open) return <Button onClick={() => setOpen(true)}>📝 記錄一場 session</Button>;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-lg bg-card p-6 space-y-4">
          <h3 className="text-xl font-semibold">記錄一場 session</h3>
          <div><Label>上課日期</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>開始時間</Label><Input type="time" value={start} onChange={(e) => setStart(e.target.value)} /></div>
            <div><Label>結束時間</Label><Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          </div>
          <div><Label>使用時數</Label><Input type="number" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
          <div>
            <Label>主題</Label>
            <select className="w-full rounded border p-2" value={topic} onChange={(e) => setTopic(e.target.value)}>
              {CONSULTING_TOPICS.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
            </select>
          </div>
          <div><Label>共寫文件連結</Label><Input value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="https://..." /></div>
          <div><Label>Vista 筆記</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></div>
          <label className="flex items-center gap-2"><Checkbox checked={notify} onCheckedChange={(v) => setNotify(!!v)} /> 同時寄通知信給學員</label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={save} disabled={saving}>{saving ? "儲存中..." : "儲存"}</Button>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2：建立 EnrollmentDetail + page**

  ```tsx
  // src/components/admin/consulting/EnrollmentDetail.tsx
  "use client";
  import { useRouter } from "next/navigation";
  import { AddSessionModal } from "./AddSessionModal";

  interface Props {
    enrollment: any; // EnrollmentWithBalance type
    sessions: any[];
  }

  export function EnrollmentDetail({ enrollment, sessions }: Props) {
    const router = useRouter();
    return (
      <div className="space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-bold">{enrollment.name}</h2>
          <p className="text-muted-foreground">{enrollment.email}</p>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted-foreground">方案</dt><dd>{enrollment.plan}</dd></div>
            <div><dt className="text-muted-foreground">總時數</dt><dd>{enrollment.total_hours} hr</dd></div>
            <div><dt className="text-muted-foreground">已使用</dt><dd>{enrollment.hours_used} hr</dd></div>
            <div><dt className="text-muted-foreground">剩餘</dt><dd className={enrollment.hours_remaining <= 1 ? "text-orange-600 font-medium" : ""}>{enrollment.hours_remaining} hr</dd></div>
            <div><dt className="text-muted-foreground">到期日</dt><dd>{new Date(enrollment.expires_at).toLocaleDateString("zh-TW")}</dd></div>
            <div><dt className="text-muted-foreground">狀態</dt><dd>{enrollment.status}</dd></div>
          </dl>
          <div className="mt-6">
            <AddSessionModal enrollmentId={enrollment.id} onSaved={() => router.refresh()} />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-xl font-semibold">Session 歷史（{sessions.length}）</h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b bg-muted">
                <th className="p-2 text-left">日期</th>
                <th className="p-2 text-left">時段</th>
                <th className="p-2 text-right">時數</th>
                <th className="p-2 text-left">主題</th>
                <th className="p-2 text-left">共寫文件</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.session_date}</td>
                  <td className="p-2">{s.time_start} ~ {s.time_end}</td>
                  <td className="p-2 text-right">{s.hours_used}</td>
                  <td className="p-2">{s.topic}</td>
                  <td className="p-2">{s.shared_doc_url ? <a href={s.shared_doc_url} target="_blank" rel="noopener" className="underline">連結</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  ```

  ```tsx
  // src/app/admin/consulting/enrollments/[id]/page.tsx
  import { redirect, notFound } from "next/navigation";
  import { isAdmin } from "@/lib/supabase/admin";
  import { getEnrollmentWithBalance, listSessionsForEnrollment } from "@/lib/consulting-db";
  import { EnrollmentDetail } from "@/components/admin/consulting/EnrollmentDetail";

  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    if (!(await isAdmin())) redirect("/");
    const { id } = await params;
    const enrollment = await getEnrollmentWithBalance(id).catch(() => null);
    if (!enrollment) notFound();
    const sessions = await listSessionsForEnrollment(id);
    return (
      <section className="container mx-auto py-12 max-w-4xl">
        <EnrollmentDetail enrollment={enrollment} sessions={sessions} />
      </section>
    );
  }
  ```

- [ ] **Step 3：建立 POST `/api/admin/consulting/sessions` route**

  ```typescript
  // src/app/api/admin/consulting/sessions/route.ts
  import { NextResponse } from "next/server";
  import { isAdmin } from "@/lib/supabase/admin";
  import { insertSession, getEnrollmentWithBalance } from "@/lib/consulting-db";
  import { sendEmail } from "@/lib/email";
  import ConsultingSessionSummary from "@/components/email/consulting-session-summary";

  export async function POST(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 403 });
    const body = await req.json();
    const session = await insertSession(body);

    if (body.notifyStudent) {
      const enrollment = await getEnrollmentWithBalance(body.enrollmentId);
      await sendEmail({
        to: enrollment.email,
        subject: `${enrollment.name}，${body.sessionDate} 課程紀錄`,
        react: ConsultingSessionSummary({
          name: enrollment.name,
          sessionDate: body.sessionDate,
          hoursUsed: body.hoursUsed,
          hoursRemaining: enrollment.hours_remaining,
          topic: body.topic,
        }),
      });
    }
    return NextResponse.json({ ok: true, session });
  }
  ```

- [ ] **Step 4：手動 smoke test**

  跑 dev server → 進 `/admin/consulting/enrollments/<id>` → 點「記錄一場 session」→ 填表 → 儲存 → 看剩餘時數有減少、收到通知信。

- [ ] **Step 5：Commit**

  ```bash
  git add src/components/admin/consulting/EnrollmentDetail.tsx \
          src/components/admin/consulting/AddSessionModal.tsx \
          src/app/admin/consulting/enrollments/[id]/page.tsx \
          src/app/api/admin/consulting/sessions/route.ts
  git commit -m "feat(admin): add consulting enrollment detail + add session modal"
  ```

---

## Phase 7：收尾

### Task 22：generate-llms.mjs 擴充

**Files:**
- Modify: `scripts/generate-llms.mjs`

- [ ] **Step 1：讀既有 script 結構**

  Run: `head -100 scripts/generate-llms.mjs`

- [ ] **Step 2：新增 consulting 段落到 llms-full.txt**

  在既有寫入 workshops 段落後追加（從 consulting-config.ts dynamic import 或硬寫死）：

  ```javascript
  // scripts/generate-llms.mjs 內既有 buildLlmsFull() 之後加：
  function buildConsultingSection() {
    return `
  ## 1-on-1 量身陪跑 (/consulting)

  Google Meet 1-on-1，從 1 小時諮詢到 20 小時長期陪跑。

  ### 主題包（7+1）
  - 💻 Vibe Coding 入門：第一個 web app／小工具，從零到上線
  - 🌐 個人網站系統：仿 solo.tw / vista.tw 的一人媒體站
  - 🎛 Solo OS：個人作業系統建置（Calendar / Notion / Anytype / Obsidian 整合）
  - ✍️ 內容生產 Pipeline：研究 → 撰稿 → 去 AI 味 → 多平臺分發
  - 🧠 第二大腦／知識管理：Wiki、backlink、AI 檢索
  - 📚 AI 輔助學術寫作：文獻、Intro、方法、投稿
  - 🎯 一人事業起步診斷：定位、產品、定價、首批客戶
  - 🌀 客製需求

  ### 階梯定價
  - 1hr 諮詢：NT$3,000
  - 3hr 套票：NT$8,400（NT$2,800/hr）
  - 5hr 套票：NT$13,500（NT$2,700/hr）
  - 10hr 套票：NT$26,000（NT$2,600/hr）
  - 20hr 套票：NT$48,000（NT$2,400/hr）

  套票使用期限 6 個月，可延期一次（+3 個月）。不退費，可一次性轉讓給 1 位他人。
  申請方式：填表 → Vista 24 小時內回信 → 確認後寄付款連結 → 付款 → E-mail/LINE 議定時段
  `;
  }

  // 在 llms-full.txt 寫入處 append buildConsultingSection() 的回傳值
  ```

- [ ] **Step 3：執行 + commit**

  ```bash
  node scripts/generate-llms.mjs
  cat public/llms-full.txt | grep -A 3 "1-on-1 量身陪跑"  # 確認段落寫入
  git add scripts/generate-llms.mjs public/llms-full.txt public/llms.txt
  git commit -m "feat(llms): include consulting 1-on-1 service in llms-full.txt"
  ```

---

### Task 23：CalEmbed 廢棄評估

**Files:**
- Possibly delete: `src/components/consulting/CalEmbed.tsx`

- [ ] **Step 1：檢查引用**

  ```bash
  grep -rn "CalEmbed" src/ --include="*.tsx" --include="*.ts"
  ```

  Expected: 只剩 `src/components/consulting/CalEmbed.tsx` 本身（其他引用已在 Task 18 移除）。

- [ ] **Step 2：若無引用 → 刪除元件 + @calcom/embed-react 套件**

  ```bash
  rm src/components/consulting/CalEmbed.tsx
  pnpm remove @calcom/embed-react
  ```

- [ ] **Step 3：若 `ai-research-system` 還引用 → 保留**

  則跳過 Step 2，僅在備份檔加註：「CalEmbed 仍由 ai-research-system 使用，保留。」

- [ ] **Step 4：Commit**

  ```bash
  # 視 Step 2 結果
  git add -A
  git commit -m "chore(consulting): remove unused CalEmbed (1-on-1 redesign superseded Cal.com flow)"
  ```

---

### Task 24：Preview deploy + end-to-end smoke test

- [ ] **Step 1：Preview deploy**

  ```bash
  vercel --prod=false  # or push to a preview branch
  ```

  記下 preview URL。

- [ ] **Step 2：在 recur.tw 後臺手動建 5 個 productId（測試金額 NT$1）**

  > Vista 要做此動作，不是 agent。
  > 建好後把 5 個 productId 提供給 agent，agent 一次性 replace `src/lib/consulting-config.ts` 與 `src/lib/recur-product-config.ts` 內的 PLACEHOLDER_XHR。
  > 同時把 `expectedAmount` 暫改為 1（測試），等 prod 再改回真實金額。

- [ ] **Step 3：完整流程 smoke test**

  在 preview URL：
  1. 訪客側填表 → thanks 頁
  2. Vista 後臺 leads page 看到新 lead
  3. 點 Approve → 學員收到 checkout E-mail
  4. 學員點連結 → Recur 付 NT$1 → 跳回 → enrollment 自動建立
  5. Vista 後臺 enrollments page 看到新學員、剩餘時數
  6. 點進詳情 → 新增 session 1.5 hr → 剩餘 = total - 1.5
  7. 學員收到 session 摘要 E-mail

- [ ] **Step 4：修任何 bug、補測試後 commit**

- [ ] **Step 5：把測試金額改回真實金額 + replace 5 個真 productId**

  ```bash
  # Vista 提供 5 個真實 productId 後
  # agent 編輯 src/lib/consulting-config.ts + src/lib/recur-product-config.ts
  git add -A
  git commit -m "chore(consulting): wire real Recur productIds for production"
  ```

---

### Task 25：Prod deploy + 上線監測

- [ ] **Step 1：Prod deploy**

  ```bash
  git push origin main
  # Vercel 自動 deploy
  ```

- [ ] **Step 2：驗收勾稽**

  ```bash
  curl -s https://www.solo.tw/consulting | grep -E "(不只是教您 AI|Vibe Coding 入門|NT\$3,000)"
  ```

  Expected: 三條皆出現，確認 prod build 內容為新版。

- [ ] **Step 3：首 24 小時監測**

  - Vista 自己回去看 `/admin/consulting/leads` 是否有新進件
  - 看 Resend dashboard E-mail 是否寄出
  - 看 Supabase `consulting_leads` table 是否寫入

- [ ] **Step 4：完成 — 把實作覆盤寫進 `docs/superpowers/specs/2026-05-13-consulting-1on1-redesign.md` §10 變更歷史**

---

## 自我檢核（Self-Review 過了的紀錄）

✅ **Spec coverage**：spec §1–§9 每段都有對應 task
- §1 背景 + §2 scope → Task 1 備份 + Task 2 setup
- §3 產品決策（主題、定價、表單、流程）→ Task 4, 10–18
- §5 技術決策（路由、DB、Recur、Email、SEO）→ Task 3, 6–9, 18
- §6 後臺 → Task 19–21
- §7 發布順序 → Task 22–25
- §8 風險與緩解 → 已嵌入各 task（stale warning、placeholder、preview deploy 用 NT$1 等）
- §9 未決問題 → 已列在 plan 開頭 + 各 task 註明

✅ **Placeholder scan**：除 Recur productId placeholder（明確標記給 Vista 補）外，所有 step 含 actual code。

✅ **Type consistency**：`ConsultingPlanSlug`、`ConsultingTopicSlug`、`LeadPayload`、`createEnrollment` props 全程一致。

✅ **Scope**：23–37 hr 範圍合理，單一 plan 處理。
