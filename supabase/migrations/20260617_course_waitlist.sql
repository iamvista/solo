-- 課程候補名單：粉絲在作者頁點「通知我下一梯」留下的聯絡方式（收手機）
create table if not exists public.course_waitlist (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  instructor_slug text,
  name text not null,
  email text not null,
  phone text,
  source_page text,
  created_at timestamptz not null default now(),
  constraint course_waitlist_course_email_unique unique (course_slug, email)
);

create index if not exists course_waitlist_instructor_idx on public.course_waitlist (instructor_slug);
create index if not exists course_waitlist_course_idx on public.course_waitlist (course_slug);
create index if not exists course_waitlist_created_idx on public.course_waitlist (created_at desc);

-- RLS 開啟但不給匿名讀寫；寫入一律走 service role（繞過 RLS）
alter table public.course_waitlist enable row level security;
