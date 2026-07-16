"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export interface RewardCard {
  id: string;
  kind: "video" | "file" | "link" | "text";
  title: string;
  description: string | null;
  /**
   * kind="text" only. Passed straight from the server, which has already
   * verified this student submitted — the other kinds fetch a URL on demand,
   * but a passage that already sits in the database has nothing to fetch.
   * Null for every other kind, so a locked passage never reaches the page.
   */
  body: string | null;
}

/**
 * Rendered as plain text, never as markup. React escapes it, so a teacher
 * pasting <b>bold</b> gets those characters shown literally rather than a
 * bold word — which is exactly why this does not parse markdown.
 */
function TextReward({ reward }: { reward: RewardCard }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
      {reward.body}
    </p>
  );
}

/** Turn a watch URL into an embeddable one. Returns null when we cannot tell. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

async function fetchRewardUrl(id: string): Promise<string> {
  const res = await fetch(`/api/rewards/${id}/access`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "無法取得這項資源");
  }
  const { url } = await res.json();
  return url;
}

function VideoReward({ reward }: { reward: RewardCard }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRewardUrl(reward.id)
      .then((u) => {
        if (!cancelled) setUrl(u);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [reward.id]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!url) return <p className="text-sm text-slate-500">載入中……</p>;

  const embed = toEmbedUrl(url);
  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline"
      >
        開啟回放
      </a>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-md bg-black">
      <iframe
        src={embed}
        title={reward.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

function ActionReward({ reward }: { reward: RewardCard }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      // Fetched on click, never cached: a handout's signed URL expires in
      // minutes, so a URL held from page load would already be dead.
      const url = await fetchRewardUrl(reward.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "無法取得這項資源");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={busy} variant="outline">
        {busy ? "準備中……" : reward.kind === "file" ? "下載" : "前往預約"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function RewardsSection({ rewards }: { rewards: RewardCard[] }) {
  if (rewards.length === 0) return null;

  return (
    <section className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50/50 p-6">
      <h2 className="text-lg font-semibold text-slate-900">給你的資源</h2>
      <p className="mt-1 text-sm text-slate-600">
        你已經交了這份作業，以下都解鎖了。
      </p>

      <ul className="mt-5 space-y-6">
        {rewards.map((reward) => (
          <li key={reward.id}>
            <h3 className="text-sm font-semibold text-slate-900">
              {reward.title}
            </h3>
            {reward.description && (
              <p className="mt-1 mb-3 text-sm text-slate-600">
                {reward.description}
              </p>
            )}
            <div className="mt-2">
              {reward.kind === "text" ? (
                <TextReward reward={reward} />
              ) : reward.kind === "video" ? (
                <VideoReward reward={reward} />
              ) : (
                <ActionReward reward={reward} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
