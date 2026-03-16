"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface EmailTemplate {
  confirmed_subject: string | null;
  confirmed_body: string | null;
  waitlisted_subject: string | null;
  waitlisted_body: string | null;
  sender_name: string | null;
}

export default function EmailTemplatePage() {
  const params = useParams();
  const eventId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [eventTitle, setEventTitle] = useState("");

  const [confirmedSubject, setConfirmedSubject] = useState("");
  const [confirmedBody, setConfirmedBody] = useState("");
  const [waitlistedSubject, setWaitlistedSubject] = useState("");
  const [waitlistedBody, setWaitlistedBody] = useState("");
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    fetch(`/api/my-events/${eventId}/email-template`)
      .then((res) => res.json())
      .then((data) => {
        setEventTitle(data.event?.title || "");
        if (data.template) {
          setConfirmedSubject(data.template.confirmed_subject || "");
          setConfirmedBody(data.template.confirmed_body || "");
          setWaitlistedSubject(data.template.waitlisted_subject || "");
          setWaitlistedBody(data.template.waitlisted_body || "");
          setSenderName(data.template.sender_name || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/my-events/${eventId}/email-template`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmed_subject: confirmedSubject,
          confirmed_body: confirmedBody,
          waitlisted_subject: waitlistedSubject,
          waitlisted_body: waitlistedBody,
          sender_name: senderName,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "確認信模板已儲存！" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "儲存失敗" });
      }
    } catch {
      setMessage({ type: "error", text: "儲存失敗" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/dashboard/my-events" className="hover:text-primary">我的活動</Link>
            <span>/</span>
            <span>{eventTitle}</span>
            <span>/</span>
            <span>確認信</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">自訂確認信</h1>
          <p className="mt-1 text-sm text-stone-500">
            自訂報名確認信的內容。留空則使用預設模板。
          </p>
        </div>

        {message && (
          <div className={`mb-6 rounded-lg p-4 text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Sender Name (Premium only) */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">寄件者名稱</CardTitle>
              <CardDescription>Premium 方案可自訂寄件者顯示名稱</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>寄件者名稱</Label>
                <Input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="預設：solo.tw"
                  maxLength={50}
                />
                <p className="text-xs text-stone-500">Email 仍透過 solo.tw 平臺寄送，僅更改顯示名稱</p>
              </div>
            </CardContent>
          </Card>

          {/* Confirmed Email */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">報名確認信</CardTitle>
              <CardDescription>報名成功時寄送的信件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>信件主旨</Label>
                <Input
                  value={confirmedSubject}
                  onChange={(e) => setConfirmedSubject(e.target.value)}
                  placeholder={`預設：報名確認：你已成功報名《${eventTitle}》`}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label>自訂訊息</Label>
                <textarea
                  value={confirmedBody}
                  onChange={(e) => setConfirmedBody(e.target.value)}
                  placeholder="在標準活動資訊下方顯示的自訂訊息&#10;例：請攜帶筆記型電腦，我們將進行實作練習。"
                  rows={4}
                  maxLength={1000}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs text-stone-500">
                  可用變數：{"{{name}}"} 報名者姓名、{"{{event_title}}"} 活動名稱、{"{{event_date}}"} 活動日期
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Waitlisted Email */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">候補通知信</CardTitle>
              <CardDescription>名額已滿時寄送的候補通知</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>信件主旨</Label>
                <Input
                  value={waitlistedSubject}
                  onChange={(e) => setWaitlistedSubject(e.target.value)}
                  placeholder={`預設：候補通知：《${eventTitle}》`}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label>自訂訊息</Label>
                <textarea
                  value={waitlistedBody}
                  onChange={(e) => setWaitlistedBody(e.target.value)}
                  placeholder="候補通知中的自訂訊息"
                  rows={3}
                  maxLength={1000}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview hint */}
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-600">
              💡 <strong>預覽提示：</strong>確認信會自動包含活動資訊（時間、地點、票種），
              你的自訂訊息會顯示在標準資訊下方。線上會議連結只會在確認信中提供，不會出現在公開頁面。
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/my-events">取消</Link>
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "儲存中..." : "儲存模板"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
