import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";

const SOLO_STAGE_LABELS: Record<string, { name: string; color: string }> = {
  setup: { name: "Set up", color: "bg-amber-100 text-amber-800" },
  operate: { name: "Operate", color: "bg-blue-100 text-blue-800" },
  leverage: { name: "Leverage", color: "bg-violet-100 text-violet-800" },
  outgrow: { name: "Outgrow", color: "bg-emerald-100 text-emerald-800" },
};

async function getProfile(username: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, level, exp, solo_stage, membership_tier, created_at")
    .eq("username", username)
    .single();
  return data;
}

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    return { title: "找不到使用者 — solo.tw" };
  }

  const displayName = profile.display_name || `@${profile.username}`;
  const description = profile.bio || `${displayName} 的一人事業主頁`;

  return {
    title: `${displayName} (@${profile.username}) — solo.tw`,
    description,
    openGraph: {
      title: `${displayName} — solo.tw`,
      description,
      url: `https://solo.tw/@${profile.username}`,
      type: "profile",
      images: [`/u/${profile.username}/og`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} — solo.tw`,
      description,
      images: [`/u/${profile.username}/og`],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  const displayName = profile.display_name || `@${profile.username}`;
  const stage = SOLO_STAGE_LABELS[profile.solo_stage] || SOLO_STAGE_LABELS.setup;
  const memberSince = new Date(profile.created_at).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-[70vh] bg-stone-50">
      {/* Profile Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="h-28 w-28 overflow-hidden rounded-full bg-stone-200 ring-4 ring-white shadow-lg sm:h-32 sm:w-32">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-stone-500 sm:text-5xl">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Name & Username */}
            <h1 className="mt-5 text-2xl font-bold text-stone-900 sm:text-3xl">
              {displayName}
            </h1>
            <p className="mt-1 text-base text-stone-500">@{profile.username}</p>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 max-w-lg text-base leading-relaxed text-stone-600">
                {profile.bio}
              </p>
            )}

            {/* Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {/* SOLO Stage */}
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${stage.color}`}>
                {stage.name}
              </span>

              {/* Level */}
              <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700">
                Lv.{profile.level}
              </span>

              {/* Membership */}
              {profile.membership_tier !== "free" && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {profile.membership_tier === "pro" ? "Pro" : "Premium"}
                </span>
              )}
            </div>

            {/* Member Since */}
            <p className="mt-4 text-sm text-stone-400">
              {memberSince} 加入 solo.tw
            </p>
          </div>
        </div>
      </div>

      {/* Content Area — Placeholder for future: achievements, events, etc. */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-8 text-center">
          <div className="text-4xl">🚀</div>
          <h2 className="mt-3 text-lg font-semibold text-stone-700">
            一人事業旅程進行中
          </h2>
          <p className="mt-2 text-base text-stone-500">
            {displayName} 正在打造自己的一人事業。更多內容即將推出！
          </p>
          <Link
            href="/diagnose"
            className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            你也想開始嗎？免費事業健檢
          </Link>
        </div>
      </div>
    </div>
  );
}
