import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import { getAdminEventList } from "@/lib/supabase/events";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  draft: { label: "草稿", variant: "secondary" },
  published: { label: "已發布", variant: "default" },
  cancelled: { label: "已取消", variant: "destructive" },
  archived: { label: "已結束", variant: "outline" },
};

const formatConfig: Record<string, string> = {
  online: "線上",
  offline: "實體",
  hybrid: "混合",
};

export default async function AdminEventsPage() {
  const adminAccess = await isAdmin();
  if (!adminAccess) redirect("/");

  const { events, total } = await getAdminEventList();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">
            活動管理
          </Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">活動列表</h1>
          <p className="mt-1 text-muted-foreground">共 {total} 個活動</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin">返回後臺</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/events/new">+ 新增活動</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              尚未建立任何活動
            </CardContent>
          </Card>
        ) : (
          events.map((event: any) => {
            const status = statusConfig[event.status] || statusConfig.draft;
            const startDate = new Date(event.starts_at);
            const TZ = "Asia/Taipei";
            const dateStr = new Intl.DateTimeFormat("zh-TW", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              weekday: "short",
              timeZone: TZ,
            }).format(startDate);
            const timeStr = new Intl.DateTimeFormat("zh-TW", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: TZ,
            }).format(startDate);

            return (
              <Card
                key={event.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatConfig[event.format] || event.format}
                        </span>
                        {event.is_featured && (
                          <Badge
                            variant="outline"
                            className="border-yellow-400 bg-yellow-50 text-yellow-700"
                          >
                            推薦
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="hover:underline"
                        >
                          {event.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          編輯
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/registrations`}>
                          報名
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/updates`}>
                          公告
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>
                      {dateStr} {timeStr}
                    </span>
                    {event.venue_name && <span>{event.venue_name}</span>}
                    <span>已確認 {event.confirmed_count || 0}</span>
                    <span>候補 {event.waitlisted_count || 0}</span>
                    {event.capacity > 0 && <span>容量 {event.capacity}</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
