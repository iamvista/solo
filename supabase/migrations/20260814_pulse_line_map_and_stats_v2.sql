-- Pulse HQ 第二波：營收歸線對照表＋pulse_course_stats v2（附 baseline 還版控債）
-- 計畫：vista-lab docs/plans/2026-08-14-pulse-wave2-revenue-funnel.md
-- 本檔一經 apply 即不可變；日後改歸線一律開新的 forward migration（同 upsert 與歸屬斷言格式）。

-- 1) baseline：private schema 物件補版控（pulse_course_stats 原始版建立於
--    2026-08-12 Pulse HQ 改版，當時未落 migration；函式本體直接以 v2 取代，見第 3 節）
create schema if not exists private;
create table if not exists private.pulse_rpc_config (key_hash text);

-- 2) 歸線對照表與 canonical seed（依 2026-08-14 course_enrollments 與 download_tokens
--    的實際 distinct 值；改一列即可重歸線，unmapped 不掉數字只歸桶）
create table if not exists private.pulse_line_map (
  item_kind text not null check (item_kind in ('course','product')),
  item_id   text not null,
  line_id   text not null,
  primary key (item_kind, item_id)
);

insert into private.pulse_line_map (item_kind, item_id, line_id) values
  ('course',  'ai-academic-writing',     'courses'),
  ('course',  'ai-content',              'courses'),
  ('course',  'vibe-coding',             'courses'),
  ('course',  'vibe-coding-claude-code', 'courses'),
  ('course',  'positioning-convergence', 'solo-products'),
  ('product', 'ai-coach-kit',            'solo-products'),
  ('product', 'army-kit',                'solo-products'),
  ('product', 'lecturer-kit',            'solo-products')
on conflict (item_kind, item_id) do update set line_id = excluded.line_id;

-- 3) pulse_course_stats v2：金鑰驗證與既有輸出鍵一字不改，新增每筆 line 與 totals.by_line
CREATE OR REPLACE FUNCTION public.pulse_course_stats(p_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_hash text;
BEGIN
  SELECT key_hash INTO v_hash FROM private.pulse_rpc_config LIMIT 1;
  IF v_hash IS NULL OR p_key IS NULL OR v_hash <> encode(extensions.digest(p_key, 'sha256'), 'hex') THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN (
    WITH bounds AS (
      SELECT date_trunc('month', now() AT TIME ZONE 'Asia/Taipei') AS month_start_taipei
    ),
    courses_agg AS (
      SELECT
        course_id,
        COALESCE(cohort_key, '') AS cohort_key_norm,
        COUNT(*) FILTER (WHERE status = 'paid')    AS paid_count,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) AS amount_sum,
        MAX(paid_at) FILTER (WHERE status = 'paid') AS last_paid_at
      FROM course_enrollments
      GROUP BY course_id, COALESCE(cohort_key, '')
    ),
    oneoff_agg AS (
      SELECT
        product_id,
        COUNT(*) AS cumulative_count,
        COUNT(*) FILTER (
          WHERE (created_at AT TIME ZONE 'Asia/Taipei') >= (SELECT month_start_taipei FROM bounds)
        ) AS month_count
      FROM download_tokens
      GROUP BY product_id
    ),
    totals_agg AS (
      SELECT COALESCE(SUM(amount), 0) AS month_paid_total
      FROM course_enrollments
      WHERE status = 'paid'
        AND paid_at IS NOT NULL
        AND (paid_at AT TIME ZONE 'Asia/Taipei') >= (SELECT month_start_taipei FROM bounds)
    ),
    by_line_agg AS (
      -- 與 totals_agg 同一組過濾與時區語意（Codex r1：守恆必須同語意才有意義）
      SELECT COALESCE(m.line_id, 'unmapped') AS line_id, SUM(e.amount) AS amount_sum
      FROM course_enrollments e
      LEFT JOIN private.pulse_line_map m
        ON m.item_kind = 'course' AND m.item_id = e.course_id
      WHERE e.status = 'paid'
        AND e.paid_at IS NOT NULL
        AND (e.paid_at AT TIME ZONE 'Asia/Taipei') >= (SELECT month_start_taipei FROM bounds)
      GROUP BY 1
    )
    SELECT jsonb_build_object(
      'courses', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'course_id', course_id,
          'cohort_key', NULLIF(cohort_key_norm, ''),
          'paid_count', paid_count,
          'pending_count', pending_count,
          'amount_sum', amount_sum,
          'last_paid_at', last_paid_at,
          'line', (SELECT m.line_id FROM private.pulse_line_map m
                   WHERE m.item_kind = 'course' AND m.item_id = courses_agg.course_id)
        ) ORDER BY course_id, cohort_key_norm)
        FROM courses_agg
      ), '[]'::jsonb),
      'oneoff', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'product_id', product_id,
          'cumulative_count', cumulative_count,
          'month_count', month_count,
          'line', (SELECT m.line_id FROM private.pulse_line_map m
                   WHERE m.item_kind = 'product' AND m.item_id = oneoff_agg.product_id)
        ) ORDER BY product_id)
        FROM oneoff_agg
      ), '[]'::jsonb),
      'totals', jsonb_build_object(
        'month_paid_total', (SELECT month_paid_total FROM totals_agg),
        'currency', 'TWD',
        'month_start_taipei', (SELECT to_char(month_start_taipei, 'YYYY-MM-DD') FROM bounds),
        'by_line', COALESCE((SELECT jsonb_object_agg(line_id, amount_sum) FROM by_line_agg), '{}'::jsonb)
      )
    )
  );
END;
$function$;
