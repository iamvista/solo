-- rewards 新增第四種類型 text：老師直接寫一段文字，學員繳交後在作業頁上讀到。
-- 設計文件：openspec/changes/add-reward-text-and-upload/design.md
--
-- 與另外三種的本質差別：video / file / link 都是「指向別處的東西」，
-- 需要一個 URL 才能取得；text 的內容就在資料庫裡，繳交後由 server 直接渲染，
-- 不經 signed URL。
--
-- 純文字，不解析 markdown 或 HTML：老師輸入的內容會直接出現在學員頁面上，
-- 渲染未淨化的標記等於在學員頁面開一個注入點。

alter table public.rewards add column if not exists body_text text;

-- 放寬 kind 為四種。drop 與 add 在同一個 migration 交易內完成，
-- 不存在「約束消失」的中間狀態。
alter table public.rewards drop constraint if exists rewards_kind_check;
alter table public.rewards add constraint rewards_kind_check
  check (kind in ('video', 'file', 'link', 'text'));

-- 每種 kind 仍必須帶著自己那一欄的內容。
-- 新約束在既有的 video / file / link 資料上與舊約束等價。
alter table public.rewards drop constraint if exists rewards_payload_matches_kind;
alter table public.rewards add constraint rewards_payload_matches_kind check (
  (kind = 'video' and video_url is not null)
  or (kind = 'file' and storage_path is not null)
  or (kind = 'link' and external_url is not null)
  or (kind = 'text' and body_text is not null)
);
