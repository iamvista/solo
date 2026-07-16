-- 課程來賓名冊與作業通知紀錄。
-- 設計文件：openspec/changes/add-roster-and-notify/design.md
--
-- 為什麼要有 course_guests：
-- 學員資格原本只認 course_enrollments 裡 status='paid' 的紀錄，等於假設
-- 「所有學員都經 Recur 付費」。那個假設是錯的：匯款、贈送、合作換課、助教
-- 旁聽都進不來，而唯一的變通是往金流表插一筆假的付費紀錄。
--
-- course_enrollments 回答的問題是「誰付了錢」。一個沒付錢的人在那裡沒有答案
-- 可給，塞進去會讓所有從它衍生的東西變髒：營收統計、名單匯出、admin 名單頁。
-- 「誰付了錢」與「誰能進教室」本來就是兩件事，先前只是恰好重疊。

create table if not exists public.course_guests (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  email text not null,
  name text,
  -- 為什麼加這個人。留白會讓半年後的自己看不懂名單。
  note text,
  added_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  constraint course_guests_course_email_unique unique (course_id, email),
  constraint course_guests_email_lower check (email = lower(email))
);
create index if not exists idx_course_guests_course on public.course_guests(course_id);
create index if not exists idx_course_guests_email on public.course_guests(email);

-- assignment_notifications：每一次「通知學員」的紀錄。
-- 刻意記在自己的表而非 assignments.last_notified_at：老師猶豫「我到底寄了沒」
-- 時想知道的是「寄過幾次、誰寄的」，單一時間戳答不出來。
create table if not exists public.assignment_notifications (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  sent_by uuid references public.profiles(id),
  -- 實際寄成功的封數，不是嘗試數。
  recipient_count int not null,
  sent_at timestamptz not null default now()
);
create index if not exists idx_assignment_notifications_assignment
  on public.assignment_notifications(assignment_id, sent_at desc);

-- RLS：比照既有新表，啟用但零 policy → 僅 service role 可存取，
-- 授權一律在 route handler 完成。
alter table public.course_guests enable row level security;
alter table public.assignment_notifications enable row level security;
