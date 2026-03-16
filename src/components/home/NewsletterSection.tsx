"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // 1. 存到自建資料庫
      const localRes = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "homepage",
          metadata: {
            referrer: document.referrer || "",
            url: window.location.href,
          },
        }),
      });

      if (!localRes.ok) {
        throw new Error("Local API failed");
      }

      // 2. 同步到 Substack（靜默失敗不影響用戶體驗）
      try {
        await fetch("https://iamvista.substack.com/api/v1/free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            first_url: window.location.href,
            first_referrer: document.referrer || "",
            current_url: window.location.href,
            current_referrer: document.referrer || "",
          }),
          mode: "cors",
        });
      } catch {
        // Substack sync failed silently — subscriber is saved locally
      }

      setStatus("success");
      setEmail("");
    } catch {
      // 本地 API 失敗，顯示錯誤提示
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-stone-900 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 sm:h-20 sm:w-20">
            <svg className="h-8 w-8 text-stone-900 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            每週一封，Solo 成長指南
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-400 sm:mt-6 sm:text-xl">
            自由工作者的實戰心法、接案技巧、個人品牌經營秘訣。
            <br className="hidden sm:block" />
            <span className="text-amber-400 font-semibold">18,000+</span> 位讀者都在看。
          </p>

          {status === "success" && (
            <div className="mx-auto mt-6 max-w-md rounded-xl bg-emerald-500/20 p-4 text-emerald-300">
              <p className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                訂閱成功！請檢查你的信箱確認訂閱。
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto mt-6 max-w-md rounded-xl bg-red-500/20 p-4 text-red-300">
              <p className="flex items-center justify-center gap-2">
                訂閱失敗，請稍後再試。
              </p>
            </div>
          )}

          {status !== "success" && (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Input
                type="email"
                placeholder="輸入你的 Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 flex-1 border-stone-700 bg-stone-800/50 text-base text-white placeholder:text-stone-500 focus:border-amber-400 focus:ring-amber-400 sm:h-14 sm:text-lg"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 bg-gradient-to-r from-amber-400 to-amber-500 px-6 text-base font-semibold text-stone-900 hover:from-amber-500 hover:to-amber-600 sm:h-14 sm:px-8 sm:text-lg"
              >
                {isSubmitting ? "處理中..." : "免費訂閱 →"}
              </Button>
            </form>
          )}

          {status === "success" && (
            <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-stone-400 underline hover:text-stone-300">
              使用其他信箱訂閱
            </button>
          )}

          <p className="mt-4 text-sm text-stone-600">
            隨時可以取消訂閱，我們尊重你的信箱
          </p>
        </div>
      </div>
    </section>
  );
}
