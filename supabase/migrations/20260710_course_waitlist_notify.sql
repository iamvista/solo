-- 候補名單擴充為「下期開課通知」名單：
-- 既有列一律歸位為 full_waitlist（本次改動前，唯一寫入路徑就是額滿候補）
alter table public.course_waitlist
  add column if not exists intent text not null default 'full_waitlist',
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists preferred_timeslot text,
  add column if not exists notified_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

alter table public.course_waitlist
  drop constraint if exists course_waitlist_intent_check;
alter table public.course_waitlist
  add constraint course_waitlist_intent_check
  check (intent in ('full_waitlist', 'date_conflict', 'ad_lead'));

alter table public.course_waitlist
  drop constraint if exists course_waitlist_timeslot_check;
alter table public.course_waitlist
  add constraint course_waitlist_timeslot_check
  check (preferred_timeslot is null
         or preferred_timeslot in ('weekday_evening', 'saturday', 'sunday', 'any'));

create index if not exists course_waitlist_intent_idx on public.course_waitlist (intent);
create index if not exists course_waitlist_utm_campaign_idx on public.course_waitlist (utm_campaign);

-- 衝突解析下放到資料庫：supabase-js 的 .upsert() 只能整列覆寫，
-- 無法表達「intent 不覆寫、utm_* 僅在為 NULL 時補寫」。
-- 單一語句內原子完成，免去先讀後寫的競態。
create or replace function public.upsert_course_waitlist(
  p_course_slug text,
  p_name text,
  p_email text,
  p_intent text,
  p_instructor_slug text default null,
  p_phone text default null,
  p_source_page text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null
)
returns uuid
language sql
as $$
  insert into public.course_waitlist as cw (
    course_slug, instructor_slug, name, email, phone, source_page,
    intent, utm_source, utm_medium, utm_campaign, utm_content
  )
  values (
    p_course_slug, p_instructor_slug, p_name, p_email, p_phone, p_source_page,
    p_intent, p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content
  )
  on conflict (course_slug, email) do update set
    -- 身分以最早意圖為準：先留 date_conflict 的人，不因後來從廣告再填一次而被降級為 ad_lead
    intent = cw.intent,
    -- 歸因以首次廣告接觸為準
    utm_source = coalesce(cw.utm_source, excluded.utm_source),
    utm_medium = coalesce(cw.utm_medium, excluded.utm_medium),
    utm_campaign = coalesce(cw.utm_campaign, excluded.utm_campaign),
    utm_content = coalesce(cw.utm_content, excluded.utm_content),
    -- 使用者可能修正打字錯誤
    name = excluded.name,
    phone = excluded.phone,
    updated_at = now()
  returning cw.id;
$$;

-- 刻意不用 security definer：本表 RLS 開啟且無 policy，definer 會讓匿名角色
-- 繞過 RLS 寫入。API 走 service role，本就繞過 RLS。
-- 必須先收回 public：函式預設把 execute 授予 public，只 revoke anon 不會移除其繼承而來的權限。
revoke execute on function public.upsert_course_waitlist(
  text, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.upsert_course_waitlist(
  text, text, text, text, text, text, text, text, text, text, text
) to service_role;
