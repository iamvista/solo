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
const PRODUCT_ID =
  process.env.NEXT_PUBLIC_RECUR_AI_COACH_KIT_PRODUCT_ID ??
  "xqvb9nqxtehhfesuhequm9jp";

export function CheckoutButton() {
  const [recur, setRecur] = useState<RecurInstance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!PUBLISHABLE_KEY) {
      setError("付款系統未設定");
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/recur-tw@0.16.1/dist/recur.umd.js";
    script.async = true;
    script.onload = () => {
      if (window.RecurCheckout) {
        setRecur(
          window.RecurCheckout.init({ publishableKey: PUBLISHABLE_KEY })
        );
      }
    };
    script.onerror = () => setError("付款系統載入失敗，請重新整理頁面");
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        // 未登入 → 導向登入頁，登入後回來
        const returnUrl = encodeURIComponent(
          "/products/ai-coach-kit#pricing"
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
        productId: PRODUCT_ID,
        successUrl: `${window.location.origin}/payment/success?type=download`,
        cancelUrl: `${window.location.origin}/products/ai-coach-kit#pricing`,
        customerEmail: user.email,
      });
    } catch {
      setError("發生錯誤，請稍後再試");
      setLoading(false);
    }
  }, [recur]);

  return (
    <div className="mt-6">
      <Button
        size="lg"
        className="w-full h-12 text-base font-semibold"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "處理中……" : "立即購買"}
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
