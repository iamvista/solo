import { NextResponse, after } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { normalizePhone } from "@/lib/phone";
import { sendEmail } from "@/lib/email";
import { AiMonetizationRegisterInternalEmail } from "@/components/emails/ai-monetization-register-internal";
import { AiMonetizationRegisterConfirmEmail } from "@/components/emails/ai-monetization-register-confirm";
import {
  computeAmount,
  describeSessions,
  normalizeSessions,
  type SessionKey,
} from "@/lib/ai-monetization-pricing";

export const runtime = "nodejs";

const COURSE_ID = "ai-monetization-institute";
const ATTRIBUTION = "solo.tw（Vista 帶單）";

// Rate limit: 5 / 10min per IP（in-memory，v1 足夠）
const RATE_LIMIT_BUCKET = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function ipFromReq(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() ?? "unknown";
}

function rateLimitExceeded(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_LIMIT_BUCKET.get(ip);
  if (!bucket || bucket.resetAt < now) {
    RATE_LIMIT_BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > LIMIT;
}

interface RegisterRequest {
  name?: string;
  email?: string;
  phone?: string;
  sessions?: unknown;
  transferLast5?: string;
  invoiceCompany?: string;
  invoiceTaxId?: string;
  lineId?: string;
  question?: string;
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const ip = ipFromReq(req);
  if (rateLimitExceeded(ip)) {
    return bad("rate_limit_exceeded", 429);
  }

  let body: RegisterRequest;
  try {
    body = (await req.json()) as RegisterRequest;
  } catch {
    return bad("Invalid JSON");
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phoneRaw = body.phone?.trim();
  const transferLast5 = body.transferLast5?.trim();

  if (!name || !email || !phoneRaw) {
    return bad("姓名、Email、手機為必填");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad("Email 格式不正確");
  }

  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return bad("手機號碼格式不正確");
  }

  const sessions: SessionKey[] = normalizeSessions(body.sessions);
  if (sessions.length === 0) {
    return bad("請至少勾選一個報名單元");
  }

  if (!transferLast5 || !/^\d{5}$/.test(transferLast5)) {
    return bad("請填寫轉帳帳號後五碼（5 位數字）");
  }

  // 伺服器端權威金額，不信任前端傳值
  const amount = computeAmount(sessions);
  const sessionsLabel = describeSessions(sessions);

  const invoiceTaxId = body.invoiceTaxId?.trim();
  if (invoiceTaxId && !/^\d{8}$/.test(invoiceTaxId)) {
    return bad("統一編號需為 8 位數字");
  }

  const supabase = createServiceClient();

  const { data: row, error } = await supabase
    .from("course_enrollments")
    .insert({
      course_id: COURSE_ID,
      plan: "bank_transfer",
      email,
      name,
      phone: phone.e164,
      phone_country: phone.country ?? null,
      attribution: ATTRIBUTION,
      question: body.question?.trim() || null,
      line_id: body.lineId?.trim() || null,
      invoice_company: body.invoiceCompany?.trim() || null,
      invoice_tax_id: invoiceTaxId || null,
      marketing_consent: true,
      status: "pending",
      amount,
      selected_sessions: sessions.join(","),
      transfer_last_five: transferLast5,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[/api/courses/ai-monetization/register] insert failed", error);
    return bad("internal_error", 500);
  }

  // 寄兩封信。用 after() 確保在回應送出後仍會執行（Vercel serverless 下，
  // 直接 fire-and-forget 的工作會在 return 後被凍結而漏寄）；循序 await 避免並行競爭，
  // 並逐封記錄失敗，方便日後排查。
  after(async () => {
    const internal = await sendEmail({
      to: "iamvista@gmail.com",
      subject: `🆕 AI 變現研究院報名：${name}（NT$${amount.toLocaleString()}）`,
      react: AiMonetizationRegisterInternalEmail({
        name,
        email,
        phone: phone.international,
        sessionsLabel,
        amount,
        transferLast5,
        invoiceCompany: body.invoiceCompany?.trim() || null,
        invoiceTaxId: invoiceTaxId || null,
        lineId: body.lineId?.trim() || null,
        question: body.question?.trim() || null,
      }),
    });
    if (!internal.success) {
      console.error("[ai-monetization/register] internal email failed", internal.error);
    }

    const confirm = await sendEmail({
      to: email,
      subject: "AI 變現研究院・報名資料已收到",
      react: AiMonetizationRegisterConfirmEmail({
        name,
        sessionsLabel,
        amount,
        transferLast5,
      }),
    });
    if (!confirm.success) {
      console.error("[ai-monetization/register] confirm email failed", confirm.error);
    }
  });

  return NextResponse.json({ ok: true, enrollmentId: row.id, amount });
}
