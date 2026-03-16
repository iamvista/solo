import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: list captures for a lead magnet (owner only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  // Verify ownership
  const { data: magnet } = await supabase
    .from("lead_magnets")
    .select("id, title")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!magnet) return NextResponse.json({ error: "找不到此名單磁鐵" }, { status: 404 });

  // Check for CSV export
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  const { data: captures, error } = await supabase
    .from("lead_captures")
    .select("*")
    .eq("lead_magnet_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (format === "csv") {
    const BOM = "\uFEFF";
    const header = "Email,姓名,來源頁面,UTM Source,UTM Medium,UTM Campaign,日期\n";
    const rows = (captures || [])
      .map((c) =>
        [
          c.email,
          c.name || "",
          c.source_page || "",
          c.utm_source || "",
          c.utm_medium || "",
          c.utm_campaign || "",
          new Date(c.created_at).toLocaleDateString("zh-TW"),
        ].join(","),
      )
      .join("\n");

    return new NextResponse(BOM + header + rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${magnet.title}-leads.csv"`,
      },
    });
  }

  return NextResponse.json({ captures });
}
