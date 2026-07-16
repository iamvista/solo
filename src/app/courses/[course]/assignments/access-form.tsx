"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  courseId: string;
  courseName: string;
  linkInvalid?: boolean;
}

export function AccessForm({ courseId, courseName, linkInvalid }: Props) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setFailed(null);

    try {
      const res = await fetch("/api/assignments/access/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, email }),
      });

      if (res.status === 429) {
        setFailed("剛剛已經寄過了，請等幾分鐘再試一次。");
        return;
      }

      // Every other outcome shows the same confirmation, on purpose: this page
      // must not reveal whether an address is on the roster.
      setSent(true);
    } catch {
      setFailed("網路好像有點問題，請再試一次。");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">信寄出去了</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          如果 <span className="font-medium text-slate-900">{email}</span>{" "}
          有報名這門課，入口連結已經寄到這個信箱了。連結 30 分鐘內有效。
        </p>
        <p className="mt-3 text-sm text-slate-500">
          沒收到的話，先看看垃圾郵件匣。還是找不到就寫信給{" "}
          <a
            href="mailto:iamvista@gmail.com"
            className="text-blue-600 underline"
          >
            iamvista@gmail.com
          </a>
          。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">進入作業區</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        填你報名 {courseName} 時用的 email，我們會寄一條入口連結給你。不需要密碼，也不需要註冊帳號。
      </p>

      {linkInvalid && (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          那條連結已經失效了（可能過期或已經用過）。重新要一條就好。
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
        <Button type="submit" disabled={sending} className="w-full">
          {sending ? "寄送中……" : "把入口連結寄給我"}
        </Button>
      </form>

      {failed && <p className="mt-3 text-sm text-red-600">{failed}</p>}
    </div>
  );
}
