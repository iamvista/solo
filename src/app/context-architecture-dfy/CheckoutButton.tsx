"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RecurInstance {
  redirectToCheckout: (options: {
    productId: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
  }) => Promise<void>;
}

declare global {
  interface Window {
    RecurCheckout?: {
      init: (config: { publishableKey: string }) => RecurInstance;
    };
  }
}

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY ?? "";

interface CheckoutButtonProps {
  productId: string;
  /** 產品是否已在 Recur 後臺建立。false 時 disable 按鈕並顯示提示 */
  ready: boolean;
  label?: string;
  variant?: "default" | "outline";
}

export function CheckoutButton({
  productId,
  ready,
  label = "預約訪談",
  variant = "default",
}: CheckoutButtonProps) {
  const [recur, setRecur] = useState<RecurInstance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!PUBLISHABLE_KEY) {
      setError("付款系統未設定");
      return;
    }
    if (window.RecurCheckout) {
      setRecur(window.RecurCheckout.init({ publishableKey: PUBLISHABLE_KEY }));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/recur-tw@0.16.1/dist/recur.umd.js";
    script.async = true;
    script.onload = () => {
      if (window.RecurCheckout) {
        setRecur(window.RecurCheckout.init({ publishableKey: PUBLISHABLE_KEY }));
      }
    };
    script.onerror = () => setError("付款系統載入失敗，請重新整理頁面");
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [ready]);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        const returnUrl = encodeURIComponent(
          "/context-architecture-dfy#pricing"
        );
        window.location.href = `/auth/login?redirect=${returnUrl}`;
        return;
      }

      if (!recur) {
        setError("付款系統尚未就緒，請稍後再試");
        setLoading(false);
        return;
      }

      await recur.redirectToCheckout({
        productId,
        successUrl: `${window.location.origin}/payment/success?type=service&product=context-architecture-dfy`,
        cancelUrl: `${window.location.origin}/context-architecture-dfy#pricing`,
        customerEmail: user.email,
      });
    } catch {
      setError("發生錯誤，請稍後再試");
      setLoading(false);
    }
  }, [recur, productId]);

  if (!ready) {
    return (
      <div className="w-full">
        <Button
          size="lg"
          variant={variant}
          className="w-full h-12 text-base font-semibold"
          disabled
        >
          名額即將開放，敬請期待
        </Button>
        <p className="mt-2 text-center text-xs text-stone-400">
          目前正在準備系統上線，加入電子報可第一時間收到開放通知。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Button
        size="lg"
        variant={variant}
        className="w-full h-12 text-base font-semibold"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "處理中……" : label}
        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600">{error}</p>
      )}
      <p className="mt-3 text-center text-xs text-stone-400">
        支援信用卡付款 · 由 Recur 安全處理
      </p>
    </div>
  );
}
