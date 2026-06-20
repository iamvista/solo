import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { getAffiliate, getMonthlyReferrals } from "@/lib/affiliates";

export const runtime = "nodejs";

const STATUS_LABEL: Record<string, string> = {
  pending: "待結算",
  approved: "已核准",
  paid: "已付款",
};

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Taipei",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "month 需為 YYYY-MM" }, { status: 400 });
  }
  const affiliate = await getAffiliate(id);
  if (!affiliate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const rows = await getMonthlyReferrals(id, month);

  const header = ["日期", "課程", "學員 Email", "實付金額", "比例", "分潤金額", "狀態"];
  const lines = rows.map((r) =>
    [
      fmtDate(r.created_at),
      r.course_id,
      r.enrollment_email ?? "",
      r.order_amount,
      `${Math.round(r.commission_rate * 100)}%`,
      r.commission_amount,
      STATUS_LABEL[r.status] ?? r.status,
    ]
      .map(escapeCsv)
      .join(","),
  );
  const total = rows.reduce((sum, r) => sum + r.commission_amount, 0);
  const totalLine = ["合計", "", "", "", "", total, ""].map(escapeCsv).join(",");

  const csv = `﻿${header.map(escapeCsv).join(",")}\n${lines.join("\n")}\n${totalLine}`;
  const filename = `affiliate_${affiliate.code}_${month}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
