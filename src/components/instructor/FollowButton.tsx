"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FollowButton({
  instructorSlug,
  instructorName,
}: {
  instructorSlug: string;
  instructorName: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      setMsg("請填正確的 E-mail");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "instructor-follow",
          tags: [`instructor:${instructorSlug}`],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "訂閱失敗");
      setState("done");
      setMsg(`已追蹤 ${instructorName}，有新課會第一個通知你。`);
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "訂閱失敗");
    }
  }

  if (state === "done") {
    return <p className="text-sm text-emerald-700">{msg}</p>;
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        inputMode="email"
        placeholder="你的 E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="追蹤老師的 Email"
      />
      <Button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "送出中…" : `追蹤 ${instructorName}`}
      </Button>
      {state === "error" && (
        <p className="w-full text-sm text-rose-600">{msg}</p>
      )}
    </form>
  );
}
