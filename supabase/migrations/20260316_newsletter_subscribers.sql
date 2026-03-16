-- 電子報訂閱者表（支援未登入訪客訂閱）
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',        -- 來源：website, landing-page, lead-magnet, event
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- 若有帳號則關聯
  tags TEXT[] DEFAULT '{}',             -- 標籤：用於分眾
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',          -- 額外資訊（UTM、referrer 等）
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Email 唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_email
  ON newsletter_subscribers(email) WHERE status = 'active';

-- 查詢索引
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_source ON newsletter_subscribers(source);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_tags ON newsletter_subscribers USING GIN(tags);

-- 電子報發送記錄
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  preview_text TEXT,
  content_html TEXT,                    -- 寄出的 HTML 內容
  sent_by UUID REFERENCES auth.users(id),
  recipient_count INT DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 政策
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

-- 任何人都可以訂閱（INSERT）
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- 只有管理員可以讀取訂閱者
CREATE POLICY "Admins can read subscribers" ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 訂閱者可以用 email 取消自己的訂閱
CREATE POLICY "Subscribers can unsubscribe" ON newsletter_subscribers
  FOR UPDATE USING (true)
  WITH CHECK (status = 'unsubscribed');

-- 管理員可以管理發送記錄
CREATE POLICY "Admins can manage sends" ON newsletter_sends
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 更新時自動更新 updated_at
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_newsletter_subscribers_updated
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_newsletter_updated_at();

CREATE TRIGGER trigger_newsletter_sends_updated
  BEFORE UPDATE ON newsletter_sends
  FOR EACH ROW EXECUTE FUNCTION update_newsletter_updated_at();
