// Database types for solo.tw

export type SoloType =
  | "lion"
  | "fox"
  | "elephant"
  | "eagle"
  | "turtle"
  | "chick";
export type DiagnosisType = "quick" | "full";
export type MembershipTier = "free" | "pro" | "premium";

export interface DiagnosisResult {
  id: string;
  short_id: string;
  created_at: string;
  user_id: string | null;
  email: string | null;
  diagnosis_type: DiagnosisType;
  score_positioning: number;
  score_delivery: number;
  score_trust: number;
  score_monetization: number;
  score_sustainability: number;
  total_score: number;
  solo_type: SoloType;
  answers: Record<number, number>;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  display_name: string | null;
  avatar_url: string | null;
  profession: string | null;
  expertise: string[] | null;
  years_experience: number | null;
  website: string | null;
  linkedin: string | null;
  membership_tier: MembershipTier;
  membership_expires_at: string | null;
  subscribe_newsletter: boolean;
  is_admin: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  name: string | null;
  is_active: boolean;
  unsubscribed_at: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

// Insert types (omit auto-generated fields)
export type DiagnosisResultInsert = Omit<DiagnosisResult, "id" | "created_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at">>;
export type NewsletterSubscriberInsert = Omit<
  NewsletterSubscriber,
  "id" | "created_at" | "is_active" | "unsubscribed_at"
>;

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
  category: EventCategory | null;
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
export type EventUpdateData = Partial<
  Omit<Event, "id" | "created_at" | "updated_at">
>;
export type TicketTypeInsert = Omit<TicketType, "id">;
export type RegistrationInsert = Omit<
  Registration,
  "id" | "created_at" | "checked_in_at"
>;
export type EventUpdateInsert = Omit<
  EventUpdate,
  "id" | "created_at" | "sent_at"
>;

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
