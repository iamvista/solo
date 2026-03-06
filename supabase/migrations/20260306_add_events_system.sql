-- =====================
-- Events System Migration
-- Adds: events, ticket_types, registrations, event_updates
-- =====================

-- =====================
-- 1. updated_at trigger function
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================
-- 2. events table
-- =====================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image TEXT,
  format TEXT NOT NULL CHECK (format IN ('online', 'offline', 'hybrid')) DEFAULT 'online',
  venue_name TEXT,
  venue_address TEXT,
  online_url TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  registration_starts_at TIMESTAMPTZ,
  registration_ends_at TIMESTAMPTZ,
  capacity INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'cancelled', 'archived')) DEFAULT 'draft',
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  youtube_embed TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status_starts ON events(status, starts_at);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);

-- updated_at trigger
DROP TRIGGER IF EXISTS events_updated_at ON events;
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- 3. ticket_types table
-- =====================
CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL DEFAULT 0,
  price INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON ticket_types(event_id);

-- =====================
-- 4. registrations table
-- =====================
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')) DEFAULT 'confirmed',
  note TEXT,
  checked_in_at TIMESTAMPTZ,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations(event_id, status);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- =====================
-- 5. event_updates table
-- =====================
CREATE TABLE IF NOT EXISTS event_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_updates_event ON event_updates(event_id);

-- =====================
-- 6. Row Level Security (RLS)
-- =====================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_updates ENABLE ROW LEVEL SECURITY;

-- ----- events policies -----

CREATE POLICY "Anyone can view published events" ON events
  FOR SELECT USING (status IN ('published', 'archived'));

CREATE POLICY "Organizers can view own drafts" ON events
  FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can insert events" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- ----- ticket_types policies -----

CREATE POLICY "Anyone can view ticket types" ON ticket_types
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.status IN ('published', 'archived')
    )
  );

CREATE POLICY "Organizers can manage ticket types" ON ticket_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
        AND events.organizer_id = auth.uid()
    )
  );

-- ----- registrations policies -----

CREATE POLICY "Users can view own registrations" ON registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can register" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Organizers can view event registrations" ON registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = registrations.event_id
        AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can cancel own registration" ON registrations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (status = 'cancelled');

-- ----- event_updates policies -----

CREATE POLICY "Anyone can view event updates" ON event_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_updates.event_id
        AND events.status IN ('published', 'archived')
    )
  );

CREATE POLICY "Organizers can manage event updates" ON event_updates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_updates.event_id
        AND events.organizer_id = auth.uid()
    )
  );
