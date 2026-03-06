"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TicketTypeWithCount } from "@/lib/supabase/types";

interface Props {
  eventId: string;
  ticketTypes: TicketTypeWithCount[];
  registrationEndsAt: string | null;
}

export default function RegistrationForm({ eventId, ticketTypes, registrationEndsAt }: Props) {
  const [selectedTicket, setSelectedTicket] = useState(ticketTypes[0]?.id || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const isExpired = registrationEndsAt && new Date(registrationEndsAt) < new Date();

  if (isExpired) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          報名已截止
        </CardContent>
      </Card>
    );
  }

  if (result?.success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-8 text-center">
          <p className="text-lg font-bold text-green-700">{result.message}</p>
          <p className="mt-2 text-sm text-green-600">確認信已發送到你的信箱</p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedTicket) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          ticket_type_id: selectedTicket,
          name,
          email,
          phone: phone || undefined,
          note: note || undefined,
          utm_source: new URLSearchParams(window.location.search).get("utm_source") || undefined,
          utm_medium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
          utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch {
      setResult({ success: false, message: "網路錯誤，請重試" });
    }
    setSubmitting(false);
  };

  const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  return (
    <Card>
      <CardContent className="p-6">
        {result && !result.success && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{result.message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {ticketTypes.length > 1 && (
            <div>
              <label className="block text-sm font-medium mb-1.5">選擇票種 *</label>
              <select className={inputClass} value={selectedTicket} onChange={(e) => setSelectedTicket(e.target.value)}>
                {ticketTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.capacity > 0 ? `（剩餘 ${Math.max(0, t.capacity - t.confirmed_count)} 名）` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">姓名 *</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required placeholder="你的姓名" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email *</label>
              <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">電話（選填）</label>
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912-345-678" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">備註（選填）</label>
              <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="想對主辦人說的話" />
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "報名中..." : "送出報名"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
