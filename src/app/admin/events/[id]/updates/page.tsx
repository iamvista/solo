import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import EventUpdateForm from "@/components/admin/EventUpdateForm";

export default async function AdminUpdatesPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/");

  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("title, slug").eq("id", id).single();
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
          <Badge variant="outline" className="mb-2">活動公告</Badge>
          <h1 className="text-2xl font-bold">{event.title}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/events">返回活動列表</Link>
        </Button>
      </div>

      <EventUpdateForm eventId={id} />

      {/* History */}
      {updates && updates.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold">歷史公告</h2>
          <div className="space-y-3">
            {updates.map((update: any) => (
              <Card key={update.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{update.title}</h3>
                      {update.content && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{update.content}</p>}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{new Date(update.created_at).toLocaleString("zh-TW")}</p>
                      {update.sent_at && <Badge variant="outline" className="mt-1">已寄出</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
