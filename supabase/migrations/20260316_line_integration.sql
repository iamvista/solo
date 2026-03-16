-- =============================================
-- LINE Integration
-- =============================================

-- Add LINE fields to profiles (line_uid already exists from Phase 1)
-- Add LINE notification preferences
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS line_display_name TEXT,
  ADD COLUMN IF NOT EXISTS line_picture_url TEXT,
  ADD COLUMN IF NOT EXISTS line_notify_events BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS line_notify_magnets BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS line_linked_at TIMESTAMPTZ;

-- LINE login state (for OAuth flow CSRF protection)
CREATE TABLE IF NOT EXISTS line_login_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  redirect_url TEXT DEFAULT '/settings',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '10 minutes')
);

CREATE INDEX idx_line_state ON line_login_states(state);
CREATE INDEX idx_line_state_expires ON line_login_states(expires_at);

-- RLS
ALTER TABLE line_login_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own line states"
  ON line_login_states FOR ALL
  USING (user_id = auth.uid());

-- Cleanup expired states (run via cron or on-demand)
CREATE OR REPLACE FUNCTION cleanup_expired_line_states()
RETURNS void AS $$
BEGIN
  DELETE FROM line_login_states WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
