"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** 停售期間的「開賣時通知我」表單：姓名選填、email 必填，POST /api/interest。 */
export function InterestForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setState("error");
      setMsg("請填 E-mail");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email: email.trim(),
          name: name.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "送出失敗");
      setState("done");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "送出失敗");
    }
  }

  if (state === "done") {
    return (
      <p className="text-center text-base font-medium text-primary">
        已登記！開課或方案就緒時會第一時間通知你。
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input
        placeholder="姓名（選填）"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="姓名"
        className="h-11 text-base"
      />
      <Input
        type="email"
        inputMode="email"
        placeholder="E-mail（必填）"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="E-mail"
        className="h-11 text-base"
      />
      {state === "error" && <p className="text-sm text-rose-600">{msg}</p>}
      <Button
        type="submit"
        size="lg"
        className="h-12 w-full text-base"
        disabled={state === "loading"}
      >
        {state === "loading" ? "送出中…" : "搶先登記通知"}
      </Button>
    </form>
  );
}
