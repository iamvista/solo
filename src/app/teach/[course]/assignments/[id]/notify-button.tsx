"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  assignmentId: string;
  isPublished: boolean;
  lastNotifiedAt: string | null;
  lastRecipientCount: number | null;
}

/**
 * Notifying is its own action, never a side effect of saving.
 *
 * Deliberately not wired to the publish checkbox: mail cannot be recalled, so a
 * teacher fixing a typo must never mail the class a second time by accident.
 * The protection against accidents is confirmation and visibility of the last
 * send, not a prohibition on sending again — a teacher may legitimately want to
 * remind people.
 */
export function NotifyButton({
  assignmentId,
  isPublished,
  lastNotifiedAt,
  lastRecipientCount,
}: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/teach/assignments/${assignmentId}/notify`, {
        method: "POST",
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body.error ?? "寄送失敗");
        return;
      }

      setResult(
        body.sent === 0
          ? "這門課目前沒有學員，沒有寄出任何信。"
          : `已寄給 ${body.sent} 位學員${body.failed > 0 ? `，${body.failed} 封失敗` : ""}。`,
      );
      setConfirming(false);
      router.refresh();
    } catch {
      setError("寄送失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  }

  if (!isPublished) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          這份作業還沒發布，發布之後才能通知學員。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        {confirming ? (
          <>
            <span className="text-sm text-slate-900">
              確定要寄信給這門課的全體學員嗎？
            </span>
            <Button size="sm" onClick={handleSend} disabled={busy}>
              {busy ? "寄送中……" : "確定寄出"}
            </Button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="text-sm text-slate-500 hover:underline"
            >
              取消
            </button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => setConfirming(true)}>
              通知學員
            </Button>
            <span className="text-xs text-slate-500">
              {lastNotifiedAt
                ? `上次通知：${new Date(lastNotifiedAt).toLocaleString("zh-TW")}（${lastRecipientCount} 位）`
                : "尚未通知過"}
            </span>
          </>
        )}
      </div>

      {result && <p className="mt-2 text-sm text-emerald-700">{result}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <p className="mt-2 text-xs text-slate-400">
        發布作業本身不會寄信，只有按下這裡才會。
      </p>
    </div>
  );
}
