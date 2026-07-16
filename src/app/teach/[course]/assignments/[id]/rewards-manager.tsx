"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SUBMISSIONS_BUCKET } from "@/lib/assignments";

export type RewardKind = "video" | "file" | "link" | "text";

export interface RewardRow {
  id: string;
  kind: RewardKind;
  title: string;
  description: string | null;
  video_url: string | null;
  storage_path: string | null;
  external_url: string | null;
  body_text: string | null;
}

const KIND_LABEL: Record<RewardKind, string> = {
  video: "回放影片",
  file: "講義檔案",
  link: "預約連結",
  text: "文字說明",
};

const URL_FIELD: Record<"video" | "link", { key: string; label: string; hint: string }> = {
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
};

/** What the teacher sees in the list for an already-created reward. */
function summarize(r: RewardRow): string {
  if (r.kind === "text") {
    const body = r.body_text ?? "";
    return body.length > 60 ? `${body.slice(0, 60)}……` : body;
  }
  if (r.kind === "file") {
    // Show the filename, not the key: the path is plumbing the teacher never
    // asked about and should not have to read.
    return (r.storage_path ?? "").split("/").pop() ?? "";
  }
  return r.video_url ?? r.external_url ?? "";
}

export function RewardsManager({
  assignmentId,
  rewards,
}: {
  assignmentId: string;
  rewards: RewardRow[];
}) {
  const router = useRouter();
  const [kind, setKind] = useState<RewardKind>("video");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setTitle("");
    setUrl("");
    setBodyText("");
    setFile(null);
  }

  /**
   * Upload the handout and return the key the server derived for it.
   * The teacher never sees this value.
   */
  async function uploadHandout(f: File): Promise<string> {
    const res = await fetch("/api/teach/rewards/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignment_id: assignmentId, filename: f.name }),
    });
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      throw new Error(b.error ?? "無法建立上傳連結");
    }

    const { token, path } = await res.json();
    const supabase = createClient();
    const { error: upErr } = await supabase.storage
      .from(SUBMISSIONS_BUCKET)
      .uploadToSignedUrl(path, token, f);

    if (upErr) throw new Error(`「${f.name}」上傳失敗`);
    return path;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        assignment_id: assignmentId,
        kind,
        title,
      };

      if (kind === "file") {
        if (!file) throw new Error("請選擇要上傳的檔案");
        payload.storage_path = await uploadHandout(file);
      } else if (kind === "text") {
        payload.body_text = bodyText;
      } else {
        payload[URL_FIELD[kind].key] = url;
      }

      const res = await fetch("/api/teach/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        // Keep the form as it stands. If the handout already uploaded, its
        // object is orphaned in the bucket by design; losing the teacher's
        // typing on top of that would be the worse failure.
        setError(b.error ?? "建立失敗");
        return;
      }

      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請再試一次。");
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
                <p className="truncate text-xs text-slate-500">{summarize(r)}</p>
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
              setKind(e.target.value as RewardKind);
              reset();
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {(Object.keys(KIND_LABEL) as RewardKind[]).map((k) => (
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

        {kind === "file" && (
          <div>
            <label className="block text-xs font-medium text-slate-700">
              選擇講義檔案
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
              className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:text-white"
            />
            <p className="mt-1 text-xs text-slate-500">
              檔案存在私有空間，只有交過這份作業的學員才拿得到。
            </p>
          </div>
        )}

        {kind === "text" && (
          <div>
            <label className="block text-xs font-medium text-slate-700">
              要給學員看的文字
            </label>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              required
              rows={8}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="可以寫幾段話，或一整篇短文。換行會保留。"
            />
            <p className="mt-1 text-xs text-slate-500">
              純文字，換行會保留。不支援粗體、清單等 markdown 語法。
            </p>
          </div>
        )}

        {(kind === "video" || kind === "link") && (
          <div>
            <label className="block text-xs font-medium text-slate-700">
              {URL_FIELD[kind].label}
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">{URL_FIELD[kind].hint}</p>
          </div>
        )}

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
