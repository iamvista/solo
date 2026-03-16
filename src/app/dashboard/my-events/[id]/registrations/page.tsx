"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  note: string | null;
  created_at: string;
  ticket_types: { name: string } | null;
}

const STATUS_CLASS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  waitlisted: "bg-amber-100 text-amber-700",
  cancelled: "bg-stone-100 text-stone-500",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "已確認",
  waitlisted: "候補",
  cancelled: "已取消",
};

export default function EventRegistrationsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<{ id: string; title: string } | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch(`/api/my-events/${eventId}/registrations`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event);
        setRegistrations(data.registrations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/my-events/${eventId}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export_csv" }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `registrations-${eventId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const confirmed = registrations.filter((r) => r.status === "confirmed").length;
  const waitlisted = registrations.filter((r) => r.status === "waitlisted").length;
  const total = registrations.filter((r) => r.status !== "cancelled").length;

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Link href="/dashboard/my-events" className="hover:text-primary">我的活動</Link>
              <span>/</span>
              <span>{event?.title || "活動"}</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-stone-900">報名者管理</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={exporting || total === 0}>
              {exporting ? "匯出中..." : "匯出 CSV"}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/my-events">← 返回</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{confirmed}</p>
              <p className="text-xs text-stone-500">已確認</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{waitlisted}</p>
              <p className="text-xs text-stone-500">候補中</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-stone-700">{total}</p>
              <p className="text-xs text-stone-500">總報名</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg">報名者清單</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-stone-50 text-left text-xs font-medium text-stone-500">
                      <th className="px-4 py-3">姓名</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">電話</th>
                      <th className="px-4 py-3">票種</th>
                      <th className="px-4 py-3">狀態</th>
                      <th className="px-4 py-3">報名時間</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 font-medium text-stone-900">{reg.name}</td>
                        <td className="px-4 py-3 text-stone-600">{reg.email}</td>
                        <td className="px-4 py-3 text-stone-600">{reg.phone || "—"}</td>
                        <td className="px-4 py-3 text-stone-600">{reg.ticket_types?.name || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[reg.status] || ""}`}>
                            {STATUS_LABEL[reg.status] || reg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-500">
                          {new Date(reg.created_at).toLocaleString("zh-TW")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-stone-500">還沒有人報名</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
