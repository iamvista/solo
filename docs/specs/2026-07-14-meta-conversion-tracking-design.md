# solo.tw Meta 轉換追蹤（Lead + Purchase, Pixel + CAPI）設計文件

- 日期：2026-07-14
- 動機：讓廣告戰情室（lab.vista.tw/warroom）能顯示真實 CPA/ROAS 而非代理指標。現況：solo.tw 已裝 Vista Pixel（`1593496197630087`）但只打 PageView，無任何轉換事件、無 CAPI；兩支廣告落地頁都在 solo.tw 課程頁。
- 拍板（Vista 2026-07-14）：追 Lead + Purchase；client pixel + server CAPI 雙軌；CAPI 用現有 60 天 user token（廣告帳號/pixel 為個人資產、不在 Business Manager，System User 永久權杖需先搬遷故暫不做），續期時同步更新 Vercel。

## 1. 範圍與非目標

做：solo.tw 一站，在現有 pixel 上加 Lead（報名送出）與 Purchase（Recur 付款成功）兩事件，各以 client fbq + server CAPI 雙軌送、用 event_id 去重。
不做（本 spec 外）：
- 儀表板讀轉換數據算真實 CPA/ROAS ＝ 下一階段（等事件累積一兩週後，另做，擴充 vista-ads-ops 的 build-snapshot + warroom）。
- 廣告最佳化目標從 LANDING_PAGE_VIEWS 改成轉換 ＝ 事件量穩定後才切，非本 spec。
- 其他數位商品（army-kit / ai-coach-kit 等）的 Purchase ＝ 只做課程（`config.kind === "course"`），其他日後再映射。
- 搬遷 pixel/廣告帳號進 Business Manager、換 System User 永久權杖 ＝ 獨立任務。

## 2. Token 與環境變數

- CAPI 用現有 `~/.meta-ads/.env` 的 `META_ACCESS_TOKEN`（已實測能對 pixel `1593496197630087` 送事件，回 `events_received:1`）。60 天期，約 2026-09-02 到期。
- 新增 solo 環境變數（`.env.local.example` 補註解、Vercel Production 設值）：
  - `NEXT_PUBLIC_META_PIXEL_ID=1593496197630087`（公開，取代 layout.tsx 寫死值）
  - `META_CAPI_ACCESS_TOKEN=<現有 user token>`（server-only，絕不上 client）
- **續期同步**：在 `~/.meta-ads/setup-token.sh` 尾端加一步，換發新 token 後同時 `vercel env` 更新 solo 的 `META_CAPI_ACCESS_TOKEN`（Production），一個指令同時更新 `.env` 與 Vercel。詳見 §7。

## 3. CAPI 傳送庫 `src/lib/meta-capi.ts`（新檔）

比照 repo 既有風格：原生 `fetch`（如 `src/lib/line.ts`）、Node 內建 `crypto`（如 `src/lib/waitlist-token.ts`）。無新套件。

介面：
```ts
type CapiUserData = { email?: string; phone?: string; firstName?: string;
                      fbp?: string; fbc?: string; clientIp?: string; userAgent?: string };
type CapiEvent = {
  eventName: "Lead" | "Purchase";
  eventId: string;                 // 去重 key，需與 client fbq 的 eventID 一致
  eventSourceUrl: string;
  actionSource: "website";
  user: CapiUserData;
  customData?: { value?: number; currency?: string };
};
// 送一個事件到 Graph API /{pixelId}/events。失敗只 log、回 boolean，NEVER throw（不可拖垮報名/webhook 主流程）。
export async function sendCapiEvent(ev: CapiEvent): Promise<boolean>;
```

實作要點：
- pixel id 讀 `process.env.NEXT_PUBLIC_META_PIXEL_ID`，token 讀 `process.env.META_CAPI_ACCESS_TOKEN`；缺任一 → 直接 return false（不擋主流程、log warn）。
- PII 一律 `crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex")`；email 全小寫去空白、phone 用 E.164 去掉非數字、firstName 小寫。空值不放進 user_data。
- POST `https://graph.facebook.com/v23.0/{pixelId}/events`，body 帶 `data=[{event_name,event_time(秒),event_id,event_source_url,action_source,user_data,custom_data}]`、`access_token`；測試期帶 `test_event_code`（見 §6）。
- `user_data` 盡量帶 `fbp`/`fbc`（從 cookie `_fbp`/`_fbc`）、`client_ip_address`、`client_user_agent` 提高配對率。
- 逾時保護：`AbortSignal.timeout(3000)`；catch 全部吞掉回 false。

## 4. Lead 事件（報名送出）

去重 key：`event_id = enrollmentId`（client 與 server 同值）。

### 4a. Client pixel：`src/app/courses/[course]/register/CourseRegistrationForm.tsx`
- 位置：第 166 行後（`json.ok` 為真、已解構 `customerEmail`/`customerName`/`enrollmentId`）、第 174 行 `redirectToCheckout` 前。
- 動作：
```ts
if (typeof window !== "undefined" && (window as any).fbq) {
  (window as any).fbq("track", "Lead", { content_name: productId }, { eventID: enrollmentId });
}
```
- fbq 由 layout.tsx pixel base code 掛在 window（`strategy="afterInteractive"`）；報名送出是使用者互動後的晚期，fbq 已就緒，但仍以 `window.fbq` 存在與否做保護。

### 4b. Server CAPI：`src/app/api/courses/register/route.ts`
- 位置：`Response.json({ ok:true, ... })`（約第 226 行）前，`row.id` 已產生（約第 203 行後）。
- 動作：`await sendCapiEvent({ eventName:"Lead", eventId: row.id, eventSourceUrl: <報名頁 URL>, actionSource:"website", user:{ email: body.email, phone: phoneParsed.e164, firstName: body.name, fbp: <cookie _fbp>, fbc: <cookie _fbc>, clientIp: <req ip>, userAgent: <req UA> } })`。
- 讀 cookie/header：route handler 用 `request.headers.get("cookie")` 解 `_fbp`/`_fbc`、`request.headers.get("user-agent")`、`x-forwarded-for` 取 IP。
- 不可 throw：sendCapiEvent 已吞錯回 false；即使 false 也照常回傳報名成功（追蹤失敗不能害報名失敗）。

## 5. Purchase 事件（付款成功）

去重 key：`event_id = enrollmentId`（webhook 與 success 頁同值；與 Lead 不同事件名，互不干擾）。幣別：固定 `"TWD"`（webhook 無 currency 欄位，solo 課程皆臺幣銷售）。

### 5a. Server CAPI（權威來源）：`src/app/api/webhooks/recur/route.ts`
- 位置：`handleOrderPaid` 內、`markEnrollmentPaid` 完成後（約第 224 行後）、限 `config.kind === "course"`（約第 271 行）分支。
- 可用欄位：`orderId`=`data.id`、`email`=`data.customer?.email`、`amount`=`data.amount`、`enrollmentId`（由 `findPendingEnrollment` 反查得）。
- 動作：`await sendCapiEvent({ eventName:"Purchase", eventId: enrollmentId, eventSourceUrl:"https://www.solo.tw/", actionSource:"website", user:{ email }, customData:{ value: amount, currency:"TWD" } })`。
- webhook 是 server-to-server，無 fbp/fbc/UA/IP（使用者不在瀏覽器）；只帶 hash email，Meta 仍可配對。
- 已在 `order.paid` 且付款確認後，安全。sendCapiEvent 失敗只 log、不影響 webhook 既有邏輯與回應。

### 5b. Client pixel（best-effort 補配對）：`src/app/courses/[course]/register/success/page.tsx`
- success 頁是 server component，已 fetch 到 `enrollment`（`amount`/`status`/`email`、`isPaid = status==="paid"`）。
- 新增小 client 子元件 `PurchasePixel.tsx`（`"use client"`），props：`{ eventId, value }`；在 `useEffect` 內、`window.fbq` 存在時打 `fbq("track","Purchase",{value,currency:"TWD"},{eventID})`。
- 在 success page 僅當 `isPaid` 為真時 render `<PurchasePixel eventId={enrollment.id} value={enrollment.amount} />`。
- 坑：使用者到 success 頁時 webhook 可能還沒處理完（`isPaid` 暫為 false）→ 這次不打 client Purchase，靠 5a 的 webhook CAPI 補；兩邊同 `event_id=enrollmentId` → Meta 去重不重複計。

## 6. 測試（上線前必做，用 Meta Test Events）

- Events Manager → Vista Pixel → 測試事件（Test Events）分頁取 `test_event_code`。
- 實作時 `sendCapiEvent` 支援讀 `process.env.META_CAPI_TEST_CODE`（存在就帶 `test_event_code`，事件只進 Test Events 不進正式數據）。
- 驗證清單（都在 Test Events 面板看到、且標「已透過瀏覽器與伺服器接收＝去重成功」）：
  1. 報名送出 → Lead 出現，browser + server 兩來源同 event_id 去重。
  2. 走完一筆測試付款（或 Recur 測試 webhook）→ Purchase 出現、value/currency 正確。
- 驗證過 → 移除 `META_CAPI_TEST_CODE`（Vercel 拿掉該變數）→ 事件轉正式。

## 7. setup-token.sh 續期同步

- 在 `~/.meta-ads/setup-token.sh` 換發並寫入 `.env` 成功後追加：把新 token 以 `vercel env rm META_CAPI_ACCESS_TOKEN production -y` + `printf '%s' "$NEW_TOKEN" | vercel env add META_CAPI_ACCESS_TOKEN production`（在 solo repo 目錄跑，或 `vercel --cwd`）更新 Vercel Production，並提示「需 redeploy 或下次部署生效」。
- 效果：續期一個指令同時更新 `.env` 與 Vercel，CAPI 不會因 token 過期靜默失效。

## 8. 涉及檔案

新增：
- `solo/src/lib/meta-capi.ts`（CAPI 傳送＋hash）
- `solo/src/app/courses/[course]/register/success/PurchasePixel.tsx`（client 子元件）

修改：
- `solo/src/app/courses/[course]/register/CourseRegistrationForm.tsx`（client Lead）
- `solo/src/app/api/courses/register/route.ts`（server CAPI Lead）
- `solo/src/app/api/webhooks/recur/route.ts`（server CAPI Purchase）
- `solo/src/app/courses/[course]/register/success/page.tsx`（掛 PurchasePixel）
- `solo/src/app/layout.tsx`（pixel id 改讀 `NEXT_PUBLIC_META_PIXEL_ID`）
- `solo/.env.local.example`（補兩個變數註解）
- `~/.meta-ads/setup-token.sh`（續期同步 Vercel）
- Vercel 專案 solo：Production 設 `NEXT_PUBLIC_META_PIXEL_ID`、`META_CAPI_ACCESS_TOKEN`（＋測試期 `META_CAPI_TEST_CODE`）

## 9. 部署與驗證

- solo.tw：merge main → Vercel 自動 production 部署。
- 上線後：Meta Test Events 走完 §6 驗證；確認 Events Manager 正式事件開始進；一兩週後啟動下一階段（儀表板讀轉換）。
- 鐵律：追蹤程式一律「失敗只 log、不 throw」，NEVER 因追蹤問題害到報名或 webhook 金流主流程。
