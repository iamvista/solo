"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventUpdateForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  const handleSend = async () => {
    if (!title) { setResult("請填寫標題"); return; }
    setSending(true);
    setResult("");

    try {
      const res = await fetch(`/api/admin/events/${eventId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, target }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(`公告已送出，共寄出 ${data.emailsSent} 封信`);
        setTitle("");
        setContent("");
        router.refresh();
      } else {
        setResult(`錯誤：${data.error}`);
      }
    } catch {
      setResult("網路錯誤");
    }
    setSending(false);
  };

  const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <Card>
      <CardHeader><CardTitle>發送新公告</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className={labelClass}>發送對象</label>
          <select className={inputClass} value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="all">全部報名者</option>
            <option value="confirmed">已確認</option>
            <option value="waitlisted">候補中</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>標題 *</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="公告標題" />
        </div>
        <div>
          <label className={labelClass}>內容</label>
          <textarea className={`${inputClass} min-h-[150px]`} value={content} onChange={(e) => setContent(e.target.value)} placeholder="公告內容..." />
        </div>
        {result && <p className="text-sm">{result}</p>}
        <Button onClick={handleSend} disabled={sending}>{sending ? "發送中..." : "發送公告"}</Button>
      </CardContent>
    </Card>
  );
}
