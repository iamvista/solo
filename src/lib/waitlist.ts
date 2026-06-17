import { normalizePhone } from "@/lib/phone";

export interface CleanWaitlist {
  course_slug: string;
  instructor_slug: string | null;
  name: string;
  email: string;
  phone: string | null;
  source_page: string | null;
}

export type WaitlistValidation =
  | { ok: true; value: CleanWaitlist }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateWaitlistPayload(
  input: Record<string, unknown>,
): WaitlistValidation {
  const course_slug = str(input.course_slug);
  if (!course_slug) return { ok: false, error: "缺少課程" };

  const name = str(input.name);
  if (!name) return { ok: false, error: "請填姓名" };

  const email = str(input.email).toLowerCase();
  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "E-mail 格式不正確" };

  const phoneRaw = str(input.phone);
  let phone: string | null = null;
  if (phoneRaw) {
    if (!normalizePhone(phoneRaw))
      return { ok: false, error: "手機號碼格式不正確" };
    phone = phoneRaw;
  }

  const instructor_slug = str(input.instructor_slug) || null;
  const source_page = str(input.source_page) || null;

  return {
    ok: true,
    value: { course_slug, instructor_slug, name, email, phone, source_page },
  };
}
