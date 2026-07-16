"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface GuestRow {
  id: string;
  email: string;
  name: string | null;
  note: string | null;
  created_at: string;
}

export function RosterManager({
  courseId,
  guests,
}: {
  courseId: string;
  guests: GuestRow[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/teach/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId, email, name, note }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setError(b.error ?? "加入失敗");
        return;
      }
      setEmail("");
      setName("");
      setNote("");
      router.refresh();
    } catch {
      setError("加入失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/teach/roster?id=${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {guests.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          還沒有手動加入的人。付費報名的學員不會出現在這裡，他們本來就進得來。
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {guests.map((g) => (
            <li
              key={g.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {g.name || g.email}
                </p>
                {g.name && <p className="text-xs text-slate-500">{g.email}</p>}
                {g.note && (
                  <p className="mt-1 text-xs text-slate-600">{g.note}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(g.created_at).toLocaleDateString("zh-TW")} 加入
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(g.id)}
                disabled={busy}
                className="shrink-0 text-xs text-red-600 hover:underline"
              >
                移除
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleAdd}
        className="mt-8 space-y-3 rounded-lg border border-slate-200 bg-white p-5"
      >
        <h2 className="text-sm font-semibold text-slate-900">加入一個人</h2>
        <div className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email（必填）"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="姓名"
            className="w-40 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="備註：為什麼加這個人（例如：匯款、助教、合作換課）"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy} size="sm">
            {busy ? "處理中……" : "加入"}
          </Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </>
  );
}
