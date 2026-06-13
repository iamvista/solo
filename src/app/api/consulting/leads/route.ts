import { NextResponse, after } from "next/server";
import { validateLeadPayload, insertLead } from "@/lib/consulting-db";
import { sendEmail } from "@/lib/email";
import { ConsultingLeadReceivedEmail } from "@/components/emails/consulting-lead-received";
import { ConsultingLeadInternalEmail } from "@/components/emails/consulting-lead-internal";

// Rate limit: 5 / 10min per IP (in-memory, suffices for v1)
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

export async function POST(req: Request) {
  const ip = ipFromReq(req);
  if (rateLimitExceeded(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limit_exceeded" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const validation = validateLeadPayload(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error, fieldErrors: validation.fieldErrors },
      { status: 422 },
    );
  }

  const payload = validation.data;

  try {
    const lead = await insertLead(payload);

    // 寄兩封信。用 after() 確保在回應送出後仍會執行（Vercel serverless 下，return 後的
    // bare fire-and-forget 會被凍結而漏寄）；循序 await 避免並行競爭，逐封記錄失敗。
    // TODO v2: subscribeNewsletter flag → newsletter_subscribers upsert
    after(async () => {
      const received = await sendEmail({
        to: payload.email,
        subject: "需求表單收到了 — Vista",
        react: ConsultingLeadReceivedEmail({
          name: payload.name,
          plan: payload.plan,
          topics: payload.topics,
        }),
      });
      if (!received.success) {
        console.error(
          "[consulting/leads POST] lead-received (to student) send failed",
          received.error,
        );
      }

      const internal = await sendEmail({
        to: "iamvista@gmail.com",
        subject: `🆕 新諮詢 lead：${payload.name}（${payload.plan}）`,
        react: ConsultingLeadInternalEmail({ lead }),
      });
      if (!internal.success) {
        console.error(
          "[consulting/leads POST] lead-internal (to Vista) send failed",
          internal.error,
        );
      }
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (err) {
    console.error("insertLead failed", err);
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 },
    );
  }
}
