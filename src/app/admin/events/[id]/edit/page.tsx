import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import EventForm from "@/components/admin/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/");

  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();
  if (!event) notFound();

  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("event_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Badge variant="outline" className="mb-2">編輯活動</Badge>
      <h1 className="mb-8 text-2xl font-bold">編輯：{event.title}</h1>
      <EventForm mode="edit" event={{ ...event, ticket_types: ticketTypes || [] }} />
    </div>
  );
}
