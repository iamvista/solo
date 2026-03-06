import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { createEvent, upsertTicketTypes } from "@/lib/supabase/events";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ticket_types, ...eventData } = body;

    const event = await createEvent(eventData);
    if (!event) {
      return NextResponse.json({ error: "活動建立失敗" }, { status: 500 });
    }

    // Create ticket types if provided
    if (ticket_types && ticket_types.length > 0) {
      await upsertTicketTypes(event.id, ticket_types);
    }

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error("Create event error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
