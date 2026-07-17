-- pending 唯一索引改為以期別為單位。
--
-- 原索引是 (course_id, email) where status='pending'，用意是防 TOCTOU 競態
-- （同一人同時建出兩筆待付款）。但一門課開多期之後，它會把「第一期學員想報
-- 第二期」也擋掉——那是完全正當的報名。
--
-- 收斂到 (course_id, cohort_key, email) 後，防競態的效果不變（同一期仍只能有
-- 一筆 pending），跨期報名則放行。
--
-- cohort_key 為 null 的情況（沒有招生中的期別）用 coalesce 收斂成空字串，
-- 否則 null 在唯一索引中彼此不相等，防競態會失效。

drop index if exists course_enrollments_pending_unique;

create unique index if not exists course_enrollments_pending_unique
on public.course_enrollments (course_id, coalesce(cohort_key, ''), email)
where status = 'pending';
