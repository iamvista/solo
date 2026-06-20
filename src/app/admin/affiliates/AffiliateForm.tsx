"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AffiliateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    email: "",
    percent: "20",
    courseIds: "",
    note: "",
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
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          email: form.email || undefined,
          commissionRate: percentNum / 100,
          courseIds: form.courseIds
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          note: form.note || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "建立失敗");
        return;
      }
      router.push("/admin/affiliates");
      router.refresh();
    });
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <label className="block">
        <span className="text-sm">代碼（自動轉大寫）</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.code}
          onChange={(e) => set("code", e.target.value)}
          required
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
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? "建立中…" : "建立代碼"}
      </button>
    </form>
  );
}
