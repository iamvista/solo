import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const COLUMNS: { key: string; label: string }[] = [
  { key: "subscribed_at", label: "訂閱時間" },
  { key: "email", label: "E-mail" },
  { key: "name", label: "姓名" },
  { key: "source", label: "來源" },
  { key: "tags", label: "標籤" },
  { key: "status", label: "狀態" },
];

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = Array.isArray(value) ? value.join("|") : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// GET /api/admin/newsletter/export?status=active|unsubscribed|all&source=...&tag=...
// 針對「不同清單」匯出：可依來源（source）或標籤（tag，如 instructor:susie）篩選。
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "active";
  const source = searchParams.get("source");
  const tag = searchParams.get("tag");

  const sb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = sb
    .from("newsletter_subscribers")
    .select("subscribed_at, email, name, source, tags, status")
    .order("subscribed_at", { ascending: false })
    .limit(10000);
  if (status !== "all") query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (tag) query = query.contains("tags", [tag]);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = COLUMNS.map((c) => c.label).join(",");
  const rows = (data || []).map((row) =>
    COLUMNS.map((c) =>
      escapeCsv((row as Record<string, unknown>)[c.key]),
    ).join(","),
  );
  const csv = "﻿" + [header, ...rows].join("\n");

  const parts = ["newsletter"];
  if (source) parts.push(source);
  if (tag) parts.push(tag.replace(/:/g, "-"));
  if (status !== "active") parts.push(status);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${parts.join("-")}-${date}.csv"`,
    },
  });
}
