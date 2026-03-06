import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getEventBySlug } from "@/lib/supabase/events";
import RegistrationForm from "@/components/events/RegistrationForm";
import ShareButtons from "@/components/events/ShareButtons";
import TicketTypeList from "@/components/events/TicketTypeList";
import MarkdownContent from "@/components/events/MarkdownContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw"
  ).trim();
  const eventUrl = `${baseUrl}/events/${slug}`;
  const eventImage = event.cover_image || `${baseUrl}/events/${slug}/og`;

  return {
    title: `${event.title} | 自由人學院`,
    description: event.subtitle || event.description?.slice(0, 150) || "",
    openGraph: {
      title: event.title,
      description: event.subtitle || "",
      images: [{ url: eventImage, width: 1200, height: 630 }],
      url: eventUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.subtitle || event.description?.slice(0, 150) || "",
      images: [eventImage],
    },
  };
}

const formatLabels: Record<string, string> = {
  online: "線上活動",
  offline: "實體活動",
  hybrid: "混合活動",
};

/** Convert any YouTube URL to embed format */
function toYouTubeEmbedUrl(url: string): string {
  if (!url) return url;
  if (url.includes("youtube.com/embed/")) return url;
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&\s]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/(?:youtu\.be\/)([^?\s]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || (event.status !== "published" && event.status !== "archived")) {
    notFound();
  }

  const isArchived = event.status === "archived";
  const startDate = new Date(event.starts_at);
  const endDate = event.ends_at ? new Date(event.ends_at) : null;

  const TZ = "Asia/Taipei";
  const dateStr = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: TZ,
  }).format(startDate);
  const timeFmt = new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
  const timeStr =
    timeFmt.format(startDate) +
    (endDate ? ` – ${timeFmt.format(endDate)}` : "");

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw"
  ).trim();
  const eventUrl = `${baseUrl}/events/${slug}`;

  // Google Calendar URL
  const calStart = startDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const calEnd = endDate
    ? endDate
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")
    : calStart;
  // Build calendar location: include address for venue events, online URL for online events
  const calendarLocation =
    event.format === "online"
      ? event.online_url || "線上"
      : [event.venue_name, event.venue_address].filter(Boolean).join(" ") ||
        "待通知";
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${calStart}/${calEnd}&location=${encodeURIComponent(calendarLocation)}`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.subtitle || event.description?.slice(0, 200),
    startDate: event.starts_at,
    endDate: event.ends_at || undefined,
    eventAttendanceMode:
      event.format === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : event.format === "hybrid"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location:
      event.format === "online"
        ? { "@type": "VirtualLocation", url: event.online_url || eventUrl }
        : event.format === "hybrid"
          ? [
              {
                "@type": "Place",
                name: event.venue_name || "",
                address: event.venue_address || "",
              },
              {
                "@type": "VirtualLocation",
                url: event.online_url || eventUrl,
              },
            ]
          : {
              "@type": "Place",
              name: event.venue_name || "",
              address: event.venue_address || "",
            },
    image: event.cover_image || undefined,
    organizer: event.organizer
      ? {
          "@type": "Person",
          name: event.organizer.display_name || "自由人學院",
        }
      : { "@type": "Organization", name: "自由人學院" },
    url: eventUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Archived banner */}
        {isArchived && (
          <div className="mb-6 rounded-lg bg-muted p-4 text-center">
            <p className="text-muted-foreground">
              此活動已結束，以下為歷史紀錄。
            </p>
          </div>
        )}

        {/* Hero image */}
        {event.cover_image && (
          <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <img
              src={event.cover_image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="outline">{formatLabels[event.format]}</Badge>
            {event.category && (
              <Badge variant="secondary">
                {event.category === "workshop"
                  ? "工作坊"
                  : event.category === "lecture"
                    ? "講座"
                    : event.category === "meetup"
                      ? "聚會"
                      : "研討會"}
              </Badge>
            )}
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{event.title}</h1>
          {event.subtitle && (
            <p className="mt-2 text-lg text-muted-foreground">
              {event.subtitle}
            </p>
          )}
        </div>

        {/* Info card */}
        <Card className="mb-8">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  日期時間
                </p>
                <p className="font-medium">{dateStr}</p>
                <p className="text-sm text-muted-foreground">{timeStr}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  地點
                </p>
                <p className="font-medium">
                  {event.format === "online"
                    ? "線上活動"
                    : event.venue_name || "待通知"}
                </p>
                {event.venue_address &&
                  (event.format === "offline" || event.format === "hybrid") && (
                    <p className="text-sm text-muted-foreground">
                      {event.venue_address}
                    </p>
                  )}
                {(event.format === "online" || event.format === "hybrid") && (
                  <p className="text-sm text-muted-foreground">
                    報名後將透過確認信提供線上會議連結
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {event.organizer && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    主辦人
                  </p>
                  <p className="font-medium">{event.organizer.display_name}</p>
                </div>
              )}
              <div className="flex gap-3">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  加入 Google 日曆
                </a>
              </div>
              <ShareButtons url={eventUrl} title={event.title} />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {event.description && (
          <div className="mb-8">
            <MarkdownContent content={event.description} />
          </div>
        )}

        {/* YouTube embed */}
        {event.youtube_embed && (
          <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl">
            <iframe
              src={toYouTubeEmbedUrl(event.youtube_embed)}
              className="h-full w-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Ticket types */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">票種</h2>
          <TicketTypeList ticketTypes={event.ticket_types} />
        </div>

        {/* Registration form */}
        {!isArchived && (
          <div className="mb-8" id="register">
            <h2 className="mb-4 text-xl font-bold">報名</h2>
            <RegistrationForm
              eventId={event.id}
              ticketTypes={event.ticket_types}
              registrationEndsAt={event.registration_ends_at}
            />
          </div>
        )}

        {/* Event updates */}
        {event.updates.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">活動公告</h2>
            <div className="space-y-3">
              {event.updates.map((update) => (
                <Card key={update.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{update.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("zh-TW", {
                          timeZone: TZ,
                        }).format(new Date(update.created_at))}
                      </span>
                    </div>
                    {update.content && (
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                        {update.content}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
