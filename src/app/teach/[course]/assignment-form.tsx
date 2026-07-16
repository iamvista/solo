"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface AssignmentFormValues {
  id?: string;
  title: string;
  description: string;
  sort_order: number;
  allow_file: boolean;
  allow_text: boolean;
  allow_link: boolean;
  due_at: string;
  is_published: boolean;
}

interface Props {
  courseId: string;
  initial?: AssignmentFormValues;
  onDone?: string;
}

const EMPTY: AssignmentFormValues = {
  title: "",
  description: "",
  sort_order: 0,
  allow_file: true,
  allow_text: true,
  allow_link: true,
  due_at: "",
  is_published: false,
};

export function AssignmentForm({ courseId, initial, onDone }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<AssignmentFormValues>(initial ?? EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(initial?.id);

  function set<K extends keyof AssignmentFormValues>(
    key: K,
    value: AssignmentFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(
        editing
          ? `/api/teach/assignments/${initial!.id}`
          : "/api/teach/assignments",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, course_id: courseId }),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "儲存失敗");
        return;
      }

      if (onDone) router.push(onDone);
      else router.refresh();
    } catch {
      setError("儲存失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-900">標題</label>
        <input
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">
          說明（支援換行）
        </label>
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-900">
          收哪些形式
        </legend>
        <p className="mt-1 text-xs text-slate-500">至少要開放一種。</p>
        <div className="mt-2 flex gap-4">
          {(
            [
              ["allow_text", "文字"],
              ["allow_link", "連結"],
              ["allow_file", "檔案"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values[key]}
                onChange={(e) => set(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-900">
            建議完成日
          </label>
          <input
            type="date"
            value={values.due_at ? values.due_at.slice(0, 10) : ""}
            onChange={(e) => set("due_at", e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            只顯示給學員看，不會擋住遲交。
          </p>
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium text-slate-900">
            排序
          </label>
          <input
            type="number"
            value={values.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.is_published}
          onChange={(e) => set("is_published", e.target.checked)}
        />
        發布給學員（未勾選時只有你看得到）
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "儲存中……" : editing ? "儲存變更" : "建立作業"}
        </Button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}
