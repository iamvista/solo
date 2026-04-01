import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 60; // ISR: 1 minute

export const metadata: Metadata = {
  title: "社群動態 | solo.tw",
  description: "看看 solo.tw 社群裡的一人事業家們都在做什麼",
  alternates: { canonical: "https://www.solo.tw/community" },
  openGraph: {
    title: "社群動態 | solo.tw",
    description: "看看 solo.tw 社群裡的一人事業家們都在做什麼",
  },
};

const ACTION_CONFIG: Record<string, { icon: string; template: (m: Record<string, unknown>) => string }> = {
  joined: {
    icon: "👋",
    template: () => "加入了 solo.tw 社群",
  },
  set_username: {
    icon: "🏷️",
    template: (m) => `設定了個人代稱 @${m.username || ""}`,
  },
  completed_diagnosis: {
    icon: "📊",
    template: (m) => `完成了${m.diagnosis_type === "full" ? "深度" : "快速"}事業健檢`,
  },
  registered_event: {
    icon: "🎪",
    template: (m) => `報名了「${m.event_title || "活動"}」`,
  },
  created_event: {
    icon: "🎯",
    template: (m) => `建立了活動「${m.event_title || ""}」`,
  },
  created_lead_magnet: {
    icon: "🧲",
    template: (m) => `發布了免費資源「${m.title || ""}」`,
  },
  leveled_up: {
    icon: "⬆️",
    template: (m) => `升到了 Lv.${m.level || "?"}`,
  },
  stage_advanced: {
    icon: "🚀",
    template: (m) => {
      const stageNames: Record<string, string> = {
        setup: "Set up",
        operate: "Operate",
        leverage: "Leverage",
        outgrow: "Outgrow",
      };
      return `進入了 SOLO ${stageNames[m.stage as string] || m.stage} 階段`;
    },
  },
};

function getEntityLink(item: { action_type: string; entity_type: string | null; entity_id: string | null; metadata: Record<string, unknown> }): string | null {
  if (item.action_type === "registered_event" && item.metadata.event_slug) {
    return `/events/${item.metadata.event_slug}`;
  }
  if (item.action_type === "set_username" && item.metadata.username) {
    return `/@${item.metadata.username}`;
  }
  return null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "剛剛";
  if (mins < 60) return `${mins} 分鐘前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小時前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  return new Date(dateStr).toLocaleDateString("zh-TW");
}

export default async function CommunityPage() {
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from("activity_feed")
    .select(`
      id, user_id, action_type, entity_type, entity_id, metadata, created_at,
      profiles:user_id (display_name, avatar_url, username)
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(50);

  const feed = activities || [];

  // Stats
  const { count: memberCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { count: eventCount } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            社群動態
          </h1>
          <p className="mt-3 text-stone-600">
            看看 solo.tw 社群裡的一人事業家們都在做什麼
          </p>
          {/* Stats bar */}
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900">{memberCount || 0}</p>
              <p className="text-xs text-stone-500">成員</p>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900">{eventCount || 0}</p>
              <p className="text-xs text-stone-500">進行中活動</p>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900">{feed.length}</p>
              <p className="text-xs text-stone-500">近期動態</p>
            </div>
          </div>
        </div>

        {/* Feed */}
        {feed.length > 0 ? (
          <div className="space-y-3">
            {feed.map((item) => {
              const config = ACTION_CONFIG[item.action_type];
              if (!config) return null;

              const profile = item.profiles as unknown as { display_name: string | null; avatar_url: string | null; username: string | null } | null;
              const displayName = profile?.display_name || (item.metadata?.name as string) || "匿名成員";
              const username = profile?.username;
              const avatarUrl = profile?.avatar_url;
              const actionText = config.template(item.metadata as Record<string, unknown>);
              const link = getEntityLink(item);

              return (
                <Card key={item.id} className="border-0 shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-3 p-4">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-lg">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        config.icon
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-stone-800">
                        {username ? (
                          <Link
                            href={`/@${username}`}
                            className="font-semibold text-stone-900 hover:underline"
                          >
                            {displayName}
                          </Link>
                        ) : (
                          <span className="font-semibold text-stone-900">{displayName}</span>
                        )}
                        {" "}
                        {link ? (
                          <Link href={link} className="hover:text-stone-600 hover:underline">
                            {actionText}
                          </Link>
                        ) : (
                          actionText
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {timeAgo(item.created_at)}
                      </p>
                    </div>

                    {/* Action icon */}
                    <span className="shrink-0 text-lg">{config.icon}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="text-5xl">🌱</div>
              <h2 className="mt-4 text-lg font-semibold text-stone-900">社群正在萌芽中</h2>
              <p className="mt-2 text-sm text-stone-500">
                成為第一批加入的一人事業家！
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
