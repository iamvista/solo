-- 新增舊生方案需要的欄位
-- 對應 vibe-coding-claude-code 舊生優惠 NT$3,500（需提交過去 Antigravity 版報名憑證）

alter table course_enrollments
  add column if not exists alumni_certificate text;
