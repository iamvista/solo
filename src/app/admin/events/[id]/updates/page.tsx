import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import EventUpdateForm from "@/components/admin/EventUpdateForm";
import EventUpdateHistory from "@/components/admin/EventUpdateHistory";

export default async function AdminUpdatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/");

  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select(
      "title, slug, starts_at, ends_at, format, venue_name, venue_address, online_url",
    )
    .eq("id", id)
    .single();
  if (!event) notFound();

  const { data: updates } = await supabase
    .from("event_updates")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">
            活動公告
          </Badge>
          <h1 className="text-2xl font-bold">{event.title}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/events">返回活動列表</Link>
        </Button>
      </div>

      <EventUpdateForm eventId={id} event={event} />

      {/* History */}
      {updates && updates.length > 0 && (
        <EventUpdateHistory eventId={id} updates={updates} />
      )}
    </div>
  );
}
