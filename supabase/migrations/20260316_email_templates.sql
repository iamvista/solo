-- Email template customization for event owners
-- Pro: can customize message body
-- Premium: can also customize sender name

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Customizable fields
  confirmed_subject TEXT, -- null = use default
  confirmed_body TEXT,    -- Custom message shown after standard info
  waitlisted_subject TEXT,
  waitlisted_body TEXT,

  -- Premium: custom sender name (still uses platform email)
  sender_name TEXT,       -- null = "solo.tw"

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_event ON email_templates (event_id);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Owners can manage templates for their events
CREATE POLICY "Owners can manage email templates"
  ON email_templates FOR ALL
  USING (owner_id = auth.uid());

-- Admins can manage all
CREATE POLICY "Admins can manage all email templates"
  ON email_templates FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
