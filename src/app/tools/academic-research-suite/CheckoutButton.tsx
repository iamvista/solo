"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { RecurInstance } from "@/lib/recur-checkout-types";
import type { ArsBundle } from "@/lib/ars-bundles";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY ?? "";

// 5 個 bundle 各自獨立 ONE_TIME 產品（硬約束：redirectToCheckout 無 amount 覆寫）。
// 沒有 hardcoded fallback：env 缺值時 productId 是空字串，按鈕直接 disabled，
// 杜絕 sandbox／production productId 混用事故。
const ARS_BUNDLE_PRODUCT_IDS: Record<ArsBundle, string> = {
  grad: process.env.NEXT_PUBLIC_RECUR_ARS_GRAD_PRODUCT_ID ?? "",
  faculty: process.env.NEXT_PUBLIC_RECUR_ARS_FACULTY_PRODUCT_ID ?? "",
  clinician: process.env.NEXT_PUBLIC_RECUR_ARS_CLINICIAN_PRODUCT_ID ?? "",
  allaccess: process.env.NEXT_PUBLIC_RECUR_ARS_ALLACCESS_PRODUCT_ID ?? "",
  "addon-vertical":
    process.env.NEXT_PUBLIC_RECUR_ARS_ADDON_VERTICAL_PRODUCT_ID ?? "",
};

interface CheckoutButtonProps {
  bundle: ArsBundle;
  label?: string;
  variant?: "default" | "outline";
}

export function CheckoutButton({
  bundle,
  label = "立即購買",
  variant = "default",
}: CheckoutButtonProps) {
  const productId = ARS_BUNDLE_PRODUCT_IDS[bundle];
  const ready = Boolean(productId);

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
          "/tools/academic-research-suite#pricing",
        );
        window.location.href = `/auth/login?redirect=${returnUrl}`;
        return;
      }

      if (!recur) {
        setError("付款系統尚未就緒，請稍後再試");
        setLoading(false);
        return;
      }

      // 結帳導回的成功頁拿不到 token（token 是 webhook 非同步落地後由下載信送達），
      // 所以只帶 type=ars，不帶 token；下載一律由信中連結進入。
      await recur.redirectToCheckout({
        productId,
        successUrl: `${window.location.origin}/payment/success?type=ars`,
        cancelUrl: `${window.location.origin}/tools/academic-research-suite#pricing`,
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
          尚未開放購買
        </Button>
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
    </div>
  );
}
