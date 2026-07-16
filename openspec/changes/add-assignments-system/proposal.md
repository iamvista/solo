## Why

solo.tw 的課程學員目前沒有繳交作業的地方，回放影片、講義、1-on-1 預約連結也沒有發放機制，只能靠人工寄信。作業的用意是促使學員動手練習，因此獎勵應在繳交當下自動解鎖，老師不該是瓶頸。

此外，Susie 老師即將開課，而現行權限模型（`src/lib/supabase/admin.ts` 內硬編碼的 `ADMIN_EMAILS`）容納不了第二位老師，也無法讓不同老師只看到自己課程的學員資料。

## What Changes

- 學員以 email 收取 magic link 進入作業區，系統核對該 email 有無該課程 `status='paid'` 的報名紀錄。學員無須註冊帳號。
- 學員可繳交作業，支援檔案上傳、文字內容、外部連結三種形式，可重複繳交（就地更新）。
- 繳交後，該份作業掛載的獎勵（回放影片、講義下載、1-on-1 預約連結）於同頁自動解鎖。
- 新增 `/teach` 老師後臺，供授課老師管理作業與獎勵、檢視繳交名單、撰寫評語。老師沿用既有 Supabase Auth 登入，權限改由 `course_teachers` 對應表決定，不再硬編碼。
- 新增私有 Supabase Storage bucket 存放學員作業與講義，並將 bucket 定義納入 migration。

## Non-Goals

（本變更會建立 design.md，範圍排除與已否決方案詳見該文件。）

## Capabilities

### New Capabilities

- `student-access`: 學員進入作業區的資格核對與工作階段：報名資格查核、magic link 簽發與驗證、簽章 cookie。
- `assignment-submission`: 作業的定義與繳交：作業內容、允許的繳交形式、學員繳交與重繳、檔案上傳。
- `submission-rewards`: 繳交後的獎勵解鎖：獎勵的三種型態、解鎖判定、內容取用授權。
- `course-teaching-access`: 課程層級的教學權限：老師與課程的對應、資料隔離、批改介面的存取控制。

### Modified Capabilities

（無。既有的 waitlist 相關 spec 不受影響。）

## Impact

**受影響的既有程式碼**

- `supabase/migrations/`：新增 migration（六張新表、私有 bucket）。
- `src/middleware.ts`：保護路由清單加入 `/teach` 與 `/api/teach`。

**明確不碰**

- **`course_enrollments` 完全不動。** 不加欄位、不回填、不改結構，僅以 email 讀取查核報名資格。
- Recur webhook（`src/app/api/webhooks/recur/route.ts`）與任何結帳、付款、退款路徑。
- 課程設定檔 `src/lib/courses-config.ts` 維持原狀，課程資料不搬進資料庫。
- 既有 `/admin` 的 18 個頁面與 `isAdmin()` 權限模型維持原狀。
- 既有 Supabase Auth 的登入、註冊、`profiles` 流程。學員不使用帳號系統，老師沿用現況。
- `consulting_enrollments` / `consulting_sessions` 時數模型不串接。

**新增依賴**

- 無新增 npm 套件。magic link 寄送沿用既有的 Resend 整合。
- 新增一個環境變數作為學員 cookie 的簽章金鑰。
