## Context

solo.tw 是 Next.js 16 App Router + Supabase（Postgres）+ Vercel 的一人公司網站。課程報名資料存在 `course_enrollments`，課程本身的設定則寫在 `src/lib/courses-config.ts`（TypeScript 設定檔，不在資料庫）。

現況勘查（2026-07-16）發現三個與本變更直接相關的事實：

1. **`course_enrollments` 與 `auth.users` 零關聯。** 該表只有 `email`，沒有 `user_id`，RLS 已啟用但零 policy（等同只有 service role 能存取）。學員目前是「用 email 被記錄」而非「用帳號被識別」，`/dashboard` 完全沒讀報名資料。
2. **沒有安全的檔案上傳路徑。** 既有兩個 Supabase Storage bucket（`lead-magnets`、`avatars`）都用 `getPublicUrl()`，無存取控制，且 bucket 是在 Dashboard 手動建立、不在 migration 內。Vercel Blob 那條路全 repo 無 `put()`，純出不進。
3. **權限模型容納不了第二位老師。** `src/lib/supabase/admin.ts` 內硬編碼 `ADMIN_EMAILS = ["iamvista@gmail.com"]`，18 個 `/admin` 頁面各自呼叫 `isAdmin()`。

可複用的既有基礎：Supabase Auth（密碼 + Google OAuth）已上線；`download_tokens` 有成熟的權杖驗證前例（TTL、次數上限、退款撤銷、跨商品盜用防護）；`src/components/ui/file-upload.tsx` 有現成上傳元件。

利害關係人：Vista（平臺擁有者、授課老師）、Susie（授課老師，非平臺管理者）、課程學員。

## Goals / Non-Goals

**Goals:**

- 學員能以檔案、文字、外部連結三種形式繳交作業，並可重繳。
- 繳交當下自動解鎖該作業的獎勵，無須老師介入。
- Vista 與 Susie 各自只能存取自己授課課程的學員資料，且此隔離以真實資料庫測試驗證，不靠程式碼審查判斷。
- 學員作業檔案不對外公開，僅本人與授課老師可取用。

**Non-Goals:**

- **不碰結帳。** Recur webhook、付款、退款路徑一律不動。`src/app/api/courses/register/route.ts` 僅新增帶入 `user_id` 一處改動。
- **不把課程搬進資料庫。** `courses-config.ts` 維持原狀（理由見決策一）。
- **不串接時數模型。** 1-on-1 僅為被 gate 的外部網址（cal.com），實際排程走口頭約定，不接 `consulting_sessions`。
- **不做評分、成績、遲交懲罰。** `due_at` 僅供顯示，不強制。
- **不做通知信。** 第一版學員自行回頁面看評語。
- **不做繳交版本歷史。** 重繳就地更新同一列。
- **不改動既有 `/admin` 與 `isAdmin()`。** 新的老師權限模型獨立存在，兩者不互相繼承。

## Decisions

### 課程設定檔不搬進資料庫，改用 course_teachers 對應表

課程資料留在 `src/lib/courses-config.ts`，新系統以 `course_id`（text）弱連結。另建 `course_teachers` 表管理批改權限。

**替代方案：** 建 `courses` 表帶 `owner_teacher_id`，報名頁改讀資料庫。模型最乾淨，但會動到報名與結帳的渲染路徑，那是收錢的管線，回歸風險最高，且與本變更目的無關。**否決。**

**替代方案：** 另開 `/classroom` 獨立子系統，自帶課程表。隔離徹底，但學員需在兩套身分間跳轉，與「統一身分」的目標矛盾。**否決。**

對應表在課程日後真的搬進資料庫時依然是正確的抽象，故此決策不製造未來的技術債。

### 不建權益表，解鎖狀態由 submission 推導

「有沒有權益」等於「有沒有交這份作業」，一個查詢即可回答，不需要另一張表記錄可推導的事實。

**替代方案：** 建 `entitlements` 表記錄「誰解鎖了什麼」。多一張表就多一個會與事實不同步的來源（交了但沒發權益、退課了權益還在），且在「繳交即解鎖」的規則下它承載不了任何新資訊。**否決。**

日後若需要「手動授予權益」或「解鎖後收回」，再引入不遲，屆時才會知道它該有什麼欄位。

### 寫入一律經 route handler，RLS 只負責讀取

Supabase anon key 是公開的，學員可直接呼叫 PostgREST。若開放 insert/update policy，就必須用欄位層級保護或 trigger 才能防止學員自行寫入 `teacher_comment`，兩者都是難以察覺的隱形機制。

**決定：** 新表一律不開寫入 policy（無 policy 等同只有 service role 能寫），所有寫入經 Next.js route handler，在應用層做明確授權檢查。RLS 的讀取 policy 作為第二層防禦。此模式與 repo 既有做法一致。

### Storage 零 policy，全走 server 簽發的 signed URL

私有 bucket 不設任何 policy。上傳走 `createSignedUploadUrl()`：server 先驗報名資格再簽發，client 直接 PUT 到 Supabase。下載走 `createSignedUrl()`，短效期，前端不快取。

此決策同時解決兩件事：bucket 完全不對外，且**繞過 Vercel route handler 4.5MB 的 body 上限**（大附件不經過 serverless function）。

**替代方案：** 開 storage RLS policy 讓 client 直傳。需以 `storage.foldername(name)` 解析路徑做權限判斷，脆弱且難測。**否決。**

### 獎勵一律掛在單一作業底下

`rewards.assignment_id` 為 NOT NULL，不存在「課程級獎勵」。若需要「全部交完才給」的獎勵，掛在最後一份作業上即可。此決策避免引入「完成度計算」這條規則與其邊界情況（作業新增後完成度倒退等）。

### 學員身分以 email 回填綁定

`course_enrollments` 新增 `user_id`，以 email 比對回填既有資料；報名時若有 session 即帶入；登入時認領同 email 且尚未綁定的紀錄。Supabase Auth 的 email 經過驗證，故此認領安全。

**邊界情況：** 以 A 信箱付款、以 Google B 信箱登入者無法自動對上。**決定不做自助流程**，後臺提供人工綁定介面即可，預期量少，不值得為此建置機制。

## Implementation Contract

### 資料模型

`course_enrollments` 新增欄位（僅新增，不改動任何既有欄位）：

```sql
alter table course_enrollments add column user_id uuid references auth.users(id);
create index on course_enrollments (user_id);
```

五張新表：

- **`course_teachers`**：`id` uuid pk、`course_id` text not null、`teacher_id` uuid not null → `profiles(id)`、`created_at`。unique `(course_id, teacher_id)`。
- **`assignments`**：`id` uuid pk、`course_id` text not null、`title` text not null、`description` text（markdown）、`sort_order` int not null default 0、`allow_file` / `allow_text` / `allow_link` boolean not null（check 約束：至少一為 true）、`due_at` timestamptz null（僅顯示）、`is_published` boolean not null default false、`created_by` uuid → `profiles(id)`、`created_at` / `updated_at`。
- **`submissions`**：`id` uuid pk、`assignment_id` uuid not null → `assignments(id)` on delete cascade、`user_id` uuid not null → `auth.users(id)` on delete cascade、`text_content` text null、`link_url` text null、`submitted_at` timestamptz not null default now()、`updated_at` timestamptz not null、`teacher_comment` text null、`reviewed_at` timestamptz null、`reviewed_by` uuid null → `profiles(id)`。unique `(assignment_id, user_id)`。**無 status 欄位**：有沒有交等於這列存不存在，有沒有批改等於 `reviewed_at is null`。
- **`submission_files`**：`id` uuid pk、`submission_id` uuid not null → `submissions(id)` on delete cascade、`storage_path` text not null、`filename` text not null（原始檔名）、`size_bytes` bigint not null、`mime_type` text、`created_at`。
- **`rewards`**：`id` uuid pk、`assignment_id` uuid not null → `assignments(id)` on delete cascade、`kind` text not null（check in `video` / `file` / `link`）、`title` text not null、`description` text、`video_url` text（kind=video）、`storage_path` text（kind=file）、`external_url` text（kind=link）、`sort_order` int not null default 0、`created_at`。

### RLS

兩個 security definer helper：

```sql
create function is_course_teacher(p_course_id text) returns boolean
  language sql security definer stable as $$
    select exists (select 1 from course_teachers
      where course_id = p_course_id and teacher_id = auth.uid());
  $$;

create function is_enrolled(p_course_id text) returns boolean
  language sql security definer stable as $$
    select exists (select 1 from course_enrollments
      where course_id = p_course_id and user_id = auth.uid() and status = 'paid');
  $$;
```

讀取 policy（**所有新表一律不開寫入 policy**）：

- `assignments`：學員可讀 `is_enrolled(course_id) and is_published`；老師可讀 `is_course_teacher(course_id)`。
- `submissions`：學員僅可讀 `user_id = auth.uid()`；老師可讀所屬課程全部（需 join `assignments` 取 `course_id`）。
- `submission_files`：跟隨所屬 `submission` 的可見性。
- `rewards`：學員可讀的條件為「該 assignment 存在屬於自己的 submission」；老師可讀所屬課程全部。
- `course_teachers`：老師僅可讀 `teacher_id = auth.uid()` 的列。

### Storage

私有 bucket `submissions`，於 migration 內以 `insert into storage.buckets` 建立，`public = false`，**不設任何 policy**。

- 學員作業路徑：`{course_id}/{assignment_id}/{user_id}/{timestamp}-{safe_filename}`
- 講義檔案路徑：`rewards/{course_id}/{timestamp}-{safe_filename}`

### 可觀察行為

**學員：** 於 `/courses/[course]/assignments` 看到該課程已發布的作業列表與自己的繳交狀態。點入 `/courses/[course]/assignments/[id]` 可讀說明並繳交；繳交成功後，獎勵區塊於同頁展開，影片內嵌播放、講義提供下載、1-on-1 提供預約連結。重繳會覆寫先前內容。未登入者導向 `/auth/login` 並帶 return URL；已登入但該課程無 `status='paid'` 報名紀錄者，看到「尚未報名」提示與課程頁連結，且不洩漏任何作業內容。

**老師：** 於 `/teach` 看到自己授課的課程。`/teach/[course]` 列出作業與各自繳交數；`/teach/[course]/assignments/[id]` 列出繳交名單，可讀內容、下載附件、撰寫評語。可新增與編輯作業和獎勵。非授課老師存取他人課程一律 404 或 403，不得洩漏該課程存在與否以外的資訊。

**平臺管理者（僅 Vista，沿用既有 `isAdmin()`）：** 可指派 `course_teachers`、可人工綁定 email 對不上的報名紀錄。

### 介面

- `POST /api/assignments/[id]/upload-url` → 驗報名資格後回傳 signed upload URL 與 storage path。
- `POST /api/assignments/[id]/submit` → 建立或更新 submission，body 含 `text_content`、`link_url`、已上傳檔案的 metadata 陣列。
- `GET /api/rewards/[id]/access` → 驗有無對應 submission 後，回傳 signed URL（kind=file）或直接回傳網址（kind=video / link）。
- `POST /api/teach/submissions/[id]/review` → 寫入 `teacher_comment`、`reviewed_at`、`reviewed_by`。
- 作業與獎勵的 CRUD routes（於 `/api/teach/` 之下）。

`src/middleware.ts` 的保護路由清單加入 `/teach` 與 `/api/teach`。

### 失敗模式

- 上傳失敗：client 顯示錯誤並保留表單內容，不建立 submission 列。
- 檔案已上傳但 submit 失敗：孤兒檔案留在 bucket。**刻意不處理**，不建清理排程，量大再議。
- signed URL 過期：前端重新請求，不快取 URL。
- 未報名者請求 upload URL：403，不簽發。
- 未繳交者請求 reward access：403。
- 非授課老師寫評語：403。

### 驗收標準

- **RLS 隔離測試（最高優先）**：對真實資料庫、以不同 JWT 身分斷言：學員 A 讀不到學員 B 的 submission；非授課老師讀不到他課的 submission；未報名者讀不到 assignments。此項不接受以程式碼審查代替。
- **route handler 授權測試**：未報名者拿不到 upload URL；未繳交者拿不到 reward；非授課老師寫不了評語。
- **回填 migration 驗證**：對複製資料集驗證回填筆數正確，且既有欄位零異動。
- 沿用既有 vitest 設定與 `src/app/api/download/*/route.test.ts` 的測試 pattern。

### 範圍邊界

**在範圍內：** 上述五張表、RLS、私有 bucket、學員與老師頁面、上列 API routes、`course_enrollments` 加欄位與回填、`register/route.ts` 帶入 `user_id`、middleware 路由清單。

**在範圍外：** 任何 Recur / 結帳 / 退款程式碼、`courses-config.ts`、既有 `/admin` 頁面與 `isAdmin()`、`consulting_*` 相關表、既有兩個公開 bucket 的改造、通知信。

## Risks / Trade-offs

- **回填動到收錢資料** → 只寫新欄位、不碰既有欄位；加欄位與回填拆成兩個獨立 migration；執行前備份；以複製資料集先驗證。
- **RLS 寫錯導致學員看到別人作業** → 以真實資料庫測試驗證隔離，列為驗收標準第一項，不靠程式碼審查。
- **repo 無本機 Supabase 環境，RLS 無法驗證** → 實作第一項任務即為 `supabase init` 建立本機環境，讓 migration 能在本機 Postgres 重放並以不同 JWT 身分驗證 policy。付費 Supabase branch 與對正式專案測試皆為更差的替代方案。
- **孤兒檔案累積** → 第一版接受，不做清理排程。
- **`/teach` 與 `/admin` 權限模型分歧** → 明確界線：`/admin` 是平臺管理（Vista），`/teach` 是課程教學（授課者）。兩者不互相繼承，不共用 helper。
- **課程仍在設定檔、`course_id` 為弱連結** → 設定檔移除課程但 `assignments` 仍存在時會產生孤兒資料。第一版接受（課程極少下架），老師後臺會略過無對應設定的課程。

## Migration Plan

依序執行，每一步可獨立回滾：

1. `supabase init` 建立本機環境（不影響正式環境）。
2. Migration A：`course_enrollments` 新增 `user_id` 欄位與索引。可回滾（drop column）。
3. Migration B：以 email 回填 `user_id`。回滾方式為 `update course_enrollments set user_id = null`，不損失任何既有資料。
4. Migration C：五張新表、helper function、RLS 讀取 policy。可回滾（drop）。
5. Migration D：建立私有 bucket。可回滾（delete bucket，此時尚無檔案）。
6. 應用程式碼部署（Vercel，git push）。

前端在 Migration C 之前不引用新表，故 2 至 5 步可先行且不影響線上。

## Open Questions

無。設計已於 2026-07-16 經 Vista 核可：多老師一次到位、補 `user_id` 強制登入、三種繳交形式全支援、繳交即自動解鎖、不串時數、不建權益表、不碰結帳。
