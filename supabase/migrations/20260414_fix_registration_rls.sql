-- 修補：events registrations RLS 政策
-- 原始 policy "Anyone can register" 使用 WITH CHECK (true)，
-- 等於允許未驗證身分的請求直接 INSERT，會被機器人/惡意腳本灌爆活動報名。
-- 改為強制 auth.uid() 不為 null，且 user_id 必須等於目前登入者，避免冒名註冊。

DROP POLICY IF EXISTS "Anyone can register" ON registrations;

CREATE POLICY "Authenticated users can register"
  ON registrations
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );
