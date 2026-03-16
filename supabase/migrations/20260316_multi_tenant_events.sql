-- Phase 1: Multi-tenant event system
-- Allow Pro/Premium members to create and manage their own events

-- Add owner fields to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_platform_event BOOLEAN DEFAULT true;

-- Backfill: existing events are platform events
UPDATE events SET is_platform_event = true WHERE is_platform_event IS NULL;

-- Index for owner queries
CREATE INDEX IF NOT EXISTS idx_events_owner ON events (owner_id) WHERE owner_id IS NOT NULL;

-- Update RLS: organizer OR owner can manage their events
-- Drop old organizer policies and recreate with owner support
DROP POLICY IF EXISTS "Organizers can view own events" ON events;
DROP POLICY IF EXISTS "Organizers can edit own events" ON events;
DROP POLICY IF EXISTS "Organizers can delete own events" ON events;

-- Owner can manage own events (CRUD)
CREATE POLICY "Owners can view own events"
  ON events FOR SELECT
  USING (owner_id = auth.uid() OR organizer_id = auth.uid());

CREATE POLICY "Owners can insert events"
  ON events FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own events"
  ON events FOR UPDATE
  USING (owner_id = auth.uid() OR organizer_id = auth.uid());

CREATE POLICY "Owners can delete own draft events"
  ON events FOR DELETE
  USING (owner_id = auth.uid() AND status = 'draft');

-- Owner can manage ticket types for own events
DROP POLICY IF EXISTS "Organizers can manage ticket types" ON ticket_types;

CREATE POLICY "Owners can manage ticket types for own events"
  ON ticket_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
      AND (events.owner_id = auth.uid() OR events.organizer_id = auth.uid())
    )
  );

-- Owner can view registrations for own events
DROP POLICY IF EXISTS "Organizers can view registrations" ON registrations;

CREATE POLICY "Owners can view registrations for own events"
  ON registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = registrations.event_id
      AND (events.owner_id = auth.uid() OR events.organizer_id = auth.uid())
    )
  );

-- Owner can manage event updates for own events
DROP POLICY IF EXISTS "Organizers can manage event updates" ON event_updates;

CREATE POLICY "Owners can manage event updates for own events"
  ON event_updates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_updates.event_id
      AND (events.owner_id = auth.uid() OR events.organizer_id = auth.uid())
    )
  );

-- Usage limits table for Pro tier restrictions
CREATE TABLE IF NOT EXISTS usage_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  events_created_this_month INTEGER DEFAULT 0,
  lead_magnets_created_this_month INTEGER DEFAULT 0,
  surveys_created_this_month INTEGER DEFAULT 0,
  month_year TEXT NOT NULL DEFAULT to_char(NOW(), 'YYYY-MM'),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_limits_user ON usage_limits (user_id);

ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own usage"
  ON usage_limits FOR SELECT
  USING (auth.uid() = user_id);

-- Function to check and increment usage
CREATE OR REPLACE FUNCTION check_and_increment_usage(
  target_user_id UUID,
  resource_type TEXT -- 'events', 'lead_magnets', 'surveys'
)
RETURNS JSONB AS $$
DECLARE
  user_tier TEXT;
  current_month TEXT;
  current_count INTEGER;
  max_allowed INTEGER;
  result JSONB;
BEGIN
  current_month := to_char(NOW(), 'YYYY-MM');

  -- Get user's membership tier
  SELECT membership_tier INTO user_tier
  FROM profiles WHERE id = target_user_id;

  IF user_tier IS NULL OR user_tier = 'free' THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'free_tier', 'limit', 0, 'current', 0);
  END IF;

  -- Determine limits
  IF user_tier = 'premium' THEN
    max_allowed := 999; -- effectively unlimited
  ELSIF user_tier = 'pro' THEN
    max_allowed := 3;
  ELSE
    max_allowed := 0;
  END IF;

  -- Upsert usage record for current month
  INSERT INTO usage_limits (user_id, month_year)
  VALUES (target_user_id, current_month)
  ON CONFLICT (user_id) DO UPDATE SET
    month_year = CASE
      WHEN usage_limits.month_year != current_month THEN current_month
      ELSE usage_limits.month_year
    END,
    events_created_this_month = CASE
      WHEN usage_limits.month_year != current_month THEN 0
      ELSE usage_limits.events_created_this_month
    END,
    lead_magnets_created_this_month = CASE
      WHEN usage_limits.month_year != current_month THEN 0
      ELSE usage_limits.lead_magnets_created_this_month
    END,
    surveys_created_this_month = CASE
      WHEN usage_limits.month_year != current_month THEN 0
      ELSE usage_limits.surveys_created_this_month
    END;

  -- Get current count
  IF resource_type = 'events' THEN
    SELECT events_created_this_month INTO current_count
    FROM usage_limits WHERE user_id = target_user_id;
  ELSIF resource_type = 'lead_magnets' THEN
    SELECT lead_magnets_created_this_month INTO current_count
    FROM usage_limits WHERE user_id = target_user_id;
  ELSIF resource_type = 'surveys' THEN
    SELECT surveys_created_this_month INTO current_count
    FROM usage_limits WHERE user_id = target_user_id;
  ELSE
    RETURN jsonb_build_object('allowed', false, 'reason', 'invalid_resource');
  END IF;

  IF current_count >= max_allowed THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'limit_reached', 'limit', max_allowed, 'current', current_count);
  END IF;

  -- Increment
  IF resource_type = 'events' THEN
    UPDATE usage_limits SET events_created_this_month = events_created_this_month + 1, updated_at = NOW()
    WHERE user_id = target_user_id;
  ELSIF resource_type = 'lead_magnets' THEN
    UPDATE usage_limits SET lead_magnets_created_this_month = lead_magnets_created_this_month + 1, updated_at = NOW()
    WHERE user_id = target_user_id;
  ELSIF resource_type = 'surveys' THEN
    UPDATE usage_limits SET surveys_created_this_month = surveys_created_this_month + 1, updated_at = NOW()
    WHERE user_id = target_user_id;
  END IF;

  RETURN jsonb_build_object('allowed', true, 'limit', max_allowed, 'current', current_count + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
