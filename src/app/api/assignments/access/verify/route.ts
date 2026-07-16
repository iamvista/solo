import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getCourseConfig } from "@/lib/courses-config";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/assignment-access";
import {
  generateSessionToken,
  sessionCookieName,
} from "@/lib/assignment-session";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.solo.tw";

/**
 * Send a failed verification somewhere useful. The `course` param is untrusted,
 * so it is validated against the course config before being used to build a
 * redirect — an unvalidated value here would be an open redirect.
 */
function failureRedirect(courseParam: string | null) {
  const config = courseParam ? getCourseConfig(courseParam) : null;
  const target = config
    ? `${SITE_URL}/courses/${config.slug}/assignments?error=link_invalid`
    : `${SITE_URL}/courses`;
  return NextResponse.redirect(target, { status: 303 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const courseParam = url.searchParams.get("course");

  if (!token) return failureRedirect(courseParam);

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // Claim the token atomically: the update only matches while it is still
  // unused and unexpired, so two concurrent clicks cannot both succeed.
  // Reading first and updating after would leave that race open.
  const { data, error } = await supabase
    .from("assignment_access_tokens")
    .update({ used_at: now })
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", now)
    .select("email, course_id")
    .maybeSingle();

  if (error || !data) return failureRedirect(courseParam);

  const config = getCourseConfig(data.course_id);
  if (!config) return failureRedirect(courseParam);

  const response = NextResponse.redirect(
    `${SITE_URL}/courses/${config.slug}/assignments`,
    { status: 303 },
  );

  response.cookies.set(
    sessionCookieName(data.course_id),
    generateSessionToken({ email: data.email, courseId: data.course_id }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: SITE_URL.startsWith("https://"),
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    },
  );

  return response;
}
