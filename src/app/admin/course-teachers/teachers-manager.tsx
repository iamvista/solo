"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface TeacherRow {
  id: string;
  course_id: string;
  courseTitle: string;
  email: string;
  displayName: string | null;
}

export function TeachersManager({
  courses,
  teachers,
}: {
  courses: Array<{ slug: string; title: string }>;
  teachers: TeacherRow[];
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.slug ?? "");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/course-teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId, email }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setError(b.error ?? "指派失敗");
        return;
      }
      setEmail("");
      router.refresh();
    } catch {
      setError("指派失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/course-teachers?id=${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {teachers.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          還沒有指派任何授課老師。
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {teachers.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {t.displayName || t.email}
                </p>
                {t.displayName && (
                  <p className="text-xs text-slate-500">{t.email}</p>
                )}
                <p className="mt-1 text-xs text-slate-600">{t.courseTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(t.id)}
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
        <h2 className="text-sm font-semibold text-slate-900">指派授課老師</h2>
        <p className="text-xs text-slate-500">
          對方必須先到 solo.tw 註冊過帳號。授課老師與助教同權：能看繳交、寫評語，
          也能建立與刪除作業和資源。
        </p>
        <div className="flex gap-3">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="老師的 email"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy} size="sm">
            {busy ? "處理中……" : "指派"}
          </Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </>
  );
}
