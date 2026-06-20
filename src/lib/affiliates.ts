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
  else
    console.log(
      "[affiliates] referral recorded for enrollment",
      enr.id,
      "commission",
      commission,
    );
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

// ─── 後台讀取 helpers ───────────────────────────────────────────────────────

export interface AffiliateWithTotals extends Affiliate {
  referral_count: number;
  pending_amount: number;
  approved_amount: number;
  paid_amount: number;
}

export interface ReferralRow extends AffiliateReferral {
  enrollment_email: string | null;
  enrollment_name: string | null;
}

export async function listAffiliatesWithTotals(): Promise<AffiliateWithTotals[]> {
  const sb = svc();
  const { data: affs } = await sb
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: refs } = await sb
    .from("affiliate_referrals")
    .select("affiliate_id, status, commission_amount");
  const totals: Record<
    string,
    { count: number; pending: number; approved: number; paid: number }
  > = {};
  (refs ?? []).forEach((r) => {
    if (r.status === "void") return;
    const t = (totals[r.affiliate_id] ??= {
      count: 0,
      pending: 0,
      approved: 0,
      paid: 0,
    });
    t.count++;
    if (r.status === "pending") t.pending += r.commission_amount;
    else if (r.status === "approved") t.approved += r.commission_amount;
    else if (r.status === "paid") t.paid += r.commission_amount;
  });
  return (affs ?? []).map((a) => ({
    ...(a as Affiliate),
    referral_count: totals[a.id]?.count ?? 0,
    pending_amount: totals[a.id]?.pending ?? 0,
    approved_amount: totals[a.id]?.approved ?? 0,
    paid_amount: totals[a.id]?.paid ?? 0,
  }));
}

export async function getAffiliate(id: string): Promise<Affiliate | null> {
  const sb = svc();
  const { data } = await sb.from("affiliates").select("*").eq("id", id).maybeSingle();
  return (data as Affiliate) ?? null;
}

export async function getReferralsForAffiliate(
  affiliateId: string,
): Promise<ReferralRow[]> {
  const sb = svc();
  const { data } = await sb
    .from("affiliate_referrals")
    .select("*, course_enrollments(email, name)")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => {
    const enr = (r as { course_enrollments?: { email?: string; name?: string } })
      .course_enrollments;
    return {
      ...(r as AffiliateReferral),
      enrollment_email: enr?.email ?? null,
      enrollment_name: enr?.name ?? null,
    };
  });
}

// ─── 後台寫入 helpers ───────────────────────────────────────────────────────

export async function createAffiliate(input: {
  code: string;
  name: string;
  email?: string;
  commissionRate: number; // 0..1
  courseIds?: string[];
  note?: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const code = normalizeCode(input.code);
  if (!code) return { ok: false, error: "代碼不可空白" };
  if (!input.name?.trim()) return { ok: false, error: "夥伴名稱必填" };
  if (!(input.commissionRate > 0 && input.commissionRate <= 1)) {
    return { ok: false, error: "比例需介於 0 與 100% 之間" };
  }
  const sb = svc();
  const { data, error } = await sb
    .from("affiliates")
    .insert({
      code,
      name: input.name.trim(),
      email: input.email?.trim() || null,
      commission_rate: input.commissionRate,
      course_ids: input.courseIds && input.courseIds.length ? input.courseIds : null,
      note: input.note?.trim() || null,
      status: "active",
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return { ok: false, error: "此代碼已存在" };
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function updateAffiliate(
  id: string,
  patch: Partial<{
    name: string;
    email: string | null;
    commission_rate: number;
    course_ids: string[] | null;
    status: AffiliateStatus;
    note: string | null;
  }>,
): Promise<{ ok: boolean; error?: string }> {
  if (
    patch.commission_rate !== undefined &&
    !(patch.commission_rate > 0 && patch.commission_rate <= 1)
  ) {
    return { ok: false, error: "比例需介於 0 與 100% 之間" };
  }
  const sb = svc();
  const { error } = await sb
    .from("affiliates")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateReferralStatus(
  id: string,
  to: ReferralStatus,
  payoutNote?: string,
): Promise<{ ok: boolean; error?: string }> {
  const sb = svc();
  const { data: cur } = await sb
    .from("affiliate_referrals")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (!cur) return { ok: false, error: "找不到此分潤紀錄" };
  if (!canTransitionReferral(cur.status as ReferralStatus, to)) {
    return { ok: false, error: `不允許由 ${cur.status} 轉為 ${to}` };
  }
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status: to };
  if (to === "approved") patch.approved_at = now;
  if (to === "paid") {
    patch.paid_at = now;
    if (payoutNote?.trim()) patch.payout_note = payoutNote.trim();
  }
  if (to === "void") patch.voided_at = now;
  const { error } = await sb.from("affiliate_referrals").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** 取某夥伴某月（YYYY-MM，台北時區月界）的分潤明細，排除 void。 */
export async function getMonthlyReferrals(
  affiliateId: string,
  month: string,
): Promise<ReferralRow[]> {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return [];
  const year = Number(m[1]);
  const mon = Number(m[2]); // 1-12
  // 臺北 (UTC+8) 月界換算成 UTC：當月 1 日 00:00 +08:00 = 前一日 16:00 UTC
  const startUtc = new Date(Date.UTC(year, mon - 1, 1, -8, 0, 0)).toISOString();
  const endUtc = new Date(Date.UTC(year, mon, 1, -8, 0, 0)).toISOString();
  const sb = svc();
  const { data } = await sb
    .from("affiliate_referrals")
    .select("*, course_enrollments(email, name)")
    .eq("affiliate_id", affiliateId)
    .neq("status", "void")
    .gte("created_at", startUtc)
    .lt("created_at", endUtc)
    .order("created_at", { ascending: true });
  return (data ?? []).map((r) => {
    const enr = (r as { course_enrollments?: { email?: string; name?: string } })
      .course_enrollments;
    return {
      ...(r as AffiliateReferral),
      enrollment_email: enr?.email ?? null,
      enrollment_name: enr?.name ?? null,
    };
  });
}
