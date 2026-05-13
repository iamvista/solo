// src/lib/consulting-db.ts
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import {
  EXPIRY_MONTHS,
  type ConsultingPlanSlug,
  type ConsultingTopicSlug,
} from "./consulting-config";

// ────────────────────────────────────────
// Zod schema (shared with API route)
// ────────────────────────────────────────
export const leadSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  contactMethod: z.enum(["email", "line", "ig"]),
  contactId: z.string().max(80).optional(),
  topics: z.array(z.string()).min(1),
  specificProblem: z.string().min(30).max(2000),
  expectedOutcome: z.string().max(1000).optional(),
  level: z.enum(["beginner", "basic", "intermediate", "advanced", "expert"]),
  desiredStart: z
    .enum(["this_week", "2_weeks", "1_month", "no_rush"])
    .optional(),
  plan: z.enum(["1hr", "3hr", "5hr", "10hr", "20hr", "undecided"]),
  attribution: z.string().max(80).optional(),
  consentTerms: z.literal(true),
  subscribeNewsletter: z.boolean().optional(),
  utmSource: z.string().max(80).optional(),
  utmMedium: z.string().max(80).optional(),
  utmCampaign: z.string().max(80).optional(),
});

export type LeadPayload = z.infer<typeof leadSchema>;

export function validateLeadPayload(
  payload: unknown,
):
  | { ok: true; data: LeadPayload }
  | { ok: false; error: string; fieldErrors?: Record<string, string> } {
  const result = leadSchema.safeParse(payload);
  if (result.success) return { ok: true, data: result.data };
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    fieldErrors[issue.path.join(".")] = issue.message;
  }
  return { ok: false, error: "invalid_payload", fieldErrors };
}

// ────────────────────────────────────────
// Date helpers
// ────────────────────────────────────────
export function computeExpiresAt(
  purchasedAt: Date,
  months = EXPIRY_MONTHS,
): Date {
  const expires = new Date(purchasedAt);
  expires.setUTCMonth(expires.getUTCMonth() + months);
  return expires;
}

// ────────────────────────────────────────
// DB operations
// ────────────────────────────────────────
export async function insertLead(payload: LeadPayload) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("consulting_leads")
    .insert({
      name: payload.name,
      email: payload.email,
      contact_method: payload.contactMethod,
      contact_id: payload.contactId ?? null,
      topics: payload.topics,
      specific_problem: payload.specificProblem,
      expected_outcome: payload.expectedOutcome ?? null,
      level: payload.level,
      desired_start: payload.desiredStart ?? null,
      plan: payload.plan,
      attribution: payload.attribution ?? null,
      consent_terms: payload.consentTerms,
      subscribe_newsletter: payload.subscribeNewsletter ?? false,
      utm_source: payload.utmSource ?? null,
      utm_medium: payload.utmMedium ?? null,
      utm_campaign: payload.utmCampaign ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listLeads(status?: string) {
  const supabase = createServiceClient();
  let query = supabase
    .from("consulting_leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateLeadStatus(
  id: string,
  status: "approved" | "rejected" | "enrolled" | "stale",
  vistaNotes?: string,
) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("consulting_leads")
    .update({
      status,
      vista_notes: vistaNotes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createEnrollment(params: {
  leadId: string | null;
  name: string;
  email: string;
  contactMethod?: string;
  contactId?: string;
  plan: ConsultingPlanSlug;
  totalHours: number;
  recurProductId: string;
  recurPaymentId: string;
  purchasedAt: Date;
}) {
  const supabase = createServiceClient();
  const expiresAt = computeExpiresAt(params.purchasedAt);
  const { data, error } = await supabase
    .from("consulting_enrollments")
    .insert({
      lead_id: params.leadId,
      name: params.name,
      email: params.email,
      contact_method: params.contactMethod ?? null,
      contact_id: params.contactId ?? null,
      plan: params.plan,
      total_hours: params.totalHours,
      recur_product_id: params.recurProductId,
      recur_payment_id: params.recurPaymentId,
      purchased_at: params.purchasedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listEnrollmentsWithBalance() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("consulting_enrollments_with_balance")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getEnrollmentWithBalance(id: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("consulting_enrollments_with_balance")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function listSessionsForEnrollment(enrollmentId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("consulting_sessions")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .order("session_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteLead(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("consulting_leads").delete().eq("id", id);
  if (error) throw error;
  return { id };
}

/**
 * 把 approved 超過 7 天但仍未 enrolled 的 lead 自動標為 stale。
 * Return 受影響的筆數。Server-side only。
 */
export async function markStaleApprovedLeads(): Promise<number> {
  const supabase = createServiceClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
  const { data, error } = await supabase
    .from("consulting_leads")
    .update({ status: "stale", updated_at: new Date().toISOString() })
    .eq("status", "approved")
    .lt("updated_at", sevenDaysAgo.toISOString())
    .select("id");
  if (error) throw error;
  return data?.length ?? 0;
}

export async function insertSession(params: {
  enrollmentId: string;
  sessionDate: string;
  timeStart?: string;
  timeEnd?: string;
  hoursUsed: number;
  topic: ConsultingTopicSlug | string;
  sharedDocUrl?: string;
  vistaNotes?: string;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("consulting_sessions")
    .insert({
      enrollment_id: params.enrollmentId,
      session_date: params.sessionDate,
      time_start: params.timeStart ?? null,
      time_end: params.timeEnd ?? null,
      hours_used: params.hoursUsed,
      topic: params.topic,
      shared_doc_url: params.sharedDocUrl ?? null,
      vista_notes: params.vistaNotes ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
