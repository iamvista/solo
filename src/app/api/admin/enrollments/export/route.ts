import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const COLUMNS: { key: string; label: string }[] = [
  { key: "created_at", label: "建立時間" },
  { key: "status", label: "狀態" },
  { key: "course_id", label: "課程" },
  { key: "plan", label: "方案" },
  { key: "selected_sessions", label: "選的單元" },
  { key: "transfer_last_five", label: "轉帳末五碼" },
  { key: "name", label: "姓名" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "手機" },
  { key: "phone_country", label: "國碼" },
  { key: "amount", label: "金額" },
  { key: "organization", label: "公司" },
  { key: "job_title", label: "職稱" },
  { key: "attribution", label: "歸因" },
  { key: "current_proposal_pain", label: "提案痛點" },
  { key: "alumni_certificate", label: "舊生憑證" },
  { key: "question", label: "想問講師" },
  { key: "line_id", label: "LINE" },
  { key: "facebook", label: "Facebook" },
  { key: "dietary", label: "飲食" },
  { key: "invoice_company", label: "發票抬頭" },
  { key: "invoice_tax_id", label: "統編" },
  { key: "marketing_consent", label: "行銷同意" },
  { key: "recur_order_id", label: "Recur 訂單" },
  { key: "recur_product_id", label: "Recur 產品" },
  { key: "paid_at", label: "付款時間" },
  { key: "email_confirmation_sent_at", label: "E-mail 寄出" },
  { key: "sms_confirmation_sent_at", label: "SMS 寄出" },
  { key: "id", label: "報名 ID" },
];

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // CSV 規範：含雙引號、逗號、換行、回車的值要用雙引號包起來，內部雙引號轉義為兩個
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Taipei",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const courseFilter = url.searchParams.get("course");
  const statusFilter = url.searchParams.get("status");

  const sb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = sb
    .from("course_enrollments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (courseFilter) query = query.eq("course_id", courseFilter);
  if (statusFilter) query = query.eq("status", statusFilter);

  const { data, error } = await query;
  if (error) {
    console.error("[admin enrollments export] failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];

  const dateCols = new Set([
    "created_at",
    "paid_at",
    "email_confirmation_sent_at",
    "sms_confirmation_sent_at",
  ]);

  const header = COLUMNS.map((c) => escapeCsv(c.label)).join(",");
  const body = rows
    .map((row) =>
      COLUMNS.map((c) => {
        const raw = (row as Record<string, unknown>)[c.key];
        const value = dateCols.has(c.key) ? fmtDate(raw as string | null) : raw;
        return escapeCsv(value);
      }).join(","),
    )
    .join("\n");

  // BOM 讓 Excel 正確解析 UTF-8 中文
  const csv = `﻿${header}\n${body}`;

  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  const filename = `enrollments_${courseFilter ?? "all"}_${
    statusFilter ?? "all"
  }_${ts}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
