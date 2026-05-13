import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import {
  insertSession,
  getEnrollmentWithBalance,
} from "@/lib/consulting-db";
import { sendEmail } from "@/lib/email";
import { ConsultingSessionSummaryEmail } from "@/components/emails/consulting-session-summary";

interface SessionPayload {
  enrollmentId: string;
  sessionDate: string;
  timeStart?: string;
  timeEnd?: string;
  hoursUsed: number;
  topic: string;
  sharedDocUrl?: string;
  vistaNotes?: string;
  notifyStudent?: boolean;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let body: SessionPayload;
  try {
    body = (await req.json()) as SessionPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (
    !body.enrollmentId ||
    !body.sessionDate ||
    typeof body.hoursUsed !== "number" ||
    !body.topic
  ) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  let session;
  try {
    session = await insertSession({
      enrollmentId: body.enrollmentId,
      sessionDate: body.sessionDate,
      timeStart: body.timeStart,
      timeEnd: body.timeEnd,
      hoursUsed: body.hoursUsed,
      topic: body.topic,
      sharedDocUrl: body.sharedDocUrl,
      vistaNotes: body.vistaNotes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }

  if (body.notifyStudent) {
    try {
      const enrollment = await getEnrollmentWithBalance(body.enrollmentId);
      await sendEmail({
        to: enrollment.email,
        subject: `${enrollment.name}，${body.sessionDate} 課程紀錄`,
        react: ConsultingSessionSummaryEmail({
          name: enrollment.name,
          sessionDate: body.sessionDate,
          hoursUsed: body.hoursUsed,
          hoursRemaining: enrollment.hours_remaining,
          topic: body.topic,
        }),
      });
    } catch (err) {
      console.error("[admin consulting sessions POST] notify failed", err);
      return NextResponse.json(
        { ok: true, session, emailError: true },
        { status: 200 },
      );
    }
  }

  return NextResponse.json({ ok: true, session });
}
