// 聯盟行銷分潤：核心型別與純函式。
// 注意：此檔同時含 server-only 的 DB 函式（後續任務追加），但純函式可在 vitest（node）匯入，
// 因此不要加 `import "server-only"`；DB 函式於呼叫時才讀環境變數。

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type AffiliateStatus = "active" | "disabled";
export type ReferralStatus = "pending" | "approved" | "paid" | "void";

export interface Affiliate {
  id: string;
  code: string;
  name: string;
  email: string | null;
  commission_rate: number; // 0..1
  course_ids: string[] | null;
  status: AffiliateStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateReferral {
  id: string;
  affiliate_id: string;
  enrollment_id: string;
  course_id: string;
  order_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: ReferralStatus;
  recur_order_id: string | null;
  payout_note: string | null;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
  voided_at: string | null;
}

export function normalizeCode(raw: string): string {
  return (raw ?? "").trim().toUpperCase();
}

export function isCourseInScope(
  courseIds: string[] | null | undefined,
  courseSlug: string,
): boolean {
  if (!courseIds || courseIds.length === 0) return true;
  return courseIds.includes(courseSlug);
}

export function computeCommission(orderAmount: number, rate: number): number {
  if (!Number.isFinite(orderAmount) || orderAmount <= 0) return 0;
  return Math.round(orderAmount * rate);
}

const REFERRAL_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  pending: ["approved", "void"],
  approved: ["paid", "void"],
  paid: ["void"],
  void: [],
};

export function canTransitionReferral(
  from: ReferralStatus,
  to: ReferralStatus,
): boolean {
  return REFERRAL_TRANSITIONS[from]?.includes(to) ?? false;
}

function svc(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** 依代碼找 active 且適用該課程的夥伴；查無或不適用回 null。 */
export async function findActiveAffiliateByCode(
  rawCode: string,
  courseSlug: string,
): Promise<Affiliate | null> {
  const code = normalizeCode(rawCode);
  if (!code) return null;
  const sb = svc();
  const { data, error } = await sb
    .from("affiliates")
    .select("*")
    .eq("code", code)
    .eq("status", "active")
    .maybeSingle();
  if (error) {
    console.error("[affiliates] findActiveAffiliateByCode error", error);
    return null;
  }
  if (!data) return null;
  if (!isCourseInScope(data.course_ids, courseSlug)) return null;
  return data as Affiliate;
}
