import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { createAffiliate } from "@/lib/affiliates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const result = await createAffiliate({
    code: body.code,
    name: body.name,
    email: body.email,
    commissionRate: Number(body.commissionRate),
    courseIds: Array.isArray(body.courseIds) ? body.courseIds : undefined,
    note: body.note,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, id: result.id });
}
