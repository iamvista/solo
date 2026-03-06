import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EventWithCounts } from "@/lib/supabase/types";

const formatLabels: Record<string, string> = {
  online: "線上",
  offline: "實體",
  hybrid: "混合",
};

const categoryLabels: Record<string, string> = {
  workshop: "工作坊",
  lecture: "講座",
  meetup: "聚會",
  conference: "研討會",
};

export default function EventCard({ event }: { event: EventWithCounts }) {
  const startDate = new Date(event.starts_at);
  const isEnded = event.status === "archived";
  const TZ = "Asia/Taipei";
  const dateStr = new Intl.DateTimeFormat("zh-TW", {
    month: "long",
    day: "numeric",
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
      className={`overflow-hidden transition-shadow hover:shadow-lg ${isEnded ? "opacity-70" : ""}`}
    >
      {event.cover_image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={event.cover_image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {formatLabels[event.format] || event.format}
          </Badge>
          {event.category && (
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[event.category] || event.category}
            </Badge>
          )}
          {event.is_featured && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              推薦
            </Badge>
          )}
          {isEnded && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              已結束
            </Badge>
          )}
        </div>

        <h3 className="mb-2 text-lg font-bold leading-tight">
          <Link href={`/events/${event.slug}`} className="hover:underline">
            {event.title}
          </Link>
        </h3>

        {event.subtitle && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {event.subtitle}
          </p>
        )}

        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p>
            {dateStr} {timeStr}
          </p>
          <p>
            {event.format === "online"
              ? "線上活動"
              : event.venue_name || "待通知"}
          </p>
          <p>{event.registration_count} 人已報名</p>
        </div>

        {!isEnded ? (
          <Button asChild className="w-full">
            <Link href={`/events/${event.slug}`}>立即報名</Link>
          </Button>
        ) : (
          <Button variant="outline" asChild className="w-full">
            <Link href={`/events/${event.slug}`}>查看活動</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
