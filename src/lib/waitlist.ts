import { normalizePhone } from "@/lib/phone";

/** 名單動機。full_waitlist 為預設值，讓改動前寫入的列自動歸位。 */
export const WAITLIST_INTENTS = [
  "full_waitlist",
  "date_conflict",
  "ad_lead",
] as const;
export type WaitlistIntent = (typeof WAITLIST_INTENTS)[number];

/** 誘餌欄位：人類看不到也填不到，機器人會填。 */
export const HONEYPOT_FIELD = "company_website";

export interface CleanWaitlist {
  course_slug: string;
  instructor_slug: string | null;
  name: string;
  email: string;
  phone: string | null;
  source_page: string | null;
  intent: WaitlistIntent;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
}

export type WaitlistValidation =
  | { ok: true; value: CleanWaitlist }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTM_MAX_LEN = 200;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** UTM 由 query string 而來，屬不可信輸入：截長、空值轉 null。 */
function utm(v: unknown): string | null {
  return str(v).slice(0, UTM_MAX_LEN) || null;
}

/** 誘餌欄位非空即視為機器人。呼叫端應靜默回傳成功，不揭露偵測邏輯。 */
export function isHoneypotTriggered(input: Record<string, unknown>): boolean {
  return str(input[HONEYPOT_FIELD]).length > 0;
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

  // 缺漏時歸位為 full_waitlist，維持改動前呼叫端的相容性
  const intentRaw = str(input.intent) || "full_waitlist";
  if (!(WAITLIST_INTENTS as readonly string[]).includes(intentRaw))
    return { ok: false, error: "無效的名單類型" };
  const intent = intentRaw as WaitlistIntent;

  const instructor_slug = str(input.instructor_slug) || null;
  const source_page = str(input.source_page) || null;

  const utmIn = (input.utm ?? {}) as Record<string, unknown>;

  return {
    ok: true,
    value: {
      course_slug,
      instructor_slug,
      name,
      email,
      phone,
      source_page,
      intent,
      utm_source: utm(utmIn.source),
      utm_medium: utm(utmIn.medium),
      utm_campaign: utm(utmIn.campaign),
      utm_content: utm(utmIn.content),
    },
  };
}
