-- Download tokens for digital product delivery
CREATE TABLE IF NOT EXISTS download_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL DEFAULT 'ai-coach-kit',
  token TEXT UNIQUE NOT NULL,
  email TEXT,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON download_tokens
  FOR ALL USING (auth.role() = 'service_role');
