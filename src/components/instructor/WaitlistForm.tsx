"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizePhone } from "@/lib/phone";

export function WaitlistForm({
  courseSlug,
  instructorSlug,
  courseTitle,
}: {
  courseSlug: string;
  instructorSlug: string;
  courseTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  const phoneError = useMemo(() => {
    if (!phoneTouched) return null;
    const val = form.phone.trim();
    if (!val) return null;
    return normalizePhone(val)
      ? null
      : "手機號碼看起來不完整，請填完整 10 碼（09 開頭）或帶國碼的國際號碼。";
  }, [phoneTouched, form.phone]);

  function set(k: "name" | "email" | "phone", v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setState("error");
      setMsg("姓名與 E-mail 為必填");
      return;
    }
    if (form.phone.trim() && !normalizePhone(form.phone.trim())) {
      setPhoneTouched(true);
      setState("error");
      setMsg("手機號碼格式不正確");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/courses/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_slug: courseSlug,
          instructor_slug: instructorSlug,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          source_page: `/teachers/${instructorSlug}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "送出失敗");
      setState("done");
      setMsg("已記下你！這門課下一梯開課，我們第一個通知你。");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "送出失敗");
    }
  }

  if (state === "done") {
    return <p className="mt-2 text-sm text-emerald-700">{msg}</p>;
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        通知我下一梯
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 flex flex-col gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
      <p className="text-sm font-medium text-stone-700">
        《{courseTitle}》下一梯通知我
      </p>
      <Input placeholder="姓名" value={form.name} onChange={(e) => set("name", e.target.value)} aria-label="姓名" />
      <Input type="email" inputMode="email" placeholder="E-mail" value={form.email} onChange={(e) => set("email", e.target.value)} aria-label="E-mail" />
      <Input
        type="tel"
        inputMode="tel"
        placeholder="手機（選填，方便課前聯絡你）"
        value={form.phone}
        onChange={(e) => set("phone", e.target.value)}
        onBlur={() => setPhoneTouched(true)}
        aria-invalid={!!phoneError}
        aria-label="手機"
      />
      {phoneError && <p className="text-xs text-rose-600">{phoneError}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={state === "loading"}>
          {state === "loading" ? "送出中…" : "送出"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          取消
        </Button>
      </div>
      {state === "error" && <p className="text-sm text-rose-600">{msg}</p>}
    </form>
  );
}
