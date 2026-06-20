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

let _svc: SupabaseClient | undefined;
function svc(): SupabaseClient {
  return (_svc ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ));
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

/** 付款成功後建立 pending 分潤；靠 enrollment_id unique index 冪等（重送不重複）。 */
export async function recordCommissionForEnrollment(params: {
  enrollmentId: string;
  orderId: string;
  orderAmount?: number;
}): Promise<void> {
  const sb = svc();
  const { data: enr, error } = await sb
    .from("course_enrollments")
    .select("id, course_id, referral_code, amount")
    .eq("id", params.enrollmentId)
    .maybeSingle();
  if (error || !enr) {
    console.error("[affiliates] load enrollment failed", error);
    return;
  }
  if (!enr.referral_code) return;
  const affiliate = await findActiveAffiliateByCode(
    enr.referral_code,
    enr.course_id,
  );
  if (!affiliate) {
    console.log("[affiliates] no active affiliate for", enr.referral_code);
    return;
  }
  const orderAmount =
    typeof params.orderAmount === "number" ? params.orderAmount : enr.amount ?? 0;
  const commission = computeCommission(orderAmount, affiliate.commission_rate);
  const { error: insErr } = await sb.from("affiliate_referrals").upsert(
    {
      affiliate_id: affiliate.id,
      enrollment_id: enr.id,
      course_id: enr.course_id,
      order_amount: orderAmount,
      commission_rate: affiliate.commission_rate,
      commission_amount: commission,
      status: "pending",
      recur_order_id: params.orderId,
    },
    { onConflict: "enrollment_id", ignoreDuplicates: true },
  );
  if (insErr) console.error("[affiliates] insert referral failed", insErr);
}

/** 退款／取消：把該訂單對應的分潤標 void（排除已 void）。 */
export async function voidCommissionByOrderId(orderId: string): Promise<void> {
  if (!orderId) return;
  const sb = svc();
  const { error } = await sb
    .from("affiliate_referrals")
    .update({ status: "void", voided_at: new Date().toISOString() })
    .eq("recur_order_id", orderId)
    .neq("status", "void");
  if (error) console.error("[affiliates] void by order failed", error);
}
