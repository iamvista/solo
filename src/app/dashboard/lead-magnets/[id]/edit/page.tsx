"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";

const RESOURCE_TYPES = [
  { value: "pdf", label: "📄 PDF 文件" },
  { value: "checklist", label: "✅ 檢查清單" },
  { value: "template", label: "📋 模板" },
  { value: "toolkit", label: "🧰 工具包" },
  { value: "video", label: "🎬 影片" },
  { value: "other", label: "🎁 其他" },
];

export default function EditLeadMagnetPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("pdf");
  const [fileUrl, setFileUrl] = useState("");
  const [ctaText, setCtaText] = useState("免費下載");
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [currentStatus, setCurrentStatus] = useState("draft");

  useEffect(() => {
    fetch(`/api/lead-magnets/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.lead_magnet) {
          const m = data.lead_magnet;
          setTitle(m.title);
          setSlug(m.slug);
          setDescription(m.description || "");
          setResourceType(m.resource_type);
          setFileUrl(m.file_url || "");
          setCtaText(m.cta_text || "免費下載");
          setThankYouMessage(m.thank_you_message || "");
          setBenefits(m.benefits?.length ? m.benefits : [""]);
          setCurrentStatus(m.status);
        }
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = useCallback(
    async (status?: string) => {
      if (!title || !slug) {
        setError("請填寫標題和網址代稱");
        return;
      }
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/lead-magnets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            description: description || null,
            resource_type: resourceType,
            file_url: fileUrl || null,
            cta_text: ctaText,
            thank_you_message: thankYouMessage,
            benefits: benefits.filter((b) => b.trim()),
            ...(status ? { status } : {}),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "更新失敗");
          return;
        }

        router.push("/dashboard/lead-magnets");
      } catch {
        setError("網路錯誤");
      } finally {
        setLoading(false);
      }
    },
    [id, title, slug, description, resourceType, fileUrl, ctaText, thankYouMessage, benefits, router],
  );

  const addBenefit = () => setBenefits([...benefits, ""]);
  const updateBenefit = (i: number, val: string) => {
    const next = [...benefits];
    next[i] = val;
    setBenefits(next);
  };
  const removeBenefit = (i: number) => setBenefits(benefits.filter((_, idx) => idx !== i));

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-stone-500">載入中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900">編輯名單磁鐵</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/lead-magnets">← 返回</Link>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-base font-semibold text-stone-800">基本資訊</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">標題 *</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">網址代稱 *</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-400">solo.tw/m/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">說明</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">資源類型</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                >
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-base font-semibold text-stone-800">賣點列表</h2>
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={b}
                    onChange={(e) => updateBenefit(i, e.target.value)}
                    placeholder={`賣點 ${i + 1}`}
                    className="flex-1"
                  />
                  {benefits.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeBenefit(i)}>✕</Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addBenefit}>+ 新增賣點</Button>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card className="border-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-base font-semibold text-stone-800">資源交付</h2>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">上傳檔案</label>
                <FileUpload
                  bucket="lead-magnets"
                  accept=".pdf,.zip,.png,.jpg,.jpeg,.webp,.doc,.docx,.xlsx,.pptx"
                  maxSizeMB={10}
                  onUpload={(url) => setFileUrl(url)}
                  currentUrl={fileUrl || undefined}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  或直接貼上檔案 URL
                </label>
                <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">CTA 按鈕文字</label>
                <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">感謝訊息</label>
                <textarea
                  value={thankYouMessage}
                  onChange={(e) => setThankYouMessage(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleSubmit()} disabled={loading} className="flex-1">
              儲存
            </Button>
            {currentStatus === "draft" && (
              <Button onClick={() => handleSubmit("published")} disabled={loading} className="flex-1">
                {loading ? "處理中..." : "發布"}
              </Button>
            )}
            {currentStatus === "published" && (
              <Button onClick={() => handleSubmit("archived")} disabled={loading} variant="secondary" className="flex-1">
                封存
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
