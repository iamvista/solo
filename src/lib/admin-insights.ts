import { createServiceClient } from "@/lib/supabase/service";
import { getCourseConfig } from "@/lib/courses-config";

// ── 報名洞察（全部用站內資料，零外部依賴）────────────────────────────

export interface CourseFunnelRow {
  courseId: string;
  title: string;
  waitlist: number;
  pending: number;
  paid: number;
  revenue: number;
}

export interface PendingEnrollment {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  courseId: string;
  amount: number | null;
  createdAt: string;
}

export interface RegistrationInsights {
  monthRevenue: number;
  enroll30d: number;
  pendingCount: number;
  pendingAmount: number;
  waitlistCount: number;
  paidCount: number;
  courseFunnel: CourseFunnelRow[];
  pending: PendingEnrollment[];
  attribution: [string, number][];
  revenueTrend: { label: string; revenue: number }[];
}

interface EnrollmentRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  course_id: string | null;
  amount: number | null;
  status: string;
  attribution: string | null;
  created_at: string;
  paid_at: string | null;
}

function courseTitle(slug: string): string {
  return getCourseConfig(slug)?.title ?? slug;
}

const DAY = 24 * 60 * 60 * 1000;

export async function getRegistrationInsights(): Promise<RegistrationInsights> {
  const sb = createServiceClient();
  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();
  const since30 = new Date(now.getTime() - 30 * DAY).toISOString();

  const [enrollRes, waitlistRes] = await Promise.all([
    sb
      .from("course_enrollments")
      .select(
        "id, name, email, phone, course_id, amount, status, attribution, created_at, paid_at",
      ),
    sb.from("course_waitlist").select("course_slug"),
  ]);

  const enrollments = (enrollRes.data ?? []) as EnrollmentRow[];
  const waitlist = (waitlistRes.data ?? []) as { course_slug: string }[];

  const waitlistByCourse: Record<string, number> = {};
  waitlist.forEach((w) => {
    waitlistByCourse[w.course_slug] =
      (waitlistByCourse[w.course_slug] || 0) + 1;
  });

  const funnelMap: Record<
    string,
    { pending: number; paid: number; revenue: number }
  > = {};
  const attribution: Record<string, number> = {};
  const pending: PendingEnrollment[] = [];
  let pendingCount = 0;
  let pendingAmount = 0;
  let monthRevenue = 0;
  let enroll30d = 0;
  let paidCount = 0;

  enrollments.forEach((e) => {
    const c = e.course_id ?? "unknown";
    funnelMap[c] ??= { pending: 0, paid: 0, revenue: 0 };

    if (e.status === "paid") {
      funnelMap[c].paid++;
      funnelMap[c].revenue += e.amount ?? 0;
      paidCount++;
      if (e.paid_at && e.paid_at >= monthStart) monthRevenue += e.amount ?? 0;
    } else if (e.status === "pending") {
      funnelMap[c].pending++;
      pendingCount++;
      pendingAmount += e.amount ?? 0;
      pending.push({
        id: e.id,
        name: e.name ?? "—",
        email: e.email,
        phone: e.phone ?? null,
        courseId: c,
        amount: e.amount ?? null,
        createdAt: e.created_at,
      });
    }

    if (
      e.created_at >= since30 &&
      (e.status === "paid" || e.status === "pending")
    ) {
      enroll30d++;
    }

    const attr = (e.attribution && e.attribution.trim()) || "未填";
    attribution[attr] = (attribution[attr] || 0) + 1;
  });

  const courseIds = new Set([
    ...Object.keys(funnelMap),
    ...Object.keys(waitlistByCourse),
  ]);
  const courseFunnel: CourseFunnelRow[] = [...courseIds]
    .map((c) => ({
      courseId: c,
      title: courseTitle(c),
      waitlist: waitlistByCourse[c] ?? 0,
      pending: funnelMap[c]?.pending ?? 0,
      paid: funnelMap[c]?.paid ?? 0,
      revenue: funnelMap[c]?.revenue ?? 0,
    }))
    .sort(
      (a, b) =>
        b.paid + b.pending + b.waitlist - (a.paid + a.pending + a.waitlist),
    );

  // 近 8 週已付課程收入趨勢
  const weeks = 8;
  const revenueTrend: { label: string; revenue: number }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 7 * DAY);
    const end = new Date(now.getTime() - i * 7 * DAY);
    let rev = 0;
    enrollments.forEach((e) => {
      if (e.status === "paid" && e.paid_at) {
        const t = new Date(e.paid_at);
        if (t >= start && t < end) rev += e.amount ?? 0;
      }
    });
    revenueTrend.push({
      label: `${start.getMonth() + 1}/${start.getDate()}`,
      revenue: rev,
    });
  }

  pending.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    monthRevenue,
    enroll30d,
    pendingCount,
    pendingAmount,
    waitlistCount: waitlist.length,
    paidCount,
    courseFunnel,
    pending: pending.slice(0, 25),
    attribution: Object.entries(attribution).sort((a, b) => b[1] - a[1]),
    revenueTrend,
  };
}

// ── 獲客洞察（站內漏斗 + 名單來源）─────────────────────────────────

export interface AcquisitionInsights {
  funnel: { diagnoses: number; enrollments: number; paid: number };
  utmSources: [string, number][];
  newsletterBySource: [string, number][];
}

export async function getAcquisitionInsights(): Promise<AcquisitionInsights> {
  const sb = createServiceClient();

  const [diagRes, utmRes, enrollRes, nlRes] = await Promise.all([
    sb
      .from("diagnosis_results")
      .select("*", { count: "exact", head: true }),
    sb.from("diagnosis_results").select("utm_source"),
    sb.from("course_enrollments").select("status"),
    sb
      .from("newsletter_subscribers")
      .select("source")
      .eq("status", "active"),
  ]);

  const diagnoses = diagRes.count ?? 0;
  const enrollRows = (enrollRes.data ?? []) as { status: string }[];
  const enrollments = enrollRows.length;
  const paid = enrollRows.filter((e) => e.status === "paid").length;

  const utmCount: Record<string, number> = {};
  ((utmRes.data ?? []) as { utm_source: string | null }[]).forEach((d) => {
    const s = d.utm_source || "direct";
    utmCount[s] = (utmCount[s] || 0) + 1;
  });

  const nlCount: Record<string, number> = {};
  ((nlRes.data ?? []) as { source: string | null }[]).forEach((r) => {
    const s = r.source || "unknown";
    nlCount[s] = (nlCount[s] || 0) + 1;
  });

  return {
    funnel: { diagnoses, enrollments, paid },
    utmSources: Object.entries(utmCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8),
    newsletterBySource: Object.entries(nlCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8),
  };
}
