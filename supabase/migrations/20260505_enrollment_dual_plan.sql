-- 新增雙人同行方案需要的欄位
-- 對應 ai-proposal-spotlight 雙人同行 NT$8,888

alter table course_enrollments
  add column if not exists plan text not null default 'individual',
  add column if not exists companion_name text,
  add column if not exists companion_email text,
  add column if not exists companion_phone text,
  add column if not exists companion_phone_country text;

create index if not exists idx_course_enrollments_companion_email
  on course_enrollments(companion_email);
