import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { updateReferralStatus, type ReferralStatus } from "@/lib/affiliates";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const to = body?.status as ReferralStatus | undefined;
  if (!to) return NextResponse.json({ error: "Missing status" }, { status: 400 });
  const result = await updateReferralStatus(id, to, body?.payoutNote);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
