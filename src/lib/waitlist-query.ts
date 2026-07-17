import type { SupabaseClient } from "@supabase/supabase-js";

export interface WaitlistFilters {
  course?: string;
  instructor?: string;
  intent?: string;
  campaign?: string;
}

export interface WaitlistRow {
  id: string;
  course_slug: string;
  instructor_slug: string | null;
  name: string;
  email: string;
  phone: string | null;
  source_page: string | null;
  intent: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  preferred_timeslot: string | null;
  notified_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function parseFilters(searchParams: {
  get(key: string): string | null;
}): WaitlistFilters {
  return {
    course: searchParams.get("course") || undefined,
    instructor: searchParams.get("instructor") || undefined,
    intent: searchParams.get("intent") || undefined,
    campaign: searchParams.get("campaign") || undefined,
  };
}

/**
 * 後臺列表、CSV 匯出、廣播收件人三者共用同一組條件。
 * 若各自寫一份，畫面顯示的人數就會與實際寄出的人數對不起來。
 *
 * @param excludeUnsubscribed 廣播時必為 true：已退訂者不論篩選條件為何都不寄。
 */
export async function fetchWaitlist(
  supabase: SupabaseClient,
  filters: WaitlistFilters,
  { excludeUnsubscribed = false, limit = 1000 } = {},
): Promise<{ rows: WaitlistRow[]; error: string | null }> {
  let query = supabase
    .from("course_waitlist")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.course) query = query.eq("course_slug", filters.course);
  if (filters.instructor)
    query = query.eq("instructor_slug", filters.instructor);
  if (filters.intent) query = query.eq("intent", filters.intent);
  if (filters.campaign) query = query.eq("utm_campaign", filters.campaign);
  if (excludeUnsubscribed) query = query.is("unsubscribed_at", null);

  const { data, error } = await query;
  return { rows: (data || []) as WaitlistRow[], error: error?.message ?? null };
}

/**
 * 有候補資料的課程清單，供後臺的課程選單使用。
 *
 * 刻意不列 workshops 的全部課程：選單是用來選廣播對象的，列出零候補者的課程
 * 只會讓操作者選到一個空集合。也刻意不從當前篩選結果推導：已選課程時，
 * 那份結果只會剩下該課程，選單就再也切不回別門課。
 */
export async function fetchWaitlistCourses(
  supabase: SupabaseClient,
): Promise<string[]> {
  const { data } = await supabase.from("course_waitlist").select("course_slug");
  const slugs = (data || []).map((r: { course_slug: string }) => r.course_slug);
  return Array.from(new Set(slugs)).sort();
}

/** 偏好時段分佈，供後臺判斷下一梯該排在什麼時候。 */
export function timeslotDistribution(
  rows: WaitlistRow[],
): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const r of rows) {
    const key = r.preferred_timeslot ?? "unset";
    dist[key] = (dist[key] ?? 0) + 1;
  }
  return dist;
}
