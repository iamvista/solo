import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { validateWaitlistPayload } from "@/lib/waitlist";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(ip, { max: 10, windowMs: 60_000 })) {
    return json({ ok: false, error: "請求過於頻繁，請稍後再試" }, 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const v = validateWaitlistPayload(raw);
  if (!v.ok) return json({ ok: false, error: v.error }, 400);
  const data = v.value;

  const supabase = createServiceClient();

  const { error } = await supabase.from("course_waitlist").upsert(
    {
      course_slug: data.course_slug,
      instructor_slug: data.instructor_slug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      source_page: data.source_page,
    },
    { onConflict: "course_slug,email" },
  );

  if (error) {
    console.error("waitlist insert error:", error);
    return json({ ok: false, error: "儲存失敗，請稍後再試" }, 500);
  }

  // 同步進電子報池（best-effort，失敗不影響候補成功）
  // newsletter_subscribers.email 只有 partial unique index (WHERE status='active')，
  // 不支援 onConflict:"email" upsert → 改用 check-then-insert，鏡像 /api/newsletter/subscribe
  try {
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", data.email)
      .maybeSingle();

    if (!existing) {
      await supabase.from("newsletter_subscribers").insert({
        email: data.email,
        name: data.name,
        status: "active",
        source: "waitlist",
        tags: [`waitlist:${data.course_slug}`],
      });
    }
  } catch (e) {
    console.error("waitlist newsletter sync failed:", e);
  }

  return json({ ok: true });
}
