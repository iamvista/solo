-- 防止同一 (course_id, email) 同時存在多筆 pending 報名（TOCTOU 競態）。
-- partial unique index：只約束 status='pending'，合法的多筆歷史狀態列（cancelled 後重報等）不受影響。
-- 已於 2026-07-14 透過 Supabase MCP apply_migration 套用到正式專案 avwdnlwrqmrjrugcadwz。
CREATE UNIQUE INDEX IF NOT EXISTS course_enrollments_pending_unique
ON course_enrollments (course_id, email)
WHERE status = 'pending';
