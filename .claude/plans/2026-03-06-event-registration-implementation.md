# Event Registration System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full event registration system on solo.tw with public listing, registration, admin management, and email notifications.

**Architecture:** Next.js 16 App Router with Supabase PostgreSQL for data, Supabase Auth for authentication, Resend + React Email for transactional emails, and Vercel Cron for automation. All new pages follow existing patterns in the codebase (server components with `createClient()`, admin guard via `isAdmin()`, Radix UI + Tailwind for UI).

**Tech Stack:** Next.js 16, Supabase (PostgreSQL + Auth + Storage), Resend, React Email, Vercel Cron

---

## Phase 1: Database & Type Foundation

### Task 1: Create database migration

**Files:**
- Create: `supabase/migrations/20260306_add_events_system.sql`

**Step 1: Write the migration SQL**

```sql
-- =====================
-- Events System Tables
-- =====================

-- 1. Events table
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

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status_starts ON events(status, starts_at);
CREATE INDEX idx_events_organizer ON events(organizer_id);

-- 2. Ticket types table
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

CREATE INDEX idx_ticket_types_event ON ticket_types(event_id);

-- 3. Registrations table
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

CREATE INDEX idx_registrations_event_status ON registrations(event_id, status);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_email ON registrations(email);

-- 4. Event updates table
CREATE TABLE IF NOT EXISTS event_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_updates_event ON event_updates(event_id);

-- 5. Updated_at trigger for events
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- Row Level Security
-- =====================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_updates ENABLE ROW LEVEL SECURITY;

-- Events: anyone can read published/archived
CREATE POLICY "Anyone can view published events" ON events
  FOR SELECT USING (status IN ('published', 'archived'));

-- Events: organizers can manage their own
CREATE POLICY "Organizers can insert events" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- Organizers can see their own drafts
CREATE POLICY "Organizers can view own drafts" ON events
  FOR SELECT USING (auth.uid() = organizer_id);

-- Ticket types: anyone can read for published events
CREATE POLICY "Anyone can view ticket types" ON ticket_types
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = ticket_types.event_id AND events.status IN ('published', 'archived'))
  );

CREATE POLICY "Organizers can manage ticket types" ON ticket_types
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = ticket_types.event_id AND events.organizer_id = auth.uid())
  );

-- Registrations: users can see their own
CREATE POLICY "Users can view own registrations" ON registrations
  FOR SELECT USING (auth.uid() = user_id);

-- Registrations: anyone can insert (anonymous registration allowed)
CREATE POLICY "Anyone can register" ON registrations
  FOR INSERT WITH CHECK (true);

-- Registrations: organizers can view registrations for their events
CREATE POLICY "Organizers can view event registrations" ON registrations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = registrations.event_id AND events.organizer_id = auth.uid())
  );

-- Registrations: users can cancel their own
CREATE POLICY "Users can cancel own registration" ON registrations
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (status = 'cancelled');

-- Event updates: anyone can read for published events
CREATE POLICY "Anyone can view event updates" ON event_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_updates.event_id AND events.status IN ('published', 'archived'))
  );

CREATE POLICY "Organizers can manage event updates" ON event_updates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_updates.event_id AND events.organizer_id = auth.uid())
  );
```

**Step 2: Run migration in Supabase Dashboard**

Go to Supabase Dashboard → SQL Editor → paste and run the migration SQL.

**Step 3: Commit**

```bash
git add supabase/migrations/20260306_add_events_system.sql
git commit -m "feat(db): add events, ticket_types, registrations, event_updates tables"
```

---

### Task 2: Add TypeScript types for events system

**Files:**
- Modify: `src/lib/supabase/types.ts`

**Step 1: Append event-related types to existing types file**

Add the following after the existing `NewsletterSubscriberInsert` type:

```typescript
// =====================
// Event System Types
// =====================

export type EventFormat = "online" | "offline" | "hybrid";
export type EventStatus = "draft" | "published" | "cancelled" | "archived";
export type EventCategory = "workshop" | "lecture" | "meetup" | "conference";
export type RegistrationStatus = "confirmed" | "waitlisted" | "cancelled";

export interface Event {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image: string | null;
  format: EventFormat;
  venue_name: string | null;
  venue_address: string | null;
  online_url: string | null;
  starts_at: string;
  ends_at: string | null;
  registration_starts_at: string | null;
  registration_ends_at: string | null;
  capacity: number;
  status: EventStatus;
  organizer_id: string | null;
  category: string | null;
  tags: string[];
  youtube_embed: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  capacity: number;
  price: number;
  sort_order: number;
  is_active: boolean;
}

export interface Registration {
  id: string;
  event_id: string;
  ticket_type_id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  status: RegistrationStatus;
  note: string | null;
  checked_in_at: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

export interface EventUpdate {
  id: string;
  event_id: string;
  title: string;
  content: string | null;
  sent_at: string | null;
  created_by: string | null;
  created_at: string;
}

// Insert/update types
export type EventInsert = Omit<Event, "id" | "created_at" | "updated_at">;
export type EventUpdateData = Partial<Omit<Event, "id" | "created_at" | "updated_at">>;
export type TicketTypeInsert = Omit<TicketType, "id">;
export type RegistrationInsert = Omit<Registration, "id" | "created_at" | "checked_in_at">;
export type EventUpdateInsert = Omit<EventUpdate, "id" | "created_at" | "sent_at">;

// Composite types for frontend display
export interface EventWithCounts extends Event {
  registration_count: number;
  confirmed_count: number;
  waitlisted_count: number;
}

export interface EventDetail extends Event {
  ticket_types: TicketTypeWithCount[];
  updates: EventUpdate[];
  organizer: Pick<Profile, "id" | "display_name" | "avatar_url"> | null;
}

export interface TicketTypeWithCount extends TicketType {
  confirmed_count: number;
  waitlisted_count: number;
}
```

**Step 2: Commit**

```bash
git add src/lib/supabase/types.ts
git commit -m "feat(types): add Event, TicketType, Registration, EventUpdate types"
```

---

### Task 3: Create event data access layer

**Files:**
- Create: `src/lib/supabase/events.ts`

**Step 1: Create the events helper module**

This file provides all Supabase queries for events. Pattern follows existing `src/lib/supabase/diagnosis.ts` and `src/lib/supabase/admin.ts`.

```typescript
import { createClient } from "./server";
import type {
  Event, EventInsert, EventUpdateData, EventWithCounts, EventDetail,
  TicketType, TicketTypeInsert, TicketTypeWithCount,
  Registration, RegistrationInsert, RegistrationStatus,
  EventUpdate, EventUpdateInsert,
} from "./types";

// ─── Public Queries ───

export async function getPublishedEvents(): Promise<EventWithCounts[]> {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .in("status", ["published", "archived"])
    .order("starts_at", { ascending: true });

  if (!events || events.length === 0) return [];

  // Get registration counts per event
  const eventIds = events.map((e) => e.id);
  const { data: regCounts } = await supabase
    .from("registrations")
    .select("event_id, status")
    .in("event_id", eventIds)
    .neq("status", "cancelled");

  const countMap: Record<string, { total: number; confirmed: number; waitlisted: number }> = {};
  regCounts?.forEach((r) => {
    if (!countMap[r.event_id]) countMap[r.event_id] = { total: 0, confirmed: 0, waitlisted: 0 };
    countMap[r.event_id].total++;
    if (r.status === "confirmed") countMap[r.event_id].confirmed++;
    if (r.status === "waitlisted") countMap[r.event_id].waitlisted++;
  });

  return events.map((e) => ({
    ...e,
    registration_count: countMap[e.id]?.total || 0,
    confirmed_count: countMap[e.id]?.confirmed || 0,
    waitlisted_count: countMap[e.id]?.waitlisted || 0,
  }));
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return null;

  // Get ticket types with counts
  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("event_id", event.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: regs } = await supabase
    .from("registrations")
    .select("ticket_type_id, status")
    .eq("event_id", event.id)
    .neq("status", "cancelled");

  const ticketCounts: Record<string, { confirmed: number; waitlisted: number }> = {};
  regs?.forEach((r) => {
    if (!ticketCounts[r.ticket_type_id]) ticketCounts[r.ticket_type_id] = { confirmed: 0, waitlisted: 0 };
    if (r.status === "confirmed") ticketCounts[r.ticket_type_id].confirmed++;
    if (r.status === "waitlisted") ticketCounts[r.ticket_type_id].waitlisted++;
  });

  const ticketTypesWithCounts: TicketTypeWithCount[] = (ticketTypes || []).map((t) => ({
    ...t,
    confirmed_count: ticketCounts[t.id]?.confirmed || 0,
    waitlisted_count: ticketCounts[t.id]?.waitlisted || 0,
  }));

  // Get updates
  const { data: updates } = await supabase
    .from("event_updates")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  // Get organizer profile
  let organizer = null;
  if (event.organizer_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", event.organizer_id)
      .single();
    organizer = profile;
  }

  return {
    ...event,
    ticket_types: ticketTypesWithCounts,
    updates: updates || [],
    organizer,
  };
}

// ─── Registration ───

export async function registerForEvent(data: RegistrationInsert): Promise<{ registration: Registration | null; error: string | null }> {
  const supabase = await createClient();

  // Check if ticket type has capacity
  const { data: ticketType } = await supabase
    .from("ticket_types")
    .select("capacity")
    .eq("id", data.ticket_type_id)
    .single();

  if (!ticketType) return { registration: null, error: "票種不存在" };

  // Count existing confirmed registrations for this ticket type
  const { count } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("ticket_type_id", data.ticket_type_id)
    .eq("status", "confirmed");

  // Check if duplicate email for same event
  const { count: existingCount } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", data.event_id)
    .eq("email", data.email)
    .neq("status", "cancelled");

  if (existingCount && existingCount > 0) {
    return { registration: null, error: "此 Email 已報名此活動" };
  }

  // Determine status based on capacity
  const confirmedCount = count || 0;
  const status: RegistrationStatus = ticketType.capacity > 0 && confirmedCount >= ticketType.capacity
    ? "waitlisted"
    : "confirmed";

  const { data: registration, error } = await supabase
    .from("registrations")
    .insert({ ...data, status })
    .select()
    .single();

  if (error) return { registration: null, error: error.message };

  return { registration, error: null };
}

export async function cancelRegistration(registrationId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "cancelled" as RegistrationStatus })
    .eq("id", registrationId)
    .eq("user_id", userId);

  return !error;
}

export async function getUserRegistrations(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("registrations")
    .select(`
      *,
      events:event_id (id, slug, title, starts_at, ends_at, format, venue_name, online_url, cover_image, status),
      ticket_types:ticket_type_id (name)
    `)
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  return data || [];
}

// ─── Admin Queries ───

export async function getAdminEventList(page: number = 1, limit: number = 20) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data: events, count } = await supabase
    .from("events")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (!events) return { events: [], total: 0, page, limit, totalPages: 0 };

  // Get registration counts
  const eventIds = events.map((e) => e.id);
  const { data: regCounts } = await supabase
    .from("registrations")
    .select("event_id, status")
    .in("event_id", eventIds)
    .neq("status", "cancelled");

  const countMap: Record<string, { confirmed: number; waitlisted: number }> = {};
  regCounts?.forEach((r) => {
    if (!countMap[r.event_id]) countMap[r.event_id] = { confirmed: 0, waitlisted: 0 };
    if (r.status === "confirmed") countMap[r.event_id].confirmed++;
    if (r.status === "waitlisted") countMap[r.event_id].waitlisted++;
  });

  const enriched = events.map((e) => ({
    ...e,
    confirmed_count: countMap[e.id]?.confirmed || 0,
    waitlisted_count: countMap[e.id]?.waitlisted || 0,
    registration_count: (countMap[e.id]?.confirmed || 0) + (countMap[e.id]?.waitlisted || 0),
  }));

  return {
    events: enriched,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function createEvent(data: EventInsert): Promise<Event | null> {
  const supabase = await createClient();
  const { data: event, error } = await supabase.from("events").insert(data).select().single();
  if (error) { console.error("createEvent error:", error); return null; }
  return event;
}

export async function updateEvent(id: string, data: EventUpdateData): Promise<Event | null> {
  const supabase = await createClient();
  const { data: event, error } = await supabase.from("events").update(data).eq("id", id).select().single();
  if (error) { console.error("updateEvent error:", error); return null; }
  return event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  return !error;
}

export async function upsertTicketTypes(eventId: string, ticketTypes: Omit<TicketTypeInsert, "event_id">[]): Promise<boolean> {
  const supabase = await createClient();

  // Delete existing ticket types for this event
  await supabase.from("ticket_types").delete().eq("event_id", eventId);

  // Insert new ones
  const inserts = ticketTypes.map((t, i) => ({
    ...t,
    event_id: eventId,
    sort_order: i,
  }));

  const { error } = await supabase.from("ticket_types").insert(inserts);
  return !error;
}

export async function getEventRegistrations(eventId: string, page: number = 1, limit: number = 50) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data, count } = await supabase
    .from("registrations")
    .select(`
      *,
      ticket_types:ticket_type_id (name)
    `, { count: "exact" })
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    registrations: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function updateRegistrationStatus(registrationId: string, status: RegistrationStatus): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("registrations").update({ status }).eq("id", registrationId);
  return !error;
}

export async function createEventUpdate(data: EventUpdateInsert): Promise<EventUpdate | null> {
  const supabase = await createClient();
  const { data: update, error } = await supabase.from("event_updates").insert(data).select().single();
  if (error) return null;
  return update;
}

// ─── Event Stats for Admin Dashboard ───

export async function getEventStats() {
  const supabase = await createClient();

  const { count: activeEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: totalRegistrations } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("status", "confirmed");

  // This month events
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .gte("starts_at", startOfMonth.toISOString())
    .in("status", ["published", "archived"]);

  // Most popular event
  const { data: topEvent } = await supabase
    .from("events")
    .select("id, title, slug")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let topEventCount = 0;
  if (topEvent) {
    const { count } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", topEvent.id)
      .eq("status", "confirmed");
    topEventCount = count || 0;
  }

  return {
    activeEvents: activeEvents || 0,
    totalRegistrations: totalRegistrations || 0,
    monthlyEvents: monthlyEvents || 0,
    topEvent: topEvent ? { ...topEvent, count: topEventCount } : null,
  };
}
```

**Step 2: Commit**

```bash
git add src/lib/supabase/events.ts
git commit -m "feat(data): add events data access layer with all CRUD operations"
```

---

## Phase 2: Email Infrastructure

### Task 4: Install Resend and React Email

**Step 1: Install packages**

```bash
cd /Users/vista/Developer/solo-tw
pnpm add resend @react-email/components
```

**Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "deps: add resend and @react-email/components"
```

---

### Task 5: Create email service and templates

**Files:**
- Create: `src/lib/email.ts`
- Create: `src/components/emails/registration-confirm.tsx`
- Create: `src/components/emails/event-reminder.tsx`
- Create: `src/components/emails/event-update-email.tsx`

**Step 1: Create the email service wrapper**

`src/lib/email.ts`:
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "events@solo.tw";
const FROM_NAME = process.env.FROM_NAME || "自由人學院";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email service error:", err);
    return { success: false, error: err };
  }
}
```

**Step 2: Create registration confirmation email template**

`src/components/emails/registration-confirm.tsx`:
```tsx
import {
  Body, Container, Head, Heading, Hr, Html, Link,
  Preview, Section, Text,
} from "@react-email/components";

interface Props {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketType: string;
  eventUrl: string;
  calendarUrl: string;
  cancelUrl: string;
  isOnline: boolean;
}

export function RegistrationConfirmEmail({
  name, eventTitle, eventDate, eventTime, venue,
  ticketType, eventUrl, calendarUrl, cancelUrl, isOnline,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>你已成功報名《{eventTitle}》</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>報名確認</Heading>
          <Text style={text}>哈囉，{name}</Text>
          <Text style={text}>你已成功報名以下活動：</Text>
          <Section style={infoBox}>
            <Text style={eventTitleStyle}>《{eventTitle}》</Text>
            <Text style={infoText}>📅 {eventDate} {eventTime}</Text>
            <Text style={infoText}>📍 {venue}</Text>
            <Text style={infoText}>🎫 票種：{ticketType}</Text>
          </Section>
          <Section style={buttonSection}>
            <Link href={eventUrl} style={button}>查看活動詳情</Link>
          </Section>
          <Text style={text}>📎 <Link href={calendarUrl}>加入 Google 日曆</Link></Text>
          <Hr style={hr} />
          <Text style={smallText}>
            {isOnline
              ? "【入場說明】線上活動請於開始前 10 分鐘進入會議室。"
              : "【入場說明】實體活動請攜帶此信件作為報名憑證。"}
          </Text>
          <Text style={smallText}>
            如需取消報名，請<Link href={cancelUrl}>點此連結</Link>。
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "'Noto Sans TC', sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "40px 20px", maxWidth: "560px" };
const h1 = { color: "#1a1a1a", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px" };
const text = { color: "#333", fontSize: "16px", lineHeight: "26px", margin: "0 0 10px" };
const infoBox = { backgroundColor: "#f0f4f8", borderRadius: "8px", padding: "20px", margin: "20px 0" };
const eventTitleStyle = { color: "#1a1a1a", fontSize: "18px", fontWeight: "bold", margin: "0 0 12px" };
const infoText = { color: "#555", fontSize: "15px", lineHeight: "24px", margin: "0 0 4px" };
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = { backgroundColor: "#0f172a", borderRadius: "6px", color: "#fff", fontSize: "16px", padding: "12px 24px", textDecoration: "none" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const smallText = { color: "#8898aa", fontSize: "13px", lineHeight: "20px", margin: "0 0 6px" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
```

**Step 3: Create event reminder email template**

`src/components/emails/event-reminder.tsx`:
```tsx
import {
  Body, Container, Head, Heading, Hr, Html, Link,
  Preview, Section, Text,
} from "@react-email/components";

interface Props {
  name: string;
  eventTitle: string;
  eventTime: string;
  venue: string;
  eventUrl: string;
  isOnline: boolean;
  onlineUrl?: string;
}

export function EventReminderEmail({
  name, eventTitle, eventTime, venue, eventUrl, isOnline, onlineUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{name}，明天見！提醒你參加《{eventTitle}》</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{name}，明天見！</Heading>
          <Text style={text}>提醒你明天參加的活動：</Text>
          <Section style={infoBox}>
            <Text style={eventTitleStyle}>《{eventTitle}》</Text>
            <Text style={infoText}>📅 明天 {eventTime}</Text>
            <Text style={infoText}>📍 {venue}</Text>
          </Section>
          <Section style={buttonSection}>
            <Link href={isOnline && onlineUrl ? onlineUrl : eventUrl} style={button}>
              {isOnline ? "進入活動" : "查看活動詳情"}
            </Link>
          </Section>
          <Text style={text}>建議提早 5-10 分鐘入場</Text>
          <Text style={text}>期待在活動中見到你！</Text>
          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "'Noto Sans TC', sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "40px 20px", maxWidth: "560px" };
const h1 = { color: "#1a1a1a", fontSize: "24px", fontWeight: "bold", margin: "0 0 20px" };
const text = { color: "#333", fontSize: "16px", lineHeight: "26px", margin: "0 0 10px" };
const infoBox = { backgroundColor: "#f0f4f8", borderRadius: "8px", padding: "20px", margin: "20px 0" };
const eventTitleStyle = { color: "#1a1a1a", fontSize: "18px", fontWeight: "bold", margin: "0 0 12px" };
const infoText = { color: "#555", fontSize: "15px", lineHeight: "24px", margin: "0 0 4px" };
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = { backgroundColor: "#0f172a", borderRadius: "6px", color: "#fff", fontSize: "16px", padding: "12px 24px", textDecoration: "none" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
```

**Step 4: Create event update/announcement email template**

`src/components/emails/event-update-email.tsx`:
```tsx
import {
  Body, Container, Head, Heading, Hr, Html, Link,
  Markdown, Preview, Section, Text,
} from "@react-email/components";

interface Props {
  name: string;
  eventTitle: string;
  updateTitle: string;
  updateContent: string;
  eventUrl: string;
}

export function EventUpdateEmail({
  name, eventTitle, updateTitle, updateContent, eventUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>《{eventTitle}》活動公告：{updateTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>📢 活動公告</Text>
          <Heading style={h1}>{updateTitle}</Heading>
          <Text style={text}>哈囉，{name}</Text>
          <Text style={subtext}>關於你報名的《{eventTitle}》，主辦人有新的公告：</Text>
          <Section style={contentBox}>
            <Text style={text}>{updateContent}</Text>
          </Section>
          <Section style={buttonSection}>
            <Link href={eventUrl} style={button}>查看活動頁面</Link>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "'Noto Sans TC', sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "40px 20px", maxWidth: "560px" };
const tag = { color: "#6366f1", fontSize: "13px", fontWeight: "600", margin: "0 0 8px" };
const h1 = { color: "#1a1a1a", fontSize: "22px", fontWeight: "bold", margin: "0 0 20px" };
const text = { color: "#333", fontSize: "16px", lineHeight: "26px", margin: "0 0 10px" };
const subtext = { color: "#666", fontSize: "14px", lineHeight: "22px", margin: "0 0 16px" };
const contentBox = { backgroundColor: "#fafafa", borderLeft: "3px solid #6366f1", padding: "16px 20px", margin: "16px 0" };
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = { backgroundColor: "#0f172a", borderRadius: "6px", color: "#fff", fontSize: "16px", padding: "12px 24px", textDecoration: "none" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
```

**Step 5: Commit**

```bash
git add src/lib/email.ts src/components/emails/
git commit -m "feat(email): add Resend service and 3 email templates"
```

---

## Phase 3: API Routes

### Task 6: Create registration API route

**Files:**
- Create: `src/app/api/events/register/route.ts`

**Step 1: Implement the registration endpoint**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { registerForEvent } from "@/lib/supabase/events";
import { sendEmail } from "@/lib/email";
import { RegistrationConfirmEmail } from "@/components/emails/registration-confirm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, ticket_type_id, name, email, phone, note, utm_source, utm_medium, utm_campaign } = body;

    if (!event_id || !ticket_type_id || !name || !email) {
      return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
    }

    // Get current user if logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { registration, error } = await registerForEvent({
      event_id,
      ticket_type_id,
      user_id: user?.id || null,
      name,
      email,
      phone: phone || null,
      status: "confirmed", // registerForEvent will override based on capacity
      note: note || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Fetch event and ticket info for email
    const { data: event } = await supabase
      .from("events")
      .select("title, starts_at, ends_at, format, venue_name, online_url, slug")
      .eq("id", event_id)
      .single();

    const { data: ticketType } = await supabase
      .from("ticket_types")
      .select("name")
      .eq("id", ticket_type_id)
      .single();

    if (event && registration) {
      const startDate = new Date(event.starts_at);
      const endDate = event.ends_at ? new Date(event.ends_at) : null;

      const dateStr = startDate.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
      const timeStr = startDate.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })
        + (endDate ? `–${endDate.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}` : "");

      const venue = event.format === "online"
        ? "線上活動"
        : event.venue_name || "待通知";

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw";

      // Send confirmation email (fire and forget)
      sendEmail({
        to: email,
        subject: registration.status === "confirmed"
          ? `報名確認：${event.title}`
          : `候補通知：${event.title}`,
        react: RegistrationConfirmEmail({
          name,
          eventTitle: event.title,
          eventDate: dateStr,
          eventTime: timeStr,
          venue,
          ticketType: ticketType?.name || "",
          eventUrl: `${baseUrl}/events/${event.slug}`,
          calendarUrl: buildGoogleCalendarUrl(event.title, event.starts_at, event.ends_at, venue),
          cancelUrl: `${baseUrl}/dashboard/events`,
          isOnline: event.format === "online",
        }),
      });
    }

    return NextResponse.json({
      success: true,
      registration,
      message: registration?.status === "confirmed" ? "報名成功！" : "已加入候補名單",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

function buildGoogleCalendarUrl(title: string, start: string, end: string | null, location: string): string {
  const startDate = new Date(start).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const endDate = end
    ? new Date(end).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    : startDate;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startDate}/${endDate}`,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
```

**Step 2: Commit**

```bash
git add src/app/api/events/register/route.ts
git commit -m "feat(api): add POST /api/events/register endpoint with email confirmation"
```

---

### Task 7: Create admin event API routes

**Files:**
- Create: `src/app/api/admin/events/route.ts`
- Create: `src/app/api/admin/events/[id]/route.ts`
- Create: `src/app/api/admin/events/[id]/registrations/route.ts`
- Create: `src/app/api/admin/events/[id]/updates/route.ts`

These API routes handle admin CRUD operations. Each route checks `isAdmin()` first.

Implement standard REST patterns:
- `POST /api/admin/events` — create event + ticket types
- `PUT /api/admin/events/[id]` — update event + ticket types
- `DELETE /api/admin/events/[id]` — delete event
- `GET /api/admin/events/[id]/registrations` — list registrations
- `PATCH /api/admin/events/[id]/registrations` — bulk update registration status
- `POST /api/admin/events/[id]/updates` — create and send event announcement

Each route follows the pattern in `src/app/api/diagnosis/delete/route.ts` — validate auth, call data layer, return JSON.

**Commit after each file is created.**

---

## Phase 4: Admin Frontend

### Task 8: Create admin events list page

**Files:**
- Create: `src/app/admin/events/page.tsx`

Server component. Follows pattern from `src/app/admin/page.tsx`. Calls `isAdmin()` guard, then `getAdminEventList()`. Renders a table with status badge, title, date, registration count, and action buttons (edit, registrations, duplicate).

Add navigation link to `src/app/admin/page.tsx` header buttons section:
```tsx
<Button variant="outline" asChild className="h-11 px-4 text-base">
  <Link href="/admin/events">活動管理</Link>
</Button>
```

**Commit:**
```bash
git commit -m "feat(admin): add events list page at /admin/events"
```

---

### Task 9: Create admin event form (new + edit)

**Files:**
- Create: `src/app/admin/events/new/page.tsx`
- Create: `src/app/admin/events/[id]/edit/page.tsx`
- Create: `src/components/admin/EventForm.tsx` (shared client component)

`EventForm.tsx` is a client component (`"use client"`) with:
- Tab navigation: 基本資訊 / 時間地點 / 活動內容 / 票種設定 / 發布設定
- Cover image upload (Supabase Storage `event-covers` bucket)
- Dynamic ticket types (add/remove rows)
- Slug auto-generation from title (using `slugify` logic or manual edit)
- Form submission via `fetch("/api/admin/events", { method: "POST" })`
- Edit mode: pre-fills all fields from existing event data

The `/new` page renders `<EventForm />`. The `/[id]/edit` page loads event data server-side and passes as prop.

**Commit:**
```bash
git commit -m "feat(admin): add event create/edit form with multi-tab layout"
```

---

### Task 10: Create admin registrations management page

**Files:**
- Create: `src/app/admin/events/[id]/registrations/page.tsx`
- Create: `src/components/admin/RegistrationTable.tsx` (client component)

Server component loads event + registrations data. Client component handles:
- Stats bar (confirmed / waitlisted / cancelled / capacity)
- Searchable table with checkbox selection
- Status badges with color coding
- Bulk actions dropdown: confirm, waitlist, cancel
- CSV export button (client-side CSV generation)

**Commit:**
```bash
git commit -m "feat(admin): add registration management with bulk actions and CSV export"
```

---

### Task 11: Create admin event updates/announcements page

**Files:**
- Create: `src/app/admin/events/[id]/updates/page.tsx`

Form to compose announcement:
- Target audience radio: all / confirmed / waitlisted
- Title + content (textarea, Markdown)
- Preview button (shows rendered email)
- Send button → POST to `/api/admin/events/[id]/updates`
- History list of past announcements below

**Commit:**
```bash
git commit -m "feat(admin): add event announcements page with send and history"
```

---

### Task 12: Add event stats to admin dashboard

**Files:**
- Modify: `src/app/admin/page.tsx`

Add new section after existing stats:

```tsx
// Add to imports:
import { getEventStats } from "@/lib/supabase/events";

// Add to Promise.all:
const [userStats, diagnosisStats, trafficAnalysis, eventStats] = await Promise.all([
  getUserStats(),
  getDiagnosisStats(),
  getTrafficAnalysis(),
  getEventStats(),
]);

// Add new card grid section before the existing quick actions card:
{/* 活動統計 */}
<div className="mb-8">
  <h2 className="mb-4 text-xl font-bold">📅 活動統計</h2>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {/* 4 cards: activeEvents, totalRegistrations, monthlyEvents, topEvent */}
  </div>
</div>
```

Also add "活動管理" button to the header actions.

**Commit:**
```bash
git commit -m "feat(admin): add event statistics cards to dashboard"
```

---

## Phase 5: Public Frontend

### Task 13: Create event listing page

**Files:**
- Create: `src/app/events/page.tsx`
- Create: `src/components/events/EventCard.tsx`
- Create: `src/components/events/EventFilters.tsx` (client component)

`/events/page.tsx` is a server component that:
1. Calls `getPublishedEvents()`
2. Generates metadata with OG tags
3. Renders filter bar + event card grid

`EventCard.tsx`: Reusable card showing cover image, title, date, venue, registration count, status badge, CTA button. Follows the card design from the approved design doc.

`EventFilters.tsx`: Client component with filter chips (全部 / 線上 / 實體 / 工作坊 / 講座 / 聚會) + search input. Uses URL search params for state.

Sorting: upcoming events first (starts_at > now), then ended events at bottom with "已結束" grey badge.

**Commit:**
```bash
git commit -m "feat(events): add public event listing page with filters and cards"
```

---

### Task 14: Create single event page

**Files:**
- Create: `src/app/events/[slug]/page.tsx`
- Create: `src/components/events/RegistrationForm.tsx` (client component)
- Create: `src/components/events/ShareButtons.tsx`
- Create: `src/components/events/TicketTypeList.tsx`

`/events/[slug]/page.tsx`:
- Server component, calls `getEventBySlug(slug)`
- If not found → `notFound()`
- If status not published/archived → `notFound()`
- Generates dynamic metadata (title, description, OG image using cover_image)
- Generates JSON-LD `Event` structured data
- Renders hero image, info card, description (Markdown), YouTube embed, ticket types, updates, organizer section

`RegistrationForm.tsx`:
- Client component with `"use client"`
- If event is archived/cancelled → disabled state with message
- If registration_ends_at passed → disabled
- Select ticket type → show name/email/phone fields
- If user is logged in → pre-fill from Supabase Auth
- Submit → `fetch("/api/events/register")`
- Success state with confetti or checkmark

`ShareButtons.tsx`:
- Copy link / Facebook / X / LINE / Threads
- Each generates the proper share URL

`TicketTypeList.tsx`:
- Shows each ticket type with progress bar: `{confirmed}/{capacity}`
- Status text: 可報名 / 已額滿（候補中）/ 已關閉

**Commit:**
```bash
git commit -m "feat(events): add single event page with registration, share, and ticket display"
```

---

### Task 15: Create OG image route for events

**Files:**
- Create: `src/app/events/[slug]/og/route.tsx`

Follow the same pattern as `src/app/r/[id]/og/route.tsx`. Use `ImageResponse` from `next/og` to generate a dynamic OG image with event title, date, and cover image.

**Commit:**
```bash
git commit -m "feat(og): add dynamic OG image generation for event pages"
```

---

## Phase 6: User Dashboard

### Task 16: Create "My Events" dashboard page

**Files:**
- Create: `src/app/dashboard/events/page.tsx`
- Create: `src/components/dashboard/MyEventCard.tsx` (client component)

Server component that:
1. Gets current user via `supabase.auth.getUser()`
2. If not logged in → redirect to `/auth/login`
3. Calls `getUserRegistrations(userId)`
4. Splits into upcoming vs past events
5. Renders two sections with event cards

`MyEventCard.tsx`:
- Shows event title, date, status badge (confirmed/waitlisted)
- Countdown for upcoming events ("3 天後")
- Cancel button (only for upcoming, confirmed events)
- Cancel → `PATCH /api/events/register` with status "cancelled"

Add navigation link in user dashboard or header.

**Commit:**
```bash
git commit -m "feat(dashboard): add My Events page with upcoming/past events"
```

---

## Phase 7: Cron Jobs

### Task 17: Create daily cron job

**Files:**
- Create: `src/app/api/cron/daily-check/route.ts`
- Modify: `vercel.json` (create if not exists)

`route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { EventReminderEmail } from "@/components/emails/event-reminder";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 1. Send reminders for tomorrow's events
  const tomorrowStart = new Date(tomorrow);
  tomorrowStart.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const { data: tomorrowEvents } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", tomorrowStart.toISOString())
    .lte("starts_at", tomorrowEnd.toISOString());

  let remindersSent = 0;
  for (const event of tomorrowEvents || []) {
    const { data: registrations } = await supabase
      .from("registrations")
      .select("name, email")
      .eq("event_id", event.id)
      .eq("status", "confirmed");

    for (const reg of registrations || []) {
      await sendEmail({
        to: reg.email,
        subject: `明天見！提醒你參加《${event.title}》`,
        react: EventReminderEmail({
          name: reg.name,
          eventTitle: event.title,
          eventTime: new Date(event.starts_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
          venue: event.format === "online" ? "線上活動" : event.venue_name || "待通知",
          eventUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.slug}`,
          isOnline: event.format === "online",
          onlineUrl: event.online_url || undefined,
        }),
      });
      remindersSent++;
    }
  }

  // 2. Auto-archive past events
  const { count: archived } = await supabase
    .from("events")
    .update({ status: "archived" })
    .eq("status", "published")
    .lt("ends_at", now.toISOString())
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    success: true,
    remindersSent,
    archived: archived || 0,
  });
}
```

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-check",
      "schedule": "0 2 * * *"
    }
  ]
}
```

(Schedule `0 2 * * *` = 02:00 UTC = 10:00 UTC+8)

**Commit:**
```bash
git commit -m "feat(cron): add daily cron for event reminders and auto-archive"
```

---

## Phase 8: Navigation & Integration

### Task 18: Update site navigation

**Files:**
- Modify: `src/components/layout/Header.tsx` — add "活動" link to nav
- Modify: `src/components/layout/Footer.tsx` — add "活動" link

Add `{ href: "/events", label: "活動" }` to the navigation items array, placed after "課程" or "工具".

**Commit:**
```bash
git commit -m "feat(nav): add Events link to site header and footer"
```

---

### Task 19: Environment variables setup

**Required env vars to add:**

```
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=events@solo.tw
FROM_NAME=自由人學院
NEXT_PUBLIC_SITE_URL=https://www.solo.tw
CRON_SECRET=your-random-secret-here
```

Set in Vercel Dashboard → Settings → Environment Variables.

Also create Supabase Storage bucket `event-covers` with public read access.

**No commit needed — env vars are set in dashboard.**

---

## Execution Order Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-3 | Database migration, types, data layer |
| 2 | 4-5 | Email packages, service, templates |
| 3 | 6-7 | Registration + admin API routes |
| 4 | 8-12 | Admin pages (list, form, registrations, updates, dashboard) |
| 5 | 13-15 | Public pages (listing, single event, OG image) |
| 6 | 16 | User dashboard (my events) |
| 7 | 17 | Cron jobs (reminders, auto-archive) |
| 8 | 18-19 | Navigation updates, env vars |

Total: 19 tasks, estimated ~4-6 hours of implementation.
