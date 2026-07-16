## Why

作業系統上線並實際使用後，浮現三個缺口：

1. **沒有付費以外的入場方式。** 學員資格只認 `course_enrollments` 裡 `status='paid'` 的紀錄，整套設計建立在「所有學員都經 Recur 付費」這個假設上，而那個假設是錯的：匯款、贈送、合作換課、助教旁聽都進不來。目前唯一的辦法是往金流表插一筆假的付費紀錄，而那正是設計文件明令不得寫入的表；那筆假資料還會混進 `/admin/enrollments`、名單匯出與人數統計。

2. **發布作業不會通知任何人。** `is_published` 只是可見性開關，學員不會無緣無故回到一個沒去過的網址。作業發布了卻沒人知道，這條動線是斷的。

3. **`course_teachers` 沒有管理介面。** 現有的兩位老師都是以 SQL 手動掛上的，每次要加人都得動資料庫。

## What Changes

- 新增 `course_guests`：老師可手動把非付費學員（匯款、贈送、助教）加入課程。學員資格改為「有 `paid` 報名 **或** 在來賓名單上」。`course_enrollments` 仍然完全不寫入。
- 新增 `/teach/[course]/roster`：老師管理自己課程的來賓名單。
- 新增 `/admin/course-teachers`：平臺管理者指派授課老師，不再需要 SQL。
- 新增「通知學員」按鈕：老師明確按下才寄信給該課全體學員，附上作業連結。**刻意不綁在「發布」的勾選上**：綁在一起的話，改個錯字重新發布就會再寄一次給全班。
- 記錄每次通知的時間、寄件者與收件人數，讓老師看得到「上次通知是什麼時候」。

## Non-Goals

（本變更會建立 design.md，範圍排除與已否決方案詳見該文件。）

## Capabilities

### New Capabilities

- `course-roster`: 課程名冊管理：來賓名單的增刪、授課老師的指派、兩者各自的管理介面與權限歸屬。
- `assignment-notification`: 作業通知：明確觸發的寄信、收件對象、重複寄送的防護與紀錄。

### Modified Capabilities

- `student-access`: 資格判定由「僅限 `paid` 報名」擴充為「`paid` 報名或來賓名單」。

## Impact

**受影響的既有程式碼**

- `supabase/migrations/`：新增 `course_guests` 與 `assignment_notifications` 兩張表。
- `src/lib/assignment-access.ts`：`findEligibleStudent()` 加入來賓查核。
- `src/app/teach/[course]/`：新增 roster 頁與通知按鈕。

**明確不碰**

- **`course_enrollments` 仍然零寫入。** 來賓存在自己的表，金流表永遠只放真的金流。
- Recur webhook、結帳與退款路徑、`courses-config.ts`。
- 既有 `/admin` 的 18 個頁面與 `isAdmin()`（新增的 `/admin/course-teachers` 沿用既有 `isAdmin()` 模式，但不改動它）。
- magic link 與簽章 cookie 的機制。
- 助教不引入角色分級：沿用 `course_teachers`（見 design.md 決策二）。

**新增依賴**

- 無。通知寄信沿用既有的 Resend 整合與 `sendBatchEmails()`。
