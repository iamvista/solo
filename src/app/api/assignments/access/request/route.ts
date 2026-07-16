import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { getCourseConfig } from "@/lib/courses-config";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { AssignmentAccessEmail } from "@/components/emails/assignment-access";
import {
  ACCESS_TOKEN_TTL_MINUTES,
  findEligibleStudent,
  normalizeEmail,
} from "@/lib/assignment-access";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.solo.tw";

// Per-client cap: blunts scanning and log spam from one source.
const IP_LIMIT = { max: 10, windowMs: 60_000 };

// Per-address cap: the one that actually protects a student's inbox. A per-IP
// limit alone does nothing against a flood aimed at one address from many
// clients. Deliberately tighter and over a longer window — a real student needs
// one link, and asks again only if the mail went astray.
const EMAIL_LIMIT = { max: 3, windowMs: 15 * 60_000 };

/**
 * EVERY path through this route returns exactly this — including malformed
 * bodies, unknown courses, unenrolled emails, and internal failures.
 *
 * A different status, body, or timing for "not enrolled" would turn this
 * endpoint into a roster oracle: anyone could enumerate who bought the course.
 * Only an eligible address receives mail; its sender sees the same message as
 * everyone else.
 */
function identicalResponse() {
  return NextResponse.json({
    ok: true,
    message: "如果這個 email 有報名這門課，入口連結已經寄出了。請到信箱收信。",
  });
}

/**
 * Throttled requests share one response shape, which is the same for enrolled
 * and unenrolled addresses alike — see the rate limiting note in POST below.
 */
function throttledResponse() {
  return NextResponse.json(
    { ok: false, message: "請求過於頻繁，請稍後再試。" },
    { status: 429 },
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`assignment-access:ip:${ip}`, IP_LIMIT)) {
    return throttledResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return identicalResponse();
  }

  const payload = body as { courseId?: unknown; email?: unknown } | null;
  const courseId = String(payload?.courseId ?? "");
  const email = normalizeEmail(String(payload?.email ?? ""));

  // Keyed on the SUBMITTED address and evaluated before any eligibility lookup.
  // Throttling only enrolled addresses would make a 429 mean "this person
  // bought the course", handing back the roster the identical response exists
  // to hide.
  if (
    email &&
    !checkRateLimit(`assignment-access:email:${courseId}:${email}`, EMAIL_LIMIT)
  ) {
    return throttledResponse();
  }

  const config = getCourseConfig(courseId);
  if (!config || !email) return identicalResponse();

  const student = await findEligibleStudent(courseId, email);
  if (!student) return identicalResponse();

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_MINUTES * 60_000);

  const supabase = createServiceClient();
  const { error } = await supabase.from("assignment_access_tokens").insert({
    token,
    email: student.email,
    course_id: courseId,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Assignment access token insert error:", error);
    return identicalResponse();
  }

  const accessUrl = `${SITE_URL}/api/assignments/access/verify?token=${token}&course=${encodeURIComponent(courseId)}`;

  await sendEmail({
    to: student.email,
    subject: `進入 ${config.title} 作業區`,
    react: AssignmentAccessEmail({
      studentName: student.name || "同學",
      courseName: config.title,
      accessUrl,
      expiresInMinutes: ACCESS_TOKEN_TTL_MINUTES,
    }),
  });

  return identicalResponse();
}
