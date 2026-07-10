## Why

課程銷售頁上有一批高意向的訪客：他們想報名，但開課當天無法出席。目前 `CourseCard.tsx` 只在課程狀態為 `full`／`coming_soon`／`ended` 時渲染 `WaitlistForm`，因此當課程處於 `open` 或 `filling`（仍有名額）時，這些人**完全沒有留下聯絡方式的入口**，只能關掉頁面離開。他們是最容易轉換的下期學員，卻是目前流失最徹底的一群。

同時，Meta 廣告帶進來的流量落在課程銷售頁，該頁的目標是當期成交。對「有興趣但時間不合」的廣告訪客而言，這一頁沒有任何出口，廣告預算換到的意向就此蒸發。現有的 `vista-ads-ops` 只看得到 CPC 與到達頁次數，看不到名單品質，無法回答「哪一組廣告帶進來的人後來真的報名了」。

現有的 `course_waitlist` 表、`/api/courses/waitlist` route、後臺 CSV 匯出都已存在且運作正常，缺的是入口、確認信、來源歸因與再行銷的觸發方式。

## What Changes

- **擴充 `course_waitlist` schema**：新增 `intent`（`full_waitlist` / `date_conflict` / `ad_lead`）、`utm_source` / `utm_medium` / `utm_campaign` / `utm_content`、`preferred_timeslot`、`notified_at`、`unsubscribed_at`、`updated_at`。`intent` 預設 `full_waitlist`，正確回填既有資料列。
- **開放候補入口到有名額的課程**：`open` / `filling` 狀態的課程卡片加一個次要連結（非主按鈕），點擊後展開既有的 `WaitlistForm`，依課程狀態送出對應的 `intent`。
- **新增確認信**：留下資料後自動寄出 `waitlist-confirm` 信（Resend + React Email，best-effort，寄信失敗不影響資料寫入）。信中以四個帶 HMAC token 的連結回填 `preferred_timeslot`，並提供退訂連結。
- **新增廣告落地頁** `/courses/[course]/notify`：無價格、無報名按鈕，唯一目標是取得 Email。讀取 query string 的 `utm_*` 一併寫入。表單加 honeypot 欄位。
- **擴充後臺** `/admin/waitlist`：依 `course_slug`、`intent`、`utm_campaign` 篩選，顯示 `preferred_timeslot` 分佈；支援選定名單後手動廣播開課通知（`sendBatchEmails`），寄送前顯示收件人數並二次確認，自動排除已退訂者，寄成功寫入 `notified_at`。

## Capabilities

### New Capabilities

- `course-waitlist-capture`: 名單擷取的資料契約與寫入語意，涵蓋 `intent` 分類、UTM 歸因、upsert 衝突處理、honeypot 與限流。
- `waitlist-confirmation-email`: 留資後的自動確認信，含以 HMAC token 連結回填偏好時段與退訂的機制。
- `waitlist-ad-landing`: 課程層級的廣告落地頁，以取得 Email 為唯一目標並保存廣告來源。
- `waitlist-admin-broadcast`: 後臺名單檢視、分眾篩選，以及人工觸發的開課通知廣播。

### Modified Capabilities

（無。本專案目前尚無既有 spec，故沒有需求層級的行為變更。）

## Impact

- **資料庫**：新增一份 migration 於 `supabase/migrations/`，`ALTER TABLE course_waitlist`。既有 `UNIQUE(course_slug, email)` 保留。
- **既有程式**：
  - `src/lib/waitlist.ts`（payload 驗證擴充）
  - `src/app/api/courses/waitlist/route.ts`（接收 `intent`、`utm_*`、honeypot）
  - `src/components/instructor/CourseCard.tsx`（新增次要入口與狀態對應）
  - `src/components/instructor/WaitlistForm.tsx`（文案依 `intent` 切換、honeypot）
  - `src/app/admin/waitlist/page.tsx`、`src/app/api/admin/waitlist/export/route.ts`（篩選與廣播）
- **新增檔案**：`src/components/emails/waitlist-confirm.tsx`、`src/components/emails/cohort-announcement.tsx`、`src/app/courses/[course]/notify/page.tsx`、`src/app/waitlist/preference/route.ts`、`src/app/waitlist/unsubscribe/route.ts`、`src/app/api/admin/waitlist/broadcast/route.ts`
- **環境變數**：新增 `WAITLIST_TOKEN_SECRET`（不沿用 `NEWSLETTER_UNSUBSCRIBE_SECRET`，避免退訂 token 跨系統生效）。
- **不受影響**：`src/lib/workshops.ts`、`course_enrollments` 及其 Recur 金流路徑、`newsletter_subscribers` 既有同步邏輯（新名單仍帶 `waitlist:<slug>` 標籤灌入訂閱池）。
- **外部服務**：Resend（既有）。不新增 cron、不新增依賴套件。
