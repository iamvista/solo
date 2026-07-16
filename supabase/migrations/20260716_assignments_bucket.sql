-- 學員作業與講義的私有 storage bucket。
-- 設計文件：openspec/changes/add-assignments-system/design.md
--
-- 刻意與既有的 lead-magnets / avatars 兩個 bucket 不同：
-- 那兩個是公開 bucket（getPublicUrl），且是在 Dashboard 手動建立、不在 migration 內。
-- 本 bucket 為私有且零 policy，一律由 server 簽發短效期 signed URL 存取：
--   上傳 createSignedUploadUrl()、下載 createSignedUrl()。
-- 上傳不經 route handler，藉此繞過 Vercel 4.5MB 的 request body 上限。
--
-- 路徑格式：
--   學員作業 {course_id}/{assignment_id}/{random_id}-{safe_filename}
--   講義     rewards/{course_id}/{random_id}-{safe_filename}
-- 路徑不含 email，擁有權記錄於 submission_files 而非由路徑推導。

insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

-- 不建立任何 storage policy：僅 service role 可存取物件。
