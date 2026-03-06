import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { updateEvent, deleteEvent, upsertTicketTypes } from "@/lib/supabase/events";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { ticket_types, ...eventData } = body;

    const event = await updateEvent(id, eventData);
    if (!event) {
      return NextResponse.json({ error: "活動更新失敗" }, { status: 500 });
    }

    if (ticket_types) {
      await upsertTicketTypes(id, ticket_types);
    }

    return NextResponse.json({ success: true, event });
  } catch (err) {
    console.error("Update event error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await deleteEvent(id);
    if (!success) {
      return NextResponse.json({ error: "活動刪除失敗" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete event error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
