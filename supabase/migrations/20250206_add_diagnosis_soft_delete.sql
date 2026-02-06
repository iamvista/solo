-- 為 diagnosis_results 添加軟刪除欄位
ALTER TABLE diagnosis_results
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

ALTER TABLE diagnosis_results
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 建立索引優化查詢
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_is_deleted ON diagnosis_results(is_deleted);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_user_deleted ON diagnosis_results(user_id, is_deleted);

-- 更新 RLS 政策：用戶只能看到未刪除的紀錄
DROP POLICY IF EXISTS "Users can view own diagnosis results" ON diagnosis_results;
CREATE POLICY "Users can view own diagnosis results"
ON diagnosis_results FOR SELECT
USING (
  auth.uid() = user_id
  AND (is_deleted = false OR is_deleted IS NULL)
);

-- 用戶可以更新自己的紀錄（用於軟刪除）
DROP POLICY IF EXISTS "Users can update own diagnosis results" ON diagnosis_results;
CREATE POLICY "Users can update own diagnosis results"
ON diagnosis_results FOR UPDATE
USING (auth.uid() = user_id);

-- 管理員可以查看所有紀錄（包含已刪除）
-- 注意：這需要一個 service role 或特殊的管理員查詢方式
