# 聯盟行銷分潤系統 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 讓 Vista 發給不同人／單位專屬代碼協助銷售課程，確實透過代碼帶入的已付款訂單依比例自動計算分潤，後台可管理代碼、檢視訂單與分潤、月結對帳匯出。

**Architecture:** 兩張新 Supabase 表（`affiliates` 代碼／`affiliate_referrals` 分潤 ledger）+ `course_enrollments.referral_code` 欄位。`?ref=` 連結經 middleware 寫 cookie 首觸歸因；報名時於 register API 驗證並落地代碼；Recur `order.paid` webhook 自動建立 pending 分潤、退款事件作廢。後台 `/admin/affiliates` 做 CRUD 與月結 CSV。

**Tech Stack:** Next.js 16 App Router、TypeScript、Supabase（Postgres，service role）、Recur webhook、vitest、Tailwind + 既有 `@/components/ui`。

## Global Constraints

- 用字：正體中文，一律用「臺」不用「台」；避免大陸用語（試點→試辦、批量→批次等）。
- 金額一律 NT$ 整數（`integer`）；分潤取整用 `Math.round`。
- 代碼正規化：`trim()` 後 `toUpperCase()`，DB 一律存大寫。
- 比例存小數 `numeric(5,4)`（0.2000 = 20%），約束 `0 < rate <= 1`。
- 後台所有頁面與 API 一律過既有 `isAdmin()`（`@/lib/supabase/admin`）；server 端 DB 寫入用 service role client `createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`。
- 本版不新增環境變數。
- webhook handler 任何錯誤只 `console.error`、不可 throw 到中斷主流程（沿用既有風格，webhook 永遠回 200）。
- 分潤狀態機：`pending → approved → paid`；任一狀態（除 void）→ `void`。報表計算一律排除 `void`。
- 歸因：首觸（cookie `solo_ref` 已存在不覆蓋），窗 30 天。
- 分潤計算基礎＝實付金額（webhook `data.amount`，缺值 fallback `enrollment.amount`）。

---

### Task 1: 資料庫 Migration

**Files:**
- Create: `supabase/migrations/20260620_affiliate_commission.sql`

**Interfaces:**
- Produces: 表 `affiliates`、`affiliate_referrals`，欄位 `course_enrollments.referral_code`。後續所有任務依賴這些 schema。

- [ ] **Step 1: 建立 migration 檔**

Create `supabase/migrations/20260620_affiliate_commission.sql`:

```sql
-- 聯盟行銷分潤系統
-- affiliates：夥伴／代碼；affiliate_referrals：分潤明細 ledger

create table if not exists affiliates (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  email text,
  commission_rate numeric(5,4) not null check (commission_rate > 0 and commission_rate <= 1),
  course_ids text[],
  status text not null default 'active',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_affiliates_code on affiliates(code);
create index if not exists idx_affiliates_status on affiliates(status);

alter table affiliates enable row level security;

create table if not exists affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references affiliates(id),
  enrollment_id uuid not null references course_enrollments(id),
  course_id text not null,
  order_amount integer not null,
  commission_rate numeric(5,4) not null,
  commission_amount integer not null,
  status text not null default 'pending',
  recur_order_id text,
  payout_note text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz,
  voided_at timestamptz
);

create unique index if not exists idx_affiliate_referrals_enrollment on affiliate_referrals(enrollment_id);
create index if not exists idx_affiliate_referrals_affiliate on affiliate_referrals(affiliate_id);
create index if not exists idx_affiliate_referrals_status on affiliate_referrals(status);
create index if not exists idx_affiliate_referrals_created on affiliate_referrals(created_at desc);
create index if not exists idx_affiliate_referrals_recur_order on affiliate_referrals(recur_order_id);

alter table affiliate_referrals enable row level security;

alter table course_enrollments add column if not exists referral_code text;
create index if not exists idx_course_enrollments_referral on course_enrollments(referral_code);
```

- [ ] **Step 2: 套用 migration 到 Supabase**

用專案既有的 migration 套用流程（Supabase CLI `supabase db push`，或在 Supabase SQL editor 貼上執行；與本資料夾其他 migration 一致）。

- [ ] **Step 3: 驗證 schema**

在 Supabase SQL editor 執行確認三者存在：

```sql
select column_name from information_schema.columns where table_name = 'affiliate_referrals' order by ordinal_position;
select column_name from information_schema.columns where table_name = 'course_enrollments' and column_name = 'referral_code';
```

Expected: `affiliate_referrals` 14 欄齊全；`referral_code` 一列。

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260620_affiliate_commission.sql
git commit -m "feat(db): 聯盟分潤系統 migration（affiliates / affiliate_referrals / referral_code）"
```

---

### Task 2: 分潤核心邏輯 lib（純函式 + 型別，TDD）

**Files:**
- Create: `src/lib/affiliates.ts`
- Test: `src/lib/affiliates.test.ts`

**Interfaces:**
- Produces:
  - `type AffiliateStatus = "active" | "disabled"`
  - `type ReferralStatus = "pending" | "approved" | "paid" | "void"`
  - `interface Affiliate`、`interface AffiliateReferral`（見下方程式碼，後續任務依賴這些欄位名）
  - `normalizeCode(raw: string): string`
  - `isCourseInScope(courseIds: string[] | null | undefined, courseSlug: string): boolean`
  - `computeCommission(orderAmount: number, rate: number): number`
  - `canTransitionReferral(from: ReferralStatus, to: ReferralStatus): boolean`

- [ ] **Step 1: 寫失敗測試**

Create `src/lib/affiliates.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  normalizeCode,
  isCourseInScope,
  computeCommission,
  canTransitionReferral,
} from "./affiliates";

describe("normalizeCode", () => {
  it("trims and uppercases", () => {
    expect(normalizeCode("  vista20 ")).toBe("VISTA20");
  });
  it("returns empty string for blank", () => {
    expect(normalizeCode("   ")).toBe("");
  });
});

describe("isCourseInScope", () => {
  it("null scope = all courses", () => {
    expect(isCourseInScope(null, "concept-monetization-bootcamp")).toBe(true);
  });
  it("empty scope = all courses", () => {
    expect(isCourseInScope([], "any-course")).toBe(true);
  });
  it("restricts to listed courses", () => {
    expect(isCourseInScope(["a", "b"], "b")).toBe(true);
    expect(isCourseInScope(["a", "b"], "c")).toBe(false);
  });
});

describe("computeCommission", () => {
  it("rounds to nearest integer", () => {
    expect(computeCommission(9999, 0.2)).toBe(2000); // 1999.8 → 2000
  });
  it("handles zero/negative amount", () => {
    expect(computeCommission(0, 0.2)).toBe(0);
    expect(computeCommission(-100, 0.2)).toBe(0);
  });
});

describe("canTransitionReferral", () => {
  it("allows the legal transitions", () => {
    expect(canTransitionReferral("pending", "approved")).toBe(true);
    expect(canTransitionReferral("approved", "paid")).toBe(true);
    expect(canTransitionReferral("pending", "void")).toBe(true);
    expect(canTransitionReferral("paid", "void")).toBe(true);
  });
  it("rejects illegal transitions", () => {
    expect(canTransitionReferral("pending", "paid")).toBe(false);
    expect(canTransitionReferral("void", "approved")).toBe(false);
    expect(canTransitionReferral("paid", "approved")).toBe(false);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test -- src/lib/affiliates.test.ts`
Expected: FAIL（`affiliates.ts` 尚未 export 這些函式 / 模組不存在）。

- [ ] **Step 3: 寫最小實作**

Create `src/lib/affiliates.ts`:

```ts
// 聯盟行銷分潤：核心型別與純函式。
// 注意：此檔同時含 server-only 的 DB 函式（後續任務追加），但純函式可在 vitest（node）匯入，
// 因此不要加 `import "server-only"`；DB 函式於呼叫時才讀環境變數。

export type AffiliateStatus = "active" | "disabled";
export type ReferralStatus = "pending" | "approved" | "paid" | "void";

export interface Affiliate {
  id: string;
  code: string;
  name: string;
  email: string | null;
  commission_rate: number; // 0..1
  course_ids: string[] | null;
  status: AffiliateStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  enrollment_id: string;
  course_id: string;
  order_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: ReferralStatus;
  recur_order_id: string | null;
  payout_note: string | null;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
  voided_at: string | null;
}

export function normalizeCode(raw: string): string {
  return (raw ?? "").trim().toUpperCase();
}

export function isCourseInScope(
  courseIds: string[] | null | undefined,
  courseSlug: string,
): boolean {
  if (!courseIds || courseIds.length === 0) return true;
  return courseIds.includes(courseSlug);
}

export function computeCommission(orderAmount: number, rate: number): number {
  if (!Number.isFinite(orderAmount) || orderAmount <= 0) return 0;
  return Math.round(orderAmount * rate);
}

const REFERRAL_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  pending: ["approved", "void"],
  approved: ["paid", "void"],
  paid: ["void"],
  void: [],
};

export function canTransitionReferral(
  from: ReferralStatus,
  to: ReferralStatus,
): boolean {
  return REFERRAL_TRANSITIONS[from]?.includes(to) ?? false;
}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npm test -- src/lib/affiliates.test.ts`
Expected: PASS（全部綠）。

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliates.ts src/lib/affiliates.test.ts
git commit -m "feat(affiliates): 分潤核心型別與純函式 + 單元測試"
```

---

### Task 3: middleware 寫入 `?ref` 首觸歸因 cookie

**Files:**
- Modify: `src/middleware.ts`

**Interfaces:**
- Produces: cookie `solo_ref`（httpOnly、sameSite=lax、path=/、maxAge 30 天），report 任務於 register API 讀取。

- [ ] **Step 1: 加入 captureReferral helper**

在 `src/middleware.ts` 的 `import` 之後、`middleware` 函式之前，新增：

```ts
const REF_COOKIE = "solo_ref";
const REF_MAX_AGE = 60 * 60 * 24 * 30; // 30 天

// 首觸歸因：只在 cookie 尚未存在且 URL 帶 ?ref= 時寫入；不覆蓋既有來源。
function captureReferral(request: NextRequest, response: NextResponse) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref) return;
  if (request.cookies.get(REF_COOKIE)) return;
  const code = ref.trim().toUpperCase();
  if (!code || code.length > 64) return;
  response.cookies.set(REF_COOKIE, code, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: REF_MAX_AGE,
  });
}
```

- [ ] **Step 2: 在公開路由與 auth 路由的 return 前呼叫**

修改 `src/middleware.ts`：

公開路由分支（目前是 `if (!needsAuth) { return NextResponse.next(); }`）改為：

```ts
  const needsAuth = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (!needsAuth) {
    const res = NextResponse.next();
    captureReferral(request, res);
    return res;
  }
```

auth 路由分支結尾（目前是 `return supabaseResponse;`）改為：

```ts
  captureReferral(request, supabaseResponse);
  return supabaseResponse;
```

> 課程頁 `/courses/...` 為公開路由，落在第一個分支；ref 連結即由此寫入 cookie。

- [ ] **Step 3: 型別檢查**

Run: `npx tsc --noEmit`
Expected: 無錯誤。

- [ ] **Step 4: 手動驗證 cookie 寫入**

啟動 `npm run dev`，另開終端：

```bash
curl -sI "http://localhost:3000/courses/concept-monetization-bootcamp?ref=test20" | grep -i set-cookie
```

Expected: 出現 `set-cookie: solo_ref=TEST20; ...`。再帶既有 cookie 重打應**不**再 set（首觸不覆蓋）：

```bash
curl -sI --cookie "solo_ref=KEEP" "http://localhost:3000/courses/concept-monetization-bootcamp?ref=other" | grep -i set-cookie || echo "no overwrite (correct)"
```

Expected: `no overwrite (correct)`。

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(affiliates): middleware 寫入 ?ref 首觸歸因 cookie"
```

---

### Task 4: register API 解析、驗證並落地 `referral_code`

**Files:**
- Modify: `src/lib/affiliates.ts`（追加 `findActiveAffiliateByCode`）
- Modify: `src/app/api/courses/register/route.ts`

**Interfaces:**
- Consumes: `normalizeCode`、`isCourseInScope`、`Affiliate`（Task 2）。
- Produces: `findActiveAffiliateByCode(rawCode: string, courseSlug: string): Promise<Affiliate | null>`；enrollment 落地 `referral_code` 欄位。

- [ ] **Step 1: 在 affiliates.ts 追加 service client 與查詢函式**

在 `src/lib/affiliates.ts` 末端追加：

```ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function svc(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** 依代碼找 active 且適用該課程的夥伴；查無或不適用回 null。 */
export async function findActiveAffiliateByCode(
  rawCode: string,
  courseSlug: string,
): Promise<Affiliate | null> {
  const code = normalizeCode(rawCode);
  if (!code) return null;
  const sb = svc();
  const { data, error } = await sb
    .from("affiliates")
    .select("*")
    .eq("code", code)
    .eq("status", "active")
    .maybeSingle();
  if (error) {
    console.error("[affiliates] findActiveAffiliateByCode error", error);
    return null;
  }
  if (!data) return null;
  if (!isCourseInScope(data.course_ids, courseSlug)) return null;
  return data as Affiliate;
}
```

> 將此 `import` 放檔案最上方與其他 import 一起亦可；放末端可運作但若 linter 要求 import 置頂，請移到頂部。

- [ ] **Step 2: register route 讀取並驗證代碼**

修改 `src/app/api/courses/register/route.ts`：

(a) 在最上方 import 區加入：

```ts
import { cookies } from "next/headers";
import { findActiveAffiliateByCode } from "@/lib/affiliates";
```

(b) `RegisterRequest` interface 加一欄：

```ts
  referralCode?: string;
```

(c) 在 `const supabase = createClient(...)` 之前，插入代碼解析：

```ts
  // 解析來源代碼：手動填的優先，否則讀 ?ref 寫入的 cookie
  const cookieStore = await cookies();
  const rawReferral =
    body.referralCode?.trim() || cookieStore.get("solo_ref")?.value || "";
  let referralCode: string | null = null;
  if (rawReferral) {
    const affiliate = await findActiveAffiliateByCode(rawReferral, course.slug);
    referralCode = affiliate ? affiliate.code : null;
  }
```

(d) 在 `.insert({ ... })` 物件內，於 `marketing_consent` 那行附近加入：

```ts
      referral_code: referralCode,
```

(e) 在回傳的 `metadata` 物件組裝處（`const metadata: Record<string, string> = {...}` 之後），附帶代碼以增韌性：

```ts
  if (referralCode) metadata.referral_code = referralCode;
```

- [ ] **Step 3: 型別檢查**

Run: `npx tsc --noEmit`
Expected: 無錯誤。

- [ ] **Step 4: 手動驗證三路徑**

先在 Supabase 插入一筆測試代碼：

```sql
insert into affiliates (code, name, commission_rate, status)
values ('TEST20', '測試夥伴', 0.2000, 'active');
```

啟動 `npm run dev`，用 curl 模擬報名（有效代碼）：

```bash
curl -s -X POST http://localhost:3000/api/courses/register \
  -H 'content-type: application/json' \
  -d '{"courseSlug":"concept-monetization-bootcamp","email":"t1@example.com","name":"測試","phone":"0912345678","referralCode":"test20"}'
```

Expected: 回 `{"ok":true,...}`。到 Supabase 查 `select referral_code from course_enrollments where email='t1@example.com'` → `TEST20`。

無效代碼（`referralCode":"NOPE"`，換 email t2）→ `referral_code` 應為 `null`，報名仍成功。

停用代碼測試：`update affiliates set status='disabled' where code='TEST20';` 再報名（t3）→ `referral_code` 為 `null`。測完還原 `status='active'`。

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliates.ts src/app/api/courses/register/route.ts
git commit -m "feat(affiliates): register API 驗證並落地 referral_code"
```

---

### Task 5: 報名表單新增「推薦代碼」選填欄位

**Files:**
- Modify: `src/app/courses/[course]/register/CourseRegistrationForm.tsx`

**Interfaces:**
- Consumes: register API 的 `referralCode` 欄位（Task 4）。

- [ ] **Step 1: FormState 與初始值加 referralCode**

在 `interface FormState` 加：

```ts
  referralCode: string;
```

在 `useState<FormState>({ ... })` 初始物件加：

```ts
    referralCode: "",
```

- [ ] **Step 2: 表單加入欄位 UI**

在「行銷同意（marketingConsent）」欄位附近、送出按鈕之前，加入一段（沿用既有 `Label` / `Input` / `update` 慣例）：

```tsx
        <div className="space-y-1.5">
          <Label htmlFor="referralCode">推薦代碼（選填）</Label>
          <Input
            id="referralCode"
            value={form.referralCode}
            onChange={(e) => update("referralCode", e.target.value)}
            placeholder="若有朋友／單位提供的推薦代碼，請填寫"
            autoCapitalize="characters"
          />
        </div>
```

- [ ] **Step 3: 送出時帶入 referralCode**

在 `handleSubmit` 內送往 `/api/courses/register` 的 JSON body 物件中，加入：

```ts
        referralCode: form.referralCode.trim() || undefined,
```

> 該 body 是組給 `fetch("/api/courses/register", ...)` 的物件；找到 `JSON.stringify({` 處加入此鍵。

- [ ] **Step 4: 型別檢查**

Run: `npx tsc --noEmit`
Expected: 無錯誤。

- [ ] **Step 5: 手動驗證**

`npm run dev` → 開 `http://localhost:3000/courses/concept-monetization-bootcamp/register` → 確認「推薦代碼（選填）」欄位出現、可輸入。填 `TEST20` 走一次（不付款也可，DB 應寫進 pending enrollment 的 `referral_code`）。

- [ ] **Step 6: Commit**

```bash
git add src/app/courses/[course]/register/CourseRegistrationForm.tsx
git commit -m "feat(affiliates): 報名表單新增推薦代碼選填欄位"
```

---

### Task 6: Recur webhook 自動建立分潤 + 退款作廢

**Files:**
- Modify: `src/lib/affiliates.ts`（追加 `recordCommissionForEnrollment`、`voidCommissionByOrderId`）
- Modify: `src/app/api/webhooks/recur/route.ts`

**Interfaces:**
- Consumes: `findActiveAffiliateByCode`、`computeCommission`（Task 2/4）。
- Produces:
  - `recordCommissionForEnrollment(params: { enrollmentId: string; orderId: string; orderAmount?: number }): Promise<void>`
  - `voidCommissionByOrderId(orderId: string): Promise<void>`

- [ ] **Step 1: affiliates.ts 追加分潤寫入與作廢**

在 `src/lib/affiliates.ts` 追加：

```ts
/** 付款成功後建立 pending 分潤；靠 enrollment_id unique index 冪等（重送不重複）。 */
export async function recordCommissionForEnrollment(params: {
  enrollmentId: string;
  orderId: string;
  orderAmount?: number;
}): Promise<void> {
  const sb = svc();
  const { data: enr, error } = await sb
    .from("course_enrollments")
    .select("id, course_id, referral_code, amount")
    .eq("id", params.enrollmentId)
    .maybeSingle();
  if (error || !enr) {
    console.error("[affiliates] load enrollment failed", error);
    return;
  }
  if (!enr.referral_code) return;
  const affiliate = await findActiveAffiliateByCode(
    enr.referral_code,
    enr.course_id,
  );
  if (!affiliate) {
    console.log("[affiliates] no active affiliate for", enr.referral_code);
    return;
  }
  const orderAmount =
    typeof params.orderAmount === "number" ? params.orderAmount : enr.amount ?? 0;
  const commission = computeCommission(orderAmount, affiliate.commission_rate);
  const { error: insErr } = await sb.from("affiliate_referrals").upsert(
    {
      affiliate_id: affiliate.id,
      enrollment_id: enr.id,
      course_id: enr.course_id,
      order_amount: orderAmount,
      commission_rate: affiliate.commission_rate,
      commission_amount: commission,
      status: "pending",
      recur_order_id: params.orderId,
    },
    { onConflict: "enrollment_id", ignoreDuplicates: true },
  );
  if (insErr) console.error("[affiliates] insert referral failed", insErr);
}

/** 退款／取消：把該訂單對應的分潤標 void（排除已 void）。 */
export async function voidCommissionByOrderId(orderId: string): Promise<void> {
  if (!orderId) return;
  const sb = svc();
  const { error } = await sb
    .from("affiliate_referrals")
    .update({ status: "void", voided_at: new Date().toISOString() })
    .eq("recur_order_id", orderId)
    .neq("status", "void");
  if (error) console.error("[affiliates] void by order failed", error);
}
```

- [ ] **Step 2: webhook 在標記 paid 後建立分潤**

修改 `src/app/api/webhooks/recur/route.ts`：

(a) import 區加入：

```ts
import {
  recordCommissionForEnrollment,
  voidCommissionByOrderId,
} from "@/lib/affiliates";
```

(b) 在 `handleOrderPaid` 內，`markEnrollmentPaid({...})` 呼叫之後（`if (enrollmentId) { await markEnrollmentPaid(...) }` 區塊內），緊接著加入：

```ts
    await recordCommissionForEnrollment({
      enrollmentId,
      orderId,
      orderAmount: amount,
    });
```

> 位置：在 `markEnrollmentPaid` 成功呼叫後、同一個 `if (enrollmentId)` 區塊內。`orderId` 與 `amount` 在 `handleOrderPaid` 範圍內已存在。

- [ ] **Step 3: webhook 接退款事件作廢**

在 `POST` 的事件分派 `if (event.type === "order.paid") {...} else if (...) {...}` 鏈中，於 `checkout.completed` 分支之前加入：

```ts
    } else if (
      event.type === "order.refunded" ||
      event.type === "order.cancelled"
    ) {
      const data = event.data as unknown as OrderPaidData;
      await voidCommissionByOrderId(data.id);
      console.log("[recur webhook] referral voided for", event.type, data.id);
```

> 註：Recur 實際退款事件型別需於實作時以 `mcp__recur__get_webhook_event_types` 或 Recur 文件確認；若名稱不同，替換上面兩個字串。若 Recur 完全不推退款事件，本分支留著無害，作廢改由 Task 8 後台手動按鈕完成。

- [ ] **Step 4: 型別檢查**

Run: `npx tsc --noEmit`
Expected: 無錯誤。

- [ ] **Step 5: 手動／sandbox 驗證**

確保 Task 4 的測試代碼 `TEST20`（active）存在。用 Recur sandbox 走一次 `concept-monetization-bootcamp` 報名（帶 `?ref=test20` 或表單填 `TEST20`）→ 完成付款。確認：

```sql
select status, order_amount, commission_rate, commission_amount, recur_order_id
from affiliate_referrals order by created_at desc limit 1;
```

Expected: 一筆 `status='pending'`，`commission_amount = round(order_amount * 0.2)`。

冪等驗證：在 Recur 後台重送同一筆 `order.paid` webhook → 上面查詢仍只有一筆（不重複）。

- [ ] **Step 6: Commit**

```bash
git add src/lib/affiliates.ts src/app/api/webhooks/recur/route.ts
git commit -m "feat(affiliates): webhook order.paid 建立分潤 + 退款作廢"
```

---

### Task 7: 後台讀取 helper + 列表頁 + 明細頁

**Files:**
- Modify: `src/lib/affiliates.ts`（追加讀取 helper）
- Create: `src/app/admin/affiliates/page.tsx`
- Create: `src/app/admin/affiliates/[id]/page.tsx`

**Interfaces:**
- Consumes: `Affiliate`、`AffiliateReferral`（Task 2）、`isAdmin`（既有）。
- Produces:
  - `interface AffiliateWithTotals extends Affiliate { referral_count; pending_amount; approved_amount; paid_amount }`
  - `interface ReferralRow extends AffiliateReferral { enrollment_email: string | null; enrollment_name: string | null }`
  - `listAffiliatesWithTotals(): Promise<AffiliateWithTotals[]>`
  - `getAffiliate(id: string): Promise<Affiliate | null>`
  - `getReferralsForAffiliate(affiliateId: string): Promise<ReferralRow[]>`

- [ ] **Step 1: affiliates.ts 追加讀取 helper**

```ts
export interface AffiliateWithTotals extends Affiliate {
  referral_count: number;
  pending_amount: number;
  approved_amount: number;
  paid_amount: number;
}

export interface ReferralRow extends AffiliateReferral {
  enrollment_email: string | null;
  enrollment_name: string | null;
}

export async function listAffiliatesWithTotals(): Promise<AffiliateWithTotals[]> {
  const sb = svc();
  const { data: affs } = await sb
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: refs } = await sb
    .from("affiliate_referrals")
    .select("affiliate_id, status, commission_amount");
  const totals: Record<
    string,
    { count: number; pending: number; approved: number; paid: number }
  > = {};
  (refs ?? []).forEach((r) => {
    if (r.status === "void") return;
    const t = (totals[r.affiliate_id] ??= {
      count: 0,
      pending: 0,
      approved: 0,
      paid: 0,
    });
    t.count++;
    if (r.status === "pending") t.pending += r.commission_amount;
    else if (r.status === "approved") t.approved += r.commission_amount;
    else if (r.status === "paid") t.paid += r.commission_amount;
  });
  return (affs ?? []).map((a) => ({
    ...(a as Affiliate),
    referral_count: totals[a.id]?.count ?? 0,
    pending_amount: totals[a.id]?.pending ?? 0,
    approved_amount: totals[a.id]?.approved ?? 0,
    paid_amount: totals[a.id]?.paid ?? 0,
  }));
}

export async function getAffiliate(id: string): Promise<Affiliate | null> {
  const sb = svc();
  const { data } = await sb.from("affiliates").select("*").eq("id", id).maybeSingle();
  return (data as Affiliate) ?? null;
}

export async function getReferralsForAffiliate(
  affiliateId: string,
): Promise<ReferralRow[]> {
  const sb = svc();
  const { data } = await sb
    .from("affiliate_referrals")
    .select("*, course_enrollments(email, name)")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => {
    const enr = (r as { course_enrollments?: { email?: string; name?: string } })
      .course_enrollments;
    return {
      ...(r as AffiliateReferral),
      enrollment_email: enr?.email ?? null,
      enrollment_name: enr?.name ?? null,
    };
  });
}
```

- [ ] **Step 2: 列表頁**

Create `src/app/admin/affiliates/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/supabase/admin";
import { listAffiliatesWithTotals } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "聯盟分潤 | 後台",
  robots: { index: false, follow: false },
};

function ntd(n: number): string {
  return `NT$${n.toLocaleString()}`;
}

export default async function AdminAffiliatesPage() {
  if (!(await isAdmin())) redirect("/");
  const affiliates = await listAffiliatesWithTotals();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">聯盟分潤代碼</h1>
        <Link
          href="/admin/affiliates/new"
          className="rounded bg-stone-900 px-4 py-2 text-sm text-white"
        >
          新增代碼
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b text-left text-stone-500">
          <tr>
            <th className="py-2">代碼</th>
            <th>夥伴</th>
            <th>比例</th>
            <th>狀態</th>
            <th className="text-right">帶單</th>
            <th className="text-right">待結算</th>
            <th className="text-right">已核准</th>
            <th className="text-right">已付款</th>
          </tr>
        </thead>
        <tbody>
          {affiliates.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-2 font-mono">
                <Link href={`/admin/affiliates/${a.id}`} className="underline">
                  {a.code}
                </Link>
              </td>
              <td>{a.name}</td>
              <td>{Math.round(a.commission_rate * 100)}%</td>
              <td>{a.status === "active" ? "啟用" : "停用"}</td>
              <td className="text-right">{a.referral_count}</td>
              <td className="text-right">{ntd(a.pending_amount)}</td>
              <td className="text-right">{ntd(a.approved_amount)}</td>
              <td className="text-right">{ntd(a.paid_amount)}</td>
            </tr>
          ))}
          {affiliates.length === 0 && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-stone-400">
                尚無代碼，點右上「新增代碼」建立。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: 明細頁**

Create `src/app/admin/affiliates/[id]/page.tsx`:

```tsx
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/supabase/admin";
import { getAffiliate, getReferralsForAffiliate } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "聯盟夥伴明細 | 後台",
  robots: { index: false, follow: false },
};

function ntd(n: number): string {
  return `NT$${n.toLocaleString()}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Taipei",
  }).format(new Date(iso));
}

const STATUS_LABEL: Record<string, string> = {
  pending: "待結算",
  approved: "已核准",
  paid: "已付款",
  void: "作廢",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AffiliateDetailPage({ params }: PageProps) {
  if (!(await isAdmin())) redirect("/");
  const { id } = await params;
  const affiliate = await getAffiliate(id);
  if (!affiliate) notFound();
  const referrals = await getReferralsForAffiliate(id);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-1 text-2xl font-bold">
        {affiliate.name}（<span className="font-mono">{affiliate.code}</span>）
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        比例 {Math.round(affiliate.commission_rate * 100)}%・
        {affiliate.status === "active" ? "啟用中" : "已停用"}・
        {affiliate.email ?? "（無聯絡 email）"}
      </p>

      <table className="w-full text-sm">
        <thead className="border-b text-left text-stone-500">
          <tr>
            <th className="py-2">日期</th>
            <th>課程</th>
            <th>學員</th>
            <th className="text-right">實付</th>
            <th className="text-right">分潤</th>
            <th>狀態</th>
            <th>Recur 訂單</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{fmtDate(r.created_at)}</td>
              <td>{r.course_id}</td>
              <td>{r.enrollment_email ?? "—"}</td>
              <td className="text-right">{ntd(r.order_amount)}</td>
              <td className="text-right">{ntd(r.commission_amount)}</td>
              <td>{STATUS_LABEL[r.status] ?? r.status}</td>
              <td className="font-mono text-xs">{r.recur_order_id ?? "—"}</td>
            </tr>
          ))}
          {referrals.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-stone-400">
                尚無帶單紀錄。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: 型別檢查 + 視覺驗證**

Run: `npx tsc --noEmit`（無錯誤）。`npm run dev` → 以 admin 帳號登入 → 開 `http://localhost:3000/admin/affiliates` 看到 `TEST20` 列；點進去看到明細頁（Task 6 的 sandbox 分潤應出現）。

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliates.ts src/app/admin/affiliates/page.tsx "src/app/admin/affiliates/[id]/page.tsx"
git commit -m "feat(affiliates): 後台代碼列表頁與夥伴明細頁"
```

---

### Task 8: 後台寫入 API（建立／更新代碼、更新分潤狀態）+ 表單與操作 UI

**Files:**
- Modify: `src/lib/affiliates.ts`（追加 `createAffiliate`、`updateAffiliate`、`updateReferralStatus`）
- Create: `src/app/api/admin/affiliates/route.ts`（POST 建立）
- Create: `src/app/api/admin/affiliates/[id]/route.ts`（PATCH 更新代碼）
- Create: `src/app/api/admin/affiliates/referrals/[id]/route.ts`（PATCH 更新分潤狀態）
- Create: `src/app/admin/affiliates/new/page.tsx`（新增代碼表單）
- Create: `src/app/admin/affiliates/AffiliateForm.tsx`（client 表單組件）
- Create: `src/app/admin/affiliates/[id]/ReferralActions.tsx`（client：核准／付款／作廢按鈕）
- Modify: `src/app/admin/affiliates/[id]/page.tsx`（每列接入 ReferralActions）

**Interfaces:**
- Consumes: `canTransitionReferral`、`normalizeCode`、`isAdmin`、`AffiliateWithTotals`/`ReferralRow`（前面任務）。
- Produces:
  - `createAffiliate(input: { code; name; email?; commissionRate: number; courseIds?: string[]; note?: string }): Promise<{ ok: boolean; error?: string; id?: string }>`
  - `updateAffiliate(id: string, patch: Partial<{ name; email; commission_rate; course_ids; status; note }>): Promise<{ ok: boolean; error?: string }>`
  - `updateReferralStatus(id: string, to: ReferralStatus, payoutNote?: string): Promise<{ ok: boolean; error?: string }>`

- [ ] **Step 1: affiliates.ts 追加寫入 helper**

```ts
export async function createAffiliate(input: {
  code: string;
  name: string;
  email?: string;
  commissionRate: number; // 0..1
  courseIds?: string[];
  note?: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const code = normalizeCode(input.code);
  if (!code) return { ok: false, error: "代碼不可空白" };
  if (!input.name?.trim()) return { ok: false, error: "夥伴名稱必填" };
  if (!(input.commissionRate > 0 && input.commissionRate <= 1)) {
    return { ok: false, error: "比例需介於 0 與 100% 之間" };
  }
  const sb = svc();
  const { data, error } = await sb
    .from("affiliates")
    .insert({
      code,
      name: input.name.trim(),
      email: input.email?.trim() || null,
      commission_rate: input.commissionRate,
      course_ids: input.courseIds && input.courseIds.length ? input.courseIds : null,
      note: input.note?.trim() || null,
      status: "active",
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return { ok: false, error: "此代碼已存在" };
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function updateAffiliate(
  id: string,
  patch: Partial<{
    name: string;
    email: string | null;
    commission_rate: number;
    course_ids: string[] | null;
    status: AffiliateStatus;
    note: string | null;
  }>,
): Promise<{ ok: boolean; error?: string }> {
  const sb = svc();
  const { error } = await sb
    .from("affiliates")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateReferralStatus(
  id: string,
  to: ReferralStatus,
  payoutNote?: string,
): Promise<{ ok: boolean; error?: string }> {
  const sb = svc();
  const { data: cur } = await sb
    .from("affiliate_referrals")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (!cur) return { ok: false, error: "找不到此分潤紀錄" };
  if (!canTransitionReferral(cur.status as ReferralStatus, to)) {
    return { ok: false, error: `不允許由 ${cur.status} 轉為 ${to}` };
  }
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status: to };
  if (to === "approved") patch.approved_at = now;
  if (to === "paid") {
    patch.paid_at = now;
    if (payoutNote?.trim()) patch.payout_note = payoutNote.trim();
  }
  if (to === "void") patch.voided_at = now;
  const { error } = await sb.from("affiliate_referrals").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
```

- [ ] **Step 2: 建立代碼 API**

Create `src/app/api/admin/affiliates/route.ts`:

```ts
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { createAffiliate } from "@/lib/affiliates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const result = await createAffiliate({
    code: body.code,
    name: body.name,
    email: body.email,
    commissionRate: Number(body.commissionRate),
    courseIds: Array.isArray(body.courseIds) ? body.courseIds : undefined,
    note: body.note,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, id: result.id });
}
```

- [ ] **Step 3: 更新代碼 API**

Create `src/app/api/admin/affiliates/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { updateAffiliate } from "@/lib/affiliates";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) patch.name = String(body.name).trim();
  if (body.email !== undefined) patch.email = body.email?.trim() || null;
  if (body.commissionRate !== undefined)
    patch.commission_rate = Number(body.commissionRate);
  if (body.courseIds !== undefined)
    patch.course_ids =
      Array.isArray(body.courseIds) && body.courseIds.length ? body.courseIds : null;
  if (body.status !== undefined) patch.status = body.status;
  if (body.note !== undefined) patch.note = body.note?.trim() || null;
  const result = await updateAffiliate(id, patch);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: 更新分潤狀態 API**

Create `src/app/api/admin/affiliates/referrals/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { updateReferralStatus, type ReferralStatus } from "@/lib/affiliates";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const to = body?.status as ReferralStatus | undefined;
  if (!to) return NextResponse.json({ error: "Missing status" }, { status: 400 });
  const result = await updateReferralStatus(id, to, body?.payoutNote);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 5: 新增代碼表單組件**

Create `src/app/admin/affiliates/AffiliateForm.tsx`:

```tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AffiliateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    email: "",
    percent: "20",
    courseIds: "",
    note: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const percentNum = Number(form.percent);
    if (!(percentNum > 0 && percentNum <= 100)) {
      setError("比例需介於 1 與 100 之間");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          email: form.email || undefined,
          commissionRate: percentNum / 100,
          courseIds: form.courseIds
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          note: form.note || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "建立失敗");
        return;
      }
      router.push("/admin/affiliates");
      router.refresh();
    });
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <label className="block">
        <span className="text-sm">代碼（自動轉大寫）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.code}
          onChange={(e) => set("code", e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm">夥伴／單位名稱</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm">聯絡 email（出款用，選填）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-sm">分潤比例（%）</span>
        <input
          type="number"
          min={1}
          max={100}
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.percent}
          onChange={(e) => set("percent", e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm">適用課程 slug（逗號分隔，留空＝全站）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.courseIds}
          onChange={(e) => set("courseIds", e.target.value)}
          placeholder="concept-monetization-bootcamp"
        />
      </label>
      <label className="block">
        <span className="text-sm">備註（選填）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? "建立中…" : "建立代碼"}
      </button>
    </form>
  );
}
```

- [ ] **Step 6: 新增代碼頁**

Create `src/app/admin/affiliates/new/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/supabase/admin";
import { AffiliateForm } from "../AffiliateForm";

export const metadata: Metadata = {
  title: "新增聯盟代碼 | 後台",
  robots: { index: false, follow: false },
};

export default async function NewAffiliatePage() {
  if (!(await isAdmin())) redirect("/");
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">新增聯盟代碼</h1>
      <AffiliateForm />
    </div>
  );
}
```

- [ ] **Step 7: 分潤操作按鈕組件**

Create `src/app/admin/affiliates/[id]/ReferralActions.tsx`:

```tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ReferralActions({
  referralId,
  status,
}: {
  referralId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const move = (to: string) => {
    if (to === "void" && !confirm("確定作廢這筆分潤？")) return;
    let payoutNote: string | undefined;
    if (to === "paid") {
      payoutNote = prompt("出款備註（轉帳日期／方式，選填）") ?? undefined;
    }
    startTransition(async () => {
      const res = await fetch(`/api/admin/affiliates/referrals/${referralId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: to, payoutNote }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error ?? "操作失敗");
        return;
      }
      router.refresh();
    });
  };

  return (
    <span className="flex gap-2">
      {status === "pending" && (
        <button
          disabled={pending}
          onClick={() => move("approved")}
          className="text-emerald-700 underline disabled:opacity-50"
        >
          核准
        </button>
      )}
      {status === "approved" && (
        <button
          disabled={pending}
          onClick={() => move("paid")}
          className="text-emerald-700 underline disabled:opacity-50"
        >
          標已付
        </button>
      )}
      {status !== "void" && status !== "paid" && (
        <button
          disabled={pending}
          onClick={() => move("void")}
          className="text-rose-600 underline disabled:opacity-50"
        >
          作廢
        </button>
      )}
    </span>
  );
}
```

- [ ] **Step 8: 明細頁每列接入操作**

修改 `src/app/admin/affiliates/[id]/page.tsx`：在頂部 import 加 `import { ReferralActions } from "./ReferralActions";`，並在表頭加一欄 `<th>操作</th>`（放在「Recur 訂單」之後），每列加：

```tsx
              <td>
                <ReferralActions referralId={r.id} status={r.status} />
              </td>
```

同步把空列 `colSpan={7}` 改為 `colSpan={8}`。

- [ ] **Step 9: 型別檢查 + 手動驗證**

Run: `npx tsc --noEmit`（無錯誤）。`npm run dev`，admin 登入：
- 開 `/admin/affiliates/new` → 建一個代碼 `PARTNER15`、15%、適用課程留空 → 送出後導回列表，看到該列。
- 進有分潤的夥伴明細頁 → 對 pending 那筆按「核准」→ 變已核准；按「標已付」填備註 → 變已付款；列表頁對應金額欄位跟著移動。
- 對已付款那筆嘗試非法轉移（無按鈕可點，API 端 `canTransitionReferral` 亦會擋）。

- [ ] **Step 10: Commit**

```bash
git add src/lib/affiliates.ts "src/app/api/admin/affiliates" "src/app/admin/affiliates"
git commit -m "feat(affiliates): 後台建立/更新代碼 API 與分潤狀態操作 UI"
```

---

### Task 9: 月結對帳單 CSV 匯出

**Files:**
- Modify: `src/lib/affiliates.ts`（追加 `getMonthlyReferrals`）
- Create: `src/app/api/admin/affiliates/[id]/export/route.ts`
- Modify: `src/app/admin/affiliates/[id]/page.tsx`（加月份選擇 + 匯出連結）

**Interfaces:**
- Consumes: `getAffiliate`、`ReferralRow`（Task 7）。
- Produces: `getMonthlyReferrals(affiliateId: string, month: string): Promise<ReferralRow[]>`（month 格式 `YYYY-MM`，以 Asia/Taipei 月界）。

- [ ] **Step 1: affiliates.ts 追加月度查詢**

```ts
/** 取某夥伴某月（YYYY-MM，台北時區月界）的分潤明細，排除 void。 */
export async function getMonthlyReferrals(
  affiliateId: string,
  month: string,
): Promise<ReferralRow[]> {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return [];
  const year = Number(m[1]);
  const mon = Number(m[2]); // 1-12
  // 台北 (UTC+8) 月界換算成 UTC：當月 1 日 00:00 +08:00 = 前一日 16:00 UTC
  const startUtc = new Date(Date.UTC(year, mon - 1, 1, -8, 0, 0)).toISOString();
  const endUtc = new Date(Date.UTC(year, mon, 1, -8, 0, 0)).toISOString();
  const sb = svc();
  const { data } = await sb
    .from("affiliate_referrals")
    .select("*, course_enrollments(email, name)")
    .eq("affiliate_id", affiliateId)
    .neq("status", "void")
    .gte("created_at", startUtc)
    .lt("created_at", endUtc)
    .order("created_at", { ascending: true });
  return (data ?? []).map((r) => {
    const enr = (r as { course_enrollments?: { email?: string; name?: string } })
      .course_enrollments;
    return {
      ...(r as AffiliateReferral),
      enrollment_email: enr?.email ?? null,
      enrollment_name: enr?.name ?? null,
    };
  });
}
```

- [ ] **Step 2: 匯出 route**

Create `src/app/api/admin/affiliates/[id]/export/route.ts`:

```ts
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { getAffiliate, getMonthlyReferrals } from "@/lib/affiliates";

export const runtime = "nodejs";

const STATUS_LABEL: Record<string, string> = {
  pending: "待結算",
  approved: "已核准",
  paid: "已付款",
};

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Taipei",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "month 需為 YYYY-MM" }, { status: 400 });
  }
  const affiliate = await getAffiliate(id);
  if (!affiliate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const rows = await getMonthlyReferrals(id, month);

  const header = ["日期", "課程", "學員 Email", "實付金額", "比例", "分潤金額", "狀態"];
  const lines = rows.map((r) =>
    [
      fmtDate(r.created_at),
      r.course_id,
      r.enrollment_email ?? "",
      r.order_amount,
      `${Math.round(r.commission_rate * 100)}%`,
      r.commission_amount,
      STATUS_LABEL[r.status] ?? r.status,
    ]
      .map(escapeCsv)
      .join(","),
  );
  const total = rows.reduce((sum, r) => sum + r.commission_amount, 0);
  const totalLine = ["合計", "", "", "", "", total, ""].map(escapeCsv).join(",");

  const csv = `﻿${header.map(escapeCsv).join(",")}\n${lines.join("\n")}\n${totalLine}`;
  const filename = `affiliate_${affiliate.code}_${month}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
```

- [ ] **Step 3: 明細頁加月份選擇 + 匯出連結**

修改 `src/app/admin/affiliates/[id]/page.tsx`：

(a) `PageProps` 改為同時接 searchParams：

```tsx
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}
```

(b) 函式簽名與取值：

```tsx
export default async function AffiliateDetailPage({ params, searchParams }: PageProps) {
  if (!(await isAdmin())) redirect("/");
  const { id } = await params;
  const { month } = await searchParams;
```

(c) 在夥伴資訊段落（`<p>` 之後、表格之前）插入月份選單與匯出按鈕：

```tsx
      <form className="mb-4 flex items-center gap-2" action={`/admin/affiliates/${affiliate.id}`}>
        <input
          type="month"
          name="month"
          defaultValue={month ?? ""}
          className="rounded border px-2 py-1 text-sm"
        />
        <button type="submit" className="rounded border px-3 py-1 text-sm">
          套用月份
        </button>
        {month && (
          <a
            href={`/api/admin/affiliates/${affiliate.id}/export?month=${month}`}
            className="rounded bg-stone-900 px-3 py-1 text-sm text-white"
          >
            匯出 {month} 對帳單
          </a>
        )}
      </form>
```

> 此 `<form>` 用 GET 把 `?month=` 帶回同頁；匯出連結僅在已選月份時顯示。明細表格本身仍顯示全部紀錄（月份只控制匯出）。

- [ ] **Step 4: 型別檢查 + 手動驗證**

Run: `npx tsc --noEmit`（無錯誤）。`npm run dev`，admin 登入 → 進有分潤的夥伴明細頁 → 選一個有資料的月份 → 點「匯出對帳單」→ 下載 CSV，用 Excel 開確認：中文不亂碼、欄位齊全、最後一列「合計」金額正確、不含 void。

- [ ] **Step 5: Commit**

```bash
git add src/lib/affiliates.ts "src/app/api/admin/affiliates/[id]/export" "src/app/admin/affiliates/[id]/page.tsx"
git commit -m "feat(affiliates): 月結對帳單 CSV 匯出"
```

---

## 上線（全部任務完成後）

1. 確認 migration 已套用到 production Supabase。
2. 依專案既有流程部署（Vercel）。
3. 後台 `/admin/affiliates/new` 建立首批正式代碼，適用課程填 `concept-monetization-bootcamp`（或留空全站）。
4. 用 Recur sandbox 走一次完整 `?ref=` → 報名 → 付款 → 後台出現 pending 分潤 → 核准 → 標已付 → 匯出對帳單，全綠後再對外發代碼。

## Self-Review 對照（spec → task）

- 資料模型（spec §3）→ Task 1 ✅
- 核心邏輯／狀態機（spec §8）→ Task 2 ✅
- `?ref` cookie 首觸歸因（spec §4.1）→ Task 3 ✅
- register 驗證落地（spec §4.3）→ Task 4 ✅
- 表單手動補填（spec §4.2）→ Task 5 ✅
- webhook 自動分潤 + 退款作廢（spec §5、§6）→ Task 6 ✅
- 後台列表／明細（spec §7.1、§7.3）→ Task 7 ✅
- 新增/編輯代碼、分潤狀態操作（spec §7.2、§7.5）→ Task 8 ✅
- 月結 CSV 匯出（spec §7.4）→ Task 9 ✅
- 安全 isAdmin/RLS（spec §10）→ 貫穿 Task 7-9 + Global Constraints ✅
