import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { updateAffiliate } from "@/lib/affiliates";

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
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) patch.name = String(body.name).trim();
  if (body.email !== undefined) patch.email = body.email?.trim() || null;
  if (body.commissionRate !== undefined)
    patch.commission_rate = Number(body.commissionRate);
  if (body.courseIds !== undefined)
    patch.course_ids =
      Array.isArray(body.courseIds) && body.courseIds.length ? body.courseIds : null;
  if (body.status !== undefined) patch.status = body.status;
  if (body.note !== undefined) patch.note = body.note?.trim() || null;
  const result = await updateAffiliate(id, patch);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
