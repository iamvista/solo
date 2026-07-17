"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface GuestRow {
  id: string;
  cohort_key: string | null;
  email: string;
  name: string | null;
  note: string | null;
  created_at: string;
}

export function RosterManager({
  courseId,
  cohorts,
  guests,
}: {
  courseId: string;
  cohorts: Array<{ key: string; name: string; date: string; open?: boolean }>;
  guests: GuestRow[];
}) {
  const router = useRouter();
  const [cohortKey, setCohortKey] = useState(
    cohorts.find((c) => c.open)?.key ?? cohorts[0]?.key ?? "",
  );
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
        body: JSON.stringify({
          course_id: courseId,
          cohort_key: cohortKey,
          email,
          name,
          note,
        }),
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
                  {cohorts.find((c) => c.key === g.cohort_key)?.name ?? "未指定期別"}
                  ・{new Date(g.created_at).toLocaleDateString("zh-TW")} 加入
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
        <div>
          <label className="block text-xs font-medium text-slate-700">期別</label>
          <select
            value={cohortKey}
            onChange={(e) => setCohortKey(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {cohorts.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}（{c.date}）{c.open ? "・招生中" : ""}
              </option>
            ))}
          </select>
        </div>
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
