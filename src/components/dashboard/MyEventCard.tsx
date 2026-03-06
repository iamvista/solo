"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RegistrationWithEvent {
  id: string;
  status: string;
  events: {
    id: string;
    slug: string;
    title: string;
    starts_at: string;
    ends_at: string | null;
    format: string;
    venue_name: string | null;
    online_url: string | null;
    cover_image: string | null;
    status: string;
  } | null;
  ticket_types: {
    name: string;
  } | null;
}

const formatLabels: Record<string, string> = {
  online: "線上",
  offline: "實體",
  hybrid: "混合",
};

function getCountdownText(startsAt: string): string {
  const now = new Date();
  const start = new Date(startsAt);
  const diffMs = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "今天";
  if (diffDays === 1) return "明天";
  return `${diffDays} 天後`;
}

export default function MyEventCard({
  registration,
  isUpcoming,
}: {
  registration: RegistrationWithEvent;
  isUpcoming: boolean;
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const event = registration.events;
  if (!event) return null;

  const startDate = new Date(event.starts_at);
  const dateStr = startDate.toLocaleDateString("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeStr = startDate.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleCancel() {
    if (!confirm("確定要取消報名嗎？")) return;

    setCancelling(true);
    try {
      const res = await fetch("/api/events/register", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.id }),
      });

      if (res.ok) {
        setCancelled(true);
        // Refresh server data after a short delay
        setTimeout(() => router.refresh(), 1500);
      } else {
        const data = await res.json();
        alert(data.error || "取消失敗，請稍後再試");
      }
    } catch {
      alert("網路錯誤，請稍後再試");
    } finally {
      setCancelling(false);
    }
  }

  if (cancelled) {
    return (
      <Card className="overflow-hidden border-dashed opacity-60">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <svg className="mx-auto mb-2 h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="font-medium text-green-600">已取消報名</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-lg ${!isUpcoming ? "opacity-70" : ""}`}>
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
        {/* Badges row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {formatLabels[event.format] || event.format}
          </Badge>
          {registration.status === "confirmed" && (
            <Badge className="bg-green-100 text-green-800 text-xs">
              已確認
            </Badge>
          )}
          {registration.status === "waitlisted" && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              候補中
            </Badge>
          )}
          {isUpcoming && (
            <Badge variant="secondary" className="text-xs">
              {getCountdownText(event.starts_at)}
            </Badge>
          )}
          {!isUpcoming && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              已結束
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold leading-tight">
          <Link href={`/events/${event.slug}`} className="hover:underline">
            {event.title}
          </Link>
        </h3>

        {/* Event info */}
        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p>{dateStr} {timeStr}</p>
          <p>
            {event.format === "online"
              ? "線上活動"
              : event.venue_name || "待通知"}
          </p>
          {registration.ticket_types?.name && (
            <p>票種：{registration.ticket_types.name}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/events/${event.slug}`}>查看活動</Link>
          </Button>
          {isUpcoming && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "取消中..." : "取消報名"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
