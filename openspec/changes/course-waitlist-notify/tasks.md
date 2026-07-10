## 1. 資料庫 schema

- [x] 1.1 依「沿用 course_waitlist 單表，以 intent 欄位區分名單動機」新增 migration，使 `course_waitlist` 具備 `intent` 欄位（`NOT NULL DEFAULT 'full_waitlist'`，CHECK 限定三值）。滿足 "Waitlist entries record the visitor's intent"。驗證：於本地套用 migration 後執行 `SELECT intent, count(*) FROM course_waitlist GROUP BY intent`，既有列全數為 `full_waitlist` 且總筆數與套用前一致。
- [x] 1.2 同一份 migration 加入 `utm_source` / `utm_medium` / `utm_campaign` / `utm_content` 四個 nullable 欄位與 `(utm_campaign)` 索引，滿足 "Waitlist entries preserve advertising attribution"。驗證：`\d course_waitlist` 顯示四欄與索引存在，且既有列該四欄皆為 NULL。
- [x] 1.3 同一份 migration 加入 `preferred_timeslot`（CHECK 限定四值）、`notified_at`、`unsubscribed_at` 與 `updated_at`（`NOT NULL DEFAULT now()`），並加上 `(intent)` 索引，滿足 "Waitlist rows carry scheduling preference and lifecycle timestamps"。驗證：插入一筆測試列後確認三個 lifecycle 欄位為 NULL、`updated_at` 已填；插入非法 `preferred_timeslot` 值時資料庫拒絕。
- [x] 1.4 在 `.env.local.example` 宣告 `WAITLIST_TOKEN_SECRET`，並依「退訂與偏好回填共用獨立的 WAITLIST_TOKEN_SECRET」確認其與 `NEWSLETTER_UNSUBSCRIBE_SECRET` 為不同變數。驗證：`grep WAITLIST_TOKEN_SECRET .env.local.example` 命中，且程式中無任何位置以 newsletter 密鑰簽發 waitlist token。

## 2. 擷取端點

- [x] 2.1 擴充 waitlist payload 驗證，接受 `intent`、`utm` 物件與 honeypot 欄位，非法 `intent` 值一律拒絕。滿足 "Waitlist entries record the visitor's intent" 與 "Waitlist entries preserve advertising attribution"。驗證：對驗證函式撰寫單元測試，涵蓋合法三值、非法值、缺漏 `utm` 三種輸入。
- [x] 2.2 依「upsert 衝突時保留最早的 intent」在 migration 中建立 `upsert_course_waitlist` 資料庫函式，於單一 `ON CONFLICT DO UPDATE` 語句內完成：`intent` 不覆寫、`utm_*` 以 `coalesce` 僅在原值為 NULL 時補寫、`name` 與 `phone` 覆寫、`updated_at` 更新，並回傳寫入列的 `id`。端點改以 `supabase.rpc()` 呼叫。滿足 "Repeat submissions preserve the earliest intent and first-touch attribution"。驗證：以同一 `(course_slug, email)` 連續 POST 兩次（先 `date_conflict` 無 UTM，後 `ad_lead` 帶 `utm_campaign`），查詢資料庫確認 `intent` 仍為 `date_conflict`、`utm_campaign` 已補寫、`updated_at` 已更新，且回應回傳的 `id` 兩次相同。
- [x] 2.3 端點偵測到 honeypot 欄位非空時回傳與正常提交相同的 200 成功回應且不寫入任何列，滿足 "The capture endpoint rejects bot submissions silently"。驗證：帶 honeypot 值 POST 後回應為 200，且 `SELECT count(*)` 與 POST 前相同；比對成功回應 body 與正常提交完全一致。
- [x] 2.4 確認限流、既有 payload 驗證，以及 `newsletter_subscribers` 的 best-effort 同步在改動後行為不變，滿足 "The capture endpoint retains its existing protections and side effects"。驗證：超過限流回傳 429 且無列寫入；以 stub 讓 newsletter 同步拋錯，端點仍回傳成功且 waitlist 列已持久化。

## 3. 課程頁入口

- [x] 3.1 依「入口抽為共用的 NextCohortNotify 元件，裝進每個銷售頁」新增 `NextCohortNotify` client 元件：依課程狀態決定入口樣式與 `intent`，展開後渲染 `WaitlistForm`，並接受呼叫端傳入的 `sourcePage`。同時把 `WaitlistForm` 的 `source_page` 由硬編碼改為 props、`instructorSlug` 改為選填。滿足 "Every course surface exposes an entry to the notification list"。驗證：元件測試斷言五種課程狀態送出的 `intent` 與呈現文案符合 spec 對照表，且 `source_page` 等於傳入值。
- [x] 3.2 依「候補入口採次要連結而非主按鈕」，`open` 與 `filling` 狀態時入口為報名按鈕下方的次要文字連結、點擊後才展開表單，`full` 狀態時表單為主要行動點。驗證：元件測試斷言 `open` 狀態下不存在第二個 primary 樣式的按鈕；`full` 狀態下表單直接可見。
- [x] 3.3 `CourseCard` 改用 `NextCohortNotify`，行為與現況等價且 `open`／`filling` 新增入口。驗證：`/teachers/<slug>` 頁面在 `full`、`coming_soon`、`ended` 三種狀態下的入口與改動前一致，`open` 狀態新增次要連結。
- [x] 3.4 把 `NextCohortNotify` 裝進 9 個課程銷售頁的報名按鈕下方，每頁僅新增 import 與元件呼叫兩行，不重構頁面其餘部分，並傳入該頁自身路徑作為 `sourcePage`。驗證：`git diff --stat src/app/courses/*/page.tsx` 顯示每檔僅增加 2 行；對狀態為 `open` 的線上銷售頁執行 `curl -H "Cache-Control: no-cache"`，回應 HTML 含次要入口文案。

## 4. 確認信與 token 路由

- [x] 4.1 實作 token 簽發與驗證工具，格式為 `base64url(id) + "." + base64url(HMAC_SHA256(WAITLIST_TOKEN_SECRET, id))`，滿足 "Preference and unsubscribe links are authenticated by a signed token"。驗證：單元測試涵蓋合法 token 通過、竄改任一字元後拒絕、以 newsletter 密鑰簽出的 token 被拒絕。
- [x] 4.2 新增 `waitlist-confirm` React Email template 並在名單寫入後以 best-effort 寄出，寄信失敗不影響 API 回應與資料持久化，滿足 "A confirmation email is sent after a waitlist entry is captured"。驗證：以 stub 讓 Resend 拋錯，端點仍回傳成功且列存在、錯誤已寫入 log；honeypot 命中的提交不觸發寄信。
- [x] 4.3 依「偏好時段以確認信中的 token 連結回填，不放進表單」，於信中放置四個時段連結，並實作 GET `/waitlist/preference` 直接寫入 `preferred_timeslot` 後渲染致謝頁，重複點擊可覆寫。滿足 "The confirmation email collects a preferred timeslot through one-click links"。驗證：以合法 token 依序請求 `saturday` 與 `sunday`，資料庫最終值為 `sunday`；非法 slot 回傳 400 且欄位不變；確認 waitlist 表單本身未新增時段欄位。
- [x] 4.4 依「退訂需二段確認，偏好回填可直接寫入」，GET `/waitlist/unsubscribe` 僅渲染確認頁不寫入，POST 才寫入 `unsubscribed_at`，滿足 "Unsubscribing requires an explicit second step"。驗證：對退訂連結發 GET 後查詢 `unsubscribed_at` 仍為 NULL；POST 後該欄位被填入。

## 5. 廣告落地頁

- [x] 5.1 依「廣告落地頁採課程層級動態路由，主題層級名單交由 lead magnet 系統」新增 `/courses/[course]/notify` 動態路由，未知 slug 回傳 404，滿足 "Every course exposes a dedicated notify landing page"。驗證：對既有課程 slug 請求得 200 且頁面含課程標題；對不存在的 slug 請求得 404。
- [x] 5.2 落地頁不呈現價格、報名按鈕與匯款資訊，唯一行動點為 Email 表單，滿足 "The landing page pursues email capture as its only conversion goal"。驗證：`curl -H "Cache-Control: no-cache"` 抓取頁面 HTML，grep 價格字樣、報名連結與匯款關鍵字皆零命中。
- [x] 5.3 落地頁自 query string 讀取四個 `utm_*` 並隨表單送出，且固定送出 `intent='ad_lead'`，滿足 "The landing page form carries advertising attribution and intent"。驗證：帶 UTM 參數提交後查詢資料庫，四欄值正確且 `intent` 為 `ad_lead`；不帶參數提交時四欄為 NULL 且不報錯。
- [x] 5.4 依「廣告落地頁表單加 honeypot」加入對視覺與輔助技術皆隱藏的誘餌欄位並送至端點，滿足 "The landing page form includes a honeypot field"。驗證：渲染後 HTML 含該欄位且具 `aria-hidden` 與視覺隱藏樣式；模擬填滿所有欄位提交後無新列寫入。

## 6. 後臺分眾與廣播

- [x] 6.1 後臺名單頁支援依 `course_slug`、`intent`、`utm_campaign` 篩選並顯示 `preferred_timeslot` 分佈，CSV 匯出遵循當前篩選，滿足 "The admin waitlist view supports segmentation"。驗證：套用 `intent=date_conflict` 篩選後，列表與匯出的 CSV 列數一致且皆為該 intent；時段分佈總和等於列表筆數。
- [x] 6.2 依「開課通知採人工廣播，不建 cron 與序列信」新增 `cohort-announcement` template 與廣播端點，梯次日期與報名連結由操作者於廣播時輸入而非讀自 `workshops.ts`，滿足 "Cohort announcements are broadcast manually"。驗證：在 `workshops.ts` 新增一筆課程後不觸發任何寄信；操作者手動廣播時信件內容含其輸入的日期與連結。程式中無新增 cron 或排程設定。
- [x] 6.3 廣播收件人集合排除 `unsubscribed_at IS NOT NULL` 的名單，滿足 "Broadcasts exclude unsubscribed recipients"。驗證：將一筆符合篩選的名單標記退訂後執行廣播，該地址未收信且不計入收件人數。
- [x] 6.4 廣播前顯示確切收件人數並要求二次確認，滿足 "A broadcast requires an explicit confirmation of its blast radius"。驗證：介面顯示的人數等於「符合篩選且 `unsubscribed_at IS NULL`」的查詢結果；未按下確認鈕時無任何寄送且無 `notified_at` 寫入。
- [x] 6.5 廣播僅對寄送成功者寫入 `notified_at`，並向操作者回報成功與失敗筆數以便重試，滿足 "Broadcast outcomes are recorded and partial failures are surfaced"。驗證：以 stub 讓部分收件人寄送失敗，確認成功者 `notified_at` 更新、失敗者維持原值，且介面顯示的成功與失敗筆數與 stub 設定相符。

## 7. 部署與驗證

- [ ] 7.1 於 Vercel 專案 `solo` 與本地環境設定 `WAITLIST_TOKEN_SECRET`，確保 token 路由在正式環境可運作。驗證：部署後對正式站的偏好連結發出一次請求並得到致謝頁而非 500。
- [ ] 7.2 依 design.md 的 Migration Plan 先套用 migration 再部署程式碼，確認向後相容。驗證：migration 套用後、程式碼部署前，既有課程頁與現行 waitlist 提交流程仍正常運作。
- [ ] 7.3 逐項執行 design.md「驗收條件」清單並記錄結果，未通過項目回到對應任務修正。驗證：八項驗收條件全數通過，其中線上頁面驗證一律使用 `curl -H "Cache-Control: no-cache"`。
