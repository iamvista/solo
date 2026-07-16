## Why

solo.tw 的課程學員目前沒有繳交作業的地方，回放影片、講義、1-on-1 預約連結也沒有發放機制，只能靠人工寄信。作業的用意是促使學員動手練習，因此獎勵應在繳交當下自動解鎖，老師不該是瓶頸。

此外，Susie 老師即將開課，而現行權限模型（`src/lib/supabase/admin.ts` 內硬編碼的 `ADMIN_EMAILS`）容納不了第二位老師，也無法讓不同老師只看到自己課程的學員資料。

## What Changes

- 學員可在課程頁繳交作業，支援檔案上傳、文字內容、外部連結三種形式，可重複繳交（就地更新）。
- 繳交後，該份作業掛載的獎勵（回放影片、講義下載、1-on-1 預約連結）於同頁自動解鎖。
- 新增 `/teach` 老師後臺，供授課老師管理作業與獎勵、檢視繳交名單、撰寫評語。老師權限改由 `course_teachers` 對應表決定，不再硬編碼。
- `course_enrollments` 新增 `user_id` 欄位並以 email 回填，將報名紀錄與登入帳號綁定。學員須登入才能繳交作業。
- 新增私有 Supabase Storage bucket 存放學員作業與講義，並將 bucket 定義納入 migration。

## Non-Goals

（本變更會建立 design.md，範圍排除與已否決方案詳見該文件。）

## Capabilities

### New Capabilities

- `enrollment-identity`: 報名紀錄與登入帳號的綁定：`user_id` 欄位、email 回填、登入時認領、對不上時的人工綁定。
- `assignment-submission`: 作業的定義與繳交：作業內容、允許的繳交形式、學員繳交與重繳、檔案上傳。
- `submission-rewards`: 繳交後的獎勵解鎖：獎勵的三種型態、解鎖判定、內容取用授權。
- `course-teaching-access`: 課程層級的教學權限：老師與課程的對應、資料隔離、批改介面的存取控制。

### Modified Capabilities

（無。既有的 waitlist 相關 spec 不受影響。）

## Impact

**受影響的既有程式碼**

- `supabase/migrations/`：新增 migration（`course_enrollments` 加欄位、回填、五張新表、私有 bucket）。
- `src/app/api/courses/register/route.ts`：報名時若有 session 即帶入 `user_id`。此為結帳路徑上的唯一改動，不影響付款流程。
- `src/middleware.ts`：保護路由清單加入 `/teach` 與 `/api/teach`。

**明確不碰**

- Recur webhook（`src/app/api/webhooks/recur/route.ts`）與任何結帳、金流、退款路徑。
- 課程設定檔 `src/lib/courses-config.ts` 維持原狀，課程資料不搬進資料庫。
- 既有 `/admin` 的 18 個頁面與 `isAdmin()` 權限模型維持原狀。
- `consulting_enrollments` / `consulting_sessions` 時數模型不串接。

**新增依賴**

- 無新增 npm 套件。
- 需建立本機 Supabase CLI 環境（`supabase init`），repo 目前無 `supabase/config.toml`，而 RLS 資料隔離必須以真實資料庫驗證。
