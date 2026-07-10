-- ARS（AI 學術研究工作臺）bundle 支援：
-- 1) chosen_vertical：研究生／教授包在下載頁自選 1 個學科垂直後鎖定的欄位。
-- 2) order_id 唯一索引：download_tokens 目前只由 ai-coach-kit 使用，每筆 order 僅開一個
--    token，無同 order 多 token 的合法案例（查證：webhook route.ts 唯一寫入路徑
--    fulfilAiCoachKit 每個 order 只 insert 一次）；加唯一索引把現有 maybeSingle() 冪等
--    從「樂觀假設」變成 DB 層硬保證，webhook 併發重送不會雙開 token。
-- 3) 兩支原子性 RPC：下載次數遞增、學科垂直一次性鎖定，皆靠 SQL WHERE 條件擋在資料庫層，
--    affected rows（RETURNING 是否有列）判斷成敗，避免「先讀再寫」的競態視窗。

ALTER TABLE download_tokens
  ADD COLUMN IF NOT EXISTS chosen_vertical TEXT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS download_tokens_order_id_key
  ON download_tokens (order_id);

CREATE OR REPLACE FUNCTION increment_download_count(p_token TEXT)
RETURNS SETOF download_tokens
LANGUAGE sql
AS $$
  UPDATE download_tokens
  SET download_count = download_count + 1
  WHERE token = p_token
    AND download_count < max_downloads
  RETURNING *;
$$;

CREATE OR REPLACE FUNCTION select_ars_vertical(p_token TEXT, p_vertical TEXT)
RETURNS SETOF download_tokens
LANGUAGE sql
AS $$
  UPDATE download_tokens
  SET chosen_vertical = p_vertical
  WHERE token = p_token
    AND chosen_vertical IS NULL
  RETURNING *;
$$;
