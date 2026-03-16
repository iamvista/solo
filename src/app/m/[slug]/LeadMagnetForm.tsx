"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  leadMagnetId: string;
  ctaText: string;
}

export default function LeadMagnetForm({ leadMagnetId, ctaText }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;

      setLoading(true);
      setError("");

      try {
        // Get UTM params from URL
        const params = new URLSearchParams(window.location.search);
        const res = await fetch("/api/lead-magnets/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_magnet_id: leadMagnetId,
            email,
            name: name || null,
            source_page: window.location.pathname,
            utm_source: params.get("utm_source"),
            utm_medium: params.get("utm_medium"),
            utm_campaign: params.get("utm_campaign"),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "送出失敗，請稍後再試");
          return;
        }

        setSuccess(true);
        setSuccessMessage(data.message || "感謝下載！請檢查你的信箱。");

        // If there's a redirect URL, navigate after a short delay
        if (data.redirect_url) {
          setTimeout(() => {
            window.location.href = data.redirect_url;
          }, 2000);
        }
      } catch {
        setError("網路錯誤，請稍後再試");
      } finally {
        setLoading(false);
      }
    },
    [email, name, leadMagnetId],
  );

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-3">📬</div>
        <h3 className="text-lg font-semibold text-stone-900 mb-2">已送出！</h3>
        <p className="text-stone-600">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        placeholder="你的名字（選填）"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        placeholder="你的 Email *"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <Button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white"
        size="lg"
      >
        {loading ? "處理中..." : ctaText}
      </Button>
      <p className="text-xs text-stone-400 text-center">
        我們尊重你的隱私，不會寄送垃圾郵件。
      </p>
    </form>
  );
}
