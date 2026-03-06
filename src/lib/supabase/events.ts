import { createClient } from "./server";
import { createServiceClient } from "./service";
import type {
  Event,
  EventInsert,
  EventUpdateData,
  EventWithCounts,
  EventDetail,
  TicketType,
  TicketTypeInsert,
  TicketTypeWithCount,
  Registration,
  RegistrationInsert,
  RegistrationStatus,
  EventUpdate,
  EventUpdateInsert,
} from "./types";

// ─── Public Queries ───

export async function getPublishedEvents(): Promise<EventWithCounts[]> {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .in("status", ["published", "archived"])
    .order("starts_at", { ascending: true });

  if (!events || events.length === 0) return [];

  // Get registration counts per event
  const eventIds = events.map((e) => e.id);
  const { data: regCounts } = await supabase
    .from("registrations")
    .select("event_id, status")
    .in("event_id", eventIds)
    .neq("status", "cancelled");

  const countMap: Record<
    string,
    { total: number; confirmed: number; waitlisted: number }
  > = {};
  regCounts?.forEach((r) => {
    if (!countMap[r.event_id])
      countMap[r.event_id] = { total: 0, confirmed: 0, waitlisted: 0 };
    countMap[r.event_id].total++;
    if (r.status === "confirmed") countMap[r.event_id].confirmed++;
    if (r.status === "waitlisted") countMap[r.event_id].waitlisted++;
  });

  return events.map((e) => ({
    ...e,
    registration_count: countMap[e.id]?.total || 0,
    confirmed_count: countMap[e.id]?.confirmed || 0,
    waitlisted_count: countMap[e.id]?.waitlisted || 0,
  }));
}

export async function getEventBySlug(
  slug: string,
): Promise<EventDetail | null> {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return null;

  // Get ticket types with counts
  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("event_id", event.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: regs } = await supabase
    .from("registrations")
    .select("ticket_type_id, status")
    .eq("event_id", event.id)
    .neq("status", "cancelled");

  const ticketCounts: Record<
    string,
    { confirmed: number; waitlisted: number }
  > = {};
  regs?.forEach((r) => {
    if (!ticketCounts[r.ticket_type_id])
      ticketCounts[r.ticket_type_id] = { confirmed: 0, waitlisted: 0 };
    if (r.status === "confirmed") ticketCounts[r.ticket_type_id].confirmed++;
    if (r.status === "waitlisted") ticketCounts[r.ticket_type_id].waitlisted++;
  });

  const ticketTypesWithCounts: TicketTypeWithCount[] = (ticketTypes || []).map(
    (t) => ({
      ...t,
      confirmed_count: ticketCounts[t.id]?.confirmed || 0,
      waitlisted_count: ticketCounts[t.id]?.waitlisted || 0,
    }),
  );

  // Get updates
  const { data: updates } = await supabase
    .from("event_updates")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  // Get organizer profile
  let organizer = null;
  if (event.organizer_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", event.organizer_id)
      .single();
    organizer = profile;
  }

  return {
    ...event,
    ticket_types: ticketTypesWithCounts,
    updates: updates || [],
    organizer,
  };
}

// ─── Registration ───

export async function registerForEvent(
  data: RegistrationInsert,
): Promise<{ registration: Registration | null; error: string | null }> {
  // Use service role client to bypass RLS — registration is a public action
  const supabase = createServiceClient();

  // Check if ticket type has capacity
  const { data: ticketType } = await supabase
    .from("ticket_types")
    .select("capacity")
    .eq("id", data.ticket_type_id)
    .single();

  if (!ticketType) return { registration: null, error: "票種不存在" };

  // Count existing confirmed registrations for this ticket type
  const { count } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("ticket_type_id", data.ticket_type_id)
    .eq("status", "confirmed");

  // Check if duplicate email for same event
  const { count: existingCount } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", data.event_id)
    .eq("email", data.email)
    .neq("status", "cancelled");

  if (existingCount && existingCount > 0) {
    return { registration: null, error: "此 Email 已報名此活動" };
  }

  // Determine status based on capacity
  const confirmedCount = count || 0;
  const status: RegistrationStatus =
    ticketType.capacity > 0 && confirmedCount >= ticketType.capacity
      ? "waitlisted"
      : "confirmed";

  const { data: registration, error } = await supabase
    .from("registrations")
    .insert({ ...data, status })
    .select()
    .single();

  if (error) return { registration: null, error: error.message };

  return { registration, error: null };
}

export async function cancelRegistration(
  registrationId: string,
  userId: string,
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "cancelled" as RegistrationStatus })
    .eq("id", registrationId)
    .eq("user_id", userId);

  return !error;
}

export async function getUserRegistrations(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("registrations")
    .select(
      `
      *,
      events:event_id (id, slug, title, starts_at, ends_at, format, venue_name, venue_address, online_url, cover_image, status),
      ticket_types:ticket_type_id (name)
    `,
    )
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  return data || [];
}

// ─── Admin Queries ───

export async function getAdminEventList(page: number = 1, limit: number = 20) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data: events, count } = await supabase
    .from("events")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (!events) return { events: [], total: 0, page, limit, totalPages: 0 };

  // Get registration counts
  const eventIds = events.map((e) => e.id);
  const { data: regCounts } = await supabase
    .from("registrations")
    .select("event_id, status")
    .in("event_id", eventIds)
    .neq("status", "cancelled");

  const countMap: Record<string, { confirmed: number; waitlisted: number }> =
    {};
  regCounts?.forEach((r) => {
    if (!countMap[r.event_id])
      countMap[r.event_id] = { confirmed: 0, waitlisted: 0 };
    if (r.status === "confirmed") countMap[r.event_id].confirmed++;
    if (r.status === "waitlisted") countMap[r.event_id].waitlisted++;
  });

  const enriched = events.map((e) => ({
    ...e,
    confirmed_count: countMap[e.id]?.confirmed || 0,
    waitlisted_count: countMap[e.id]?.waitlisted || 0,
    registration_count:
      (countMap[e.id]?.confirmed || 0) + (countMap[e.id]?.waitlisted || 0),
  }));

  return {
    events: enriched,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function createEvent(data: EventInsert): Promise<Event | null> {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .insert(data)
    .select()
    .single();
  if (error) {
    console.error("createEvent error:", error);
    return null;
  }
  return event;
}

export async function updateEvent(
  id: string,
  data: EventUpdateData,
): Promise<Event | null> {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("updateEvent error:", error);
    return null;
  }
  return event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  return !error;
}

export async function upsertTicketTypes(
  eventId: string,
  ticketTypes: Omit<TicketTypeInsert, "event_id">[],
): Promise<boolean> {
  const supabase = await createClient();

  // Delete existing ticket types for this event
  await supabase.from("ticket_types").delete().eq("event_id", eventId);

  // Insert new ones
  const inserts = ticketTypes.map((t, i) => ({
    ...t,
    event_id: eventId,
    sort_order: i,
  }));

  const { error } = await supabase.from("ticket_types").insert(inserts);
  return !error;
}

export async function getEventRegistrations(
  eventId: string,
  page: number = 1,
  limit: number = 50,
) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data, count } = await supabase
    .from("registrations")
    .select(
      `
      *,
      ticket_types:ticket_type_id (name)
    `,
      { count: "exact" },
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    registrations: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus,
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("registrations")
    .update({ status })
    .eq("id", registrationId);
  return !error;
}

export async function deleteRegistrations(
  registrationIds: string[],
): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registrations")
    .delete()
    .in("id", registrationIds)
    .select("id");
  if (error) {
    console.error("Delete registrations error:", error);
    return 0;
  }
  return data?.length || 0;
}

export async function createEventUpdate(
  data: EventUpdateInsert,
): Promise<EventUpdate | null> {
  const supabase = await createClient();
  const { data: update, error } = await supabase
    .from("event_updates")
    .insert(data)
    .select()
    .single();
  if (error) return null;
  return update;
}

// ─── Event Stats for Admin Dashboard ───

export async function getEventStats() {
  const supabase = await createClient();

  const { count: activeEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: totalRegistrations } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("status", "confirmed");

  // This month events
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .gte("starts_at", startOfMonth.toISOString())
    .in("status", ["published", "archived"]);

  // Most popular event
  const { data: topEvent } = await supabase
    .from("events")
    .select("id, title, slug")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let topEventCount = 0;
  if (topEvent) {
    const { count } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", topEvent.id)
      .eq("status", "confirmed");
    topEventCount = count || 0;
  }

  return {
    activeEvents: activeEvents || 0,
    totalRegistrations: totalRegistrations || 0,
    monthlyEvents: monthlyEvents || 0,
    topEvent: topEvent ? { ...topEvent, count: topEventCount } : null,
  };
}
