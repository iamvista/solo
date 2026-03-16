import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

// GET: Get email template for an event
export async function GET(_request: NextRequest, { params }: Params) {
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

  const { data: template } = await supabase
    .from("email_templates")
    .select("*")
    .eq("event_id", id)
    .single();

  return NextResponse.json({ template: template || null, event });
}

// PUT: Create or update email template
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  // Verify ownership + membership
  const [{ data: event }, { data: profile }] = await Promise.all([
    supabase.from("events").select("id").eq("id", id).eq("owner_id", user.id).single(),
    supabase.from("profiles").select("membership_tier").eq("id", user.id).single(),
  ]);

  if (!event) return NextResponse.json({ error: "找不到活動" }, { status: 404 });

  const body = await request.json();
  const tier = profile?.membership_tier || "free";

  const templateData: Record<string, unknown> = {
    event_id: id,
    owner_id: user.id,
    confirmed_subject: body.confirmed_subject?.trim() || null,
    confirmed_body: body.confirmed_body?.trim() || null,
    waitlisted_subject: body.waitlisted_subject?.trim() || null,
    waitlisted_body: body.waitlisted_body?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  // Only Premium can set custom sender name
  if (tier === "premium") {
    templateData.sender_name = body.sender_name?.trim() || null;
  }

  const { data: template, error } = await supabase
    .from("email_templates")
    .upsert(templateData, { onConflict: "event_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
  }

  return NextResponse.json({ template });
}
