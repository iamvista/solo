import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// GET: List user's own events
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (!events) return NextResponse.json({ events: [] });

  // Get registration counts
  const serviceClient = createServiceClient();
  const eventIds = events.map((e) => e.id);
  const { data: regs } = await serviceClient
    .from("registrations")
    .select("event_id, status")
    .in("event_id", eventIds)
    .neq("status", "cancelled");

  const countMap: Record<string, { confirmed: number; waitlisted: number }> = {};
  regs?.forEach((r) => {
    if (!countMap[r.event_id]) countMap[r.event_id] = { confirmed: 0, waitlisted: 0 };
    if (r.status === "confirmed") countMap[r.event_id].confirmed++;
    if (r.status === "waitlisted") countMap[r.event_id].waitlisted++;
  });

  const enriched = events.map((e) => ({
    ...e,
    confirmed_count: countMap[e.id]?.confirmed || 0,
    waitlisted_count: countMap[e.id]?.waitlisted || 0,
  }));

  return NextResponse.json({ events: enriched });
}

// POST: Create a new event (with usage limit check)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "未登入" }, { status: 401 });

  // Check usage limits
  const serviceClient = createServiceClient();
  const { data: limitResult } = await serviceClient.rpc("check_and_increment_usage", {
    target_user_id: user.id,
    resource_type: "events",
  });

  if (!limitResult?.allowed) {
    const reason = limitResult?.reason;
    if (reason === "free_tier") {
      return NextResponse.json({ error: "免費方案無法建立活動，請升級至 Pro 方案", upgrade: true }, { status: 403 });
    }
    if (reason === "limit_reached") {
      return NextResponse.json({
        error: `本月已達活動上限（${limitResult.limit} 場），請升級至 Premium 方案或下月再試`,
        upgrade: true,
        limit: limitResult.limit,
        current: limitResult.current,
      }, { status: 403 });
    }
    return NextResponse.json({ error: "無法建立活動" }, { status: 403 });
  }

  const body = await request.json();
  const { ticketTypes, ...eventData } = body;

  // Set owner
  eventData.owner_id = user.id;
  eventData.organizer_id = user.id;
  eventData.is_platform_event = false;

  const { data: event, error } = await supabase
    .from("events")
    .insert(eventData)
    .select()
    .single();

  if (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "建立活動失敗：" + error.message }, { status: 500 });
  }

  // Create ticket types
  if (ticketTypes && ticketTypes.length > 0) {
    const tickets = ticketTypes.map((t: Record<string, unknown>, i: number) => ({
      event_id: event.id,
      name: t.name || "一般票",
      description: t.description || null,
      capacity: t.capacity || 50,
      price: t.price || 0,
      sort_order: i,
      is_active: true,
    }));

    const { error: ticketError } = await supabase.from("ticket_types").insert(tickets);
    if (ticketError) {
      console.error("Create ticket types error:", ticketError);
    }
  }

  return NextResponse.json({ event }, { status: 201 });
}
