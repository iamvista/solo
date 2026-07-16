## 1. 本機驗證環境

- [ ] 1.1 建立本機 Supabase 環境（`supabase init`），使 migration 能在本機 Postgres 重放並以不同 JWT 身分連線。此為 design.md「驗收標準」中 RLS 隔離測試的前置條件，repo 目前無 `supabase/config.toml`。驗證：`supabase start` 後 `supabase db reset` 成功重放既有 29 個 migration 且無錯誤。

## 2. 身分綁定

- [ ] 2.1 交付 `Enrollment records link to authenticated accounts`：`course_enrollments` 新增可為 null 的 `user_id` 欄位與索引，既有欄位零異動。對應 design.md 決策「學員身分以 email 回填綁定」的第一步。驗證：本機重放後 `\d course_enrollments` 顯示新欄位；以複製資料集比對，所有既有欄位值與 migration 前逐筆相同。
- [ ] 2.2 交付 `Existing enrollments are backfilled by verified email`：獨立於 2.1 的回填 migration，以 case-insensitive email 比對已驗證帳號寫入 `user_id`，未匹配者維持 null。驗證：對複製資料集執行後，回填筆數等於「email 匹配已驗證帳號」的預期筆數；未匹配紀錄的 `user_id` 為 null 且其餘欄位未變；回滾（`set user_id = null`）不損失資料。
- [ ] 2.3 交付 `Accounts claim matching enrollments on sign-in`：`claimEnrollments(userId, email)` helper 於 auth callback 與 dashboard 載入時認領同 email 且 `user_id` 為 null 的報名紀錄，認領後學員即可進入該課程作業。驗證：單元測試涵蓋「有匹配紀錄則綁定」與「無匹配則零紀錄異動」兩情境。
- [ ] 2.4 交付 `Platform administrators bind mismatched enrollments manually`：後臺提供人工綁定介面，將付款 email 與登入 email 不同的報名紀錄綁定到指定帳號，僅平臺管理者可用。驗證：route handler 測試斷言非管理者（含課程老師與學員）請求遭拒且無紀錄異動。

## 3. 資料模型與存取控制

- [ ] 3.1 交付 `A mapping table grants teaching permission per course`：建立 `course_teachers` 對應表，`(course_id, teacher_id)` 唯一，`course_id` 以 text 弱連結既有課程設定檔。實現 design.md 決策「課程設定檔不搬進資料庫，改用 course_teachers 對應表」，`src/lib/courses-config.ts` 與結帳路徑零改動。驗證：重複映射遭唯一約束拒絕；`git diff` 確認 `courses-config.ts` 未被修改。
- [ ] 3.2 交付 design.md「資料模型」中的 `assignments`、`submissions`、`submission_files` 三表：submissions 以 `(assignment_id, user_id)` 唯一且無 status 欄位，繳交與否由該列存在與否表達，批改與否由 `reviewed_at` 是否為 null 表達。體現決策「不建權益表，解鎖狀態由 submission 推導」。驗證：本機重放成功；schema 中不存在 status 欄位與任何權益表。
- [ ] 3.3 交付 `Rewards attach to exactly one assignment` 與 `Rewards carry one of three kinds` 的資料層：`rewards` 表的 `assignment_id` 為 NOT NULL 且 on delete cascade，`kind` 以 check 約束限定 `video` / `file` / `link`。實現決策「獎勵一律掛在單一作業底下」，不存在課程級獎勵。驗證：插入 `assignment_id` 為 null 或 `kind` 非三者之一皆遭拒；刪除 assignment 後其 rewards 一併消失。
- [ ] 3.4 交付 design.md「RLS」定義的 `is_course_teacher` 與 `is_enrolled` helper 及全部讀取 policy，並實現決策「寫入一律經 route handler，RLS 只負責讀取」與 `Writes to submission data pass through authorized route handlers`：新表一律不開寫入 policy。驗證：以 anon key 直接對每張新表 insert / update 皆遭拒。
- [ ] 3.5 交付 `Student submissions are isolated between accounts and between teachers`：以真實資料庫、不同 JWT 身分驗證隔離。此為 design.md「驗收標準」第一優先項，不接受以程式碼審查代替。驗證：測試涵蓋 spec 中 submission read isolation 表格全部五列，斷言學員 A 讀不到學員 B 的 submission、非授課老師讀不到他課的 submission。
- [ ] 3.6 交付 design.md「Storage」的私有 bucket：以 migration 建立 `public = false` 且零 policy 的 `submissions` bucket，路徑依課程、作業、帳號分層。實現決策「Storage 零 policy，全走 server 簽發的 signed URL」，並將 bucket 定義納入 IaC。驗證：本機重放後 bucket 存在且 `public` 為 false；以 anon key 直接讀取 bucket 內物件遭拒。

## 4. 學員繳交流程

- [ ] 4.1 交付 `Assignment visibility requires paid enrollment and publication`：作業列表與詳情頁僅對持 `status='paid'` 報名且作業已發布者顯示；未登入者導向登入頁並帶 return URL，已登入未報名者見「尚未報名」提示。驗證：測試涵蓋 spec 中 assignment list visibility 表格四列；斷言未授權回應的 body 不含作業標題與說明。
- [ ] 4.2 交付 `Students submit assignments in the enabled forms`：學員可依作業啟用的形式提交文字、連結、檔案，未啟用的形式一律拒收。驗證：route handler 測試斷言未報名者提交遭拒且無 submission 列建立；對 file 停用的作業請求 upload URL 遭拒。
- [ ] 4.3 交付 `File uploads bypass the application server`：server 驗報名資格後簽發 signed upload URL，client 直接 PUT 至 Supabase，不經 route handler，藉此繞過 Vercel 4.5MB body 上限。驗證：測試斷言未報名者拿不到 signed URL；手動以大於 4.5MB 的檔案完成上傳。
- [ ] 4.4 交付 `Resubmission overwrites the previous submission`：重繳就地更新同一列並推進 `updated_at`，不保留版本歷史。驗證：測試斷言同一學員對同一作業連續兩次提交後，僅存在一列且內容為後者。

## 5. 獎勵解鎖

- [ ] 5.1 交付 `Unlock is derived from submission existence`：獎勵解鎖與否由該作業是否存在屬於該帳號的 submission 推導，繳交當下即解鎖，老師批改不構成閘門。驗證：測試涵蓋 spec 中 reward access outcomes 表格四列，含「已繳交但未批改仍可取用」。
- [ ] 5.2 交付 `Reward content is reachable only through server authorization`：`GET /api/rewards/[id]/access` 於 server 驗證 submission 存在後才回傳 signed URL 或外部網址，前端不快取 signed URL。驗證：測試斷言未繳交者請求遭拒且回應 body 不含 URL 或 storage path。
- [ ] 5.3 交付 design.md「可觀察行為」中學員端的獎勵渲染：三種 kind 於繳交成功後在同頁展開，影片內嵌播放、講義提供下載、連結提供預約入口。驗證：手動走完繳交至取用獎勵的流程，三種 kind 各驗一次。

## 6. 老師後臺

- [ ] 6.1 交付 `Teachers define assignments per course`：老師可建立與編輯自己課程的作業，含標題、說明、排序、截止日、發布狀態與三個繳交形式旗標；三者全關遭拒；截止日僅顯示不強制。驗證：測試斷言全關的作業建立請求遭拒；逾期提交仍被接受且未標記遲交。
- [ ] 6.2 交付 `Teachers reach only the courses they teach`：`/teach` 僅列出映射課程，請求未映射課程一律拒絕且不洩漏其作業、繳交、學員身分。驗證：測試斷言未映射課程的回應 body 不含任何該課程資料。
- [ ] 6.3 交付 `Teachers review submissions without gating rewards`：老師可讀繳交內容、下載附件、寫評語，評語寫入時記錄 `reviewed_by` 與 `reviewed_at`；批改不影響獎勵取用。驗證：測試斷言非授課老師寫評語遭拒且 submission 未變；學員無法為自己的 submission 寫評語。
- [ ] 6.4 交付 `Teaching permission is separate from platform administration`：`/teach` 與既有 `/admin` 為獨立權限模型，不互相繼承、不共用 helper；既有 18 個 admin 頁面與 `isAdmin()` 零改動。驗證：測試斷言非管理者的老師可進 `/teach` 但被 `/admin` 拒絕；`git diff` 確認 `src/lib/supabase/admin.ts` 未被修改。

## 7. 整合與收尾

- [ ] 7.1 交付 design.md「介面」全部 route 的接線與 `src/middleware.ts` 保護路由清單新增 `/teach` 與 `/api/teach`。同時交付 `src/app/api/courses/register/route.ts` 帶入 `user_id`，此為結帳路徑唯一改動。驗證：未登入請求 `/teach` 導向登入頁；以測試訂單完成一次真實報名，確認付款流程未受影響且新報名帶有 `user_id`。
- [ ] 7.2 交付 design.md「失敗模式」定義的錯誤處理：上傳失敗保留表單且不建 submission 列、signed URL 過期時重新請求、未授權請求回 403。孤兒檔案刻意不清理。驗證：逐項手動觸發並比對 design.md「失敗模式」清單。
- [ ] 7.3 依 design.md「範圍邊界」核對實作未越界：確認 Recur webhook、退款路徑、`courses-config.ts`、既有 `/admin`、`consulting_*` 相關表、既有兩個公開 bucket 皆零改動。驗證：`git diff --stat` 逐檔比對範圍外清單，任一命中即為越界。
- [ ] 7.4 依 design.md「Migration Plan」順序部署並確認可回滾：四個 migration 依序執行，前端在資料表建立前不引用新表。驗證：本機依序重放後再逐步回滾，確認每步皆不損失既有資料。
