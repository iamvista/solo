## Context

solo.tw 的課程頁目前把「留下聯絡方式」這件事，綁在「課程已經沒有名額」這個條件上。`CourseCard` 只有在課程狀態為 `full`／`coming_soon`／`ended` 時才渲染 `WaitlistForm`，語意是「額滿候補」。但實際流失的主力是另一群人：課程還有名額，他們也想上，只是**開課當天沒空**。這群人在現行頁面上沒有任何出口。

現有基礎設施比想像中完整，這決定了本次改動的性質是「補齊缺口」而非「新建系統」：

- `course_waitlist` 表已存在，具備 `course_slug`、`instructor_slug`、`name`、`email`、`phone`、`source_page`、`created_at`，並有 `UNIQUE(course_slug, email)`。RLS 開啟且無 policy，僅 service role 可寫。
- `/api/courses/waitlist` 已有限流（`src/lib/rate-limit.ts`，記憶體版，依 IP，10 次／60 秒）、payload 驗證（`src/lib/waitlist.ts`）、upsert，並會 best-effort 同步一筆到 `newsletter_subscribers`（`source='waitlist'`、`tags=['waitlist:<slug>']`）。
- 郵件基建齊備：Resend 加 React Email，`src/lib/email.ts` 提供 `sendEmail` 與 `sendBatchEmails`，`FROM=events@solo.tw`。已有 14 個 template。
- 後臺已有 `/admin/waitlist` 與 CSV 匯出。

缺口有四個：有名額的課程沒有入口；留資後不寄任何信；沒有廣告來源歸因；沒有觸發再行銷的方式。

限制條件：`src/lib/workshops.ts` 的課程是硬編碼陣列，`date` 是自由文字字串，`cohort` 是選填標籤，**資料模型裡不存在結構化的梯次概念**。專案目前完全沒有序列信或排程寄送機制，唯一的排程是 `api/cron/daily-check`。

## Goals / Non-Goals

**Goals:**

- 讓「有興趣但當期無法出席」的訪客在任何課程狀態下都能留下 Email。
- 留資後立刻收到確認信，消除目前的沉默。
- 取得足以決定「下一期何時開」的情報（偏好時段），且不增加表單摩擦。
- 廣告流量有專屬落地頁，並把 `utm_*` 存進名單，讓廣告成效能一路追到名單品質。
- 開新梯次時，能在後臺依課程與意向分眾，一次寄出通知。

**Non-Goals:**

- **不做自動化序列信**（D+0／D+3／D+7 培育信）。需要新建 sequences 表、cron、發信狀態機與退訂處理，工程量是人工廣播的數倍，而目前名單量尚未證明這個投資合理。
- **不建 cron job**。開課通知由人工在後臺觸發。
- **不改 `src/lib/workshops.ts`**，不引入結構化的梯次／排程資料表。人工廣播時由操作者當場填入新梯次日期與報名連結，「下一期」不需要在資料模型中存在。
- **不動 `course_enrollments`** 及其 Recur 金流路徑。
- **不發 SMS**（Twilio 已存在但不納入本次範圍）。
- **不做主題層級（非課程）的名單擷取**。理由見下方決策。
- **不改動 `newsletter_subscribers` 的既有同步邏輯**。

## Decisions

### 沿用 course_waitlist 單表，以 intent 欄位區分名單動機

「額滿候補」與「日期不合、想等下一期」動機不同，但對後續動作而言完全一致：都是留 Email 等通知。另開一張表會換來兩套 API、兩個後臺頁，以及日後對名單做聯集時的 union 查詢。

改為在 `course_waitlist` 上加 `intent text NOT NULL DEFAULT 'full_waitlist' CHECK (intent IN ('full_waitlist','date_conflict','ad_lead'))`。預設值讓既有資料列自動歸位為 `full_waitlist`，**不需要任何回填腳本**，因為在本次改動之前，能寫入這張表的路徑只有額滿候補一種。

「想等下一期」與「日期不合」合併為單一的 `date_conflict`，不再細分。兩者觸發的後續動作相同，多分一類只會讓操作者在後臺多做一次沒有意義的選擇。

### upsert 衝突時保留最早的 intent

`UNIQUE(course_slug, email)` 保留。同一個人可能先在課程頁留下 `date_conflict`，之後又被廣告打到，從落地頁再填一次 `ad_lead`。他的真實身分是「本來就想上課的人」，不該被降級成廣告名單。

因此 `ON CONFLICT` 的行為是：`intent` 維持原值不覆寫；`utm_*` 僅在原欄位為 `NULL` 時補寫（保留首次歸因）；`name`、`phone` 以新值覆寫（使用者可能修正打字錯誤）；`updated_at` 更新為 `now()`。

### 候補入口採次要連結而非主按鈕

在 `open`／`filling` 狀態的課程卡片上直接展開表單，會與「立即報名」搶主要行動點，稀釋當期轉換。改為在報名按鈕下方放一行低調的次要連結（文案近似「這個時間無法參加？留下 Email，下次開課通知你」），點擊後才展開既有的 `WaitlistForm`。

假設：會點這行字的人本來就不會報名當期，因此不損失當期成交。此假設可在上線後以「當期報名數是否下降」驗證。

`intent` 由課程狀態推導，不由使用者選擇：`full` 送 `full_waitlist`，其餘狀態（`open`／`filling`／`coming_soon`／`ended`）送 `date_conflict`。表單標題與送出按鈕文案隨之切換（額滿時說「加入候補」，其餘說「通知我下次開課」）。

### 偏好時段以確認信中的 token 連結回填，不放進表單

表單維持極簡（姓名必填、Email 必填、手機選填），不新增欄位。每多一個必填欄位就掉一截提交率，而「偏好時段」對當下的使用者沒有任何好處，只對營運方有價值。

改為在確認信中放四個連結（平日晚間／週六／週日／都可以），形式為 `/waitlist/preference?token=<token>&slot=<slot>`。使用者點一下即完成，零填寫成本。願意點的人本身就是高意向訊號，這個資料比塞進表單得到的更乾淨。

`preferred_timeslot` 因此是 nullable，且**可被重複點擊覆寫**（使用者改變主意時再點另一個連結即可）。

### 退訂與偏好回填共用獨立的 WAITLIST_TOKEN_SECRET

Token 為 `id.HMAC_SHA256(secret, id)`，以 base64url 編碼。驗證時比對 HMAC 後才信任 `id`。

不沿用既有的 `NEWSLETTER_UNSUBSCRIBE_SECRET`。兩套名單的退訂語意不同（退訂電子報不等於退出候補名單），共用密鑰會讓一方簽出的 token 在另一方生效。新增環境變數 `WAITLIST_TOKEN_SECRET`。

### 退訂需二段確認，偏好回填可直接寫入

企業郵件安全閘道（如 Outlook SafeLinks）會**預先抓取信件中的所有連結**。若退訂是單純的 GET 寫入，使用者根本沒點，名單就被掃描器退訂掉了，且不可逆。

因此 `/waitlist/unsubscribe?token=` 的 GET 只渲染一個確認頁，實際寫入 `unsubscribed_at` 由該頁上的按鈕發出 POST 完成。

`/waitlist/preference?token=&slot=` 則允許 GET 直接寫入。被預抓的後果只是填了一個時段偏好，可被使用者後續點擊覆寫，損害極低，不值得為它加一次點擊。這是刻意的不對稱設計。

### 廣告落地頁採課程層級動態路由，主題層級名單交由 lead magnet 系統

新增 `/courses/[course]/notify`，動態路由，每門課零額外維護成本。頁面移除價格、報名按鈕與匯款資訊，唯一目標是取得 Email。

**不泛化 `course_slug` 以容納主題層級（如「AI 內容產製」「Vibe Coding」）的名單**，也不預留 `list_type` 之類的欄位。理由有二：

其一，延後決策在此處是零成本的。若日後真需要主題層級名單，屆時再加 `list_type text DEFAULT 'course'`，該預設值會**正確回填**所有歷史列，因為在主題落地頁存在之前，這張表不可能出現非課程資料。沒有資料汙染風險，就沒有現在提前抽象的理由。

其二，主題層級的名單本來就不屬於 `course_waitlist`。專案已有 `lead_magnets` / `lead_captures`（含 `email`、`name`、`source_page`、`utm_*`、`email_sent`、`UNIQUE(lead_magnet_id, email)`），其語意正是「以主題誘因換 Email」。分工因此清楚：廣告打特定課程走 waitlist；廣告打主題走既有的 lead magnet 系統。

### 廣告落地頁表單加 honeypot

現有限流是記憶體版、依 IP、10 次／60 秒，擋得住手動灌水，擋不住分散式 bot。廣告落地頁是公開流量入口，必然被掃。全域 grep `honeypot|turnstile|captcha` 在 `src/**` 零命中，代表目前沒有任何機器人防護。

加入一個隱藏欄位（人類不填、機器人會填）。伺服器端偵測到非空即回傳 200 但不寫入資料庫（靜默丟棄，不讓對方學到偵測邏輯）。成本極低，優先於引入 Turnstile 這類外部依賴。

### 開課通知採人工廣播，不建 cron 與序列信

後臺選定課程與名單後，填入新梯次日期與報名連結，以既有的 `sendBatchEmails` 一次寄出。

這個選擇消除了一整類問題：因為「下一期」的資訊由操作者當場輸入，`workshops.ts` 不必長出結構化的梯次概念，也不需要排程去偵測「新梯次出現了」。人工觸發同時是安全閥：對外群發不可逆，寄送前必須顯示「即將寄給 N 人」並二次確認。

## Implementation Contract

**行為（Behavior）**

1. 訪客在任何狀態的課程卡片上都能找到留下 Email 的入口。課程額滿時入口為主要行動點；課程尚有名額時入口為報名按鈕下方的次要連結，點擊後展開表單。
2. 送出表單後，資料寫入 `course_waitlist`，並在數秒內收到一封確認信。寄信失敗時，使用者仍看到成功訊息，資料仍已寫入。
3. 確認信中點擊任一時段連結，該偏好被記錄，並看到致謝頁。重複點擊不同時段會覆寫先前的選擇。
4. 確認信中點擊退訂連結，看到確認頁；按下確認鈕後才真正退訂。未按確認鈕時，名單狀態不變。
5. 廣告訪客在 `/courses/<slug>/notify` 看到無價格、無報名按鈕的頁面，送出 Email 後行為同上，且其 `utm_*` 參數被保存。
6. 管理者在 `/admin/waitlist` 能依課程、意向、廣告活動篩選名單，看到偏好時段分佈，選定後填入新梯次資訊並廣播。廣播對象自動排除已退訂者。

**資料形狀（Data Shape）**

`course_waitlist` 新增欄位：

| 欄位 | 型別 | 約束 |
|---|---|---|
| `intent` | `text` | `NOT NULL DEFAULT 'full_waitlist'`，`CHECK IN ('full_waitlist','date_conflict','ad_lead')` |
| `utm_source` | `text` | nullable |
| `utm_medium` | `text` | nullable |
| `utm_campaign` | `text` | nullable |
| `utm_content` | `text` | nullable |
| `preferred_timeslot` | `text` | nullable，`CHECK IN ('weekday_evening','saturday','sunday','any')` |
| `notified_at` | `timestamptz` | nullable |
| `unsubscribed_at` | `timestamptz` | nullable |
| `updated_at` | `timestamptz` | `NOT NULL DEFAULT now()` |

既有欄位與 `UNIQUE(course_slug, email)` 不變。新增索引：`(intent)`、`(utm_campaign)`。

API 契約：

- `POST /api/courses/waitlist`：request body 在既有的 `{ courseSlug, instructorSlug?, name, email, phone?, sourcePage? }` 之上，新增 `intent`、`utm`（物件，四個選填鍵）、以及 honeypot 欄位。honeypot 非空時回傳 `200 { ok: true }` 但不寫入。回應形狀不變。
- `GET /waitlist/preference?token=&slot=`：token 無效或 slot 不在允許集合時回傳 400 並渲染錯誤頁；成功時寫入並渲染致謝頁。
- `GET /waitlist/unsubscribe?token=`：渲染確認頁，不寫入。
- `POST /waitlist/unsubscribe`：body 帶 token，寫入 `unsubscribed_at`，渲染完成頁。
- `POST /api/admin/waitlist/broadcast`：body 帶篩選條件、梯次日期、報名連結。回應含實際寄送成功與失敗的筆數。

Token 格式：`base64url(id) + "." + base64url(HMAC_SHA256(WAITLIST_TOKEN_SECRET, id))`。

**失敗模式（Failure Modes）**

- 確認信寄送失敗：**靜默**。記錄 log，不影響 API 回應，資料已寫入。這與既有的 `newsletter_subscribers` 同步邏輯採相同模式。
- honeypot 命中：**靜默**。回傳成功，不寫入，不揭露偵測邏輯。
- 限流命中：沿用既有行為（429）。
- token 驗證失敗：**顯性**，回傳 400 並渲染人類可讀的錯誤頁。
- 廣播中途部分失敗：**顯性**。`sendBatchEmails` 的失敗筆數回報給操作者，`notified_at` 僅寫入寄送成功者，允許操作者重試剩餘名單。

**驗收條件（Acceptance Criteria）**

- Migration 套用後，既有 `course_waitlist` 資料列的 `intent` 皆為 `full_waitlist`，且筆數不變。
- 對狀態為 `open` 的課程頁執行 `curl -H "Cache-Control: no-cache"`，回應 HTML 中存在次要入口的文案。
- 以 `intent=date_conflict` POST 至 `/api/courses/waitlist`，資料列寫入且收到確認信。
- 以同一 `(course_slug, email)` 再次 POST 且 `intent=ad_lead`，資料庫中 `intent` 仍為 `date_conflict`，`utm_*` 被補寫，`updated_at` 更新。
- honeypot 欄位帶值 POST，回應 200 且資料庫無新增列。
- 對 `/waitlist/unsubscribe?token=` 發 GET，`unsubscribed_at` 仍為 NULL。
- 竄改 token 任一字元後請求，回傳 400。
- 後臺廣播預覽顯示的收件人數，等於「符合篩選條件且 `unsubscribed_at IS NULL`」的筆數。

**範圍邊界（Scope Boundaries）**

在範圍內：上述 migration、API、兩個 email template、落地頁、偏好與退訂路由、後臺篩選與廣播。

不在範圍內：`workshops.ts`、`course_enrollments`、Recur 金流、SMS、cron、序列信、主題層級名單、把限流換成 Redis 或持久化實作、為既有表單補 honeypot（僅新增的落地頁表單納入）。

## Risks / Trade-offs

- **次要入口稀釋當期報名轉換** → 入口為文字連結而非按鈕，視覺層級明確低於「立即報名」，且表單需點擊後才展開。上線後比對改動前後的當期報名數；若確實下降，退路是把入口移至頁面底部或改為離開意圖觸發。
- **郵件安全閘道預抓連結導致誤退訂** → 退訂採 GET 渲染確認頁、POST 才寫入的二段式。偏好回填刻意不設防，因其後果可逆且損害極低。
- **記憶體版限流在 Vercel 多實例下形同虛設** → 本次不修。廣告落地頁靠 honeypot 擋主要的機器人流量。此限制已知且記錄於此，若日後出現實質灌水再升級為持久化限流。
- **`intent` 保留最早值，可能低估廣告貢獻** → 廣告帶回的舊名單會維持 `date_conflict`，在報表上不計入 `ad_lead`。但 `utm_*` 仍會被補寫，因此廣告歸因仍可透過 `utm_campaign` 查得，不會遺失。這是刻意取捨：身分以最早意圖為準，歸因以首次廣告接觸為準。
- **人工廣播可能誤寄** → 寄送前顯示收件人數並強制二次確認。`notified_at` 記錄上次通知時間，供操作者判斷是否重複。
- **`notified_at` 被覆寫，無法保留完整通知歷史** → 接受。若日後需要完整寄送紀錄，再建 `course_waitlist_notifications` 關聯表。目前的營運需求只需回答「這個人上次被通知是什麼時候」。

## Migration Plan

1. 新增 migration 檔至 `supabase/migrations/`，內容為 `ALTER TABLE course_waitlist` 加欄位與索引。所有新欄位皆為 nullable 或帶預設值，**對既有讀寫路徑向後相容**，可獨立先行套用。
2. 在 Vercel 專案（`solo`）與本地 `.env.local` 設定 `WAITLIST_TOKEN_SECRET`，並更新 `.env.local.example`。
3. 部署程式碼。
4. 依驗收條件逐項驗證，特別是 migration 後既有資料列的 `intent` 值與筆數。

回滾策略：程式碼以 Vercel 回滾至前一次部署即可，新欄位留在資料庫中不造成傷害（舊版程式不讀取它們）。`DROP COLUMN` 僅在確認不再需要時執行，且會遺失已收集的 `intent` 與 UTM 資料，因此預設不回滾 schema。

## Open Questions

- 確認信的寄件人是否沿用 `events@solo.tw`，或另設 `courses@solo.tw`？目前假設沿用，待 Vista 確認。
- 廣播用的 `cohort-announcement` 信是否需要支援純文字版本以提升送達率？目前假設沿用其餘 13 個 template 的既有做法。
