## 1. 資料層

- [x] 1.1 交付 design.md「資料模型」中的六張新表（`assignment_access_tokens`、`course_teachers`、`assignments`、`submissions`、`submission_files`、`rewards`），並實現 `New tables carry no access policies and all access passes through route handlers` 與決策「新表一律零 policy，授權全在 route handler」：每張表啟用 RLS 但不設任何 policy。`submissions` 以 `(assignment_id, student_email)` 唯一且無 status 欄位，體現決策「不建權益表，解鎖狀態由 submission 推導」。驗證：以 anon key 對每張新表 select / insert 皆回零列或遭拒；schema 中不存在 status 欄位與任何權益表。
- [x] 1.2 交付 `Rewards attach to exactly one assignment` 與 `Rewards carry one of three kinds` 的資料層約束，實現決策「獎勵一律掛在單一作業底下」：`assignment_id` NOT NULL 且 on delete cascade，`kind` 以 check 約束限定 `video` / `file` / `link`。驗證：插入 `assignment_id` 為 null 或 `kind` 非三者之一皆遭拒；刪除 assignment 後其 rewards 一併消失。
- [x] 1.3 交付 `A mapping table grants teaching permission per course`，實現決策「課程設定檔不搬進資料庫，改用 course_teachers 對應表」：`(course_id, teacher_id)` 唯一，`course_id` 以 text 弱連結既有課程設定檔。驗證：重複映射遭唯一約束拒絕；`git diff` 確認 `src/lib/courses-config.ts` 未被修改。
- [x] 1.4 交付 design.md「Storage」的私有 bucket，實現決策「Storage 零 policy，全走 server 簽發的 signed URL」：以 migration 建立 `public = false` 且零 policy 的 bucket 並納入 IaC。驗證：bucket 的 `public` 為 false；以 anon key 直接讀取 bucket 內物件遭拒。

## 2. 學員工作階段

- [x] 2.1 交付 `Students reach the assignment area without an account` 與 `Enrollment records are read but never modified` 的資格查核 helper：以小寫正規化的 email 查 `course_enrollments` 是否存在該課程 `status='paid'` 紀錄，並取回報名時的姓名供稱呼之用，全程唯讀。驗證：測試涵蓋 spec 中 eligibility by enrollment state 表格五列；斷言整個流程對 `course_enrollments` 零寫入。
- [x] 2.2 交付 `Access requests do not disclose enrollment membership`，實現決策「學員不使用帳號系統，改以 magic link 驗證 email 所有權」：`POST /api/assignments/access/request` 對已報名者以既有 Resend 寄出 magic link，對未報名者不寄信，兩者回應完全一致。驗證：測試斷言兩種情境的 status 與 body 相同，且僅前者觸發寄信。
- [x] 2.3 交付 `Magic link tokens are single-use and short-lived`：token 隨機、綁定單一 email 與 course、效期 30 分鐘，驗證時標記已用。`GET /api/assignments/access/verify` 對過期、已用、未知 token 一律拒絕並提供重新索取入口。驗證：測試涵蓋 spec 中 token verification outcomes 表格四列。
- [x] 2.4 交付 `Student sessions are signed and revalidated on every request` 與 design.md「學員工作階段」：簽發 httpOnly、Secure、SameSite=Lax 的 HMAC 簽章 cookie（含 email 與 course_id，效期 30 天），每次請求重新驗章並重查報名資格為 `paid`。驗證：測試斷言竄改 cookie 內 email 後驗章失敗視同未登入；報名轉為 `refunded` 後既有 cookie 失效；A 課程 cookie 存取 B 課程遭拒且回應不含 B 課程資料。

- [x] 2.5 交付 `Access requests are rate limited`：`POST /api/assignments/access/request` 沿用既有 `src/lib/rate-limit.ts`，同時做 per-IP 與 per-email 限流，兩者皆在資格查核之前對所有請求評估。驗證：測試斷言超量的 per-IP 與 per-email 請求皆遭拒且不寄信；已報名與未報名 email 被限流時回應完全相同。

## 3. 學員繳交流程

- [x] 3.1 交付 `Assignment visibility requires a verified session and publication`：無工作階段者見 email 索取表單且回應不含任何作業內容；持工作階段者僅見該課程已發布作業。驗證：測試涵蓋 spec 中 assignment list visibility 表格四列。
- [x] 3.2 交付 `Students submit assignments in the enabled forms`：`POST /api/assignments/[id]/submit` 依作業啟用的形式收受文字、連結、檔案 metadata，未啟用的形式一律拒收，submission 以小寫 email 為鍵。驗證：測試斷言無工作階段的提交遭拒且無 submission 列建立；對 file 停用的作業請求 upload URL 遭拒。
- [x] 3.3 交付 `Students read only their own submissions`：所有學員端 submission 讀取一律以工作階段內的 email 收斂，無法以他人 email、他人 submission id 或竄改 cookie 取得他人資料。驗證：測試斷言學員 A 以 submission id 請求學員 B 的繳交遭拒，且回應不含 B 的內容、附件與評語。
- [x] 3.4 交付 `Resubmission overwrites the previous submission`：重繳就地更新同一列並推進 `updated_at`，不保留版本歷史。驗證：測試斷言同一 email 對同一作業連續兩次提交後僅存在一列且內容為後者。
- [x] 3.5 交付 `File uploads bypass the application server`：server 驗工作階段與資格後簽發 signed upload URL，client 直接 PUT 至 Supabase，繞過 Vercel 4.5MB body 上限；storage 路徑不含 email，擁有權記錄於資料庫。驗證：測試斷言無工作階段者拿不到 signed URL；檢查產生的路徑不含 email 且無法被檔名帶出前綴。（大於 4.5MB 的實檔上傳需線上環境，移至 6.2 手動驗證。）

## 4. 獎勵解鎖

- [x] 4.1 交付 `Unlock is derived from submission existence`：解鎖與否由該作業是否存在屬於工作階段 email 的 submission 推導，繳交當下即解鎖，老師批改不構成閘門。驗證：測試涵蓋 spec 中 reward access outcomes 表格五列，含「已繳交但未批改仍可取用」與「持他課工作階段遭拒」。
- [x] 4.2 交付 `Reward content is reachable only through server authorization`：`GET /api/rewards/[id]/access` 於 server 驗 submission 存在後才回傳 signed URL 或外部網址，前端不快取 signed URL。驗證：測試斷言未繳交者請求遭拒且回應 body 不含 URL 或 storage path。
- [x] 4.3 交付 `Rewards carry one of three kinds` 的學員端渲染，對應 design.md「可觀察行為」：三種 kind 於繳交成功後在同頁展開，影片內嵌播放、講義提供下載、連結提供預約入口。驗證：手動走完繳交至取用獎勵的流程，三種 kind 各驗一次。

## 5. 老師後臺

- [x] 5.1 交付 `Teachers authenticate with the existing account system`，實現決策「老師沿用既有 Supabase Auth」：老師以既有登入進入 `/teach`，不另建密碼或憑證儲存；授權在 route handler 查 `course_teachers`，與學員端共用單一授權模型。驗證：測試斷言未登入者與已登入但無映射者皆被拒。
- [x] 5.2 交付 `Teachers reach only the courses they teach`：`/teach` 僅列出映射課程，請求未映射課程一律拒絕且不洩漏其作業、繳交、學員身分。驗證：測試涵蓋 spec 中 teaching surface access 表格五列，並斷言未映射課程的回應 body 不含任何該課程資料。
- [x] 5.3 交付 `Teachers define assignments per course`：老師可建立與編輯自己課程的作業與獎勵，含標題、說明、排序、截止日、發布狀態與三個繳交形式旗標；三者全關遭拒；截止日僅顯示不強制。驗證：測試斷言全關的作業建立請求遭拒；逾期提交仍被接受且未標記遲交。
- [x] 5.4 交付 `Teachers review submissions without gating rewards`：老師可讀繳交內容、下載附件、寫評語，寫入時記錄 `reviewed_by` 與 `reviewed_at`；批改不影響獎勵取用。驗證：測試斷言非授課老師寫評語遭拒且 submission 未變；持學員工作階段者無法為自己的 submission 寫評語。
- [x] 5.5 交付 `Teaching permission is separate from platform administration`：`/teach` 與既有 `/admin` 為獨立權限模型，不互相繼承、不共用 helper；既有 18 個 admin 頁面與 `isAdmin()` 零改動。驗證：測試斷言非管理者的老師可進 `/teach` 但被 `/admin` 拒絕；`git diff` 確認 `src/lib/supabase/admin.ts` 未被修改。

## 6. 整合與收尾

- [x] 6.1 交付 design.md「介面」全部 route 的接線與 `src/middleware.ts` 保護路由清單新增 `/teach` 與 `/api/teach`；學員路由不經 Supabase 工作階段故不納入。驗證：未登入請求 `/teach` 被拒；學員在無 Supabase session 的情況下可完成整趟繳交流程。
- [x] 6.2 交付 design.md「失敗模式」定義的錯誤處理：未報名 email 不寄信但回應相同、token 失效提供重新索取、簽章不符視同未登入、上傳失敗保留表單且不建 submission 列、signed URL 過期時重新請求、未授權請求回 403。孤兒檔案刻意不清理。驗證：逐項手動觸發並比對 design.md「失敗模式」清單；另須在線上實測「上傳大於 4.5MB 的檔案」成功（此為 3.5 繞過 Vercel body 上限的最終證明，本機無法驗證）。
- [x] 6.3 依 design.md「驗收標準」完成授權測試套件，全部沿用既有 vitest mock pattern，不依賴真實資料庫或容器 runtime。驗證：`npm test` 全綠，且測試涵蓋驗收標準逐項列出的拒絕情境。
- [x] 6.4 依 design.md「範圍邊界」核對實作未越界：確認 `course_enrollments` 結構、Recur webhook、退款路徑、`courses-config.ts`、既有 `/admin`、既有 Supabase Auth 登入註冊流程、`consulting_*` 相關表、既有兩個公開 bucket 皆零改動。驗證：`git diff --stat` 逐檔比對範圍外清單，任一命中即為越界。
- [x] 6.5 依 design.md「Migration Plan」完成部署：兩個 migration 依序執行，cookie 簽章金鑰環境變數設定於 Vercel production 與 preview，前端在資料表建立前不引用新表。驗證：部署後以 `curl -H "Cache-Control: no-cache"` 確認學員作業頁與 `/teach` 皆正常回應。
