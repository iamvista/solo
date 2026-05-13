"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CONSULTING_TOPICS } from "@/lib/consulting-config";

interface Props {
  enrollmentId: string;
  onSaved: () => void;
}

export function AddSessionModal({ enrollmentId, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [hours, setHours] = useState("1");
  const [topic, setTopic] = useState<string>("custom");
  const [docUrl, setDocUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/consulting/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrollmentId,
        sessionDate: date,
        timeStart: start || undefined,
        timeEnd: end || undefined,
        hoursUsed: Number(hours),
        topic,
        sharedDocUrl: docUrl || undefined,
        vistaNotes: notes || undefined,
        notifyStudent: notify,
      }),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? `HTTP ${res.status}`);
      return;
    }
    // 顯示 email 寄送結果（與 LeadList 一致）
    if (notify) {
      if (data.emailError) {
        alert(
          `Session 已記錄，但 session summary 通知信寄送失敗：\n\n${data.emailErrorDetail ?? "未知原因"}\n\n請手動 follow up 學員。`,
        );
      } else if (data.emailSent) {
        // 寄成功不彈窗，避免干擾連續記錄；只在 console 留 trace
        console.log("[AddSessionModal] session summary email sent");
      }
    }
    setOpen(false);
    onSaved();
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>📝 記錄一場 session</Button>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg space-y-4 rounded-lg bg-card p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold">記錄一場 session</h3>

        <div>
          <Label htmlFor="session-date">上課日期</Label>
          <Input
            id="session-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="session-start">開始時間</Label>
            <Input
              id="session-start"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="session-end">結束時間</Label>
            <Input
              id="session-end"
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="session-hours">使用時數</Label>
          <Input
            id="session-hours"
            type="number"
            step="0.5"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="session-topic">主題</Label>
          <select
            id="session-topic"
            className="w-full rounded-md border border-input bg-background p-2 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {CONSULTING_TOPICS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.emoji} {t.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="session-doc">共寫文件連結（選填）</Label>
          <Input
            id="session-doc"
            type="url"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="https://docs.google.com/..."
          />
        </div>

        <div>
          <Label htmlFor="session-notes">Vista 私人筆記（選填）</Label>
          <Textarea
            id="session-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={notify}
            onCheckedChange={(v) => setNotify(v === true)}
          />
          同時寄通知信給學員
        </label>

        {error && (
          <p className="text-sm text-red-600">儲存失敗：{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            取消
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "儲存中..." : "儲存"}
          </Button>
        </div>
      </div>
    </div>
  );
}
