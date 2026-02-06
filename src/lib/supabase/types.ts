// Database types for solo.tw

export type SoloType = "lion" | "fox" | "elephant" | "eagle" | "turtle" | "chick";
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
export type NewsletterSubscriberInsert = Omit<NewsletterSubscriber, "id" | "created_at" | "is_active" | "unsubscribed_at">;
