import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

// GET: List registrations for own event
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  // Verify ownership
  const { data: event } = await supabase
    .from("events")
    .select("id, title")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!event) return NextResponse.json({ error: "找不到活動" }, { status: 404 });

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*, ticket_types:ticket_type_id(name)")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    event,
    registrations: registrations || [],
  });
}

// GET with ?format=csv: Export CSV
export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  const body = await request.json();

  // Verify ownership
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!event) return NextResponse.json({ error: "找不到活動" }, { status: 404 });

  if (body.action === "export_csv") {
    const { data: registrations } = await supabase
      .from("registrations")
      .select("name, email, phone, status, note, created_at, ticket_types:ticket_type_id(name)")
      .eq("event_id", id)
      .neq("status", "cancelled")
      .order("created_at", { ascending: true });

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ error: "沒有報名者" }, { status: 404 });
    }

    const header = "姓名,Email,電話,狀態,票種,備註,報名時間\n";
    const rows = registrations.map((r) => {
      const ticket = r.ticket_types as unknown as { name: string } | null;
      const status = r.status === "confirmed" ? "已確認" : r.status === "waitlisted" ? "候補" : "已取消";
      return [
        `"${(r.name || "").replace(/"/g, '""')}"`,
        r.email,
        r.phone || "",
        status,
        ticket?.name || "",
        `"${(r.note || "").replace(/"/g, '""')}"`,
        new Date(r.created_at).toLocaleString("zh-TW"),
      ].join(",");
    }).join("\n");

    const csv = "\uFEFF" + header + rows; // BOM for Excel
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="registrations-${id}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "無效操作" }, { status: 400 });
}
