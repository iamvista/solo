## Context

solo.tw 是 Next.js 16 App Router + Supabase（Postgres）+ Vercel 的一人公司網站。課程報名資料存在 `course_enrollments`，課程本身的設定寫在 `src/lib/courses-config.ts`（TypeScript 設定檔，不在資料庫）。

現況勘查（2026-07-16）發現三個與本變更直接相關的事實：

1. **`course_enrollments` 與 `auth.users` 零關聯。** 該表只有 `email`，沒有 `user_id`。RLS 已啟用但零 policy，等同只有 service role 能存取。
2. **沒有安全的檔案上傳路徑。** 既有兩個 Supabase Storage bucket（`lead-magnets`、`avatars`）都用 `getPublicUrl()`，無存取控制，且 bucket 是在 Dashboard 手動建立、不在 migration 內。Vercel Blob 那條路全 repo 無 `put()`，純出不進。
3. **權限模型容納不了第二位老師。** `src/lib/supabase/admin.ts` 內硬編碼 `ADMIN_EMAILS = ["iamvista@gmail.com"]`，18 個 `/admin` 頁面各自呼叫 `isAdmin()`。

可複用的既有基礎：`download_tokens` 有成熟的權杖驗證前例（TTL、次數上限、退款撤銷、跨商品盜用防護）；`src/app/brain/skills/api/unlock/route.ts` 有 httpOnly cookie 閘門前例；Resend 已整合並用於報名確認信；`src/components/ui/file-upload.tsx` 有現成上傳元件。

利害關係人：Vista（平臺擁有者、授課老師）、Susie（授課老師，非平臺管理者）、課程學員。

**環境限制（2026-07-16 確認）：** 開發機無容器 runtime、無本機 Postgres、repo 無 `supabase/config.toml`。任何要求以真實資料庫驗證的設計，都必須先安裝 Docker 或另建 Supabase 專案。此限制直接決定了決策一。

## Goals / Non-Goals

**Goals:**

- 學員無須註冊帳號即可繳交作業，門檻越低越好。
- 學員身分核對達到「防君子」等級：擋得住隨手點的人，且因 magic link 證明 email 所有權，同班同學無法互相讀取作業與評語。
- 繳交當下自動解鎖獎勵，無須老師介入。
- Vista 與 Susie 各自只能存取自己授課課程的學員資料。
- 學員作業檔案不對外公開。

**Non-Goals:**

- **不碰 `course_enrollments`。** 不加欄位、不回填、不改結構，僅以 email 讀取查核資格。
- **不碰結帳。** Recur webhook、付款、退款路徑一律不動。
- **不讓學員使用帳號系統。** 不新增 `user_id` 綁定，不強制註冊，不動既有 Supabase Auth 流程。
- **不把課程搬進資料庫。** `courses-config.ts` 維持原狀（理由見決策二）。
- **不串接時數模型。** 1-on-1 僅為被 gate 的外部網址（cal.com），實際排程走口頭約定。
- **不做評分、成績、遲交懲罰。** `due_at` 僅供顯示，不強制。
- **不做繳交版本歷史。** 重繳就地更新同一列。
- **不改動既有 `/admin` 與 `isAdmin()`。** 新的老師權限模型獨立存在，兩者不互相繼承。

## Decisions

### 學員不使用帳號系統，改以 magic link 驗證 email 所有權

學員填入 email，系統核對該 email 有無該課程 `status='paid'` 的報名紀錄，通過即寄出 magic link；學員點連結後取得簽章 cookie，即可繳交與領獎。

**替代方案：** `course_enrollments` 新增 `user_id`、以 email 回填、強制學員註冊登入。安全性最高，但代價是在收錢的資料表上做欄位手術與資料回填，且強迫學員註冊會流失人。**否決。**

**替代方案：** 僅填姓名與 email 比對報名紀錄，不寄信。門檻最低，但知道同學姓名與 email 的人可讀取該同學的作業與教師評語，而同班同學互相知道這兩項的機率不低。**否決。**

magic link 證明 email 所有權後，姓名比對即無安全價值，故**不要求學員填姓名**：姓名已存在於報名紀錄，用於進站後的稱呼。

### 課程設定檔不搬進資料庫，改用 course_teachers 對應表

課程資料留在 `src/lib/courses-config.ts`，新系統以 `course_id`（text）弱連結。另建 `course_teachers` 表管理批改權限。

**替代方案：** 建 `courses` 表帶 `owner_teacher_id`，報名頁改讀資料庫。模型最乾淨，但會動到報名與結帳的渲染路徑，那是收錢的管線，回歸風險最高，且與本變更目的無關。**否決。**

### 新表一律零 policy，授權全在 route handler

因為學員不持有 Supabase 工作階段，`auth.uid()` 對學員一律為 null，RLS 無從據以判斷學員身分。強行為學員設計 RLS 只會製造無法運作的假防線。

**決定：** 所有新表啟用 RLS 但**不設任何 policy**（等同只有 service role 能存取），與既有 `course_enrollments` 的做法一致。所有讀寫經 Next.js route handler，以 service client 執行，並在應用層做明確授權檢查。授權判斷因此集中於一處、可被既有 mock 測試涵蓋，不需要真實資料庫。

**此決策消除了對容器 runtime 的依賴。** 前一版設計以 RLS 為主防線，迫使 RLS 隔離必須以真實資料庫驗證，進而需要安裝 Docker；改為 route handler 授權後，驗證回歸既有 vitest mock pattern。

### Storage 零 policy，全走 server 簽發的 signed URL

私有 bucket 不設任何 policy。上傳走 `createSignedUploadUrl()`：server 先驗學員工作階段與報名資格再簽發，client 直接 PUT 到 Supabase。下載走 `createSignedUrl()`，短效期。

此決策同時解決兩件事：bucket 完全不對外，且**繞過 Vercel route handler 4.5MB 的 body 上限**（大附件不經過 serverless function）。

檔案路徑不編入 email，改以隨機識別碼命名，避免個資落入儲存路徑；擁有權記錄於資料庫而非由路徑推導。

### 不建權益表，解鎖狀態由 submission 推導

「有沒有權益」等於「有沒有交這份作業」，一個查詢即可回答，不需要另一張表記錄可推導的事實。

**替代方案：** 建 `entitlements` 表記錄「誰解鎖了什麼」。多一張表就多一個會與事實不同步的來源（交了但沒發權益、退課了權益還在），且在「繳交即解鎖」的規則下它承載不了任何新資訊。**否決。**

### 獎勵一律掛在單一作業底下

`rewards.assignment_id` 為 NOT NULL，不存在「課程級獎勵」。若需要「全部交完才給」的獎勵，掛在最後一份作業上即可。此決策避免引入「完成度計算」這條規則與其邊界情況。

### 老師沿用既有 Supabase Auth

老師只有兩人且皆已有帳號，沿用既有登入即可，不另建密碼閘門。老師端的 `auth.uid()` 有效，但為與決策三保持單一授權模型，老師的授權同樣在 route handler 以 `course_teachers` 查核，不依賴 RLS。

## Implementation Contract

### 資料模型

**`course_enrollments` 零改動**，僅以 `email` 與 `status` 讀取查核資格。

六張新表，全部啟用 RLS 且不設任何 policy：

- **`assignment_access_tokens`**：`id` uuid pk、`token` text not null unique、`email` text not null、`course_id` text not null、`expires_at` timestamptz not null、`used_at` timestamptz null、`created_at`。單次使用，短效期。
- **`course_teachers`**：`id` uuid pk、`course_id` text not null、`teacher_id` uuid not null → `profiles(id)`、`created_at`。unique `(course_id, teacher_id)`。
- **`assignments`**：`id` uuid pk、`course_id` text not null、`title` text not null、`description` text（markdown）、`sort_order` int not null default 0、`allow_file` / `allow_text` / `allow_link` boolean not null（check 約束：至少一為 true）、`due_at` timestamptz null（僅顯示）、`is_published` boolean not null default false、`created_by` uuid → `profiles(id)`、`created_at` / `updated_at`。
- **`submissions`**：`id` uuid pk、`assignment_id` uuid not null → `assignments(id)` on delete cascade、`student_email` text not null、`text_content` text null、`link_url` text null、`submitted_at` timestamptz not null default now()、`updated_at` timestamptz not null、`teacher_comment` text null、`reviewed_at` timestamptz null、`reviewed_by` uuid null → `profiles(id)`。unique `(assignment_id, student_email)`。**無 status 欄位**：有沒有交等於這列存不存在，有沒有批改等於 `reviewed_at` 是否為 null。
- **`submission_files`**：`id` uuid pk、`submission_id` uuid not null → `submissions(id)` on delete cascade、`storage_path` text not null、`filename` text not null（原始檔名）、`size_bytes` bigint not null、`mime_type` text、`created_at`。
- **`rewards`**：`id` uuid pk、`assignment_id` uuid not null → `assignments(id)` on delete cascade、`kind` text not null（check in `video` / `file` / `link`）、`title` text not null、`description` text、`video_url` text（kind=video）、`storage_path` text（kind=file）、`external_url` text（kind=link）、`sort_order` int not null default 0、`created_at`。

學員 email 一律以小寫正規化後存取與比對。

### 學員工作階段

- Magic link token：隨機、單次使用、效期 30 分鐘，存於 `assignment_access_tokens`。
- 驗證成功後簽發 httpOnly、Secure、SameSite=Lax 的 cookie，內含 email 與 course_id，以 HMAC 簽章，效期 30 天。簽章金鑰取自新增的環境變數。
- 每次請求皆重新驗章並重新查核該 email 的報名資格為 `paid`，不信任 cookie 內容本身。

### Storage

私有 bucket `submissions`，於 migration 內以 `insert into storage.buckets` 建立，`public = false`，**不設任何 policy**。

- 學員作業路徑：`{course_id}/{assignment_id}/{random_id}-{safe_filename}`
- 講義檔案路徑：`rewards/{course_id}/{random_id}-{safe_filename}`

### 可觀察行為

**學員：** 於 `/courses/[course]/assignments` 未持工作階段時見 email 輸入表單。送出後，無論該 email 是否有報名紀錄，皆顯示相同的「若你已報名，信件已寄出」訊息，不透露該 email 是否在名單內。持有效報名者收到 magic link，點擊後進入作業區，以報名時的姓名受稱呼，見已發布作業列表與自己的繳交狀態。點入作業可讀說明並繳交；繳交成功後獎勵區塊於同頁展開，影片內嵌播放、講義提供下載、1-on-1 提供預約連結。重繳覆寫先前內容。學員僅能見到自己的繳交與評語。

**老師：** 以既有 Supabase Auth 登入後，於 `/teach` 見自己授課的課程。`/teach/[course]` 列出作業與各自繳交數；`/teach/[course]/assignments/[id]` 列出繳交名單，可讀內容、下載附件、撰寫評語。可新增與編輯作業和獎勵。非授課老師存取他人課程一律拒絕。

**平臺管理者（僅 Vista，沿用既有 `isAdmin()`）：** 可指派 `course_teachers`。

### 介面

- `POST /api/assignments/access/request` → 收 email 與 course_id，查核報名資格後寄出 magic link，回應一律相同。
- `GET /api/assignments/access/verify` → 驗 token，標記已用，簽發 cookie，導向作業區。
- `POST /api/assignments/[id]/upload-url` → 驗學員工作階段與報名資格後回傳 signed upload URL 與 storage path。
- `POST /api/assignments/[id]/submit` → 建立或更新 submission，body 含 `text_content`、`link_url`、已上傳檔案的 metadata 陣列。
- `GET /api/rewards/[id]/access` → 驗有無對應 submission 後，回傳 signed URL（kind=file）或直接回傳網址（kind=video / link）。
- `POST /api/teach/submissions/[id]/review` → 寫入 `teacher_comment`、`reviewed_at`、`reviewed_by`。
- 作業與獎勵的 CRUD routes（於 `/api/teach/` 之下）。

`src/middleware.ts` 的保護路由清單加入 `/teach` 與 `/api/teach`。學員路由不經 Supabase 工作階段，毋須納入。

### 失敗模式

- 未報名的 email 請求 magic link：回應與已報名者完全相同，但不寄信，以免洩漏名單。
- token 過期、已使用、或不存在：顯示連結失效並提供重新索取入口。
- cookie 簽章不符或報名資格已非 `paid`：視同未登入，導回 email 表單。
- 上傳失敗：client 顯示錯誤並保留表單內容，不建立 submission 列。
- 檔案已上傳但 submit 失敗：孤兒檔案留在 bucket。**刻意不處理**，不建清理排程，量大再議。
- signed URL 過期：前端重新請求，不快取 URL。
- 未繳交者請求 reward access：403。
- 非授課老師寫評語或讀他課資料：403。

### 驗收標準

- **route handler 授權測試**：未報名者索取 magic link 不寄信且回應與已報名者無異；偽造或竄改 cookie 遭拒；持 A 課程 cookie 者存取 B 課程遭拒；持學員 A cookie 者讀不到學員 B 的 submission；未繳交者拿不到 reward；非授課老師寫不了評語、讀不到他課繳交。
- 沿用既有 vitest 設定與 `src/app/api/download/*/route.test.ts` 的測試 pattern，不需要真實資料庫或容器 runtime。
- 手動驗證：完整走一次「索取連結 → 收信 → 進站 → 繳交 → 三種獎勵各取用一次」。

### 範圍邊界

**在範圍內：** 上述六張表、私有 bucket、學員 magic link 與工作階段、學員與老師頁面、上列 API routes、middleware 路由清單。

**在範圍外：** `course_enrollments`（任何結構改動）、任何 Recur / 結帳 / 退款程式碼、`courses-config.ts`、既有 `/admin` 頁面與 `isAdmin()`、既有 Supabase Auth 的登入註冊流程、`consulting_*` 相關表、既有兩個公開 bucket 的改造。

## Risks / Trade-offs

- **學員 email 信箱被他人存取即等同身分被冒用** → 接受。此為 magic link 的固有性質，且風險等級與既有 `download_tokens` 寄送下載連結一致。
- **magic link 信件進垃圾郵件匣導致學員進不來** → 沿用既有 Resend 整合與已驗證寄件網域；作業頁提供重新索取入口；老師後臺可見繳交名單，必要時人工協助。
- **授權集中於 route handler，遺漏任一處即形成破口** → 授權判斷收斂為單一 helper，所有學員 route 一律經過；驗收標準逐項列出必須拒絕的情境。
- **孤兒檔案累積** → 第一版接受，不做清理排程。
- **`/teach` 與 `/admin` 權限模型分歧** → 明確界線：`/admin` 是平臺管理（Vista），`/teach` 是課程教學（授課者）。兩者不互相繼承，不共用 helper。
- **課程仍在設定檔、`course_id` 為弱連結** → 設定檔移除課程但 `assignments` 仍存在時會產生孤兒資料。第一版接受（課程極少下架），老師後臺會略過無對應設定的課程。
- **無真實資料庫測試** → 因新表零 policy、授權全在應用層，資料庫層不承擔授權責任，故不構成缺口。若日後改採 RLS，須同時補上真實資料庫測試環境。

## Migration Plan

依序執行，每一步可獨立回滾：

1. Migration A：六張新表（全部啟用 RLS、不設 policy）。可回滾（drop）。
2. Migration B：建立私有 bucket。可回滾（delete bucket，此時尚無檔案）。
3. 設定 cookie 簽章金鑰環境變數（Vercel production 與 preview）。
4. 應用程式碼部署（Vercel，git push）。

`course_enrollments` 不在遷移範圍內，故無資料風險。前端在 Migration A 之前不引用新表，故 1 至 3 步可先行且不影響線上。

## Open Questions

無。設計已於 2026-07-16 經 Vista 核可並修訂：學員不走帳號系統、以 magic link 防君子、不碰 `course_enrollments`、不碰結帳、多老師以 `course_teachers` 達成、繳交即自動解鎖、不建權益表、不串時數。
