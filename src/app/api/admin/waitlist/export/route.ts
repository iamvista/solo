import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/supabase/admin";
import { fetchWaitlist, parseFilters } from "@/lib/waitlist-query";

export const runtime = "nodejs";

const COLUMNS: { key: string; label: string }[] = [
  { key: "created_at", label: "建立時間" },
  { key: "course_slug", label: "課程" },
  { key: "instructor_slug", label: "老師" },
  { key: "name", label: "姓名" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "手機" },
  { key: "source_page", label: "來源頁" },
  { key: "intent", label: "名單類型" },
  { key: "preferred_timeslot", label: "偏好時段" },
  { key: "utm_source", label: "UTM 來源" },
  { key: "utm_medium", label: "UTM 媒介" },
  { key: "utm_campaign", label: "UTM 活動" },
  { key: "utm_content", label: "UTM 素材" },
  { key: "notified_at", label: "上次通知" },
  { key: "unsubscribed_at", label: "退訂時間" },
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

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 與後臺列表、廣播收件人共用同一組篩選，匯出的內容必然等同畫面所見
  const { rows: data, error } = await fetchWaitlist(
    supabase,
    parseFilters(searchParams),
    { limit: 5000 },
  );
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const header = COLUMNS.map((c) => c.label).join(",");
  const rows = data.map((row) =>
    COLUMNS.map((c) => escapeCsv((row as unknown as Record<string, unknown>)[c.key])).join(","),
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
