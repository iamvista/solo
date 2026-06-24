import { NextResponse, after } from "next/server";
import { validateLeadPayload, insertLead } from "@/lib/consulting-db";
import { sendEmail } from "@/lib/email";
import { ConsultingLeadReceivedEmail } from "@/components/emails/consulting-lead-received";
import { ConsultingLeadInternalEmail } from "@/components/emails/consulting-lead-internal";

// Rate limit: 5 / 10min per IP（沿用 consulting route 寫法）
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
    return NextResponse.json({ ok: false, error: "rate_limit_exceeded" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // 把家教班 payload 映射成既有 consulting leadSchema
  const directions = Array.isArray(body.directions) ? (body.directions as string[]) : [];
  const tierInterest = typeof body.tierInterest === "string" ? body.tierInterest : "undecided";
  const topics = [
    ...directions.map((d) => `ai-tutor:${d}`),
    ...(tierInterest && tierInterest !== "undecided" ? [`ai-tutor-tier:${tierInterest}`] : []),
  ];

  const mapped = {
    name: body.name,
    email: body.email,
    contactMethod: body.contactMethod,
    contactId: body.contactId,
    topics,
    specificProblem: body.specificProblem,
    expectedOutcome: body.expectedOutcome,
    level: body.level,
    desiredStart: body.desiredStart,
    plan: "undecided" as const,
    attribution: body.attribution,
    consentTerms: body.consentTerms,
    subscribeNewsletter: body.subscribeNewsletter,
  };

  const validation = validateLeadPayload(mapped);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error, fieldErrors: validation.fieldErrors },
      { status: 422 },
    );
  }

  const payload = validation.data;

  try {
    const lead = await insertLead(payload);

    after(async () => {
      const received = await sendEmail({
        to: payload.email,
        subject: "AI 家教班諮詢收到了 — Vista",
        react: ConsultingLeadReceivedEmail({
          name: payload.name,
          plan: payload.plan,
          topics: payload.topics,
        }),
      });
      if (!received.success) {
        console.error("[ai-tutor/leads POST] lead-received send failed", received.error);
      }

      const internal = await sendEmail({
        to: "iamvista@gmail.com",
        subject: `🎓 新 AI 家教班 lead：${payload.name}`,
        react: ConsultingLeadInternalEmail({ lead }),
      });
      if (!internal.success) {
        console.error("[ai-tutor/leads POST] lead-internal send failed", internal.error);
      }
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (err) {
    console.error("[ai-tutor/leads] insertLead failed", err);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
