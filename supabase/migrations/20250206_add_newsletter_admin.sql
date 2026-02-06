-- 為 profiles 表新增 subscribe_newsletter 和 is_admin 欄位
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscribe_newsletter BOOLEAN DEFAULT true;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 為現有用戶設定預設值
UPDATE profiles
SET subscribe_newsletter = true
WHERE subscribe_newsletter IS NULL;

UPDATE profiles
SET is_admin = false
WHERE is_admin IS NULL;

-- 設定管理員（將 vista 設為管理員）
-- 注意：這裡需要先透過 Google 登入後，再手動設定
-- 或者可以用 email 來識別
-- UPDATE profiles SET is_admin = true WHERE id = 'user-id-here';

-- 建立索引以加速查詢
CREATE INDEX IF NOT EXISTS idx_profiles_subscribe_newsletter ON profiles(subscribe_newsletter);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_created_at ON diagnosis_results(created_at);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_solo_type ON diagnosis_results(solo_type);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_utm_source ON diagnosis_results(utm_source);
