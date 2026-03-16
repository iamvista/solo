-- =============================================
-- Lead Magnets System
-- =============================================

-- Lead magnets table (the downloadable resource)
CREATE TABLE IF NOT EXISTS lead_magnets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  -- Resource type & delivery
  resource_type TEXT NOT NULL DEFAULT 'pdf'
    CHECK (resource_type IN ('pdf', 'checklist', 'template', 'toolkit', 'video', 'other')),
  file_url TEXT, -- Supabase Storage or external URL
  redirect_url TEXT, -- Optional: redirect after download instead of file
  -- Landing page content
  benefits TEXT[], -- bullet points shown on landing page
  cta_text TEXT DEFAULT '免費下載',
  thank_you_message TEXT DEFAULT '感謝下載！請檢查你的信箱。',
  -- Status
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  -- Stats (denormalized for fast reads)
  capture_count INT DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lead captures table (who downloaded what)
CREATE TABLE IF NOT EXISTS lead_captures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_magnet_id UUID NOT NULL REFERENCES lead_magnets(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  -- Tracking
  source_page TEXT, -- which page they came from
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  -- Delivery
  email_sent BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prevent duplicate captures (same email + same magnet)
CREATE UNIQUE INDEX idx_lead_captures_unique
  ON lead_captures(lead_magnet_id, email);

-- Indexes
CREATE INDEX idx_lead_magnets_owner ON lead_magnets(owner_id);
CREATE INDEX idx_lead_magnets_slug ON lead_magnets(slug);
CREATE INDEX idx_lead_magnets_status ON lead_magnets(status);
CREATE INDEX idx_lead_captures_magnet ON lead_captures(lead_magnet_id);
CREATE INDEX idx_lead_captures_email ON lead_captures(email);

-- RLS
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;

-- Lead magnets: owner can CRUD, anyone can view published
CREATE POLICY "Anyone can view published lead magnets"
  ON lead_magnets FOR SELECT
  USING (status = 'published');

CREATE POLICY "Owners can manage own lead magnets"
  ON lead_magnets FOR ALL
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all lead magnets"
  ON lead_magnets FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Lead captures: anyone can insert (public form), owners can view their magnet's captures
CREATE POLICY "Anyone can submit lead capture"
  ON lead_captures FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can view captures for own magnets"
  ON lead_captures FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lead_magnets
      WHERE lead_magnets.id = lead_captures.lead_magnet_id
        AND lead_magnets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all captures"
  ON lead_captures FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Function to increment capture count
CREATE OR REPLACE FUNCTION increment_capture_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lead_magnets
  SET capture_count = capture_count + 1,
      updated_at = now()
  WHERE id = NEW.lead_magnet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_increment_capture_count
  AFTER INSERT ON lead_captures
  FOR EACH ROW
  EXECUTE FUNCTION increment_capture_count();
