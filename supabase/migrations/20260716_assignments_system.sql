-- 學員作業繳交系統：六張表。
-- 設計文件：openspec/changes/add-assignments-system/design.md
--
-- 授權模型：學員不持有 Supabase 工作階段（以 magic link + 簽章 cookie 識別），
-- 故 auth.uid() 對學員恆為 null，RLS 無從據以判斷學員身分。
-- 所有新表一律啟用 RLS 但不設任何 policy（等同僅 service role 可存取），
-- 授權全部在 Next.js route handler 內完成。比照 course_enrollments 與 download_tokens 的既有模式。
--
-- 本 migration 不觸碰 course_enrollments，僅由應用層唯讀查核報名資格。

-- assignment_access_tokens：magic link 權杖。單次使用、效期 30 分鐘。
create table if not exists public.assignment_access_tokens (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  email text not null,
  course_id text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint assignment_access_tokens_email_lower check (email = lower(email))
);
create index if not exists idx_assignment_access_tokens_token on public.assignment_access_tokens(token);
create index if not exists idx_assignment_access_tokens_expires on public.assignment_access_tokens(expires_at);

-- course_teachers：誰能批改哪門課。
-- course_id 弱連結 src/lib/courses-config.ts 的 key，課程資料不搬進資料庫（見 design.md 決策二）。
create table if not exists public.course_teachers (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint course_teachers_course_teacher_unique unique (course_id, teacher_id)
);
create index if not exists idx_course_teachers_teacher on public.course_teachers(teacher_id);

-- assignments：作業定義。
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  title text not null,
  description text,
  sort_order int not null default 0,
  allow_file boolean not null default true,
  allow_text boolean not null default true,
  allow_link boolean not null default true,
  due_at timestamptz,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- 至少要開放一種繳交形式，否則作業無法被繳交
  constraint assignments_at_least_one_form check (allow_file or allow_text or allow_link)
);
create index if not exists idx_assignments_course on public.assignments(course_id, sort_order);

-- submissions：學員繳交。一位學員對一份作業僅一列，重繳就地更新。
-- 刻意不設 status 欄位：有沒有交＝這列存不存在；有沒有批改＝reviewed_at 是否為 null。
-- 以 student_email 為鍵（非 user_id），因學員不使用帳號系統。
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_email text not null,
  text_content text,
  link_url text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  teacher_comment text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  constraint submissions_assignment_email_unique unique (assignment_id, student_email),
  constraint submissions_email_lower check (student_email = lower(student_email))
);
create index if not exists idx_submissions_assignment on public.submissions(assignment_id);
create index if not exists idx_submissions_email on public.submissions(student_email);

-- submission_files：繳交的附加檔案。
-- storage_path 刻意不含 email，避免個資落入儲存路徑；擁有權由本表回溯 submissions 取得。
create table if not exists public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  size_bytes bigint not null,
  mime_type text,
  created_at timestamptz not null default now()
);
create index if not exists idx_submission_files_submission on public.submission_files(submission_id);

-- rewards：繳交後解鎖的內容。
-- assignment_id 為 NOT NULL，不存在課程級獎勵（見 design.md 決策六）：
-- 若要「全部交完才給」，掛在最後一份作業上即可，藉此免除完成度計算這條規則。
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  kind text not null check (kind in ('video', 'file', 'link')),
  title text not null,
  description text,
  video_url text,
  storage_path text,
  external_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  -- 每種 kind 必須帶著自己那一欄的內容
  constraint rewards_payload_matches_kind check (
    (kind = 'video' and video_url is not null)
    or (kind = 'file' and storage_path is not null)
    or (kind = 'link' and external_url is not null)
  )
);
create index if not exists idx_rewards_assignment on public.rewards(assignment_id, sort_order);

-- RLS：六張表一律啟用但不設任何 policy → 僅 service role 可存取。
-- 學員與老師的授權皆在 route handler 完成，資料庫層不承擔授權責任。
alter table public.assignment_access_tokens enable row level security;
alter table public.course_teachers enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_files enable row level security;
alter table public.rewards enable row level security;
