import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

// GET: Get single event owned by user
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!event) return NextResponse.json({ error: "找不到活動" }, { status: 404 });

  // Get ticket types
  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("event_id", id)
    .order("sort_order");

  return NextResponse.json({ event, ticketTypes: ticketTypes || [] });
}

// PUT: Update own event
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  // Verify ownership
  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!existing) return NextResponse.json({ error: "找不到活動" }, { status: 404 });

  const body = await request.json();
  const { ticketTypes, ...eventData } = body;

  // Don't allow changing owner
  delete eventData.owner_id;
  delete eventData.is_platform_event;

  const { data: event, error } = await supabase
    .from("events")
    .update({ ...eventData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "更新失敗：" + error.message }, { status: 500 });
  }

  // Upsert ticket types
  if (ticketTypes) {
    const { data: existingTickets } = await supabase
      .from("ticket_types")
      .select("id")
      .eq("event_id", id);

    const existingIds = new Set((existingTickets || []).map((t) => t.id));
    const incomingIds = new Set(ticketTypes.filter((t: { id?: string }) => t.id).map((t: { id: string }) => t.id));

    // Delete removed
    const toDelete = [...existingIds].filter((tid) => !incomingIds.has(tid));
    if (toDelete.length > 0) {
      await supabase.from("ticket_types").delete().in("id", toDelete);
    }

    // Upsert
    for (let i = 0; i < ticketTypes.length; i++) {
      const t = ticketTypes[i];
      if (t.id && existingIds.has(t.id)) {
        await supabase.from("ticket_types").update({
          name: t.name, description: t.description, capacity: t.capacity,
          price: t.price, sort_order: i, is_active: t.is_active ?? true,
        }).eq("id", t.id);
      } else {
        await supabase.from("ticket_types").insert({
          event_id: id, name: t.name || "一般票", description: t.description || null,
          capacity: t.capacity || 50, price: t.price || 0, sort_order: i, is_active: true,
        });
      }
    }
  }

  return NextResponse.json({ event });
}

// DELETE: Delete own draft event
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)
    .eq("status", "draft");

  if (error) {
    return NextResponse.json({ error: "只能刪除草稿狀態的活動" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
