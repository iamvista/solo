"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {
  Event,
  TicketType,
  EventFormat,
  EventStatus,
  EventCategory,
} from "@/lib/supabase/types";

interface EventFormProps {
  event?: Event & { ticket_types?: TicketType[] };
  mode: "create" | "edit";
}

interface TicketTypeForm {
  name: string;
  description: string;
  capacity: number;
  price: number;
  is_active: boolean;
}

const tabs = [
  { id: "basic", label: "基本資訊" },
  { id: "datetime", label: "時間地點" },
  { id: "content", label: "活動內容" },
  { id: "tickets", label: "票種設定" },
  { id: "publish", label: "發布設定" },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

/** Convert ISO/UTC date string to local datetime-local format (YYYY-MM-DDTHH:mm) */
function toLocalDateTimeString(isoString: string): string {
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/** Convert any YouTube URL to embed format */
function toYouTubeEmbedUrl(url: string): string {
  if (!url) return url;
  // Already embed format
  if (url.includes("youtube.com/embed/")) return url;
  // https://www.youtube.com/watch?v=VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&\s]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/(?:youtu\.be\/)([^?\s]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

export default function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState(event?.title || "");
  const [subtitle, setSubtitle] = useState(event?.subtitle || "");
  const [slug, setSlug] = useState(event?.slug || "");
  const [description, setDescription] = useState(event?.description || "");
  const [format, setFormat] = useState<EventFormat>(event?.format || "offline");
  const [venueName, setVenueName] = useState(event?.venue_name || "");
  const [venueAddress, setVenueAddress] = useState(event?.venue_address || "");
  const [onlineUrl, setOnlineUrl] = useState(event?.online_url || "");
  const [startsAt, setStartsAt] = useState(
    event?.starts_at ? toLocalDateTimeString(event.starts_at) : "",
  );
  const [endsAt, setEndsAt] = useState(
    event?.ends_at ? toLocalDateTimeString(event.ends_at) : "",
  );
  const [registrationStartsAt, setRegistrationStartsAt] = useState(
    event?.registration_starts_at
      ? toLocalDateTimeString(event.registration_starts_at)
      : "",
  );
  const [registrationEndsAt, setRegistrationEndsAt] = useState(
    event?.registration_ends_at
      ? toLocalDateTimeString(event.registration_ends_at)
      : "",
  );
  const [capacity, setCapacity] = useState(event?.capacity || 0);
  const [category, setCategory] = useState<EventCategory | "">(
    event?.category || "",
  );
  const [tags, setTags] = useState(event?.tags?.join(", ") || "");
  const [youtubeEmbed, setYoutubeEmbed] = useState(event?.youtube_embed || "");
  const [coverImage, setCoverImage] = useState(event?.cover_image || "");
  const [status, setStatus] = useState<EventStatus>(event?.status || "draft");
  const [isFeatured, setIsFeatured] = useState(event?.is_featured || false);

  // Ticket types
  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>(
    event?.ticket_types?.map((t) => ({
      name: t.name,
      description: t.description || "",
      capacity: t.capacity,
      price: t.price,
      is_active: t.is_active,
    })) || [
      {
        name: "一般票",
        description: "",
        capacity: 0,
        price: 0,
        is_active: true,
      },
    ],
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (mode === "create" && !event?.slug) {
      setSlug(generateSlug(value));
    }
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: "", description: "", capacity: 0, price: 0, is_active: true },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const updateTicketType = (
    index: number,
    field: keyof TicketTypeForm,
    value: string | number | boolean,
  ) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const handleSubmit = async () => {
    if (!title || !slug || !startsAt) {
      setError("請填寫活動名稱、網址代稱、開始時間");
      return;
    }

    // Validate capacity
    if (capacity < 0 || capacity > 5000) {
      setError("總容量請設定在 0–5000 之間（0 = 無限制）");
      return;
    }

    // Validate ticket types
    for (const ticket of ticketTypes) {
      if (!ticket.name.trim()) {
        setError("每個票種都需要填寫名稱");
        return;
      }
      if (ticket.capacity < 0 || ticket.capacity > 5000) {
        setError(`票種「${ticket.name}」容量請設定在 0–5000 之間`);
        return;
      }
      if (ticket.price < 0 || ticket.price > 999999) {
        setError(`票種「${ticket.name}」價格請設定在 0–999,999 之間`);
        return;
      }
    }

    setSaving(true);
    setError("");

    const eventData = {
      title,
      subtitle: subtitle || null,
      slug,
      description: description || null,
      format,
      venue_name: venueName || null,
      venue_address: venueAddress || null,
      online_url: onlineUrl || null,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      registration_starts_at: registrationStartsAt
        ? new Date(registrationStartsAt).toISOString()
        : null,
      registration_ends_at: registrationEndsAt
        ? new Date(registrationEndsAt).toISOString()
        : null,
      capacity,
      category: category || null,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      youtube_embed: youtubeEmbed ? toYouTubeEmbedUrl(youtubeEmbed) : null,
      cover_image: coverImage || null,
      status,
      is_featured: isFeatured,
      ticket_types: ticketTypes,
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/events"
          : `/api/admin/events/${event?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "儲存失敗");
        setSaving(false);
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("網路錯誤，請重試");
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const numberInputClass = `${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "basic" && (
        <Card>
          <CardHeader>
            <CardTitle>基本資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={labelClass}>活動名稱 *</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="例：AI 工作坊"
              />
            </div>
            <div>
              <label className={labelClass}>副標題</label>
              <input
                className={inputClass}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="一句話說明活動"
              />
            </div>
            <div>
              <label className={labelClass}>網址代稱 (Slug) *</label>
              <input
                className={inputClass}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ai-workshop-2026"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                活動網址：solo.tw/events/{slug || "..."}
              </p>
            </div>
            <div>
              <label className={labelClass}>分類</label>
              <select
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
              >
                <option value="">選擇分類</option>
                <option value="workshop">工作坊</option>
                <option value="lecture">講座</option>
                <option value="meetup">聚會</option>
                <option value="conference">研討會</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>標籤（逗號分隔）</label>
              <input
                className={inputClass}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="AI, 實作, 入門"
              />
            </div>
            <div>
              <label className={labelClass}>封面圖片 URL</label>
              <input
                className={inputClass}
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "datetime" && (
        <Card>
          <CardHeader>
            <CardTitle>時間與地點</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={labelClass}>活動形式 *</label>
              <select
                className={inputClass}
                value={format}
                onChange={(e) => setFormat(e.target.value as EventFormat)}
              >
                <option value="offline">實體活動</option>
                <option value="online">線上活動</option>
                <option value="hybrid">混合活動</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>開始時間 *</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>結束時間</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </div>
            </div>
            {(format === "offline" || format === "hybrid") && (
              <>
                <div>
                  <label className={labelClass}>場地名稱</label>
                  <input
                    className={inputClass}
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="台北市某某會議中心"
                  />
                </div>
                <div>
                  <label className={labelClass}>場地地址</label>
                  <input
                    className={inputClass}
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                  />
                </div>
              </>
            )}
            {(format === "online" || format === "hybrid") && (
              <div>
                <label className={labelClass}>線上會議連結</label>
                <input
                  className={inputClass}
                  value={onlineUrl}
                  onChange={(e) => setOnlineUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>報名開始時間</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={registrationStartsAt}
                  onChange={(e) => setRegistrationStartsAt(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>報名截止時間</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={registrationEndsAt}
                  onChange={(e) => setRegistrationEndsAt(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>總容量（0 = 無限制）</label>
              <input
                type="number"
                className={numberInputClass}
                value={capacity}
                onChange={(e) =>
                  setCapacity(Math.min(parseInt(e.target.value) || 0, 5000))
                }
                min={0}
                max={5000}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "content" && (
        <Card>
          <CardHeader>
            <CardTitle>活動內容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={labelClass}>活動說明（支援 Markdown）</label>
              <textarea
                className={`${inputClass} min-h-[300px]`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="詳細的活動說明..."
              />
            </div>
            <div>
              <label className={labelClass}>YouTube 連結</label>
              <input
                className={inputClass}
                value={youtubeEmbed}
                onChange={(e) => setYoutubeEmbed(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 或 embed 連結"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                支援 YouTube 觀看連結或嵌入連結，儲存時會自動轉換
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "tickets" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>票種設定</CardTitle>
              <Button variant="outline" size="sm" onClick={addTicketType}>
                + 新增票種
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">票種 {index + 1}</span>
                  {ticketTypes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTicketType(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      刪除
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>票種名稱</label>
                    <input
                      className={inputClass}
                      value={ticket.name}
                      onChange={(e) =>
                        updateTicketType(index, "name", e.target.value)
                      }
                      placeholder="一般票"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>容量（0 = 無限制）</label>
                    <input
                      type="number"
                      className={numberInputClass}
                      value={ticket.capacity}
                      onChange={(e) =>
                        updateTicketType(
                          index,
                          "capacity",
                          Math.min(parseInt(e.target.value) || 0, 5000),
                        )
                      }
                      min={0}
                      max={5000}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>價格（TWD，0 = 免費）</label>
                    <input
                      type="number"
                      className={numberInputClass}
                      value={ticket.price}
                      onChange={(e) =>
                        updateTicketType(
                          index,
                          "price",
                          Math.min(parseInt(e.target.value) || 0, 999999),
                        )
                      }
                      min={0}
                      max={999999}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>說明</label>
                    <input
                      className={inputClass}
                      value={ticket.description}
                      onChange={(e) =>
                        updateTicketType(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "publish" && (
        <Card>
          <CardHeader>
            <CardTitle>發布設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={labelClass}>狀態</label>
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
              >
                <option value="draft">草稿</option>
                <option value="published">已發布</option>
                <option value="cancelled">已取消</option>
                <option value="archived">已結束</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                推薦活動（置頂顯示）
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action bar */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/admin/events")}>
          取消
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "儲存中..." : mode === "create" ? "建立活動" : "更新活動"}
        </Button>
      </div>
    </div>
  );
}
