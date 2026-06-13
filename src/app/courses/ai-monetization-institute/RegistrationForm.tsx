"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AM_SESSIONS,
  AM_BUNDLE_PRICE,
  AM_FULL_PRICE,
  computeAmount,
  isBundle,
  type SessionKey,
} from "@/lib/ai-monetization-pricing";

const LINE_OA = "https://line.me/R/ti/p/@016mxqyl";

export function RegistrationForm() {
  const [selected, setSelected] = useState<Record<SessionKey, boolean>>({
    joyce: false,
    claire: false,
    vista: false,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [transferLast5, setTransferLast5] = useState("");
  const [invoiceCompany, setInvoiceCompany] = useState("");
  const [invoiceTaxId, setInvoiceTaxId] = useState("");
  const [lineId, setLineId] = useState("");
  const [question, setQuestion] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ amount: number; sessionsCount: number } | null>(null);

  const keys = useMemo(
    () => AM_SESSIONS.map((s) => s.key).filter((k) => selected[k]),
    [selected],
  );
  const amount = computeAmount(keys);
  const bundle = isBundle(keys);

  function toggle(key: SessionKey) {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (keys.length === 0) {
      setError("請至少勾選一個報名單元。");
      return;
    }
    if (!/^\d{5}$/.test(transferLast5.trim())) {
      setError("請填寫轉帳帳號後五碼（5 位數字）。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/courses/ai-monetization/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          sessions: keys,
          transferLast5: transferLast5.trim(),
          invoiceCompany,
          invoiceTaxId,
          lineId,
          question,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "送出失敗，請稍後再試或來信 iamvista@gmail.com。");
        return;
      }
      setDone({ amount: data.amount ?? amount, sessionsCount: keys.length });
    } catch {
      setError("網路錯誤，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-6 text-center sm:p-8">
        <p className="text-2xl">🎉</p>
        <h3 className="mt-2 text-xl font-bold text-foreground">報名資料已收到</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          我們已收到你的報名與匯款資訊（應繳 NT${done.amount.toLocaleString()}）。
          主辦單位會用你提供的轉帳後五碼核對入帳，確認後再以 Email 通知你報名完成。
          確認信也已寄到你的信箱，請收信（含垃圾信匣）。
        </p>
        <a
          href={LINE_OA}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#06C755] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          加入 LINE 官方帳號接收上課通知（@016mxqyl）
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 匯款資訊 */}
      <section className="rounded-2xl border-2 border-sky-300 bg-sky-50/60 p-5 sm:p-6">
        <h3 className="text-base font-bold text-foreground">💳 報名與付款方式：銀行匯款</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          請<b>先完成匯款</b>，再填寫下方表單（含轉帳後五碼），方便主辦單位對帳。
        </p>
        <div className="mt-4 space-y-1.5 rounded-xl border border-sky-200 bg-background/80 p-4 text-sm">
          <p className="font-semibold text-foreground">🏦 第一銀行（中崙分行）</p>
          <p className="font-semibold text-foreground">🔢 帳號：142-10-090535</p>
          <p className="font-semibold text-foreground">👤 戶名：種子娛樂製作股份有限公司</p>
        </div>
      </section>

      {/* 選擇報名單元 */}
      <section>
        <h3 className="text-base font-semibold text-foreground">
          選擇報名單元 <span className="text-rose-600">*</span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          可單選或複選。三組全選自動套用四堂套票價 NT${AM_BUNDLE_PRICE.toLocaleString()}。
        </p>
        <div className="mt-4 space-y-3">
          {AM_SESSIONS.map((s) => {
            const active = selected[s.key];
            return (
              <label
                key={s.key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                  active
                    ? "border-primary bg-amber-50/50"
                    : "border-stone-200 bg-card hover:border-stone-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle(s.key)}
                  className="h-5 w-5 shrink-0 accent-amber-600"
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {s.instructor}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {s.axis}｜{s.dates}
                  </span>
                </span>
                <span className="shrink-0 text-base font-bold text-primary">
                  NT${s.price.toLocaleString()}
                </span>
              </label>
            );
          })}
        </div>

        {/* 金額計算 */}
        <div className="mt-4 rounded-xl border-2 border-primary/40 bg-background/80 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {keys.length === 0
                  ? "尚未選擇單元"
                  : bundle
                    ? "🎯 四堂套票方案"
                    : `已選 ${keys.length} 個單元`}
              </p>
              {bundle && (
                <p className="text-xs text-muted-foreground">
                  四堂完整路徑（定位 → 工具 → 內容 → 流量 → 變現）
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                NT${amount.toLocaleString()}
              </span>
              {bundle && (
                <>
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    NT${AM_FULL_PRICE.toLocaleString()}
                  </span>
                  <p className="text-xs text-emerald-600">
                    現省 NT${(AM_FULL_PRICE - AM_BUNDLE_PRICE).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 聯絡資料 */}
      <section>
        <h3 className="text-base font-semibold text-foreground">聯絡資料（必填）</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          這是課前提醒、教室地址與報名確認的唯一管道，請填真實可聯絡的資訊。
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="am-email">
              E-mail <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="am-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="am-name">
              姓名 <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="am-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="王大明"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="am-phone">
              手機 <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="am-phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              inputMode="tel"
            />
          </div>
        </div>
      </section>

      {/* 匯款對帳 */}
      <section>
        <h3 className="text-base font-semibold text-foreground">匯款對帳資訊（必填）</h3>
        <div className="mt-5 space-y-1.5">
          <Label htmlFor="am-last5">
            轉帳帳號後五碼 <span className="text-rose-600">*</span>
          </Label>
          <Input
            id="am-last5"
            required
            value={transferLast5}
            onChange={(e) =>
              setTransferLast5(e.target.value.replace(/\D/g, "").slice(0, 5))
            }
            placeholder="例：09535"
            inputMode="numeric"
            maxLength={5}
          />
          <p className="text-xs text-muted-foreground">
            請填你<b>轉出帳號</b>的後五碼，主辦單位用來核對入帳。完成匯款後再填寫。
          </p>
        </div>
      </section>

      {/* 選填 */}
      <section>
        <h3 className="text-base font-semibold text-foreground">選填資訊</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="am-invoice-company">發票抬頭（公司報帳用）</Label>
            <Input
              id="am-invoice-company"
              value={invoiceCompany}
              onChange={(e) => setInvoiceCompany(e.target.value)}
              placeholder="OO 股份有限公司"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="am-invoice-taxid">統一編號</Label>
            <Input
              id="am-invoice-taxid"
              value={invoiceTaxId}
              onChange={(e) =>
                setInvoiceTaxId(e.target.value.replace(/\D/g, "").slice(0, 8))
              }
              placeholder="8 位數字"
              inputMode="numeric"
              maxLength={8}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="am-line">LINE ID</Label>
            <Input
              id="am-line"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              placeholder="方便接收上課通知"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="am-question">想先讓老師知道的事 / 備註</Label>
            <Textarea
              id="am-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="選填"
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div>
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full text-base"
          disabled={submitting}
        >
          {submitting
            ? "送出中…"
            : keys.length === 0
              ? "請先選擇報名單元"
              : `送出報名（應繳 NT$${amount.toLocaleString()}）`}
        </Button>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          送出後會收到確認信。報名或繳費有任何問題，歡迎來信{" "}
          <a
            href="mailto:iamvista@gmail.com?subject=AI%20%E8%AE%8A%E7%8F%BE%E7%A0%94%E7%A9%B6%E9%99%A2%E5%A0%B1%E5%90%8D"
            className="text-primary underline underline-offset-2"
          >
            iamvista@gmail.com
          </a>
        </p>
      </div>
    </form>
  );
}
