import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getEventRegistrations } from "@/lib/supabase/events";
import RegistrationTable from "@/components/admin/RegistrationTable";

export default async function AdminRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/");

  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("title, capacity, slug").eq("id", id).single();
  if (!event) notFound();

  const { registrations, total } = await getEventRegistrations(id, 1, 200);

  const confirmed = registrations.filter((r: any) => r.status === "confirmed").length;
  const waitlisted = registrations.filter((r: any) => r.status === "waitlisted").length;
  const cancelled = registrations.filter((r: any) => r.status === "cancelled").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">報名管理</Badge>
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="mt-1 text-muted-foreground">共 {total} 筆報名紀錄</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/events">返回活動列表</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{confirmed}</p>
            <p className="text-sm text-green-600">已確認</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{waitlisted}</p>
            <p className="text-sm text-yellow-600">候補中</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{cancelled}</p>
            <p className="text-sm text-red-600">已取消</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{event.capacity || "無限"}</p>
            <p className="text-sm text-muted-foreground">總容量</p>
          </CardContent>
        </Card>
      </div>

      <RegistrationTable registrations={registrations} eventId={id} />
    </div>
  );
}
