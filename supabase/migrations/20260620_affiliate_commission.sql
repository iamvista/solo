-- 聯盟行銷分潤系統
-- affiliates：夥伴／代碼；affiliate_referrals：分潤明細 ledger

create table if not exists affiliates (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  email text,
  commission_rate numeric(5,4) not null check (commission_rate > 0 and commission_rate <= 1),
  course_ids text[],
  status text not null default 'active',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_affiliates_code on affiliates(code);
create index if not exists idx_affiliates_status on affiliates(status);

alter table affiliates enable row level security;

create table if not exists affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references affiliates(id),
  enrollment_id uuid not null references course_enrollments(id),
  course_id text not null,
  order_amount integer not null,
  commission_rate numeric(5,4) not null,
  commission_amount integer not null,
  status text not null default 'pending',
  recur_order_id text,
  payout_note text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz,
  voided_at timestamptz
);

create unique index if not exists idx_affiliate_referrals_enrollment on affiliate_referrals(enrollment_id);
create index if not exists idx_affiliate_referrals_affiliate on affiliate_referrals(affiliate_id);
create index if not exists idx_affiliate_referrals_status on affiliate_referrals(status);
create index if not exists idx_affiliate_referrals_created on affiliate_referrals(created_at desc);
create index if not exists idx_affiliate_referrals_recur_order on affiliate_referrals(recur_order_id);

alter table affiliate_referrals enable row level security;

alter table course_enrollments add column if not exists referral_code text;
create index if not exists idx_course_enrollments_referral on course_enrollments(referral_code);
