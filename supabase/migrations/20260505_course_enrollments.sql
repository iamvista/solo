-- Course enrollments — 課程報名表單收集的資料
-- 對應 src/app/courses/[course]/register 的表單輸入

create table if not exists course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  -- 必填聯絡方式
  email text not null,
  name text not null,
  phone text not null, -- E.164 格式 (例：+886912345678)
  phone_country text, -- ISO Alpha-2 (TW, US, JP...)
  -- 選填補充
  organization text,
  job_title text,
  attribution text, -- 怎麼得知這堂課
  question text, -- 想問講師的問題
  current_proposal_pain text, -- 目前最卡住的提案問題
  line_id text,
  facebook text,
  dietary text, -- 飲食偏好（含葷食/素食/過敏）
  invoice_company text, -- 公司報帳抬頭
  invoice_tax_id text, -- 統一編號
  marketing_consent boolean not null default false,
  -- 訂單對應
  status text not null default 'pending', -- pending / paid / failed / cancelled / refunded
  recur_order_id text,
  recur_product_id text,
  recur_payment_link_url text,
  amount integer, -- NT$ whole integer
  -- 通知狀態
  email_confirmation_sent_at timestamptz,
  sms_confirmation_sent_at timestamptz,
  sms_reminder_sent_at timestamptz,
  -- 時間
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_course_enrollments_email on course_enrollments(email);
create index if not exists idx_course_enrollments_phone on course_enrollments(phone);
create index if not exists idx_course_enrollments_status on course_enrollments(status);
create index if not exists idx_course_enrollments_recur_order on course_enrollments(recur_order_id);
create index if not exists idx_course_enrollments_course on course_enrollments(course_id);
create index if not exists idx_course_enrollments_created on course_enrollments(created_at desc);

-- RLS：僅 service role 可讀寫（前端透過 API route 介接）
alter table course_enrollments enable row level security;

-- 預設沒有任何 policy → 等同關閉所有非 service-role 訪問
-- 後續若要做後台名單頁，再開 owner-only SELECT policy
