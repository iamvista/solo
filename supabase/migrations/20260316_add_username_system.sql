-- Username system for /@username public profiles
-- Phase 0: solo.tw platform redesign

-- Add username and new profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS exp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS solo_stage TEXT DEFAULT 'setup' CHECK (solo_stage IN ('setup', 'operate', 'leverage', 'outgrow'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS line_uid TEXT UNIQUE;

-- Username constraints: lowercase, alphanumeric + underscore, 3-20 chars
ALTER TABLE profiles ADD CONSTRAINT username_format CHECK (
  username IS NULL OR (
    username ~ '^[a-z0-9_]{3,20}$'
    AND username !~ '^[0-9_]'
    AND username !~ '__'
  )
);

-- Reserved usernames (routes, admin, system keywords)
CREATE TABLE IF NOT EXISTS reserved_usernames (
  username TEXT PRIMARY KEY,
  reason TEXT NOT NULL DEFAULT 'reserved'
);

INSERT INTO reserved_usernames (username, reason) VALUES
  ('admin', 'system'),
  ('api', 'route'),
  ('auth', 'route'),
  ('blog', 'route'),
  ('community', 'route'),
  ('courses', 'route'),
  ('dashboard', 'route'),
  ('diagnose', 'route'),
  ('events', 'route'),
  ('explore', 'route'),
  ('growth', 'route'),
  ('help', 'system'),
  ('invite', 'route'),
  ('learn', 'route'),
  ('login', 'route'),
  ('og', 'route'),
  ('pricing', 'route'),
  ('privacy', 'route'),
  ('r', 'route'),
  ('roadmap', 'route'),
  ('search', 'route'),
  ('settings', 'route'),
  ('signup', 'route'),
  ('solo', 'brand'),
  ('support', 'system'),
  ('terms', 'route'),
  ('tools', 'route'),
  ('vista', 'brand'),
  ('www', 'system')
ON CONFLICT (username) DO NOTHING;

-- Index for fast username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles (username) WHERE username IS NOT NULL;

-- RLS: anyone can read public profiles by username
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (username IS NOT NULL);

-- Function to check username availability
CREATE OR REPLACE FUNCTION check_username_available(desired_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check format
  IF desired_username !~ '^[a-z0-9_]{3,20}$' THEN
    RETURN FALSE;
  END IF;
  IF desired_username ~ '^[0-9_]' OR desired_username ~ '__' THEN
    RETURN FALSE;
  END IF;
  -- Check reserved
  IF EXISTS (SELECT 1 FROM reserved_usernames WHERE username = desired_username) THEN
    RETURN FALSE;
  END IF;
  -- Check taken
  IF EXISTS (SELECT 1 FROM profiles WHERE username = desired_username) THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
