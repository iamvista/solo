# Event Registration System Design

**Date:** 2026-03-06
**Platform:** solo.tw (Next.js 16 + Supabase)
**Status:** Approved

## Overview

Build an event registration system on solo.tw that supports online, offline, and hybrid events. Initially for Vista + a few partners, designed to scale into a multi-organizer platform.

- Free events first; paid events continue on external platforms (OEN.tw)
- vista.tw handles content/SEO/promotion; solo.tw handles the application/registration/management

## Data Model

### `events` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Primary key |
| `slug` | TEXT UNIQUE | URL-friendly identifier |
| `title` | TEXT NOT NULL | Event title |
| `subtitle` | TEXT | Subtitle |
| `description` | TEXT | Full description (Markdown) |
| `cover_image` | TEXT | Cover image URL (Supabase Storage) |
| `format` | TEXT CHECK | `online` / `offline` / `hybrid` |
| `venue_name` | TEXT | Venue name (offline/hybrid) |
| `venue_address` | TEXT | Venue address |
| `online_url` | TEXT | Online meeting URL |
| `starts_at` | TIMESTAMPTZ NOT NULL | Event start time |
| `ends_at` | TIMESTAMPTZ | Event end time |
| `registration_starts_at` | TIMESTAMPTZ | Registration opens |
| `registration_ends_at` | TIMESTAMPTZ | Registration closes |
| `capacity` | INTEGER DEFAULT 0 | Total capacity (0 = unlimited) |
| `status` | TEXT CHECK | `draft` / `published` / `cancelled` / `archived` |
| `organizer_id` | UUID FK → profiles | Organizer |
| `category` | TEXT | `workshop` / `lecture` / `meetup` / `conference` |
| `tags` | TEXT[] | Custom tags |
| `youtube_embed` | TEXT | YouTube embed URL |
| `is_featured` | BOOLEAN DEFAULT false | Pin to top of listing |
| `created_at` | TIMESTAMPTZ DEFAULT now() | |
| `updated_at` | TIMESTAMPTZ DEFAULT now() | |

### `ticket_types` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Primary key |
| `event_id` | UUID FK → events | Parent event |
| `name` | TEXT NOT NULL | Ticket type name |
| `description` | TEXT | Description |
| `capacity` | INTEGER NOT NULL | Capacity for this ticket type |
| `price` | INTEGER DEFAULT 0 | Price in TWD (0 = free), for future use |
| `sort_order` | INTEGER DEFAULT 0 | Display order |
| `is_active` | BOOLEAN DEFAULT true | Whether active |

### `registrations` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Primary key |
| `event_id` | UUID FK → events | Event |
| `ticket_type_id` | UUID FK → ticket_types | Ticket type |
| `user_id` | UUID FK → profiles | Logged-in user (nullable for anonymous) |
| `name` | TEXT NOT NULL | Registrant name |
| `email` | TEXT NOT NULL | Registrant email |
| `phone` | TEXT | Phone (optional) |
| `status` | TEXT CHECK | `confirmed` / `waitlisted` / `cancelled` |
| `note` | TEXT | Registrant note |
| `checked_in_at` | TIMESTAMPTZ | Check-in timestamp |
| `utm_source` | TEXT | |
| `utm_medium` | TEXT | |
| `utm_campaign` | TEXT | |
| `created_at` | TIMESTAMPTZ DEFAULT now() | Registration time |

### `event_updates` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Primary key |
| `event_id` | UUID FK → events | Event |
| `title` | TEXT NOT NULL | Update title |
| `content` | TEXT | Update content (Markdown) |
| `sent_at` | TIMESTAMPTZ | When email was sent |
| `created_by` | UUID FK → profiles | Author |
| `created_at` | TIMESTAMPTZ DEFAULT now() | |

### RLS Policies

- **events**: Anyone can read published/archived events. Organizers can CRUD their own events. Admins can CRUD all.
- **ticket_types**: Anyone can read active ticket types for published events. Organizers/admins can manage.
- **registrations**: Users can read their own registrations. Organizers can read registrations for their events. Admins can read all.
- **event_updates**: Anyone can read updates for published events. Organizers/admins can create.

### Indexes

- `events(slug)` UNIQUE
- `events(status, starts_at)` for listing queries
- `events(organizer_id)`
- `registrations(event_id, status)` for count queries
- `registrations(user_id)` for "my events"
- `registrations(email)` for lookup

## Frontend Pages

### Public Pages

**`/events`** — Event listing page
- Filter bar: All / Online / Offline / Workshop / Lecture / Meetup
- Search by title + tags
- Card layout: cover image, title, date, venue, registration count, CTA button
- Sorting: upcoming first, ended events at bottom with grey badge
- Featured events pinned to top
- Ad slots insertable every 4-6 cards
- Pagination or infinite scroll

**`/events/[slug]`** — Single event page
- Hero: cover image (full width)
- Info card: date/time, venue/online, organizer, price, registration count, CTA button
- Actions: Google Calendar add, share (copy link / FB / X / LINE / Threads)
- Markdown-rendered description
- YouTube embed (if provided)
- Instructor section
- Ticket types with capacity status per type
- Event updates/announcements
- Organizer info
- Notes/policies
- Archived events: banner, no registration button, content preserved

**Registration flow:**
1. Click CTA button
2. If logged in: pre-fill name/email, show registration form
3. If not logged in: option to login/register OR fill email anonymously
4. Select ticket type, submit
5. If capacity available: status = confirmed
6. If full: status = waitlisted
7. Redirect to success page + send confirmation email

### User Pages

**`/dashboard/events`** — My events
- Upcoming events with countdown
- Past events history
- Cancel registration (before event starts)

### SEO & Social

- Open Graph tags per event (title + cover + description)
- JSON-LD Event structured data
- Share buttons: Copy link / Facebook / X (Twitter) / LINE / Threads

## Admin Pages

**`/admin/events`** — Event list management
- Table with status, title, date, registration count, actions
- Quick actions: edit, registrations, send update, duplicate, archive
- Bulk operations

**`/admin/events/new`** & **`/admin/events/[id]/edit`** — Event form
- Tabs: Basic Info / Time & Location / Content / Ticket Types / Publish Settings
- Cover image upload to Supabase Storage
- Markdown editor for description
- Dynamic ticket type form (add/remove multiple)
- Preview button

**`/admin/events/[id]/registrations`** — Registration management
- Stats bar: confirmed / waitlisted / cancelled / capacity
- Searchable, filterable table
- CSV export
- Bulk actions: confirm, waitlist, cancel, send notification
- Auto-waitlist promotion on cancellation
- Check-in marking

**`/admin/events/[id]/updates`** — Send announcements
- Target: all / confirmed / waitlisted
- Title + Markdown content editor
- Preview email, then send
- History of sent announcements

**`/admin` dashboard** — New event statistics cards
- Active events, total registrations, monthly events, most popular

## Email System

### Provider: Resend + React Email

- Sending domain: `events@solo.tw`
- DNS setup required: SPF / DKIM / DMARC
- Templates as React TSX components

### Automated Emails

| Trigger | Recipient | Template |
|---------|-----------|----------|
| Registration confirmed | Registrant | registration-confirm |
| Waitlisted | Registrant | waitlist-notice |
| Waitlist promoted | Promoted person | waitlist-promoted |
| Registration cancelled | Registrant | cancellation-confirm |
| 1 day before event | All confirmed | event-reminder |
| 1 day after event | All attendees | thank-you + feedback |

### Manual Emails

- Organizer sends announcement from admin panel
- Uses event-update template

### Cron Jobs (Vercel Cron, daily 10:00 UTC+8)

1. Events starting tomorrow → send reminder emails
2. Events ended > 24h ago → send thank-you emails
3. Events past end time → auto-archive

### API Routes

```
POST /api/emails/registration-confirm
POST /api/emails/event-reminder
POST /api/emails/event-update
GET  /api/cron/daily-check
```

## Cross-site Integration

1. vista.tw blog articles CTA → solo.tw/events/[slug]
2. vista.tw /workshops → link to solo.tw event listing
3. solo.tw registration emails → vista.tw Lead API
4. Shared Resend account, different sending domains
5. Auth independent for now; shared SSO in the future

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router, RSC) |
| Database | Supabase PostgreSQL + RLS |
| Auth | Supabase Auth (Email + Google OAuth) |
| Email | Resend + React Email |
| Storage | Supabase Storage |
| Cron | Vercel Cron Jobs |
| Deploy | Vercel |
| Share | OG + Link / FB / X / LINE / Threads |
| Search | Supabase full-text search |
