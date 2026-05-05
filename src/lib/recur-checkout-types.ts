/**
 * 共用 Recur frontend SDK 型別。
 * 之前各個 CheckoutButton 都自己 declare global Window.RecurCheckout 結果型別不一致。
 * 集中在這裡，所有結帳元件 import 同一份。
 */

export interface RecurInstance {
  redirectToCheckout: (options: {
    productId: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    customerName?: string;
    metadata?: Record<string, string>;
  }) => Promise<void>;
}

declare global {
  interface Window {
    RecurCheckout?: {
      init: (config: { publishableKey: string }) => RecurInstance;
    };
  }
}

export const RECUR_CDN_URL = "https://unpkg.com/recur-tw@0.16.1/dist/recur.umd.js";

export async function loadRecurFromCdn(publishableKey: string): Promise<RecurInstance> {
  if (typeof window === "undefined") throw new Error("loadRecur is client-only");
  if (window.RecurCheckout) {
    return window.RecurCheckout.init({ publishableKey });
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${RECUR_CDN_URL}"]`,
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("recur sdk failed to load")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = RECUR_CDN_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recur sdk failed to load"));
    document.head.appendChild(script);
  });

  const sdk = (window as Window).RecurCheckout;
  if (!sdk) throw new Error("RecurCheckout not available");
  return sdk.init({ publishableKey });
}
