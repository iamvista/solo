-- 期別：一門課會開很多期，作業與學員必須分期隔離。
-- 設計文件：openspec/changes/add-course-cohorts/design.md
--
-- 期別本身定義在 src/lib/courses-config.ts 的 cohorts 陣列（與課程同處，
-- 因為它是課程設定不是交易資料）。資料庫只記一件它真正該記的事：
-- 這筆報名／作業／來賓屬於哪一期。cohort_key 是弱連結，比照 course_id。
--
-- 回填依據是 recur_product_id，不是時間戳：2026-07-17 已把 Recur 商品拆成
-- 每期一組（第一期 b3dc06/u0rnbc、第二期 tpl4a90/dckcqar），所以「買了哪個
-- 商品」就是「哪一期」——這是付款紀錄裡的事實，不是推論。

alter table public.course_enrollments add column if not exists cohort_key text;
alter table public.assignments add column if not exists cohort_key text;
alter table public.course_guests add column if not exists cohort_key text;

create index if not exists idx_course_enrollments_cohort
  on public.course_enrollments(course_id, cohort_key);
create index if not exists idx_assignments_cohort
  on public.assignments(course_id, cohort_key);
create index if not exists idx_course_guests_cohort
  on public.course_guests(course_id, cohort_key);

-- ── 回填 ────────────────────────────────────────────────────────
-- ai-academic-writing：依商品 ID 分兩期。
update public.course_enrollments set cohort_key = '1'
where course_id = 'ai-academic-writing'
  and recur_product_id in (
    'b3dc06svryzlii74r2bpn6qo',  -- 第一期早鳥
    'u0rnbc9kgub6azuw44ub72ml'   -- 第一期原價
  );

update public.course_enrollments set cohort_key = '2'
where course_id = 'ai-academic-writing'
  and recur_product_id in (
    'tpl4a90ujudu17w69oggetbk',  -- 第二期早鳥
    'dckcqar572yqgeij7ubqsljj'   -- 第二期原價
  );

-- pending 的報名還沒付款，沒有 recur_product_id。
-- 它們全部產生於第二期開賣（2026-07-16 02:02 UTC，commit ef7188e）之前，
-- 因此屬於第一期。此為一次性的歷史修正，不是常態邏輯。
update public.course_enrollments set cohort_key = '1'
where course_id = 'ai-academic-writing'
  and cohort_key is null
  and created_at < '2026-07-16 02:02:00+00';

-- 其餘課程目前各只有一期。刻意不寫死課程清單：vibe-coding-claude-code
-- 有 6 筆報名卻已不在 courses-config 裡（課程下架但資料還在），寫死清單會漏掉它。
update public.course_enrollments set cohort_key = '1'
where cohort_key is null
  and course_id <> 'ai-academic-writing';

-- 既有作業歸入其課程的唯一一期。
update public.assignments set cohort_key = '1' where cohort_key is null;
update public.course_guests set cohort_key = '1' where cohort_key is null;
