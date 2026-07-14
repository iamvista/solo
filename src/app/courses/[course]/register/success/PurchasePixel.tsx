"use client";

import { useEffect } from "react";

/**
 * Best-effort client-side Purchase pixel（Meta CAPI 的 server 端已在 Recur webhook
 * order.paid 送出、為 authoritative 來源，見 route.ts handleOrderPaid）。這裡用同一個
 * enrollmentId 當 eventID 讓 Meta 去重。fbq 呼叫包 try/catch，追蹤失敗不可讓頁面壞掉。
 */
export default function PurchasePixel({
  eventId,
  value,
}: {
  eventId: string;
  value?: number;
}) {
  useEffect(() => {
    try {
      const fbq =
        typeof window !== "undefined"
          ? (window as { fbq?: (...a: unknown[]) => void }).fbq
          : undefined;
      if (fbq) {
        fbq(
          "track",
          "Purchase",
          { value: value ?? undefined, currency: "TWD" },
          { eventID: eventId },
        );
      }
    } catch {
      // 追蹤失敗不可影響頁面渲染
    }
  }, [eventId, value]);

  return null;
}
