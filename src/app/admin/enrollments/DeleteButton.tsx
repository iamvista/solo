"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  enrollmentId: string;
  enrollmentLabel: string; // 顯示給 user confirm 的識別文字（姓名 + email）
}

export function DeleteEnrollmentButton({ enrollmentId, enrollmentLabel }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    const ok = window.confirm(
      `確定要刪除「${enrollmentLabel}」這筆報名嗎？\n\n此動作無法復原。`,
    );
    if (!ok) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setError(json.error || `刪除失敗（${res.status}）`);
          return;
        }
        router.refresh();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "未知錯誤";
        setError(msg);
      }
    });
  };

  return (
    <div className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-xs text-rose-600 underline-offset-2 hover:underline disabled:opacity-50"
        title="刪除這筆報名（不可復原）"
      >
        {pending ? "刪除中…" : "刪除"}
      </button>
      {error && (
        <span className="mt-0.5 text-[10px] text-rose-700">{error}</span>
      )}
    </div>
  );
}
