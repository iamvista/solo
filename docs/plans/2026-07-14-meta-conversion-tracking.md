# solo.tw Meta 轉換追蹤 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development。步驟用 checkbox 追蹤。

**Goal:** solo.tw 在現有 Vista Pixel 上加 Lead（報名送出）與 Purchase（Recur 付款成功）事件，client fbq + server CAPI 雙軌、event_id 去重。

**Architecture:** 新增 `src/lib/meta-capi.ts`（純函式 + sendCapiEvent，失敗只 log 不 throw）。Lead 掛在報名表單 client 與 register route server；Purchase 掛在 Recur webhook server（權威）與 success 頁 client（補）。Token 走現有 60 天 user token，設進 Vercel。

**Tech Stack:** Next.js 16（App Router）、TypeScript、vitest（`npx vitest run`）、Node crypto、Vercel。

## Global Constraints

- 追蹤程式**失敗只 `console.warn` 回 false，NEVER throw**；絕不因追蹤問題害到報名或 webhook 金流主流程。
- PII 一律 SHA-256（email 去空白轉小寫、phone 去非數字、name 去空白轉小寫）；空值不放進 user_data。
- pixel id 讀 `process.env.NEXT_PUBLIC_META_PIXEL_ID`；CAPI token 讀 `process.env.META_CAPI_ACCESS_TOKEN`（server-only，NEVER 上 client）；測試碼 `process.env.META_CAPI_TEST_CODE`（存在才帶 test_event_code）。
- 去重：Lead 與 Purchase 各用 `event_id = enrollmentId`，client fbq 的 `eventID` 與 server CAPI 的 `event_id` 必須同值。
- Purchase 幣別固定 `"TWD"`。只對課程訂單（`config.kind === "course"`）打 Purchase。
- Graph API `https://graph.facebook.com/v23.0/{pixelId}/events`。
- 用字：中文全形標點、「臺」非「台」。commit 訊息結尾加 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 只動 solo repo（`/Users/vista/06_VibeCoding/01_Code_Products/solo`），branch 見執行時；targeted `git add`，不掃無關檔。

---

## Task 1: `src/lib/meta-capi.ts` 傳送庫（TDD）

**Files:**
- Create: `src/lib/meta-capi.ts`
- Test: `src/lib/meta-capi.test.ts`

**Interfaces (Produces):**
- `CapiEvent`、`buildUserData(u)`、`buildPayload(ev, nowSec)`、`parseFbCookies(cookieHeader)`、`sendCapiEvent(ev): Promise<boolean>`

- [ ] **Step 1: 寫失敗測試**

```ts
// src/lib/meta-capi.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHash } from "node:crypto";
import { buildUserData, buildPayload, parseFbCookies, sendCapiEvent } from "./meta-capi";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

describe("buildUserData", () => {
  it("hashes email lowercased+trimmed, phone digits-only, name lowercased", () => {
    const ud = buildUserData({ email: "  Foo@Bar.COM ", phone: "+886 912-345-678", firstName: "Vista" });
    expect(ud.em).toEqual([sha("foo@bar.com")]);
    expect(ud.ph).toEqual([sha("886912345678")]);
    expect(ud.fn).toEqual([sha("vista")]);
  });
  it("omits empty fields and passes through fbp/fbc/ip/ua", () => {
    const ud = buildUserData({ email: "", fbp: "fb.1.2.3", fbc: "fb.1.4.5", clientIp: "1.2.3.4", userAgent: "UA" });
    expect(ud.em).toBeUndefined();
    expect(ud.fbp).toBe("fb.1.2.3");
    expect(ud.client_ip_address).toBe("1.2.3.4");
    expect(ud.client_user_agent).toBe("UA");
  });
});

describe("buildPayload", () => {
  it("builds base fields and only adds custom_data when value/currency present", () => {
    const base = buildPayload({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: {} }, 100);
    expect(base.event_name).toBe("Lead");
    expect(base.event_time).toBe(100);
    expect(base.event_id).toBe("e1");
    expect(base.action_source).toBe("website");
    expect(base.custom_data).toBeUndefined();
    const p = buildPayload({ eventName: "Purchase", eventId: "o1", eventSourceUrl: "https://x", user: {}, customData: { value: 3000, currency: "TWD" } }, 100);
    expect(p.custom_data).toEqual({ value: 3000, currency: "TWD" });
  });
});

describe("parseFbCookies", () => {
  it("extracts _fbp/_fbc", () => {
    expect(parseFbCookies("a=1; _fbp=fb.1.2.3; _fbc=fb.1.4.5")).toEqual({ fbp: "fb.1.2.3", fbc: "fb.1.4.5" });
    expect(parseFbCookies(null)).toEqual({});
  });
});

describe("sendCapiEvent", () => {
  const OLD = { ...process.env };
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { process.env = { ...OLD }; });

  it("returns false and does not fetch when env missing", async () => {
    delete process.env.NEXT_PUBLIC_META_PIXEL_ID;
    delete process.env.META_CAPI_ACCESS_TOKEN;
    const f = vi.spyOn(global, "fetch");
    const ok = await sendCapiEvent({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: {} });
    expect(ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it("posts to the pixel events endpoint and returns true on ok", async () => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "PIX";
    process.env.META_CAPI_ACCESS_TOKEN = "TOK";
    delete process.env.META_CAPI_TEST_CODE;
    const f = vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ events_received: 1 }), { status: 200 }));
    const ok = await sendCapiEvent({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: { email: "a@b.com" } });
    expect(ok).toBe(true);
    const url = (f.mock.calls[0][0] as string);
    expect(url).toBe("https://graph.facebook.com/v23.0/PIX/events");
    const body = (f.mock.calls[0][1] as RequestInit).body as URLSearchParams;
    expect(body.get("access_token")).toBe("TOK");
    expect(body.get("data")).toContain("\"event_name\":\"Lead\"");
  });

  it("returns false (never throws) when fetch rejects", async () => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "PIX";
    process.env.META_CAPI_ACCESS_TOKEN = "TOK";
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network"));
    const ok = await sendCapiEvent({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: {} });
    expect(ok).toBe(false);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `cd /Users/vista/06_VibeCoding/01_Code_Products/solo && npx vitest run src/lib/meta-capi.test.ts`
Expected: FAIL（module 不存在）

- [ ] **Step 3: 寫實作**

```ts
// src/lib/meta-capi.ts
import { createHash } from "node:crypto";

const GRAPH = "https://graph.facebook.com/v23.0";

type CapiUserData = {
  email?: string; phone?: string; firstName?: string;
  fbp?: string; fbc?: string; clientIp?: string; userAgent?: string;
};
export type CapiEvent = {
  eventName: "Lead" | "Purchase";
  eventId: string;
  eventSourceUrl: string;
  actionSource?: "website";
  user: CapiUserData;
  customData?: { value?: number; currency?: string };
};

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export function buildUserData(u: CapiUserData): Record<string, unknown> {
  const ud: Record<string, unknown> = {};
  const em = u.email?.trim().toLowerCase();
  if (em) ud.em = [sha256(em)];
  const ph = u.phone?.replace(/[^0-9]/g, "");
  if (ph) ud.ph = [sha256(ph)];
  const fn = u.firstName?.trim().toLowerCase();
  if (fn) ud.fn = [sha256(fn)];
  if (u.fbp) ud.fbp = u.fbp;
  if (u.fbc) ud.fbc = u.fbc;
  if (u.clientIp) ud.client_ip_address = u.clientIp;
  if (u.userAgent) ud.client_user_agent = u.userAgent;
  return ud;
}

export function buildPayload(ev: CapiEvent, nowSec: number): Record<string, unknown> {
  const data: Record<string, unknown> = {
    event_name: ev.eventName,
    event_time: nowSec,
    event_id: ev.eventId,
    event_source_url: ev.eventSourceUrl,
    action_source: ev.actionSource ?? "website",
    user_data: buildUserData(ev.user),
  };
  if (ev.customData && (ev.customData.value != null || ev.customData.currency)) {
    data.custom_data = {
      ...(ev.customData.value != null ? { value: ev.customData.value } : {}),
      ...(ev.customData.currency ? { currency: ev.customData.currency } : {}),
    };
  }
  return data;
}

export function parseFbCookies(cookieHeader?: string | null): { fbp?: string; fbc?: string } {
  if (!cookieHeader) return {};
  const get = (k: string) => {
    const m = cookieHeader.match(new RegExp("(?:^|;\\s*)" + k + "=([^;]+)"));
    return m ? decodeURIComponent(m[1]) : undefined;
  };
  return { fbp: get("_fbp"), fbc: get("_fbc") };
}

export async function sendCapiEvent(ev: CapiEvent): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    console.warn("[meta-capi] missing NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN, skip");
    return false;
  }
  try {
    const nowSec = Math.floor(Date.now() / 1000);
    const body = new URLSearchParams();
    body.set("data", JSON.stringify([buildPayload(ev, nowSec)]));
    body.set("access_token", token);
    const testCode = process.env.META_CAPI_TEST_CODE;
    if (testCode) body.set("test_event_code", testCode);
    const res = await fetch(`${GRAPH}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.warn("[meta-capi] non-ok", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[meta-capi] send failed", (e as Error)?.message);
    return false;
  }
}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run src/lib/meta-capi.test.ts`
Expected: PASS（全部）

- [ ] **Step 5: typecheck**

Run: `npx tsc --noEmit`
Expected: 無新錯誤（若既有 baseline 有錯，確認非本檔造成）。

- [ ] **Step 6: Commit**

```bash
git add src/lib/meta-capi.ts src/lib/meta-capi.test.ts
git commit -m "feat(capi): Meta Conversions API 傳送庫（hash + payload + 送件）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: 環境變數化 pixel id + .env 範本

**Files:**
- Modify: `src/app/layout.tsx`（第 200-211 行 pixel base code）
- Modify: `.env.local.example`

**Interfaces (Consumes):** 無（純設定）

- [ ] **Step 1: layout.tsx pixel id 改讀 env**

把 `src/app/layout.tsx:200-211` 內 inline script 的兩處寫死 `1593496197630087` 改成用環境變數插值。將現有 `<Script id="meta-pixel" strategy="afterInteractive">{`...fbq('init','1593496197630087');...`}</Script>` 改為讀 `process.env.NEXT_PUBLIC_META_PIXEL_ID`（Next.js 於 build 時內嵌 `NEXT_PUBLIC_*`），例如在 script 字串前取 `const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;`，只有 `pixelId` 存在時才 render 該 `<Script>`，並把 `fbq('init', '${pixelId}')` 插值進去。保留 `fbq('track','PageView')`。不改動其他行為。

- [ ] **Step 2: .env.local.example 補註解**

在 `.env.local.example` 適當位置（比照現有 `RECUR_*` 註解風格）加：
```
# Meta 轉換追蹤（廣告戰情室真實成效）
# NEXT_PUBLIC_META_PIXEL_ID：公開可上前端，= Vista Pixel id
NEXT_PUBLIC_META_PIXEL_ID=1593496197630087
# META_CAPI_ACCESS_TOKEN：server-only，Conversions API 權杖（現用 ~/.meta-ads/.env 的 user token，60 天期，續期由 setup-token.sh 同步）
META_CAPI_ACCESS_TOKEN=
# META_CAPI_TEST_CODE：測試期填 Events Manager 的 test_event_code，事件只進 Test Events；正式上線前清空並從 Vercel 移除
META_CAPI_TEST_CODE=
```

- [ ] **Step 3: 驗證**

Run: `npx tsc --noEmit && npx next build 2>&1 | tail -5`
Expected: build 成功（layout 改動不破壞）。若 build 太久，至少 `npx tsc --noEmit` 過。

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx .env.local.example
git commit -m "feat(capi): pixel id 改讀 NEXT_PUBLIC_META_PIXEL_ID + env 範本

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Lead 事件（client + server CAPI）

**Files:**
- Modify: `src/app/courses/[course]/register/CourseRegistrationForm.tsx`（約第 166 行）
- Modify: `src/app/api/courses/register/route.ts`（約第 203-235 行）

**Interfaces (Consumes):** `sendCapiEvent`、`parseFbCookies`（Task 1）

- [ ] **Step 1: client Lead（CourseRegistrationForm.tsx）**

在 `json.ok` 為真、已取得 `customerEmail`/`customerName`/`enrollmentId`（約第 166 行）之後、`redirectToCheckout`（約第 174 行）之前插入：
```ts
if (typeof window !== "undefined" && (window as { fbq?: (...a: unknown[]) => void }).fbq) {
  (window as { fbq: (...a: unknown[]) => void }).fbq("track", "Lead", { content_name: productId }, { eventID: enrollmentId });
}
```
只加這段，不動既有報名/跳轉邏輯。

- [ ] **Step 2: server CAPI Lead（register/route.ts）**

在成功回應 `Response.json({ ok: true, ... })`（約第 226 行）之前、`row.id` 已存在處，加：
```ts
import { sendCapiEvent, parseFbCookies } from "@/lib/meta-capi";
// …在 handler 內、回應前：
const { fbp, fbc } = parseFbCookies(request.headers.get("cookie"));
await sendCapiEvent({
  eventName: "Lead",
  eventId: row.id,
  eventSourceUrl: request.headers.get("referer") || "https://www.solo.tw/",
  actionSource: "website",
  user: {
    email: body.email,
    phone: phoneParsed?.e164,
    firstName: body.name,
    fbp, fbc,
    clientIp: (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  },
});
```
（`sendCapiEvent` 已吞錯；即使回 false 也照常回報名成功。`import` 放檔案頂端既有 import 區。）確認 `row.id`、`body.email`、`phoneParsed`、`body.name` 變數名與實際程式一致，不一致則對齊實際名稱。

- [ ] **Step 3: 驗證**

Run: `npx tsc --noEmit`
Expected: 無新型別錯誤。（route 的實測留待 Task 5 的 Test Events；此處確保編譯通過與插入點正確。）

- [ ] **Step 4: Commit**

```bash
git add src/app/courses/[course]/register/CourseRegistrationForm.tsx src/app/api/courses/register/route.ts
git commit -m "feat(capi): Lead 事件（報名送出 client fbq + server CAPI，enrollmentId 去重）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Purchase 事件（webhook server CAPI + success 頁 client）

**Files:**
- Modify: `src/app/api/webhooks/recur/route.ts`（`handleOrderPaid`，約第 203-273 行）
- Modify: `src/app/api/webhooks/recur/route.test.ts`（加 Purchase CAPI 斷言）
- Create: `src/app/courses/[course]/register/success/PurchasePixel.tsx`
- Modify: `src/app/courses/[course]/register/success/page.tsx`

**Interfaces (Consumes):** `sendCapiEvent`（Task 1）

- [ ] **Step 1: 先寫/擴充 webhook 測試（TDD）**

在 `route.test.ts` 既有 `order.paid` 課程訂單付款成功的測試中（或新增一個），mock `@/lib/meta-capi` 的 `sendCapiEvent`，斷言：付款成功且為課程訂單時，`sendCapiEvent` 被呼叫一次、參數 `eventName:"Purchase"`、`customData.value` 等於 order amount、`customData.currency:"TWD"`、`eventId` 等於該筆 enrollmentId。範式：
```ts
vi.mock("@/lib/meta-capi", () => ({ sendCapiEvent: vi.fn().mockResolvedValue(true), parseFbCookies: () => ({}) }));
import { sendCapiEvent } from "@/lib/meta-capi";
// …在課程訂單 order.paid 成功案例後：
expect(sendCapiEvent).toHaveBeenCalledWith(expect.objectContaining({
  eventName: "Purchase",
  customData: expect.objectContaining({ value: <該測試的 amount>, currency: "TWD" }),
}));
```
沿用該檔頂端既有的 env 與 mock 設定；對齊既有測試建構 `order.paid` 事件的 helper。

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run src/app/api/webhooks/recur/route.test.ts`
Expected: FAIL（sendCapiEvent 尚未被呼叫）。

- [ ] **Step 3: webhook server CAPI Purchase（route.ts）**

在 `handleOrderPaid` 內、`markEnrollmentPaid` 完成後（約第 224 行後）、限 `config.kind === "course"` 分支（約第 271 行）加：
```ts
import { sendCapiEvent } from "@/lib/meta-capi";
// …課程訂單、付款確認、enrollmentId 已知後：
await sendCapiEvent({
  eventName: "Purchase",
  eventId: enrollmentId,
  eventSourceUrl: "https://www.solo.tw/",
  actionSource: "website",
  user: { email },
  customData: { value: amount, currency: "TWD" },
});
```
對齊實際變數名（`enrollmentId`、`email`、`amount`）；若 `amount` 可能為 undefined，缺值時仍送（Meta 允許無 value 的 Purchase，但盡量帶）。不動 webhook 既有 idempotency/回應邏輯。

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run src/app/api/webhooks/recur/route.test.ts`
Expected: PASS。

- [ ] **Step 5: success 頁 client 補打（PurchasePixel.tsx + page.tsx）**

建 `success/PurchasePixel.tsx`：
```tsx
"use client";
import { useEffect } from "react";
export default function PurchasePixel({ eventId, value }: { eventId: string; value?: number }) {
  useEffect(() => {
    const w = window as { fbq?: (...a: unknown[]) => void };
    if (w.fbq) w.fbq("track", "Purchase", { value: value ?? undefined, currency: "TWD" }, { eventID: eventId });
  }, [eventId, value]);
  return null;
}
```
在 `success/page.tsx` 的 `isPaid` 為真分支 render（server component 可直接 render client 子元件）：
```tsx
{isPaid && <PurchasePixel eventId={enrollment.id} value={enrollment.amount} />}
```
對齊實際變數（`enrollment.id`、`enrollment.amount`、`isPaid`）。import PurchasePixel。

- [ ] **Step 6: 驗證**

Run: `npx vitest run src/app/api/webhooks/recur/route.test.ts && npx tsc --noEmit`
Expected: 測試 PASS、型別無新錯。

- [ ] **Step 7: Commit**

```bash
git add src/app/api/webhooks/recur/route.ts src/app/api/webhooks/recur/route.test.ts src/app/courses/[course]/register/success/PurchasePixel.tsx src/app/courses/[course]/register/success/page.tsx
git commit -m "feat(capi): Purchase 事件（Recur webhook server CAPI + success 頁 client，TWD/enrollmentId 去重）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Vercel env、setup-token.sh 同步、Test Events 驗證、上線（controller/互動）

**Files:**
- Modify: `~/.meta-ads/setup-token.sh`

- [ ] **Step 1: 設 Vercel Production 環境變數**

在 solo repo 目錄：
```bash
printf '%s' "1593496197630087" | vercel env add NEXT_PUBLIC_META_PIXEL_ID production
source ~/.meta-ads/.env && printf '%s' "$META_ACCESS_TOKEN" | vercel env add META_CAPI_ACCESS_TOKEN production
# 測試期：取 Events Manager test_event_code 後
printf '%s' "<TEST_CODE>" | vercel env add META_CAPI_TEST_CODE production
```
`vercel env ls` 確認三個都在 Production。

- [ ] **Step 2: setup-token.sh 加續期同步**

在 `~/.meta-ads/setup-token.sh` 寫入 `.env` 成功後追加：換發的新長期 token 以 `vercel env rm META_CAPI_ACCESS_TOKEN production -y` 後 `printf '%s' "$LONG_TOKEN" | (cd /Users/vista/06_VibeCoding/01_Code_Products/solo && vercel env add META_CAPI_ACCESS_TOKEN production)`，並 echo 提示「Vercel token 已更新，下次部署生效（或手動 redeploy）」。對齊該腳本實際的 token 變數名。

- [ ] **Step 3: 上線（測試模式）**

- merge 到 main（見 finishing-a-development-branch）→ Vercel 自動 production 部署（`META_CAPI_TEST_CODE` 在 → 事件進 Test Events 不進正式）。

- [ ] **Step 4: Meta Test Events 驗證**

- Events Manager → Vista Pixel → 測試事件：
  1. 在 solo.tw 真跑一次報名送出 → 看到 Lead，browser + server 兩來源、去重成功。
  2. 走一筆測試付款（或觸發 Recur 測試 `order.paid`）→ 看到 Purchase、value/currency 正確、去重成功。
- 都過 → `vercel env rm META_CAPI_TEST_CODE production -y` → redeploy → 事件轉正式。

- [ ] **Step 5: 收尾**

- 確認 Events Manager 正式事件開始累積；一兩週後啟動下一階段（儀表板讀轉換算真實 CPA/ROAS，擴充 vista-ads-ops build-snapshot + warroom）。

## Self-Review（對照 spec）

- §3 meta-capi.ts：Task 1 ✅（hash/payload/parseFbCookies/sendCapiEvent，失敗回 false 不 throw 有測試釘住）
- §4 Lead client+server：Task 3 ✅（enrollmentId 去重、fbp/fbc/ip/ua）
- §5 Purchase server+client：Task 4 ✅（webhook 課程分支、TWD、success 頁 client、enrollmentId 去重、webhook 測試斷言）
- §2 token/env：Task 2 + Task 5 ✅
- §6 Test Events：Task 5 ✅
- §7 setup-token.sh 同步：Task 5 ✅
- 鐵律「失敗不 throw」：Task 1 測試 `fetch rejects → false` 釘住，route/webhook 呼叫端不 await 拋錯 ✅
```
