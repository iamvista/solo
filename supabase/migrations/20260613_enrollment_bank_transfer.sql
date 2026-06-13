-- AI 變現研究院：手動匯款報名流程
-- 為 course_enrollments 補兩個 nullable 欄位，供匯款對帳與多單元報名使用。
-- 兩欄皆 nullable，不影響既有走 Recur 的課程。

alter table course_enrollments
  add column if not exists transfer_last_five text,
  add column if not exists selected_sessions text;

comment on column course_enrollments.transfer_last_five is '匯款帳號後五碼，供主辦單位對帳（手動匯款課程用）';
comment on column course_enrollments.selected_sessions is '報名者勾選的單元，逗號分隔（如 joyce,vista）';
