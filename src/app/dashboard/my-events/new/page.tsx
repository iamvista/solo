"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<"online" | "offline" | "hybrid">("offline");
  const [category, setCategory] = useState<string>("workshop");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [registrationEndsAt, setRegistrationEndsAt] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [ticketName, setTicketName] = useState("一般票");
  const [ticketPrice, setTicketPrice] = useState(0);

  const handleSubmit = async (status: "draft" | "published") => {
    if (!title.trim()) {
      setError("請輸入活動名稱");
      return;
    }
    if (!startsAt) {
      setError("請設定活動開始時間");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/my-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          slug: generateSlug(title),
          description: description.trim() || null,
          format,
          category,
          venue_name: format !== "online" ? venueName.trim() || null : null,
          venue_address: format !== "online" ? venueAddress.trim() || null : null,
          online_url: format !== "offline" ? onlineUrl.trim() || null : null,
          starts_at: new Date(startsAt).toISOString(),
          ends_at: endsAt ? new Date(endsAt).toISOString() : null,
          registration_ends_at: registrationEndsAt ? new Date(registrationEndsAt).toISOString() : null,
          capacity,
          status,
          tags: [],
          is_featured: false,
          ticketTypes: [
            {
              name: ticketName || "一般票",
              capacity,
              price: ticketPrice,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "建立失敗");
        if (data.upgrade) {
          // Show upgrade message
        }
        return;
      }

      router.push("/dashboard/my-events");
    } catch {
      setError("建立失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">建立活動</h1>
            <p className="mt-1 text-sm text-stone-500">填寫基本資訊，建立你的活動頁面</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/my-events">取消</Link>
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">基本資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>活動名稱 *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：AI 工具應用工作坊" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label>副標題</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="簡短描述" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label>活動說明</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="詳細活動說明（支援 Markdown）"
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>活動形式</Label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as "online" | "offline" | "hybrid")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="offline">實體</option>
                    <option value="online">線上</option>
                    <option value="hybrid">混合</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>活動類別</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="workshop">工作坊</option>
                    <option value="lecture">講座</option>
                    <option value="meetup">聚會</option>
                    <option value="conference">研討會</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Location */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">時間與地點</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>開始時間 *</Label>
                  <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>結束時間</Label>
                  <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>報名截止時間</Label>
                <Input type="datetime-local" value={registrationEndsAt} onChange={(e) => setRegistrationEndsAt(e.target.value)} />
              </div>

              {format !== "online" && (
                <>
                  <div className="space-y-2">
                    <Label>場地名稱</Label>
                    <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="例：臺北文創大樓" />
                  </div>
                  <div className="space-y-2">
                    <Label>場地地址</Label>
                    <Input value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="完整地址" />
                  </div>
                </>
              )}

              {format !== "offline" && (
                <div className="space-y-2">
                  <Label>線上會議連結</Label>
                  <Input value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} placeholder="Zoom / Google Meet 連結" />
                  <p className="text-xs text-stone-500">此連結只會透過確認信提供給已報名者，不會顯示在公開頁面</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">票種設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>票種名稱</Label>
                  <Input value={ticketName} onChange={(e) => setTicketName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>容量（人數）</Label>
                  <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} min={1} max={5000} />
                </div>
                <div className="space-y-2">
                  <Label>價格（NT$）</Label>
                  <Input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} min={0} />
                </div>
              </div>
              <p className="text-xs text-stone-500">
                目前每場活動支援一種票種。需要多票種？
                <Link href="/pricing" className="text-primary hover:underline">升級至 Premium</Link>
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={saving}
              className="h-11"
            >
              儲存為草稿
            </Button>
            <Button
              onClick={() => handleSubmit("published")}
              disabled={saving}
              className="h-11"
            >
              {saving ? "建立中..." : "發布活動"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
