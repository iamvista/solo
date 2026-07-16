-- rewards 新增 file_name：講義的原始檔名。
--
-- 為什麼需要：storage key 會被 safeFilename ASCII 化（Supabase Storage 拒收
-- 非 ASCII key），所以「測試講義.txt」會變成「91e5d3b7-file.txt」。老師上傳後
-- 在列表上看到那串是無意義的——設計說「老師不需要知道 storage 路徑的存在」，
-- 卻讓他讀一段被改壞的路徑，等於違反了自己的規則。
--
-- 原始檔名存這裡，key 保持 ASCII，兩邊各司其職。
-- 學員端既有的 submission_files.filename 是同一個模式。

alter table public.rewards add column if not exists file_name text;
