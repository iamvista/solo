"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ReferralActions({
  referralId,
  status,
}: {
  referralId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const move = (to: string) => {
    if (to === "void" && !confirm("確定作廢這筆分潤？")) return;
    let payoutNote: string | undefined;
    if (to === "paid") {
      payoutNote = prompt("出款備註（轉帳日期／方式，選填）") ?? undefined;
    }
    startTransition(async () => {
      const res = await fetch(`/api/admin/affiliates/referrals/${referralId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: to, payoutNote }),
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
    <span className="flex gap-2">
      {status === "pending" && (
        <button
          disabled={pending}
          onClick={() => move("approved")}
          className="text-emerald-700 underline disabled:opacity-50"
        >
          核准
        </button>
      )}
      {status === "approved" && (
        <button
          disabled={pending}
          onClick={() => move("paid")}
          className="text-emerald-700 underline disabled:opacity-50"
        >
          標已付
        </button>
      )}
      {status !== "void" && status !== "paid" && (
        <button
          disabled={pending}
          onClick={() => move("void")}
          className="text-rose-600 underline disabled:opacity-50"
        >
          作廢
        </button>
      )}
    </span>
  );
}
