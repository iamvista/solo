"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export function PurchaseForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: "product",
          productId: "ai-coach-kit",
          productName: "AI 教練工坊",
          buyerEmail: email,
          buyerName: name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "發生錯誤，請稍後再試");
        return;
      }

      // PAYUNi 回傳的表單資料 — 動態提交
      if (data.formHtml) {
        const div = document.createElement("div");
        div.innerHTML = data.formHtml;
        document.body.appendChild(div);
        const form = div.querySelector("form") as HTMLFormElement | null;
        if (form) form.submit();
      }
    } catch {
      setError("網路錯誤，請確認連線後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="buyer-name"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          姓名（選填）
        </label>
        <Input
          id="buyer-name"
          type="text"
          placeholder="你的名字"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <label
          htmlFor="buyer-email"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="buyer-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <p className="mt-1 text-xs text-stone-500">用於接收購買確認與下載連結</p>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-semibold"
        disabled={loading}
      >
        {loading ? "處理中……" : "立即購買 NT$1,499"}
        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
      <p className="text-center text-xs text-stone-400">
        一次買斷 · 終身使用 · 支援信用卡 / ATM 轉帳
      </p>
    </form>
  );
}
