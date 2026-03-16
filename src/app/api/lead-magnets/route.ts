import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: list current user's lead magnets
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const { data, error } = await supabase
    .from("lead_magnets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lead_magnets: data });
}

// POST: create a new lead magnet
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  // Check usage limits
  const { data: usageCheck } = await supabase.rpc("check_and_increment_usage", {
    target_user_id: user.id,
    resource_type: "lead_magnets",
  });

  if (usageCheck && !usageCheck.allowed) {
    return NextResponse.json({
      error: usageCheck.reason || "已達本月名單磁鐵建立上限",
      limit: usageCheck.limit,
      current: usageCheck.current,
    }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug, description, resource_type, file_url, redirect_url, benefits, cta_text, thank_you_message, cover_image, status } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "標題和網址代稱為必填" }, { status: 400 });
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "網址代稱只能包含小寫英文、數字和連字號" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("lead_magnets")
    .insert({
      owner_id: user.id,
      title,
      slug,
      description: description || null,
      resource_type: resource_type || "pdf",
      file_url: file_url || null,
      redirect_url: redirect_url || null,
      benefits: benefits || null,
      cta_text: cta_text || "免費下載",
      thank_you_message: thank_you_message || "感謝下載！請檢查你的信箱。",
      cover_image: cover_image || null,
      status: status || "draft",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "此網址代稱已被使用" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead_magnet: data }, { status: 201 });
}
