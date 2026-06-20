"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function StatusToggle({
  affiliateId,
  status,
}: {
  affiliateId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = status === "active" ? "disabled" : "active";
  const label = status === "active" ? "停用此代碼" : "啟用此代碼";

  const toggle = () => {
    if (!confirm(`確定要${status === "active" ? "停用" : "啟用"}此代碼？`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/affiliates/${affiliateId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error ?? "操作失敗");
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="rounded border px-3 py-1 text-sm disabled:opacity-50"
    >
      {pending ? "處理中…" : label}
    </button>
  );
}
