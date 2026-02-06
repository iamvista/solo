-- 確保 profiles 表有所有需要的欄位
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profession TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS expertise TEXT[];

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS years_experience INTEGER;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS website TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS linkedin TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS membership_tier TEXT DEFAULT 'free';

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscribe_newsletter BOOLEAN DEFAULT true;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 為現有用戶設定預設值
UPDATE profiles SET subscribe_newsletter = true WHERE subscribe_newsletter IS NULL;
UPDATE profiles SET is_admin = false WHERE is_admin IS NULL;
UPDATE profiles SET membership_tier = 'free' WHERE membership_tier IS NULL;

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_profiles_subscribe_newsletter ON profiles(subscribe_newsletter);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- 確保 RLS 政策允許用戶更新自己的 profile
-- 先刪除可能存在的舊政策
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 建立新的 RLS 政策
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 允許 upsert 操作
CREATE POLICY "Users can upsert own profile"
ON profiles FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 設定管理員
UPDATE profiles
SET is_admin = true
WHERE id IN (SELECT id FROM auth.users WHERE email = 'iamvista@gmail.com');
