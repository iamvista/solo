"use client";

import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { CourseConfig, PricingPlan } from "@/lib/courses-config";
import { loadRecurFromCdn } from "@/lib/recur-checkout-types";

interface PlanOption {
  plan: PricingPlan;
  label: string;
  amount: number;
  description?: string;
  productId: string;
}

interface Props {
  course: CourseConfig;
  plans: PlanOption[];
  defaultPlan: PricingPlan;
  publishableKey: string;
}

interface FormState {
  plan: PricingPlan;
  email: string;
  name: string;
  phone: string;
  organization: string;
  jobTitle: string;
  attribution: string;
  question: string;
  currentProposalPain: string;
  alumniCertificate: string;
  lineId: string;
  facebook: string;
  dietary: string;
  invoiceCompany: string;
  invoiceTaxId: string;
  marketingConsent: boolean;
  companionName: string;
  companionEmail: string;
  companionPhone: string;
}

const ATTRIBUTION_OPTIONS = [
  "朋友／同事推薦",
  "Vista 的電子報",
  "Vista 的 FB／IG／Threads",
  "陳建銘老師的分享",
  "搜尋引擎找到的",
  "其他（請在備註說明）",
];

const DIETARY_OPTIONS = ["葷食皆可", "素食", "海鮮過敏", "其他過敏（請說明）"];

export function CourseRegistrationForm({
  course,
  plans,
  defaultPlan,
  publishableKey,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    plan: defaultPlan,
    email: "",
    name: "",
    phone: "",
    organization: "",
    jobTitle: "",
    attribution: "",
    question: "",
    currentProposalPain: "",
    alumniCertificate: "",
    lineId: "",
    facebook: "",
    dietary: "",
    invoiceCompany: "",
    invoiceTaxId: "",
    marketingConsent: true,
    companionName: "",
    companionEmail: "",
    companionPhone: "",
  });

  const selectedPlan = useMemo(
    () => plans.find((p) => p.plan === form.plan) ?? plans[0],
    [plans, form.plan],
  );
  const isDual = form.plan === "dual";
  const isAlumni = form.plan === "alumni";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.email.trim() || !form.name.trim() || !form.phone.trim()) {
      setError("E-mail、姓名、手機是必填欄位。");
      return;
    }

    if (isDual) {
      if (
        !form.companionName.trim() ||
        !form.companionEmail.trim() ||
        !form.companionPhone.trim()
      ) {
        setError("選擇雙人同行方案時，同行夥伴的姓名、E-mail、手機都是必填。");
        return;
      }
    }

    if (isAlumni && !form.alumniCertificate.trim()) {
      setError(
        "選擇舊生優惠方案時，請在備註欄填寫過去報名憑證（如報名信件主旨／日期／訂單編號／梯次）。",
      );
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/courses/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug: course.slug,
            ...form,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || "送出失敗，請再試一次或直接寫信給我們。");
          return;
        }

        const enrollmentId: string = json.enrollmentId;
        const productId: string = json.productId;
        const customerEmail: string = json.customerEmail;
        const customerName: string = json.customerName;
        const metadata: Record<string, string> = json.metadata ?? {};

        const recur = await loadRecurFromCdn(publishableKey);
        const successUrl = `${window.location.origin}${course.detailUrl}/register/success?enrollment_id=${enrollmentId}`;
        const cancelUrl = `${window.location.origin}${course.detailUrl}/register?cancelled=1`;

        await recur.redirectToCheckout({
          productId,
          successUrl,
          cancelUrl,
          customerEmail,
          customerName,
          metadata,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "未知錯誤";
        setError(`送出時出錯：${msg}`);
      }
    });
  };

  const cancelled =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("cancelled") === "1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {cancelled && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          結帳已取消。你的資料還在表單上，調整完可以再次送出。
        </div>
      )}

      {/* 方案選擇 */}
      <section>
        <h2 className="text-base font-semibold text-foreground">選擇報名方案</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          雙人同行可在課堂互相扮演提案方與決策方，練習效果更完整。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {plans.map((p) => {
            const active = form.plan === p.plan;
            return (
              <label
                key={p.plan}
                className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition-colors ${
                  active
                    ? "border-primary bg-amber-50/50"
                    : "border-stone-200 bg-card hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.plan}
                  checked={active}
                  onChange={() => update("plan", p.plan)}
                  className="sr-only"
                />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-base font-semibold">{p.label}</span>
                  <span className="text-2xl font-bold text-primary">
                    NT${p.amount.toLocaleString()}
                  </span>
                </div>
                {p.description && (
                  <span className="text-xs text-muted-foreground">
                    {p.description}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </section>

      {/* 必填區塊 */}
      <section>
        <h2 className="text-base font-semibold text-foreground">聯絡資料（必填）</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          這三個欄位是課前提醒、教室地址、補位通知的唯一管道。請務必填寫真實可聯絡到的資訊。
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">
              E-mail <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="iamvista@gmail.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">
              姓名 <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="王大明"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              手機 <span className="text-rose-600">*</span>
            </Label>
            <Input
              id="phone"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="0912345678 或 +886912345678"
              inputMode="tel"
            />
            <p className="text-xs text-muted-foreground">
              臺灣手機輸入 09 開頭即可；國際號碼請帶國碼（例 +1, +81）。
            </p>
          </div>
        </div>
      </section>

      {/* 雙人同行：同行夥伴資料 */}
      {isDual && (
        <section className="rounded-xl border-2 border-amber-300 bg-amber-50/40 p-5">
          <h2 className="text-base font-semibold text-foreground">
            👫 同行夥伴資料（必填）
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            雙人同行方案需提供另一位夥伴的聯絡方式，課前提醒會同時寄給雙方。
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="companionEmail">
                夥伴 E-mail <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="companionEmail"
                type="email"
                required={isDual}
                value={form.companionEmail}
                onChange={(e) => update("companionEmail", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="companionName">
                夥伴姓名 <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="companionName"
                required={isDual}
                value={form.companionName}
                onChange={(e) => update("companionName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="companionPhone">
                夥伴手機 <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="companionPhone"
                required={isDual}
                value={form.companionPhone}
                onChange={(e) => update("companionPhone", e.target.value)}
                placeholder="0912345678 或 +886912345678"
                inputMode="tel"
              />
            </div>
          </div>
        </section>
      )}

      {/* 舊生優惠：報名憑證 */}
      {isAlumni && (
        <section className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
          <h2 className="text-base font-semibold text-foreground">
            🎓 舊生報名憑證（必填）
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            舊生優惠採信任制，請在下方填寫你過去上 Antigravity 版 Vibe Coding 工作坊的可佐證資訊（任一即可），課前會抽查比對名單。
          </p>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="alumniCertificate">
              過去報名資訊 <span className="text-rose-600">*</span>
            </Label>
            <Textarea
              id="alumniCertificate"
              rows={4}
              required={isAlumni}
              value={form.alumniCertificate}
              onChange={(e) => update("alumniCertificate", e.target.value)}
              placeholder="例：第 5 班・2026/4/12 上課・OEN 訂單編號 ABC123；或：第 6 班・林克威介紹參加・報名信件主旨『Vibe Coding 工作坊報名確認』；或：原報名 E-mail（若與本次相同可不填）。"
            />
            <p className="text-xs text-muted-foreground">
              若查無紀錄會聯絡你補件，補件成功才會發送付款連結。如需協助請來信
              iamvista@gmail.com。
            </p>
          </div>
        </section>
      )}

      {/* 背景區塊 */}
      <section>
        <h2 className="text-base font-semibold text-foreground">關於你（選填）</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          填越完整，講師越能在課堂上對應你的職場情境。
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="organization">公司／組織</Label>
            <Input
              id="organization"
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
              placeholder="例：自由人學院"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jobTitle">職稱</Label>
            <Input
              id="jobTitle"
              value={form.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
              placeholder="例：產品企劃 / 行銷經理"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lineId">LINE ID（選填）</Label>
            <Input
              id="lineId"
              value={form.lineId}
              onChange={(e) => update("lineId", e.target.value)}
              placeholder="加入課程群組會用"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="facebook">Facebook（選填）</Label>
            <Input
              id="facebook"
              value={form.facebook}
              onChange={(e) => update("facebook", e.target.value)}
              placeholder="個人檔案網址或帳號名"
            />
          </div>
        </div>
      </section>

      {/* 客製問題 */}
      {course.customQuestionLabel && (
        <section>
          <div className="space-y-1.5">
            <Label htmlFor="currentProposalPain">{course.customQuestionLabel}</Label>
            <Textarea
              id="currentProposalPain"
              rows={4}
              value={form.currentProposalPain}
              onChange={(e) => update("currentProposalPain", e.target.value)}
              placeholder={course.customQuestionPlaceholder}
            />
          </div>
        </section>
      )}

      {/* 想問講師的問題 */}
      <section>
        <div className="space-y-1.5">
          <Label htmlFor="question">其他想問講師的問題（選填）</Label>
          <Textarea
            id="question"
            rows={3}
            value={form.question}
            onChange={(e) => update("question", e.target.value)}
            placeholder="任何想問的都可以寫，講師會在課前讀過。"
          />
        </div>
      </section>

      {/* 歸因 */}
      <section>
        <Label className="text-sm font-medium">怎麼知道這堂課的？（選填）</Label>
        <div className="mt-3 space-y-2">
          {ATTRIBUTION_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-sm transition-colors hover:border-primary/30"
            >
              <input
                type="radio"
                name="attribution"
                value={opt}
                checked={form.attribution === opt}
                onChange={(e) => update("attribution", e.target.value)}
                className="h-4 w-4 accent-primary"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 飲食偏好 */}
      {course.hasMeal && (
        <section>
          <Label className="text-sm font-medium">
            午餐偏好（含精美午餐餐盒，請選一項）
          </Label>
          <div className="mt-3 space-y-2">
            {DIETARY_OPTIONS.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-sm transition-colors hover:border-primary/30"
              >
                <input
                  type="radio"
                  name="dietary"
                  value={opt}
                  checked={form.dietary === opt}
                  onChange={(e) => update("dietary", e.target.value)}
                  className="h-4 w-4 accent-primary"
                />
                <span>{opt}</span>
              </label>
            ))}
            <Input
              placeholder="若有具體過敏項，請補充說明"
              value={form.dietary.startsWith("其他") ? form.dietary.replace("其他過敏（請說明）", "") : ""}
              onChange={(e) => update("dietary", `其他過敏（請說明）${e.target.value}`)}
              className="ml-7 mt-1 max-w-md"
              disabled={!form.dietary.startsWith("其他")}
            />
          </div>
        </section>
      )}

      {/* 公司報帳 */}
      <section>
        <h2 className="text-base font-semibold text-foreground">公司報帳發票（選填）</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          需要公司報帳請填，會開立電子發票。
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="invoiceCompany">公司抬頭</Label>
            <Input
              id="invoiceCompany"
              value={form.invoiceCompany}
              onChange={(e) => update("invoiceCompany", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoiceTaxId">統一編號</Label>
            <Input
              id="invoiceTaxId"
              value={form.invoiceTaxId}
              onChange={(e) => update("invoiceTaxId", e.target.value)}
              placeholder="8 碼"
              inputMode="numeric"
              maxLength={8}
            />
          </div>
        </div>
      </section>

      {/* 行銷同意 */}
      <section className="flex items-start gap-3 rounded-lg border bg-stone-50 p-4">
        <Checkbox
          id="marketingConsent"
          checked={form.marketingConsent}
          onCheckedChange={(checked) => update("marketingConsent", !!checked)}
          className="mt-0.5"
        />
        <Label
          htmlFor="marketingConsent"
          className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground"
        >
          我願意收到 Vista 電子報與相關課程的開班通知、學習資源等訊息。隨時可在電子報底部退訂。
        </Label>
      </section>

      {/* 送出 */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {error}
        </div>
      )}

      <div className="rounded-xl border-2 border-primary/30 bg-amber-50/30 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            本次應付（{selectedPlan.label}）
          </span>
          <span className="text-3xl font-bold text-primary">
            NT${selectedPlan.amount.toLocaleString()}
          </span>
        </div>
        {selectedPlan.plan === "early_bird" && course.earlyBirdDeadline && (
          <p className="mt-1 text-right text-xs text-emerald-700">
            ⚡ 早鳥優惠（{course.earlyBirdDeadline} 截止）
          </p>
        )}
        {isDual && (
          <p className="mt-1 text-right text-xs text-amber-700">
            👫 兩人同行・雙方都會收到課前提醒
          </p>
        )}
        {isAlumni && (
          <p className="mt-1 text-right text-xs text-primary">
            🎓 舊生優惠・課前抽查比對名單
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          className="mt-4 h-12 w-full text-base"
          disabled={pending}
        >
          {pending ? "處理中…請稍候" : "確認資料・前往付款"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          按下後會跳轉到 PAYUNi 信用卡刷卡頁。開課前 2026/6/6 前可全額退費。
        </p>
      </div>
    </form>
  );
}
