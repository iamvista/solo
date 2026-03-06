import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { createServiceClient } from "@/lib/supabase/service";

// ONE-TIME restore route — delete after use
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // 1. Find the event
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("id, slug")
    .eq("slug", "vibe-coding-brain-game")
    .single();

  if (eventErr || !event) {
    return NextResponse.json(
      { error: "Event not found", detail: eventErr },
      { status: 404 },
    );
  }

  // 2. Find ticket type for this event
  const { data: ticketTypes, error: ttErr } = await supabase
    .from("ticket_types")
    .select("id, name")
    .eq("event_id", event.id)
    .order("sort_order")
    .limit(1);

  if (ttErr || !ticketTypes || ticketTypes.length === 0) {
    return NextResponse.json(
      { error: "No ticket types found", detail: ttErr },
      { status: 404 },
    );
  }

  const ticketTypeId = ticketTypes[0].id;

  // 3. Registrations to restore (from Resend email logs)
  const emails = [
    "paggychiu@gmail.com",
    "awilliamhsu@yahoo.com.tw",
    "pon12836@gmail.com",
    "werboy@gmail.com",
    "rx1781025@gmail.com",
    "thelingso@gmail.com",
    "zeus.unikorn@gmail.com",
    "huijiaho@gmail.com",
  ];

  // 4. Check for duplicates — skip emails already registered
  const { data: existing } = await supabase
    .from("registrations")
    .select("email")
    .eq("event_id", event.id)
    .in("email", emails);

  const existingEmails = new Set((existing || []).map((r) => r.email));
  const toInsert = emails.filter((email) => !existingEmails.has(email));

  if (toInsert.length === 0) {
    return NextResponse.json({
      message: "All registrations already exist",
      skipped: emails.length,
    });
  }

  // 5. Insert registrations
  const registrations = toInsert.map((email) => ({
    event_id: event.id,
    ticket_type_id: ticketTypeId,
    name: email.split("@")[0], // placeholder — update later from Resend details
    email,
    status: "confirmed" as const,
    note: "從 Resend 記錄中復原的報名資料",
  }));

  const { data: inserted, error: insertErr } = await supabase
    .from("registrations")
    .insert(registrations)
    .select("id, name, email");

  if (insertErr) {
    return NextResponse.json(
      { error: "Insert failed", detail: insertErr },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    restored: inserted?.length || 0,
    skipped: emails.length - toInsert.length,
    registrations: inserted,
    ticketType: ticketTypes[0].name,
  });
}
