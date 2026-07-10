-- ARS（AI 學術研究工作臺）RPC 強化：defense in depth。
-- Route 層（src/app/api/download/ars/route.ts、.../select-vertical/route.ts）已經檢查
-- token 是否過期、bundle 是否允許該操作；這裡在 DB 層再加一道 WHERE 條件，防的是
-- TOCTOU（route 檢查完到 RPC 執行之間，token 若剛好過期／bundle 不合規也不該放行），
-- 而不是取代 route 層驗證。
--
-- 不修改第一支 migration（20260711_download_tokens_ars.sql，已套用到線上），
-- 用 CREATE OR REPLACE 疊加強化。

CREATE OR REPLACE FUNCTION increment_download_count(p_token TEXT)
RETURNS SETOF download_tokens
LANGUAGE sql
AS $$
  UPDATE download_tokens
  SET download_count = download_count + 1
  WHERE token = p_token
    AND download_count < max_downloads
    AND expires_at > now()
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
    AND expires_at > now()
    AND product_id IN ('grad', 'faculty', 'addon-vertical')
  RETURNING *;
$$;
