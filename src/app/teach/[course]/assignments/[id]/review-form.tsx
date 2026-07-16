"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  submissionId: string;
  initialComment: string;
}

export function ReviewForm({ submissionId, initialComment }: Props) {
  const router = useRouter();
  const [comment, setComment] = useState(initialComment);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/teach/submissions/${submissionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "儲存失敗");
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("儲存失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block text-xs font-medium text-slate-700">評語</label>
      <textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setSaved(false);
        }}
        rows={4}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        placeholder="寫給這位學員的回饋"
      />
      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={busy} size="sm">
          {busy ? "儲存中……" : "儲存評語"}
        </Button>
        {saved && <span className="text-xs text-emerald-700">已儲存</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </form>
  );
}
