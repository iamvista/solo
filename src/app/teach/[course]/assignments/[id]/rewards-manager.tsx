"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface RewardRow {
  id: string;
  kind: "video" | "file" | "link";
  title: string;
  description: string | null;
  video_url: string | null;
  storage_path: string | null;
  external_url: string | null;
}

const KIND_LABEL: Record<RewardRow["kind"], string> = {
  video: "回放影片",
  file: "講義檔案",
  link: "預約連結",
};

const PAYLOAD_FIELD: Record<RewardRow["kind"], { key: string; label: string; hint: string }> = {
  video: {
    key: "video_url",
    label: "影片網址",
    hint: "YouTube 不公開連結或 Vimeo 皆可，會直接內嵌播放。",
  },
  link: {
    key: "external_url",
    label: "預約網址",
    hint: "例如你的 cal.com 連結。",
  },
  file: {
    key: "storage_path",
    label: "講義的 storage 路徑",
    hint: "私有 bucket 內的路徑，例如 rewards/course-x/handout.pdf。",
  },
};

export function RewardsManager({
  assignmentId,
  rewards,
}: {
  assignmentId: string;
  rewards: RewardRow[];
}) {
  const router = useRouter();
  const [kind, setKind] = useState<RewardRow["kind"]>("video");
  const [title, setTitle] = useState("");
  const [payload, setPayload] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/teach/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: assignmentId,
          kind,
          title,
          [PAYLOAD_FIELD[kind].key]: payload,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "建立失敗");
        return;
      }

      setTitle("");
      setPayload("");
      router.refresh();
    } catch {
      setError("建立失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/teach/rewards/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">交完給的資源</h2>
      <p className="mt-1 text-sm text-slate-600">
        學員一交出這份作業，下面這些就會自動解鎖，你不用做任何事。
      </p>

      {rewards.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rewards.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-4 rounded border border-slate-200 px-3 py-2"
            >
              <div className="min-w-0">
                <span className="mr-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {KIND_LABEL[r.kind]}
                </span>
                <span className="text-sm text-slate-900">{r.title}</span>
                <p className="truncate text-xs text-slate-500">
                  {r.video_url ?? r.external_url ?? r.storage_path}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={busy}
                className="shrink-0 text-xs text-red-600 hover:underline"
              >
                移除
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-5 space-y-3 border-t pt-5">
        <div className="flex gap-3">
          <select
            value={kind}
            onChange={(e) => {
              setKind(e.target.value as RewardRow["kind"]);
              setPayload("");
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {(["video", "file", "link"] as const).map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="標題"
            required
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            {PAYLOAD_FIELD[kind].label}
          </label>
          <input
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">{PAYLOAD_FIELD[kind].hint}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy} size="sm" variant="outline">
            {busy ? "處理中……" : "新增資源"}
          </Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </section>
  );
}
