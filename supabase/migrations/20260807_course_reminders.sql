-- 課程倒數提醒（D-7／D-5／D-3／D-1）的寄送紀錄。
--
-- 存在的唯一理由是防重寄：cron 每天跑，若當天寄到一半失敗、或人工補跑一次，
-- 沒有這張表就會對同一位付費學員重寄同一封。UNIQUE 讓「先寫紀錄再寄信」
-- 這個順序天然冪等，cron 可以安全重跑。
--
-- 為什麼不沿用 course_enrollments 既有的 sms_reminder_sent_at 那種單一欄位：
-- 那種寫法一門課只記得住「有沒有寄過」，記不住「哪一個 offset 寄過」，
-- 四封提醒會互相蓋掉。

create table if not exists course_reminders (
  id uuid primary key default gen_random_uuid(),
  -- 課程 slug，對應 course_enrollments.course_id 與 COURSE_CONFIGS 的 key
  course_id text not null,
  -- 期別。同一門課不同期各自計算，null 代表該課沒有期別概念
  cohort_key text,
  registrant_email text not null,
  -- 7 / 5 / 3 / 1，對應 REMINDER_OFFSETS
  offset_days int not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- cohort_key 可為 null，而 Postgres 的 UNIQUE 不會把兩個 null 視為相等，
-- 所以用 coalesce 正規化後建 unique index，避免無期別課程被重複寄送。
create unique index if not exists course_reminders_unique
  on course_reminders (
    course_id,
    coalesce(cohort_key, ''),
    registrant_email,
    offset_days
  );

create index if not exists idx_course_reminders_lookup
  on course_reminders (course_id, cohort_key, offset_days);

-- RLS：比照 course_enrollments，僅 service role 可讀寫。
alter table course_reminders enable row level security;

-- ─────────────────────────────────────────────────────────────
-- 手動排除旗標
--
-- 為什麼需要：ai-content 這門課走過 6/28 → 7/12 → 8/30 三次改期，
-- 但期別與 Recur 商品從頭到尾沒換過，於是六月付款、可能已上完舊場次的
-- 學員，與八月才報名的新學員共用同一個 cohort_key，資料庫分不出來。
--
-- 正解本來是把舊學員移到獨立期別，但 courses-config.test.ts 有一條
-- 「商品不跨期共用」的不變式，而這門課的商品確實被三場共用，
-- 補期別會踩到那條防護。與其弱化防護，不如把「這個人不屬於本場」
-- 這件事明確記在列上。
-- ─────────────────────────────────────────────────────────────
alter table course_enrollments
  add column if not exists reminder_excluded boolean not null default false,
  add column if not exists reminder_excluded_reason text;

comment on column course_enrollments.reminder_excluded is
  'true 代表此列不寄開課提醒（例：改期前的舊場次學員、內部測試單）';
