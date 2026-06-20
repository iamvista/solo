"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface ExistingAffiliate {
  id: string;
  code: string;
  name: string;
  email: string | null;
  commission_rate: number;
  course_ids: string[] | null;
  note: string | null;
}

export function AffiliateForm({ affiliate }: { affiliate?: ExistingAffiliate }) {
  const router = useRouter();
  const isEdit = !!affiliate;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: affiliate?.code ?? "",
    name: affiliate?.name ?? "",
    email: affiliate?.email ?? "",
    percent: affiliate
      ? String(Math.round(affiliate.commission_rate * 100))
      : "20",
    courseIds: affiliate?.course_ids?.join(", ") ?? "",
    note: affiliate?.note ?? "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const percentNum = Number(form.percent);
    if (!(percentNum > 0 && percentNum <= 100)) {
      setError("比例需介於 1 與 100 之間");
      return;
    }
    startTransition(async () => {
      const payload = {
        name: form.name,
        email: form.email,
        commissionRate: percentNum / 100,
        courseIds: form.courseIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        note: form.note,
      };
      const res = await fetch(
        isEdit ? `/api/admin/affiliates/${affiliate.id}` : "/api/admin/affiliates",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(isEdit ? payload : { ...payload, code: form.code }),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? (isEdit ? "儲存失敗" : "建立失敗"));
        return;
      }
      router.push(isEdit ? `/admin/affiliates/${affiliate.id}` : "/admin/affiliates");
      router.refresh();
    });
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <label className="block">
        <span className="text-sm">
          代碼{isEdit ? "（不可修改）" : "（自動轉大寫）"}
        </span>
        <input
          className="mt-1 w-full rounded border px-3 py-2 disabled:bg-stone-100 disabled:text-stone-500"
          value={form.code}
          onChange={(e) => set("code", e.target.value)}
          required
          disabled={isEdit}
        />
      </label>
      <label className="block">
        <span className="text-sm">夥伴／單位名稱</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm">聯絡 email（出款用，選填）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-sm">分潤比例（%）</span>
        <input
          type="number"
          min={1}
          max={100}
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.percent}
          onChange={(e) => set("percent", e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm">適用課程 slug（逗號分隔，留空＝全站）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.courseIds}
          onChange={(e) => set("courseIds", e.target.value)}
          placeholder="concept-monetization-bootcamp"
        />
      </label>
      <label className="block">
        <span className="text-sm">備註（選填）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {pending ? "處理中…" : isEdit ? "儲存修改" : "建立代碼"}
        </button>
        {isEdit && (
          <a
            href={`/admin/affiliates/${affiliate.id}`}
            className="text-sm text-stone-500 underline"
          >
            取消
          </a>
        )}
      </div>
    </form>
  );
}
