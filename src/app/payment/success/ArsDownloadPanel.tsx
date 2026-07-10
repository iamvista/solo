"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ARS_VERTICALS,
  ARS_VERTICAL_LABELS,
  type ArsVertical,
} from "@/lib/ars-bundles";

interface Props {
  token: string;
  initialVertical: ArsVertical | null;
  showCore: boolean;
  showTeaching: boolean;
  showAll: boolean;
  showVertical: boolean;
}

export function ArsDownloadPanel({
  token,
  initialVertical,
  showCore,
  showTeaching,
  showAll,
  showVertical,
}: Props) {
  const [vertical, setVertical] = useState<ArsVertical | null>(initialVertical);
  const [pending, setPending] = useState<ArsVertical | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadUrl = (part: string) =>
    `/api/download/ars?token=${encodeURIComponent(token)}&part=${part}`;

  async function confirmVertical() {
    if (!pending) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/download/ars/select-vertical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, vertical: pending }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "選定失敗，請稍後再試");
        return;
      }
      setVertical(body.vertical ?? pending);
    } catch {
      setError("發生錯誤，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 space-y-4 text-left">
      {showCore && (
        <a href={downloadUrl("core")} className="block">
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            下載核心模組
          </Button>
        </a>
      )}
      {showTeaching && (
        <a href={downloadUrl("teaching")} className="block">
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            下載教學備課模組
          </Button>
        </a>
      )}
      {showAll && (
        <a href={downloadUrl("all")} className="block">
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            下載完整套件（19 模組全含）
          </Button>
        </a>
      )}
      {showVertical && vertical && (
        <a href={downloadUrl("vertical")} className="block">
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            下載{ARS_VERTICAL_LABELS[vertical]}垂直模組
          </Button>
        </a>
      )}
      {showVertical && !vertical && (
        <div className="rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-600">
            請選擇 1 個學科垂直（選定後不可更改）
          </p>
          <select
            className="mt-2 w-full rounded border border-stone-300 p-2 text-sm"
            value={pending}
            onChange={(e) => setPending(e.target.value as ArsVertical)}
          >
            <option value="">請選擇……</option>
            {ARS_VERTICALS.map((v) => (
              <option key={v} value={v}>
                {ARS_VERTICAL_LABELS[v]}
              </option>
            ))}
          </select>
          <Button
            className="mt-3 w-full"
            disabled={!pending || submitting}
            onClick={confirmVertical}
          >
            {submitting ? "處理中……" : "確認選定"}
          </Button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
