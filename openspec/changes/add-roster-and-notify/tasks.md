## 1. 資料層

- [x] 1.1 交付 design.md「資料模型」的 `course_guests` 與 `assignment_notifications` 兩張表，實現決策「來賓存在自己的表，金流表永遠只放金流」與 `A guest entry is never a payment record`：兩表啟用 RLS 且零 policy，`course_guests` 以 `(course_id, email)` 唯一、email 強制小寫。驗證：以真實資料庫實測重複 email 遭拒、非小寫 email 遭拒；`course_enrollments` 結構零改動。

## 2. 學員資格

- [x] 2.1 交付 `Students reach the assignment area without an account`（擴充為付費或來賓）與 design.md「資格判定」：`findEligibleStudent()` 先查 `paid` 報名，未命中再查來賓，姓名取自命中的那筆。此函式維持學員資格的唯一判定點。驗證：測試涵蓋 spec 中 eligibility by enrollment state and guest roster 表格全部八列。
- [x] 2.2 交付 `Enrollment records are read but never modified`（擴充為「不付費者一律記在來賓名單」）：全流程對 `course_enrollments` 零寫入。驗證：沿用既有 forbiddenWrite mock，斷言任何寫入都會讓測試失敗。

## 3. 來賓名冊

- [x] 3.1 交付 `Teachers admit non-paying people to their own course` 的 API：`/api/teach/roster` 的增刪，以 `requireCourseTeacher` 授權，記錄 `added_by`。驗證：測試斷言重複 email 遭拒、已有 paid 報名者遭拒、非授課老師 403 且名冊未變。
- [ ] 3.2 交付 design.md「可觀察行為」中老師端的來賓名冊頁 `/teach/[course]/roster`：顯示 email、姓名、備註、加入時間，可新增與移除。驗證：手動新增一筆來賓並確認顯示。
- [x] 3.3 交付 `Assistants are teachers`，實現決策「助教即老師，不做角色分級」：助教經 `course_teachers` 加入，與老師同權，不新增 role 欄位或權限層級。驗證：`grep` 確認 `course_teachers` 無 role 欄位；既有 teach route 零新增權限判斷。

## 4. 指派老師

- [x] 4.1 交付 `Only platform administrators assign teachers` 的 API 與頁面 `/admin/course-teachers`，實現決策「來賓歸老師管，指派老師歸平臺管理者管」：沿用既有 `isAdmin()`，不改動它本身，也不讓兩套授權互相繼承。驗證：測試涵蓋 spec 中 who may do what 表格五列，斷言課程老師（非管理者）無法指派老師。

## 5. 通知學員

- [x] 5.1 交付 `Notifying students is an explicit action, never a side effect`，實現決策「通知是明確動作，永遠不是發布的副作用」：`POST /api/teach/assignments/[id]/notify` 為唯一寄信入口，與 `is_published` 完全解耦。驗證：測試斷言建立、發布、編輯作業皆不觸發任何寄信。
- [x] 5.2 交付 `Recipients are exactly the students who can see the assignment`，實現決策「通知只寄給看得到的人，且記錄每一次寄送」：收件名單由 `findEligibleStudent()` 的同一套資格規則衍生，不另寫查詢；沿用既有 `sendBatchEmails()`，以 100 為單位切分避免靜默截斷。驗證：測試涵蓋付費＋來賓、退款者排除、零收件人不寄信亦不記錄。
- [x] 5.3 交付 `Only published assignments can be notified` 與 `Notification is authorized against the assignment's own course`：未發布回 400 且不寄信，課程由作業本身讀出，非授課老師 403。驗證：測試斷言兩種拒絕情境皆不寄信。
- [x] 5.4 交付 `Every send is recorded and shown to the teacher`：每次寄送寫入 `assignment_notifications`，按鈕旁顯示上次通知時間，需二次確認，但不封鎖重複寄送。驗證：測試斷言記錄了寄件者與實際成功數；第二次寄送不被阻擋且產生第二筆記錄。
- [ ] 5.5 交付通知信件本身：沿用既有 Resend 整合與信件元件風格，內容含作業標題與作業區連結。驗證：`grep` 確認無禁用用字與半形標點；文案經 Vista 過目。

- [x] 5.6 交付 design.md「介面」全部 route 的接線：`/api/teach/roster`、`/api/teach/assignments/[id]/notify`、`/api/admin/course-teachers`，以及 `/teach/[course]/roster`、`/admin/course-teachers` 兩個頁面與作業頁的通知按鈕。驗證：`next build` 後確認五條新路由皆註冊。

## 6. 收尾

- [x] 6.1 依 design.md「失敗模式」完成錯誤處理：重複來賓、已付費者、未發布通知、零收件人、部分寄送失敗、非授課老師操作。驗證：逐項比對 design.md「失敗模式」清單。
- [x] 6.2 依 design.md「驗收標準」完成全套驗證：`npm test` 全綠、`next build` 成功、新檔零 tsc 錯誤且既有錯誤數不增加。
- [ ] 6.3 依 design.md「範圍邊界」核對未越界：`course_enrollments`、Recur 與結帳退款、`courses-config.ts`、既有 `/admin` 18 頁與 `isAdmin()` 本身、magic link 與簽章 cookie、既有四張表結構皆零改動。驗證：`git diff --stat` 逐檔比對範圍外清單。
- [ ] 6.4 以來賓身分實際走一次：從 roster 加入 → 索取 magic link → 進入作業區 → 看到作業。此為本變更核心目的，不接受以單元測試代替。驗證：於正式站實際操作並在事後清除測試資料。
