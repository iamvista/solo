## Context

作業系統於 2026-07-16 上線，Vista 隨即建立了第一份真實作業。實際使用暴露三個當初沒設計到的缺口：非付費者無法入場、發布不通知任何人、`course_teachers` 只能靠 SQL 維護。

第一個缺口最嚴重，因為目前的變通做法本身就是設計文件明令禁止的事：往 `course_enrollments` 插一筆假的 `paid` 紀錄。開發期的 E2E 測試就是這樣做的（`amount=0`、姓名標「【測試勿計】」，事後刪除）。那是 hack，不是解法：假資料存在期間會出現在 `/admin/enrollments`、名單匯出與人數統計，而那張表是金流紀錄。

可複用的既有基礎：`sendBatchEmails()`（Resend Batch API，單次最多 100 封）已用於 waitlist 群發；`requireCourseTeacher()` 與 `isAdmin()` 兩套授權模型已就位且刻意分離；`findEligibleStudent()` 是學員資格的單一判定點。

## Goals / Non-Goals

**Goals:**

- 老師能把匯款、贈送、合作換課、助教等非付費者加入課程，而不碰金流表。
- 老師能明確地通知學員「有新作業」，並知道上次通知是什麼時候。
- 指派授課老師不再需要動資料庫。

**Non-Goals:**

- **`course_enrollments` 仍然零寫入。** 這是本變更存在的理由，不是可以妥協的細節。
- **不做助教角色分級。** 助教即老師（見決策二）。
- **不做自動通知。** 發布不寄信，永遠只有人按下按鈕才寄（見決策三）。
- **不做通知的排程、預覽、分眾。** 一份作業、一封信、全體學員。
- **不做來賓的自助申請或邀請碼。** 老師手動加，量小。
- 不碰 Recur、結帳、退款、magic link 機制、既有 `/admin` 頁面。

## Decisions

### 來賓存在自己的表，金流表永遠只放金流

新增 `course_guests`（課程、email、姓名、備註、誰加的、何時）。學員資格改為「有 `paid` 報名 **或** 在來賓名單上」。

**替代方案：** 往 `course_enrollments` 插 `status='comp'` 或 `amount=0` 的紀錄。改動最小，但那張表是付款紀錄：一筆沒付過錢的列會混進營收統計、名單匯出、`/admin/enrollments`，而且未來任何讀那張表的人都得記得排除它。**否決**：資料表的語意應該保持乾淨，「誰付了錢」與「誰能進教室」本來就是兩件事，只是先前恰好重疊。

**替代方案：** 在 `course_enrollments` 加一個 `is_comp` 旗標。同樣汙染金流表，且需要改動那張表的結構。**否決。**

### 助教即老師，不做角色分級

助教直接掛進 `course_teachers`，與授課老師同權：能看繳交、寫評語，也能建立與刪除作業和資源。

**替代方案：** 新增 `role`（owner / assistant），讓助教碰不到作業與資源的 CRUD。更安全，但每一支 teach route 都要多一層判斷，而且要回答一連串新問題（助教能不能加來賓？能不能加別的助教？）。**否決**：Vista 已確認助教是信任的人，此刻的複雜度換不到對等的價值。若日後真的需要，`course_teachers` 加一欄即可，不必重來。

### 通知是明確動作，永遠不是發布的副作用

「通知學員」是獨立按鈕，與 `is_published` 完全解耦。

**替代方案：** 勾「發布給學員」時自動寄信。少一個按鈕，但老師改個錯字重新發布就會再轟炸全班一次。副作用式的寄信是最容易出事的設計：寄出去的信收不回來，而「儲存」這個動作在使用者心中不該有對外後果。**否決。**

未發布的作業 SHALL NOT 可通知：通知一份學員點進去看不到的作業，只會製造客訴。

### 通知只寄給看得到的人，且記錄每一次寄送

收件對象是該課程全體有資格的學員（`paid` 報名 + 來賓），與學員端的資格判定共用同一個函式，不另寫一套。

每次寄送記錄於 `assignment_notifications`（作業、寄件者、時間、收件人數）。老師在按鈕旁看得到「上次通知：X」。

**替代方案：** 在 `assignments` 加 `last_notified_at`。少一張表，但答不出「寄過幾次、誰寄的」，而這正是老師猶豫「我到底寄了沒」時想知道的。**否決。**

系統**不阻止**重複寄送：老師可能真的想再提醒一次。防護是「看得到上次寄送時間」與「按鈕需二次確認」，而不是硬性封鎖。

### 來賓歸老師管，指派老師歸平臺管理者管

- `course_guests`：授課老師可增刪（他們才知道誰匯了款）。
- `course_teachers`：僅平臺管理者可指派（授予教學權限是平臺層級的信任決定，不該由老師互相授予）。

此劃分沿用既有的兩套授權模型，不新增第三套，也不讓兩者互相繼承。

## Implementation Contract

### 資料模型

兩張新表，皆啟用 RLS 且不設任何 policy（與既有新表一致，授權在 route handler）：

- **`course_guests`**：`id` uuid pk、`course_id` text not null、`email` text not null（小寫，check 約束）、`name` text、`note` text、`added_by` uuid → `profiles(id)`、`created_at`。unique `(course_id, email)`。
- **`assignment_notifications`**：`id` uuid pk、`assignment_id` uuid not null → `assignments(id)` on delete cascade、`sent_by` uuid → `profiles(id)`、`recipient_count` int not null、`sent_at` timestamptz not null default now()。

`course_enrollments` 零改動。

### 資格判定

`findEligibleStudent(courseId, email)` 改為：先查 `paid` 報名，未命中則查 `course_guests`。命中任一即有資格；姓名取自命中的那筆紀錄。兩者皆未命中則無資格。

此函式是學員資格的唯一判定點，通知的收件名單也由它衍生，不另寫一套查詢。

### 介面

- `GET/POST/DELETE /api/teach/roster`：授課老師管理自己課程的來賓。POST 收 `{ course_id, email, name, note }`；DELETE 收來賓 id。非授課老師 403。
- `POST /api/teach/assignments/[id]/notify`：寄出通知。授權為該作業所屬課程的授課老師；作業未發布時 400；寄送後寫入 `assignment_notifications`。
- `POST/DELETE /api/admin/course-teachers`：平臺管理者指派或移除授課老師。沿用既有 `isAdmin()`。
- 頁面：`/teach/[course]/roster`、`/admin/course-teachers`；通知按鈕位於 `/teach/[course]/assignments/[id]`。

### 可觀察行為

**老師：** 在 `/teach/[course]/roster` 看到來賓名單（email、姓名、備註、加入時間），可新增與移除。加入後該 email 立刻能索取 magic link 進入作業區，與付費學員無異。

在作業頁看到「通知學員」按鈕，旁邊顯示「上次通知：X」或「尚未通知過」。按下需二次確認，確認後寄信給全體有資格的學員，並回報寄出封數。作業未發布時按鈕停用並說明原因。

**平臺管理者：** 在 `/admin/course-teachers` 指派老師到課程，不需要 SQL。

**學員：** 來賓收到的信、看到的頁面、能做的事，與付費學員完全相同。

### 失敗模式

- 加入已存在的來賓 email：拒絕並提示，不建立重複列。
- 加入的 email 已有 `paid` 報名：拒絕並提示（他本來就進得來，加了只是製造混淆）。
- 通知未發布的作業：400，不寄信。
- 通知時無任何有資格的學員：不寄信，回報 0 封，不寫入紀錄。
- 寄信部分失敗：`sendBatchEmails()` 回報成功與失敗數，記錄實際成功數，並向老師顯示失敗數。
- 非授課老師操作 roster 或通知：403。

### 驗收標準

- `findEligibleStudent()` 測試涵蓋：僅付費、僅來賓、兩者皆有、兩者皆無、大小寫、退款後失效。
- 斷言整個流程對 `course_enrollments` 零寫入（沿用既有的 forbiddenWrite mock）。
- 通知授權測試：非授課老師 403；未發布作業 400 且不寄信；收件名單等於資格判定的結果。
- **通知按鈕與 `is_published` 無耦合**：測試斷言發布或更新作業不觸發任何寄信。
- 資料庫約束以真實資料庫實測：`(course_id, email)` 重複遭拒、email 非小寫遭拒。
- `npm test` 全綠、`next build` 成功、新檔零 tsc 錯誤。
- 手動：以來賓身分實際走一次 magic link 進入作業區。

### 範圍邊界

**在範圍內：** `course_guests` 與 `assignment_notifications` 兩表、`findEligibleStudent()`、上列 API routes、`/teach/[course]/roster`、`/admin/course-teachers`、作業頁的通知按鈕。

**在範圍外：** `course_enrollments`（任何改動）、Recur 與結帳退款、`courses-config.ts`、既有 `/admin` 18 個頁面與 `isAdmin()` 本身、magic link 與簽章 cookie、`assignments` / `submissions` / `submission_files` / `rewards` 四表的結構。

## Risks / Trade-offs

- **來賓名單成為繞過付費的後門** → 僅授課老師可加，且記錄 `added_by`。這與「老師本來就能把課程內容寄給任何人」的風險同級，不是新增的攻擊面。
- **助教同權可能誤刪作業** → 接受，Vista 已確認助教是信任的人。`course_teachers` 日後加一欄 `role` 即可升級，不必重來。
- **通知寄送失敗只回報數字，不重試** → 第一版接受。老師看得到失敗數，可再按一次；重複寄送的代價（學員收到兩封）低於漏寄。
- **資格判定多一次查詢** → 付費學員命中第一次查詢即返回，只有非付費者才會走到第二次。量級以百計，可忽略。
- **超過 100 位學員時 Batch API 需分批** → 目前最大課程 27 人。實作時仍以 100 為單位切分，避免日後靜默截斷。

## Migration Plan

1. 套用 migration（兩張新表）。可回滾（drop）。
2. 部署應用程式碼。

`course_enrollments` 不在遷移範圍內，故無資料風險。前端在 migration 之前不引用新表，故第 1 步可先行且不影響線上。

## Open Questions

無。已於 2026-07-16 經 Vista 確認：助教與老師同權、三件事一次做完。
