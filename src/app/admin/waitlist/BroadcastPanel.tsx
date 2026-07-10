"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WaitlistFilters } from "@/lib/waitlist-query";

type Phase = "idle" | "previewing" | "confirming" | "sending" | "done";

/**
 * 對外群發不可逆，因此寄送前一定要先讓操作者看到確切收件人數並二次確認。
 * 收件人數由伺服器以「與實際寄送相同的查詢」算出，不是前端自己數的列表長度，
 * 否則畫面上的數字與真正寄出的對象會對不起來。
 */
export function BroadcastPanel({ filters }: { filters: WaitlistFilters }) {
  const [cohortDate, setCohortDate] = useState("");
  const [enrolUrl, setEnrolUrl] = useState("");
  const [note, setNote] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(
    null,
  );
  const [error, setError] = useState("");

  async function call(confirm: boolean) {
    const res = await fetch("/api/admin/waitlist/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters, cohortDate, enrolUrl, note, confirm }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "廣播失敗");
    return data as { recipientCount: number; sent: number; failed: number };
  }

  async function preview() {
    setError("");
    if (!cohortDate.trim() || !enrolUrl.trim()) {
      setError("請先填寫梯次日期與報名連結");
      return;
    }
    setPhase("previewing");
    try {
      const data = await call(false);
      setCount(data.recipientCount);
      setPhase("confirming");
    } catch (e) {
      setError(e instanceof Error ? e.message : "廣播失敗");
      setPhase("idle");
    }
  }

  async function send() {
    setPhase("sending");
    try {
      const data = await call(true);
      setResult({ sent: data.sent, failed: data.failed });
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "廣播失敗");
      setPhase("confirming");
    }
  }

  if (phase === "done" && result) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
        <p className="font-medium text-emerald-800">廣播完成</p>
        <p className="mt-1 text-emerald-700">
          成功 {result.sent} 封，失敗 {result.failed} 封。
          {result.failed > 0 &&
            "失敗的收件人未寫入通知時間，可用同一組篩選重新廣播以重試。"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-stone-900">廣播開課通知</h2>
      <p className="mt-1 text-xs text-stone-500">
        寄給目前篩選出的名單（自動排除已退訂者）。梯次日期與報名連結在這裡填，
        不讀自課程設定檔。
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Input
          placeholder="梯次日期，例：2026/08/15（六）09:00-12:00"
          value={cohortDate}
          onChange={(e) => setCohortDate(e.target.value)}
          disabled={phase !== "idle"}
          aria-label="梯次日期"
        />
        <Input
          placeholder="報名連結，例：https://www.solo.tw/courses/ai-content"
          value={enrolUrl}
          onChange={(e) => setEnrolUrl(e.target.value)}
          disabled={phase !== "idle"}
          aria-label="報名連結"
        />
      </div>
      <Input
        className="mt-2"
        placeholder="補充訊息（選填）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={phase !== "idle"}
        aria-label="補充訊息"
      />

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

      {phase === "confirming" ? (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-900">
            即將寄給 {count} 人，這個動作無法收回。
          </p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={send} disabled={count === 0}>
              確認寄出給 {count} 人
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setPhase("idle");
                setCount(0);
              }}
            >
              取消
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="mt-3"
          size="sm"
          onClick={preview}
          disabled={phase !== "idle"}
        >
          {phase === "previewing" ? "計算收件人…" : "預覽收件人數"}
        </Button>
      )}

      {phase === "sending" && (
        <p className="mt-2 text-sm text-stone-500">寄送中，請不要關閉頁面…</p>
      )}
    </div>
  );
}
