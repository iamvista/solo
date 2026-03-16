-- =============================================
-- Activity Feed System
-- =============================================

CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Who did it
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  -- What happened
  action_type TEXT NOT NULL
    CHECK (action_type IN (
      'joined',           -- new user signed up
      'set_username',     -- set their @username
      'completed_diagnosis', -- completed solo diagnosis
      'registered_event', -- registered for an event
      'created_event',    -- created an event (organizer)
      'created_lead_magnet', -- created a lead magnet
      'leveled_up',       -- reached a new level
      'stage_advanced'    -- advanced to next SOLO stage
    )),
  -- Related entity
  entity_type TEXT, -- 'event', 'diagnosis', 'lead_magnet', 'profile'
  entity_id TEXT,   -- UUID or slug of the related entity
  -- Display data (denormalized for fast reads)
  metadata JSONB DEFAULT '{}',
  -- Visibility
  is_public BOOLEAN DEFAULT true,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_public ON activity_feed(is_public, created_at DESC)
  WHERE is_public = true;

-- RLS
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Anyone can view public activities
CREATE POLICY "Anyone can view public activities"
  ON activity_feed FOR SELECT
  USING (is_public = true);

-- Users can view their own activities (including private ones)
CREATE POLICY "Users can view own activities"
  ON activity_feed FOR SELECT
  USING (user_id = auth.uid());

-- System inserts only (via service role or triggers)
CREATE POLICY "Service role can insert"
  ON activity_feed FOR INSERT
  WITH CHECK (true);

-- =============================================
-- Auto-insert triggers
-- =============================================

-- Trigger: new user joined
CREATE OR REPLACE FUNCTION trg_activity_user_joined()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, metadata)
  VALUES (
    NEW.id,
    'joined',
    'profile',
    NEW.id::TEXT,
    jsonb_build_object('display_name', COALESCE(NEW.display_name, '新成員'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trg_activity_user_joined();

-- Trigger: username set
CREATE OR REPLACE FUNCTION trg_activity_username_set()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.username IS NULL AND NEW.username IS NOT NULL THEN
    INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, metadata)
    VALUES (
      NEW.id,
      'set_username',
      'profile',
      NEW.id::TEXT,
      jsonb_build_object('username', NEW.username)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_username_set
  AFTER UPDATE OF username ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trg_activity_username_set();

-- Trigger: level up
CREATE OR REPLACE FUNCTION trg_activity_level_up()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.level > OLD.level THEN
    INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, metadata)
    VALUES (
      NEW.id,
      'leveled_up',
      'profile',
      NEW.id::TEXT,
      jsonb_build_object('level', NEW.level, 'display_name', COALESCE(NEW.display_name, ''))
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_level_up
  AFTER UPDATE OF level ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trg_activity_level_up();

-- Trigger: SOLO stage advanced
CREATE OR REPLACE FUNCTION trg_activity_stage_advanced()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.solo_stage IS DISTINCT FROM OLD.solo_stage THEN
    INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, metadata)
    VALUES (
      NEW.id,
      'stage_advanced',
      'profile',
      NEW.id::TEXT,
      jsonb_build_object('stage', NEW.solo_stage, 'display_name', COALESCE(NEW.display_name, ''))
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_stage_advanced
  AFTER UPDATE OF solo_stage ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trg_activity_stage_advanced();

-- Trigger: event registration confirmed
CREATE OR REPLACE FUNCTION trg_activity_event_registered()
RETURNS TRIGGER AS $$
DECLARE
  event_title TEXT;
  event_slug TEXT;
BEGIN
  IF NEW.status = 'confirmed' THEN
    SELECT title, slug INTO event_title, event_slug
    FROM events WHERE id = NEW.event_id;

    INSERT INTO activity_feed (user_id, action_type, entity_type, entity_id, metadata)
    VALUES (
      NEW.user_id,
      'registered_event',
      'event',
      NEW.event_id::TEXT,
      jsonb_build_object(
        'event_title', COALESCE(event_title, ''),
        'event_slug', COALESCE(event_slug, ''),
        'name', NEW.name
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_event_registration
  AFTER INSERT ON registrations
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION trg_activity_event_registered();
