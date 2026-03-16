import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: single lead magnet detail (owner only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const { data, error } = await supabase
    .from("lead_magnets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "找不到此名單磁鐵" }, { status: 404 });
  }

  return NextResponse.json({ lead_magnet: data });
}

// PUT: update lead magnet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  // Verify ownership
  const { data: existing } = await supabase
    .from("lead_magnets")
    .select("id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "無權限編輯" }, { status: 403 });
  }

  const body = await request.json();
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  const allowedFields = [
    "title", "slug", "description", "resource_type", "file_url",
    "redirect_url", "benefits", "cta_text", "thank_you_message",
    "cover_image", "status",
  ];
  for (const field of allowedFields) {
    if (body[field] !== undefined) updateData[field] = body[field];
  }

  if (updateData.slug && !/^[a-z0-9-]+$/.test(updateData.slug as string)) {
    return NextResponse.json({ error: "網址代稱只能包含小寫英文、數字和連字號" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("lead_magnets")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "此網址代稱已被使用" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead_magnet: data });
}

// DELETE: delete draft lead magnet
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  // Only allow deleting drafts
  const { data: existing } = await supabase
    .from("lead_magnets")
    .select("id, status")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!existing) return NextResponse.json({ error: "找不到此名單磁鐵" }, { status: 404 });
  if (existing.status !== "draft") {
    return NextResponse.json({ error: "只能刪除草稿狀態的名單磁鐵" }, { status: 400 });
  }

  const { error } = await supabase.from("lead_magnets").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
