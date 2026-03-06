import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { getEventRegistrations, updateRegistrationStatus } from "@/lib/supabase/events";
import type { RegistrationStatus } from "@/lib/supabase/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await getEventRegistrations(id, page, limit);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Get registrations error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { registration_ids, status } = body as { registration_ids: string[]; status: RegistrationStatus };

    if (!registration_ids || !status) {
      return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
    }

    const results = await Promise.all(
      registration_ids.map((regId) => updateRegistrationStatus(regId, status))
    );

    const successCount = results.filter(Boolean).length;
    return NextResponse.json({ success: true, updated: successCount });
  } catch (err) {
    console.error("Update registrations error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
