import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const COLUMNS: { key: string; label: string }[] = [
  { key: "created_at", label: "建立時間" },
  { key: "course_slug", label: "課程" },
  { key: "instructor_slug", label: "老師" },
  { key: "name", label: "姓名" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "手機" },
  { key: "source_page", label: "來源頁" },
  { key: "id", label: "候補 ID" },
];

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const course = searchParams.get("course");
  const instructor = searchParams.get("instructor");

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = supabase
    .from("course_waitlist")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (course) query = query.eq("course_slug", course);
  if (instructor) query = query.eq("instructor_slug", instructor);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = COLUMNS.map((c) => c.label).join(",");
  const rows = (data || []).map((row) =>
    COLUMNS.map((c) => escapeCsv((row as Record<string, unknown>)[c.key])).join(","),
  );
  const csv = "﻿" + [header, ...rows].join("\n");

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${date}.csv"`,
    },
  });
}
