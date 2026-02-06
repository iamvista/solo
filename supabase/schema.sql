-- solo.tw Database Schema
-- 請在 Supabase Dashboard > SQL Editor 執行此 SQL

-- =====================
-- 1. 診斷結果表
-- =====================
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 用戶資訊（可選，未登入也能做診斷）
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,

  -- 診斷類型
  diagnosis_type TEXT NOT NULL DEFAULT 'quick', -- 'quick' or 'full'

  -- 五維分數 (0-100)
  score_positioning INTEGER NOT NULL DEFAULT 0,
  score_delivery INTEGER NOT NULL DEFAULT 0,
  score_trust INTEGER NOT NULL DEFAULT 0,
  score_monetization INTEGER NOT NULL DEFAULT 0,
  score_sustainability INTEGER NOT NULL DEFAULT 0,

  -- 總分與類型
  total_score INTEGER NOT NULL DEFAULT 0,
  solo_type TEXT NOT NULL, -- 'lion', 'fox', 'elephant', 'eagle', 'turtle', 'chick'

  -- 原始答案（JSON 格式）
  answers JSONB NOT NULL DEFAULT '{}',

  -- 追蹤資訊
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- 為查詢優化建立索引
CREATE INDEX IF NOT EXISTS idx_diagnosis_user_id ON diagnosis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_created_at ON diagnosis_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnosis_solo_type ON diagnosis_results(solo_type);

-- =====================
-- 2. 用戶資料表（擴展 auth.users）
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 基本資訊
  display_name TEXT,
  avatar_url TEXT,

  -- 專業資訊
  profession TEXT, -- 講師、顧問、教練等
  expertise TEXT[], -- 專業領域標籤
  years_experience INTEGER,

  -- 聯絡資訊
  website TEXT,
  linkedin TEXT,

  -- 會員狀態
  membership_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'premium'
  membership_expires_at TIMESTAMP WITH TIME ZONE
);

-- 當新用戶註冊時自動建立 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 觸發器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- 3. 電子報訂閱表
-- =====================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  email TEXT NOT NULL UNIQUE,
  name TEXT,

  -- 訂閱狀態
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,

  -- 來源追蹤
  source TEXT, -- 'homepage', 'diagnosis', 'course' 等
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- =====================
-- 4. Row Level Security (RLS)
-- =====================

-- 啟用 RLS
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- diagnosis_results 政策
-- 任何人都可以新增（未登入也能做診斷）
CREATE POLICY "Anyone can insert diagnosis" ON diagnosis_results
  FOR INSERT WITH CHECK (true);

-- 任何人都可以透過 ID 查看診斷結果（分享功能需要）
CREATE POLICY "Anyone can view diagnosis by id" ON diagnosis_results
  FOR SELECT USING (true);

-- profiles 政策
-- 用戶只能看到和編輯自己的 profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- newsletter_subscribers 政策
-- 任何人都可以訂閱
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- =====================
-- 完成！
-- =====================
