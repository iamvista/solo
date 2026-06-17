# 作者專屬頁（Instructor Author Page）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 solo.tw 建立可重用、多老師的作者專屬頁 `/t/[slug]`，永久陳列每位老師的過去＋現在課程，並用「候補名單（收手機）／追蹤老師／加 LINE」三層機制接住有意願的粉絲。

**Architecture:** 資料由 `src/lib/workshops.ts` 驅動（老師加 `slug`/`bio`，過去課改標 `status:"ended"` 不再刪除）。候補名單寫入新 Supabase 表 `course_waitlist`（收手機）；追蹤老師重用既有 `/api/newsletter/subscribe`。後台新增 `/admin/waitlist` 檢視 + CSV 匯出，比照既有 `/admin/enrollments`。

**Tech Stack:** Next.js 15 App Router (Server Components)、TypeScript、Supabase（service client 繞過 RLS）、Vitest、libphonenumber-js（`@/lib/phone`）。

## Global Constraints

- 套件管理器：**pnpm**。測試 `pnpm test`、建置 `pnpm build`、lint `pnpm lint`。
- 正體中文 UI 文案；用「臺」不用「台」。
- DB/schema 一律由執行者用 Supabase MCP `apply_migration` 套用，**NEVER 叫使用者手動跑 SQL**。
- API route 比照既有風格：`export const runtime = "nodejs"`、`Response.json({ ok: false, error })`、service client = `createServiceClient` from `@/lib/supabase/service`。
- 公開寫入端點一律 rate limit（比照 `lead-magnets/capture`：每 IP 每分鐘 10 次，`@/lib/rate-limit`）。
- 手機驗證一律用 `normalizePhone`（`@/lib/phone`）；email 用 `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`。
- 純驗證邏輯抽成可被 vitest 測的函式（比照 `src/lib/consulting-db.ts` 的 `validateLeadPayload`）。
- admin 端點/頁面一律 `isAdmin()` gate（`@/lib/supabase/admin`），頁面未過 → `redirect("/auth/login")`，API 未過 → 403。
- 部署：`git push origin main` → Vercel 自動部署（不要本地 wrangler，那是別的專案）。
- 不碰既有未提交的 `public/llms.txt`、`public/llms-full.txt`（非本工作產生）。

---

## File Structure

| 檔案 | 職責 |
|---|---|
| `src/lib/workshops.ts`（改） | Instructor/Workshop 介面擴充、vista slug/bio、status:"ended"、三個查詢 helper |
| `supabase/migrations/20260617_course_waitlist.sql`（新） | `course_waitlist` 表 |
| `src/lib/waitlist.ts`（新） | 純函式 `validateWaitlistPayload` + 型別 |
| `src/lib/waitlist.test.ts`（新） | vitest 單元測試 |
| `src/app/api/courses/waitlist/route.ts`（新） | POST 候補：驗證→upsert→newsletter 同步 |
| `src/components/instructor/FollowButton.tsx`（新） | client：email 一欄 → 追蹤老師 |
| `src/components/instructor/WaitlistForm.tsx`（新） | client：名字+email+手機(onBlur 驗證) → 候補 |
| `src/components/instructor/CourseCard.tsx`（新） | 單張課程卡，依 status 切 CTA |
| `src/components/instructor/InstructorHero.tsx`（新） | Hero：照片/bio/連結/追蹤/LINE |
| `src/app/t/[slug]/page.tsx`（新） | 取老師→篩課分組→組頁 + metadata + generateStaticParams |
| `src/app/admin/waitlist/page.tsx`（新） | 後台候補檢視 |
| `src/app/api/admin/waitlist/export/route.ts`（新） | 候補 CSV 匯出 |
| `src/app/admin/page.tsx`（改） | 加「📋 候補名單」連結 |

---

## Task 1: 資料模型 — workshops.ts 擴充 + 查詢 helper

**Files:**
- Modify: `src/lib/workshops.ts`
- Test: `src/lib/workshops.test.ts`

**Interfaces:**
- Produces:
  - `Instructor` 新增選填欄位 `slug?`, `bio?`, `longBio?`, `links?: { label: string; url: string }[]`, `lineOaUrl?`
  - `Workshop.status` 新增 `"ended"`；`Workshop` 新增選填 `cohort?: string`, `endedNote?: string`, `recapUrl?: string`
  - `getInstructorBySlug(slug: string): Instructor | undefined`
  - `getAllInstructorSlugs(): string[]`
  - `getInstructorWorkshops(slug: string): { enrolling: Workshop[]; comingSoon: Workshop[]; ended: Workshop[] }`

- [ ] **Step 1: Write the failing test**

建立 `src/lib/workshops.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import {
  getInstructorBySlug,
  getAllInstructorSlugs,
  getInstructorWorkshops,
} from "./workshops";

describe("getAllInstructorSlugs", () => {
  it("includes vista", () => {
    expect(getAllInstructorSlugs()).toContain("vista");
  });
  it("returns no empty strings and no duplicates", () => {
    const slugs = getAllInstructorSlugs();
    expect(slugs.every((s) => s.length > 0)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getInstructorBySlug", () => {
  it("finds vista", () => {
    expect(getInstructorBySlug("vista")?.name).toBe("Vista");
  });
  it("returns undefined for unknown slug", () => {
    expect(getInstructorBySlug("nobody")).toBeUndefined();
  });
});

describe("getInstructorWorkshops", () => {
  it("groups vista's workshops into enrolling/comingSoon/ended", () => {
    const g = getInstructorWorkshops("vista");
    const all = [...g.enrolling, ...g.comingSoon, ...g.ended];
    // 每堂都屬於 vista
    expect(all.every((w) => w.instructor.name === "Vista")).toBe(true);
    // enrolling 不含 ended/coming_soon
    expect(g.enrolling.every((w) => w.status !== "ended" && w.status !== "coming_soon")).toBe(true);
    expect(g.ended.every((w) => w.status === "ended")).toBe(true);
    expect(g.comingSoon.every((w) => w.status === "coming_soon")).toBe(true);
  });
  it("returns empty groups for unknown instructor", () => {
    const g = getInstructorWorkshops("nobody");
    expect(g.enrolling).toEqual([]);
    expect(g.comingSoon).toEqual([]);
    expect(g.ended).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/workshops.test.ts`
Expected: FAIL（`getInstructorBySlug` 等未匯出）

- [ ] **Step 3: Extend the interfaces**

在 `src/lib/workshops.ts` 的 `Instructor` 介面尾端（`url?: string;` 後）加：

```ts
  /** 有 slug 才會生成作者頁 /t/[slug] */
  slug?: string;
  /** 一句定位（Hero 副標） */
  bio?: string;
  /** 段落式自我介紹，支援 \n 換行 */
  longBio?: string;
  /** 社群／官網連結 */
  links?: { label: string; url: string }[];
  /** 加 LINE 好友連結，預設沿用站台 LINE OA */
  lineOaUrl?: string;
```

把 `Workshop` 介面的 `status` 改為：

```ts
  status: "open" | "filling" | "full" | "coming_soon" | "ended";
```

在 `Workshop` 介面 `featured?: boolean;` 後加：

```ts
  /** 梯次標示，例 "第 8 班" */
  cohort?: string;
  /** 結束課補充，例 "已開 7 梯、結訓 90+ 人" */
  endedNote?: string;
  /** Phase 2：課程回顧頁連結 */
  recapUrl?: string;
```

- [ ] **Step 4: Fill vista instructor profile**

把 `const vista: Instructor = {...}` 補成（保留既有 name/title/avatar/url，新增 slug/bio/longBio/links）：

```ts
const vista: Instructor = {
  name: "Vista",
  title: "AI 應用培訓師・內容策略顧問",
  avatar: "/images/workshops/instructor-vista.webp",
  url: "https://www.vista.tw",
  slug: "vista",
  bio: "用 AI 把你的專業變成能上線、能變現的數位資產。",
  longBio:
    "鄭緯筌（Vista），AI 應用培訓師與內容策略顧問。\n陪伴上千位專業工作者，用 AI 與 vibe coding 把知識變成網站、課程與一人事業。\n相信工具是手段，留下能複利的數位資產才是目的。",
  links: [
    { label: "官網 vista.tw", url: "https://www.vista.tw" },
    { label: "Threads", url: "https://www.threads.com/@vista" },
    { label: "YouTube", url: "https://www.youtube.com/@vistacheng" },
  ],
};
```

- [ ] **Step 5: Add the three helper functions**

在 `WORKSHOPS` 陣列定義之後、檔案尾端加：

```ts
/** 取得有作者頁的老師（依 slug） */
export function getInstructorBySlug(slug: string): Instructor | undefined {
  return WORKSHOPS.map((w) => w.instructor).find((i) => i.slug === slug);
}

/** 所有有 slug 的老師（給 generateStaticParams） */
export function getAllInstructorSlugs(): string[] {
  const slugs = WORKSHOPS.map((w) => w.instructor.slug).filter(
    (s): s is string => !!s,
  );
  return Array.from(new Set(slugs));
}

/** 取某老師的課，依狀態分三組；enrolling/comingSoon 由近到遠、ended 由新到舊 */
export function getInstructorWorkshops(slug: string): {
  enrolling: Workshop[];
  comingSoon: Workshop[];
  ended: Workshop[];
} {
  const mine = WORKSHOPS.filter((w) => w.instructor.slug === slug);
  const byDateAsc = (a: Workshop, b: Workshop) =>
    a.sortDate.localeCompare(b.sortDate);
  const byDateDesc = (a: Workshop, b: Workshop) =>
    b.sortDate.localeCompare(a.sortDate);
  return {
    enrolling: mine
      .filter((w) => ["open", "filling", "full"].includes(w.status))
      .sort(byDateAsc),
    comingSoon: mine.filter((w) => w.status === "coming_soon").sort(byDateAsc),
    ended: mine.filter((w) => w.status === "ended").sort(byDateDesc),
  };
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm test src/lib/workshops.test.ts`
Expected: PASS（所有 case 綠）

- [ ] **Step 7: Commit**

```bash
git add src/lib/workshops.ts src/lib/workshops.test.ts
git commit -m "feat(workshops): 老師加 slug/bio、status 加 ended、新增作者頁查詢 helper

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Migration — course_waitlist 資料表

**Files:**
- Create: `supabase/migrations/20260617_course_waitlist.sql`

**Interfaces:**
- Produces: Supabase 表 `course_waitlist`，欄位 `id, course_slug, instructor_slug, name, email, phone, source_page, created_at`，唯一鍵 `(course_slug, email)`。

- [ ] **Step 1: Write the migration SQL**

建立 `supabase/migrations/20260617_course_waitlist.sql`：

```sql
-- 課程候補名單：粉絲在作者頁點「通知我下一梯」留下的聯絡方式（收手機）
create table if not exists public.course_waitlist (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  instructor_slug text,
  name text not null,
  email text not null,
  phone text,
  source_page text,
  created_at timestamptz not null default now(),
  constraint course_waitlist_course_email_unique unique (course_slug, email)
);

create index if not exists course_waitlist_instructor_idx on public.course_waitlist (instructor_slug);
create index if not exists course_waitlist_course_idx on public.course_waitlist (course_slug);
create index if not exists course_waitlist_created_idx on public.course_waitlist (created_at desc);

-- RLS 開啟但不給匿名讀寫；寫入一律走 service role（繞過 RLS）
alter table public.course_waitlist enable row level security;
```

- [ ] **Step 2: Apply via Supabase MCP**

用 Supabase MCP：先 `list_projects` 找出 solo 專案的 `project_id`，再 `apply_migration`，name = `20260617_course_waitlist`，query = 上面 SQL 全文。
（**不要**叫使用者手動跑 SQL。）

- [ ] **Step 3: Verify the table exists**

用 Supabase MCP `list_tables` 確認 `course_waitlist` 出現且欄位齊全（id/course_slug/instructor_slug/name/email/phone/source_page/created_at），唯一鍵與三個索引存在。

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260617_course_waitlist.sql
git commit -m "feat(db): course_waitlist 候補名單表（收手機，course_slug+email 去重）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: 候補驗證純函式 + 測試

**Files:**
- Create: `src/lib/waitlist.ts`
- Test: `src/lib/waitlist.test.ts`

**Interfaces:**
- Produces:
  - `interface CleanWaitlist { course_slug: string; instructor_slug: string | null; name: string; email: string; phone: string | null; source_page: string | null }`
  - `type WaitlistValidation = { ok: true; value: CleanWaitlist } | { ok: false; error: string }`
  - `validateWaitlistPayload(input: Record<string, unknown>): WaitlistValidation`

- [ ] **Step 1: Write the failing test**

建立 `src/lib/waitlist.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { validateWaitlistPayload } from "./waitlist";

const base = {
  course_slug: "vibe-coding",
  instructor_slug: "vista",
  name: "測試",
  email: "test@test.tw",
};

describe("validateWaitlistPayload", () => {
  it("accepts a minimal valid payload without phone", () => {
    const r = validateWaitlistPayload(base);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.email).toBe("test@test.tw");
      expect(r.value.phone).toBeNull();
    }
  });

  it("lowercases & trims email", () => {
    const r = validateWaitlistPayload({ ...base, email: "  Test@Test.TW " });
    expect(r.ok && r.value.email).toBe("test@test.tw");
  });

  it("rejects missing course_slug", () => {
    const r = validateWaitlistPayload({ ...base, course_slug: "" });
    expect(r.ok).toBe(false);
  });

  it("rejects missing name", () => {
    const r = validateWaitlistPayload({ ...base, name: "  " });
    expect(r.ok).toBe(false);
  });

  it("rejects bad email", () => {
    const r = validateWaitlistPayload({ ...base, email: "nope" });
    expect(r.ok).toBe(false);
  });

  it("accepts a valid TW mobile", () => {
    const r = validateWaitlistPayload({ ...base, phone: "0912345678" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.phone).toBe("0912345678");
  });

  it("rejects an incomplete phone", () => {
    const r = validateWaitlistPayload({ ...base, phone: "091234567" });
    expect(r.ok).toBe(false);
  });

  it("treats empty phone string as no phone (valid)", () => {
    const r = validateWaitlistPayload({ ...base, phone: "   " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.phone).toBeNull();
  });

  it("defaults instructor_slug & source_page to null when absent", () => {
    const r = validateWaitlistPayload({
      course_slug: "x",
      name: "n",
      email: "a@b.tw",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.instructor_slug).toBeNull();
      expect(r.value.source_page).toBeNull();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/waitlist.test.ts`
Expected: FAIL（`./waitlist` 不存在）

- [ ] **Step 3: Write the validator**

建立 `src/lib/waitlist.ts`：

```ts
import { normalizePhone } from "@/lib/phone";

export interface CleanWaitlist {
  course_slug: string;
  instructor_slug: string | null;
  name: string;
  email: string;
  phone: string | null;
  source_page: string | null;
}

export type WaitlistValidation =
  | { ok: true; value: CleanWaitlist }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateWaitlistPayload(
  input: Record<string, unknown>,
): WaitlistValidation {
  const course_slug = str(input.course_slug);
  if (!course_slug) return { ok: false, error: "缺少課程" };

  const name = str(input.name);
  if (!name) return { ok: false, error: "請填姓名" };

  const email = str(input.email).toLowerCase();
  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "E-mail 格式不正確" };

  const phoneRaw = str(input.phone);
  let phone: string | null = null;
  if (phoneRaw) {
    if (!normalizePhone(phoneRaw))
      return { ok: false, error: "手機號碼格式不正確" };
    phone = phoneRaw;
  }

  const instructor_slug = str(input.instructor_slug) || null;
  const source_page = str(input.source_page) || null;

  return {
    ok: true,
    value: { course_slug, instructor_slug, name, email, phone, source_page },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/lib/waitlist.test.ts`
Expected: PASS（9 個 case 綠）

- [ ] **Step 5: Commit**

```bash
git add src/lib/waitlist.ts src/lib/waitlist.test.ts
git commit -m "feat(waitlist): 候補名單驗證純函式（email/手機/必填）+ 單元測試

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: 候補 API route

**Files:**
- Create: `src/app/api/courses/waitlist/route.ts`

**Interfaces:**
- Consumes: `validateWaitlistPayload` (Task 3)、`createServiceClient` (`@/lib/supabase/service`)、`checkRateLimit`/`getClientIp` (`@/lib/rate-limit`)。
- Produces: `POST /api/courses/waitlist`，body `{ course_slug, instructor_slug?, name, email, phone?, source_page? }`，回 `{ ok: true }` 或 `{ ok: false, error }`。

- [ ] **Step 1: Write the route**

建立 `src/app/api/courses/waitlist/route.ts`：

```ts
import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { validateWaitlistPayload } from "@/lib/waitlist";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(ip, { max: 10, windowMs: 60_000 })) {
    return json({ ok: false, error: "請求過於頻繁，請稍後再試" }, 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const v = validateWaitlistPayload(raw);
  if (!v.ok) return json({ ok: false, error: v.error }, 400);
  const data = v.value;

  const supabase = createServiceClient();

  const { error } = await supabase.from("course_waitlist").upsert(
    {
      course_slug: data.course_slug,
      instructor_slug: data.instructor_slug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      source_page: data.source_page,
    },
    { onConflict: "course_slug,email" },
  );

  if (error) {
    console.error("waitlist insert error:", error);
    return json({ ok: false, error: "儲存失敗，請稍後再試" }, 500);
  }

  // 同步進電子報池（best-effort，失敗不影響候補成功）
  try {
    await supabase.from("newsletter_subscribers").upsert(
      {
        email: data.email,
        name: data.name,
        status: "active",
        source: "waitlist",
        tags: [`waitlist:${data.course_slug}`],
      },
      { onConflict: "email", ignoreDuplicates: true },
    );
  } catch (e) {
    console.error("waitlist newsletter sync failed:", e);
  }

  return json({ ok: true });
}
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm build`
Expected: build 成功，無型別錯誤（route 被納入編譯）。

- [ ] **Step 3: Manual smoke test**

開另一個終端 `pnpm dev`，然後：

```bash
curl -s -X POST http://localhost:3000/api/courses/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"course_slug":"vibe-coding","instructor_slug":"vista","name":"煙霧測試","email":"smoke@test.tw","phone":"0912345678","source_page":"/t/vista"}'
```

Expected: `{"ok":true}`。再用 Supabase MCP `execute_sql`（`select * from course_waitlist where email='smoke@test.tw'`）確認寫入，含 phone。驗證後刪除該筆測試資料（`delete from course_waitlist where email='smoke@test.tw'`）。

再測壞 email：

```bash
curl -s -X POST http://localhost:3000/api/courses/waitlist \
  -H 'Content-Type: application/json' -d '{"course_slug":"x","name":"n","email":"bad"}'
```

Expected: `{"ok":false,"error":"E-mail 格式不正確"}`，HTTP 400。

- [ ] **Step 4: Commit**

```bash
git add src/app/api/courses/waitlist/route.ts
git commit -m "feat(api): POST /api/courses/waitlist 候補登記（rate limit + upsert + 電子報同步）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: 留客互動元件 — FollowButton + WaitlistForm

**Files:**
- Create: `src/components/instructor/FollowButton.tsx`
- Create: `src/components/instructor/WaitlistForm.tsx`

**Interfaces:**
- Consumes: `POST /api/newsletter/subscribe`（既有）、`POST /api/courses/waitlist`（Task 4）、`normalizePhone`（`@/lib/phone`）、UI `Button`/`Input`（`@/components/ui/*`）。
- Produces:
  - `FollowButton({ instructorSlug, instructorName }: { instructorSlug: string; instructorName: string })`
  - `WaitlistForm({ courseSlug, instructorSlug, courseTitle }: { courseSlug: string; instructorSlug: string; courseTitle: string })`

- [ ] **Step 1: Write FollowButton**

建立 `src/components/instructor/FollowButton.tsx`：

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FollowButton({
  instructorSlug,
  instructorName,
}: {
  instructorSlug: string;
  instructorName: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      setMsg("請填正確的 E-mail");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "instructor-follow",
          tags: [`instructor:${instructorSlug}`],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "訂閱失敗");
      setState("done");
      setMsg(`已追蹤 ${instructorName}，有新課會第一個通知你。`);
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "訂閱失敗");
    }
  }

  if (state === "done") {
    return <p className="text-sm text-emerald-700">{msg}</p>;
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        inputMode="email"
        placeholder="你的 E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="追蹤老師的 Email"
      />
      <Button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "送出中…" : `追蹤 ${instructorName}`}
      </Button>
      {state === "error" && (
        <p className="w-full text-sm text-rose-600">{msg}</p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Write WaitlistForm**

建立 `src/components/instructor/WaitlistForm.tsx`：

```tsx
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizePhone } from "@/lib/phone";

export function WaitlistForm({
  courseSlug,
  instructorSlug,
  courseTitle,
}: {
  courseSlug: string;
  instructorSlug: string;
  courseTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  const phoneError = useMemo(() => {
    if (!phoneTouched) return null;
    const val = form.phone.trim();
    if (!val) return null;
    return normalizePhone(val)
      ? null
      : "手機號碼看起來不完整，請填完整 10 碼（09 開頭）或帶國碼的國際號碼。";
  }, [phoneTouched, form.phone]);

  function set(k: "name" | "email" | "phone", v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setState("error");
      setMsg("姓名與 E-mail 為必填");
      return;
    }
    if (form.phone.trim() && !normalizePhone(form.phone.trim())) {
      setPhoneTouched(true);
      setState("error");
      setMsg("手機號碼格式不正確");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/courses/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_slug: courseSlug,
          instructor_slug: instructorSlug,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          source_page: `/t/${instructorSlug}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "送出失敗");
      setState("done");
      setMsg("已記下你！這門課下一梯開課，我們第一個通知你。");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "送出失敗");
    }
  }

  if (state === "done") {
    return <p className="mt-2 text-sm text-emerald-700">{msg}</p>;
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        通知我下一梯
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 flex flex-col gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
      <p className="text-sm font-medium text-stone-700">
        《{courseTitle}》下一梯通知我
      </p>
      <Input placeholder="姓名" value={form.name} onChange={(e) => set("name", e.target.value)} aria-label="姓名" />
      <Input type="email" inputMode="email" placeholder="E-mail" value={form.email} onChange={(e) => set("email", e.target.value)} aria-label="E-mail" />
      <Input
        type="tel"
        inputMode="tel"
        placeholder="手機（選填，方便課前聯絡你）"
        value={form.phone}
        onChange={(e) => set("phone", e.target.value)}
        onBlur={() => setPhoneTouched(true)}
        aria-invalid={!!phoneError}
        aria-label="手機"
      />
      {phoneError && <p className="text-xs text-rose-600">{phoneError}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={state === "loading"}>
          {state === "loading" ? "送出中…" : "送出"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          取消
        </Button>
      </div>
      {state === "error" && <p className="text-sm text-rose-600">{msg}</p>}
    </form>
  );
}
```

- [ ] **Step 3: Verify components compile**

Run: `pnpm build`
Expected: build 成功（注意：若 `@/components/ui/input` 不存在，改用既有等價元件；先 `ls src/components/ui` 確認 `button.tsx`/`input.tsx` 名稱）。

- [ ] **Step 4: Commit**

```bash
git add src/components/instructor/FollowButton.tsx src/components/instructor/WaitlistForm.tsx
git commit -m "feat(instructor): 追蹤老師 + 候補名單兩個 client 互動元件（手機 onBlur 即時驗證）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: 作者頁 — Hero + CourseCard + /t/[slug] 組裝

**Files:**
- Create: `src/components/instructor/InstructorHero.tsx`
- Create: `src/components/instructor/CourseCard.tsx`
- Create: `src/app/t/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getInstructorBySlug`/`getAllInstructorSlugs`/`getInstructorWorkshops` (Task 1)、`FollowButton`/`WaitlistForm` (Task 5)、`Workshop`/`Instructor` 型別、UI `Card`/`Badge`/`Button`、`next/image`、`next/link`。
- Produces: 路由 `/t/[slug]`（靜態生成）、`InstructorHero({ instructor })`、`CourseCard({ workshop })`。

- [ ] **Step 1: Write InstructorHero**

建立 `src/components/instructor/InstructorHero.tsx`：

```tsx
import Image from "next/image";
import type { Instructor } from "@/lib/workshops";
import { FollowButton } from "./FollowButton";

const DEFAULT_LINE_OA = "https://line.me/R/ti/p/@016mxqyl";

export function InstructorHero({ instructor }: { instructor: Instructor }) {
  const lineUrl = instructor.lineOaUrl || DEFAULT_LINE_OA;
  return (
    <header className="mx-auto max-w-3xl px-4 pt-12 text-center sm:pt-16">
      {instructor.avatar && (
        <Image
          src={instructor.avatar}
          alt={instructor.name}
          width={112}
          height={112}
          className="mx-auto h-28 w-28 rounded-full object-cover"
        />
      )}
      <h1 className="mt-5 text-3xl font-bold text-stone-900">{instructor.name}</h1>
      <p className="mt-1 text-base text-stone-500">{instructor.title}</p>
      {instructor.bio && (
        <p className="mx-auto mt-4 max-w-xl text-lg text-stone-700">{instructor.bio}</p>
      )}
      {instructor.longBio && (
        <p className="mx-auto mt-3 max-w-xl whitespace-pre-line text-sm leading-relaxed text-stone-600">
          {instructor.longBio}
        </p>
      )}
      {instructor.links && instructor.links.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          {instructor.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {l.label}
            </a>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-col items-center gap-3">
        {instructor.slug && (
          <FollowButton instructorSlug={instructor.slug} instructorName={instructor.name} />
        )}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[#06C755] px-4 py-2 text-sm font-medium text-[#06C755] hover:bg-[#06C755]/5"
        >
          加 LINE 領取上課資訊
        </a>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Write CourseCard**

建立 `src/components/instructor/CourseCard.tsx`：

```tsx
import Link from "next/link";
import type { Workshop } from "@/lib/workshops";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "./WaitlistForm";

export function CourseCard({ workshop }: { workshop: Workshop }) {
  const isEnded = workshop.status === "ended";
  const isFull = workshop.status === "full";
  const isComing = workshop.status === "coming_soon";
  const instructorSlug = workshop.instructor.slug || "";

  return (
    <Card className={isEnded ? "opacity-70" : undefined}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              {workshop.emoji} {workshop.title}
            </h3>
            <p className="mt-1 text-sm text-stone-500">{workshop.subtitle}</p>
          </div>
          {workshop.cohort && <Badge variant="secondary">{workshop.cohort}</Badge>}
        </div>

        <p className="mt-3 text-sm text-stone-600">
          {workshop.date}・{workshop.time}
        </p>
        {isEnded && workshop.endedNote && (
          <p className="mt-1 text-sm text-stone-500">{workshop.endedNote}</p>
        )}

        <div className="mt-4">
          {!isEnded && !isFull && !isComing && (
            <Button asChild>
              <Link href={`/courses/${workshop.id}/register`}>立即報名</Link>
            </Button>
          )}
          {isComing && (
            <WaitlistForm courseSlug={workshop.id} instructorSlug={instructorSlug} courseTitle={workshop.title} />
          )}
          {isFull && (
            <div>
              <p className="mb-2 text-sm font-medium text-amber-700">本梯已額滿</p>
              <WaitlistForm courseSlug={workshop.id} instructorSlug={instructorSlug} courseTitle={workshop.title} />
            </div>
          )}
          {isEnded && (
            <div className="flex flex-wrap items-center gap-3">
              <WaitlistForm courseSlug={workshop.id} instructorSlug={instructorSlug} courseTitle={workshop.title} />
              {workshop.recapUrl && (
                <Link href={workshop.recapUrl} className="text-sm text-primary hover:underline">
                  課程回顧 →
                </Link>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Write the page**

建立 `src/app/t/[slug]/page.tsx`：

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getInstructorBySlug,
  getAllInstructorSlugs,
  getInstructorWorkshops,
} from "@/lib/workshops";
import { InstructorHero } from "@/components/instructor/InstructorHero";
import { CourseCard } from "@/components/instructor/CourseCard";

export function generateStaticParams() {
  return getAllInstructorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) return { title: "找不到老師 | solo.tw" };
  const title = `${instructor.name}｜${instructor.title} - solo.tw`;
  const description = instructor.bio || `${instructor.name} 的所有課程`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.solo.tw/t/${slug}`,
      images: instructor.avatar ? [instructor.avatar] : undefined,
    },
  };
}

export default async function InstructorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) notFound();

  const { enrolling, comingSoon, ended } = getInstructorWorkshops(slug);

  return (
    <main className="min-h-screen bg-white pb-20">
      <InstructorHero instructor={instructor} />

      <div className="mx-auto mt-12 max-w-3xl space-y-12 px-4">
        {enrolling.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-stone-900">正在招生</h2>
            <div className="space-y-4">
              {enrolling.map((w) => (
                <CourseCard key={w.id} workshop={w} />
              ))}
            </div>
          </section>
        )}

        {comingSoon.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-stone-900">即將開課</h2>
            <div className="space-y-4">
              {comingSoon.map((w) => (
                <CourseCard key={w.id} workshop={w} />
              ))}
            </div>
          </section>
        )}

        {ended.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-stone-900">過去開過的課</h2>
            <p className="mb-4 text-sm text-stone-500">
              想上這些課的下一梯？留下聯絡方式，開課第一個通知你。
            </p>
            <div className="space-y-4">
              {ended.map((w) => (
                <CourseCard key={w.id} workshop={w} />
              ))}
            </div>
          </section>
        )}

        {enrolling.length === 0 && comingSoon.length === 0 && ended.length === 0 && (
          <p className="text-center text-stone-500">這位老師還沒有上架課程。</p>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Build & headless verify**

Run: `pnpm build`
Expected: build 成功，`/t/[slug]` 出現在 route 清單（SSG，含 vista）。

開 `pnpm dev`，驗證：

```bash
curl -s http://localhost:3000/t/vista | grep -o "正在招生\|過去開過的課\|追蹤 Vista\|加 LINE 領取上課資訊" | sort -u
```

Expected: 至少出現 `加 LINE 領取上課資訊`、`追蹤 Vista`，以及依現有課程狀態出現的分組標題。再 `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/t/nobody` Expected `404`。

- [ ] **Step 5: Commit**

```bash
git add src/components/instructor/InstructorHero.tsx src/components/instructor/CourseCard.tsx "src/app/t/[slug]/page.tsx"
git commit -m "feat(t): 作者專屬頁 /t/[slug]（Hero + 三分組課程卡 + 候補/追蹤/LINE）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: 後台候補名單檢視 + CSV 匯出

**Files:**
- Create: `src/app/admin/waitlist/page.tsx`
- Create: `src/app/api/admin/waitlist/export/route.ts`
- Modify: `src/app/admin/page.tsx`（加連結）

**Interfaces:**
- Consumes: `isAdmin` (`@/lib/supabase/admin`)、service client、`course_waitlist` 表。
- Produces: 頁面 `/admin/waitlist`（支援 `?instructor=`、`?course=`）、`GET /api/admin/waitlist/export`（同篩選）。

- [ ] **Step 1: Write the export route**

建立 `src/app/api/admin/waitlist/export/route.ts`：

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const COLUMNS: { key: string; label: string }[] = [
  { key: "created_at", label: "建立時間" },
  { key: "course_slug", label: "課程" },
  { key: "instructor_slug", label: "老師" },
  { key: "name", label: "姓名" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "手機" },
  { key: "source_page", label: "來源頁" },
  { key: "id", label: "候補 ID" },
];

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const course = searchParams.get("course");
  const instructor = searchParams.get("instructor");

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = supabase
    .from("course_waitlist")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (course) query = query.eq("course_slug", course);
  if (instructor) query = query.eq("instructor_slug", instructor);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = COLUMNS.map((c) => c.label).join(",");
  const rows = (data || []).map((row) =>
    COLUMNS.map((c) => escapeCsv((row as Record<string, unknown>)[c.key])).join(","),
  );
  const csv = "﻿" + [header, ...rows].join("\n");

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${date}.csv"`,
    },
  });
}
```

- [ ] **Step 2: Write the admin page**

建立 `src/app/admin/waitlist/page.tsx`：

```tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "候補名單 | 後台",
  robots: { index: false, follow: false },
};

interface WaitlistRow {
  id: string;
  course_slug: string;
  instructor_slug: string | null;
  name: string;
  email: string;
  phone: string | null;
  source_page: string | null;
  created_at: string;
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; instructor?: string }>;
}) {
  if (!(await isAdmin())) redirect("/auth/login");

  const { course, instructor } = await searchParams;
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = supabase
    .from("course_waitlist")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (course) query = query.eq("course_slug", course);
  if (instructor) query = query.eq("instructor_slug", instructor);

  const { data } = await query;
  const rows = (data || []) as WaitlistRow[];

  const exportParams = new URLSearchParams();
  if (course) exportParams.set("course", course);
  if (instructor) exportParams.set("instructor", instructor);
  const exportHref = `/api/admin/waitlist/export${
    exportParams.toString() ? `?${exportParams}` : ""
  }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">候補名單</h1>
          <p className="mt-1 text-sm text-stone-500">共 {rows.length} 筆</p>
        </div>
        <Button asChild>
          <a href={exportHref}>📄 匯出 CSV</a>
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="p-3">建立時間</th>
                <th className="p-3">課程</th>
                <th className="p-3">老師</th>
                <th className="p-3">姓名</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">手機</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="p-3 text-stone-500">
                    {new Date(r.created_at).toLocaleString("zh-TW")}
                  </td>
                  <td className="p-3">{r.course_slug}</td>
                  <td className="p-3">{r.instructor_slug || "—"}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.phone || "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-stone-400">
                    目前沒有候補資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="mt-4">
        <Link href="/admin" className="text-sm text-primary hover:underline">
          ← 回後台首頁
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Add link on admin home**

在 `src/app/admin/page.tsx` 找到既有 `<Link href="/admin/enrollments">🎓 課程報名</Link>` 那一段，在它後面（同一個清單/格線內）加一條相同樣式的連結：

```tsx
<Link href="/admin/waitlist">📋 候補名單</Link>
```

（沿用該檔案既有連結的 className 與包裹結構；只新增這一行，不改動其他項目。）

- [ ] **Step 4: Build & verify**

Run: `pnpm build`
Expected: 成功，`/admin/waitlist` 與 `/api/admin/waitlist/export` 出現在 route 清單。

`pnpm dev` 後驗證 admin gate（未登入應被導走）：

```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/admin/waitlist/export"
```

Expected: `403`（未登入非 admin）。頁面 `/admin/waitlist` 未登入 → 302/重導到 `/auth/login`。
（登入後的完整檢視/匯出驗證：登入 iamvista@gmail.com 後開 `/admin/waitlist`，確認看得到 Task 4 smoke test 寫入的資料、CSV 下載中文不亂碼——若 smoke 資料已刪則先補一筆再驗、驗完刪。）

- [ ] **Step 5: Commit**

```bash
git add "src/app/admin/waitlist/page.tsx" src/app/api/admin/waitlist/export/route.ts src/app/admin/page.tsx
git commit -m "feat(admin): 候補名單後台檢視 + CSV 匯出（isAdmin gate，UTF-8 BOM）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Final: 標記既有已結束課程 + 部署

- [ ] **Step 1: Mark ended courses**

對照今天日期（2026-06-17），把 `src/lib/workshops.ts` 中 `sortDate` 已過、且確實結束的 vista 課程改 `status: "ended"`，並酌補 `cohort`/`endedNote`（例「已結訓」）。**先跟 Vista 確認哪幾堂算已結束**再改（這牽涉對外呈現）。未結束的維持原 status。

- [ ] **Step 2: Full build + lint**

Run: `pnpm build && pnpm lint`
Expected: 皆通過（既有與本工作無關的 lint warning 如 `wenhao`/`runsheng` unused 不在本次處理範圍，不要順手改）。

- [ ] **Step 3: Deploy**

```bash
git push origin main
```

Vercel 自動部署。部署後開 `https://www.solo.tw/t/vista` headless 回讀，確認三分組、追蹤鈕、LINE、候補表單都在，候補實際送出能寫進 `course_waitlist`（再用 admin 頁回讀，驗完刪測試資料）。

---

## Self-Review（against spec）

- **Spec coverage**：路由 `/t/[slug]`→Task 6；多老師→Task 1 helper + generateStaticParams；`Instructor` 擴充→Task 1；`status:"ended"` 不刪→Task 1 + Final；`course_waitlist` 收手機→Task 2/3/4；追蹤老師重用 newsletter→Task 5 FollowButton；LINE→Task 6 Hero；過去課灰卡+候補→Task 6 CourseCard；admin 檢視+CSV→Task 7；`@username` 分工→純文件決策（無 code，spec 已記）。✅ 全覆蓋。
- **Placeholder scan**：無 TBD/TODO；每個 code step 皆完整程式碼。Final Step 1 的「哪幾堂算已結束」為**刻意的對外確認點**（非技術佔位），已標明先問 Vista。
- **Type consistency**：`getInstructorWorkshops` 回傳 `{ enrolling, comingSoon, ended }` 三處一致（Task 1 定義、Task 6 解構）；`validateWaitlistPayload` 回傳 `{ ok, value/error }` 於 Task 3 定義、Task 4 消費一致；`CleanWaitlist` 欄位與 `course_waitlist` 表欄位一致；`WaitlistForm`/`FollowButton` props 與 Task 6 呼叫一致。✅
- **UI 元件依賴**：Task 5/6 依賴 `@/components/ui/{button,input,card,badge}`，已在 Task 5 Step 3 要求先 `ls src/components/ui` 確認名稱再用。
