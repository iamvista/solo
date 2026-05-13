"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CONSULTING_TOPICS,
  CONSULTING_PLANS,
  CONSULTING_LEVELS,
  CONSULTING_DESIRED_START,
  CONSULTING_ATTRIBUTION,
} from "@/lib/consulting-config";

type ContactMethod = "email" | "line" | "ig";

interface FormState {
  name: string;
  email: string;
  contactMethod: ContactMethod;
  contactId: string;
  topics: string[];
  specificProblem: string;
  expectedOutcome: string;
  level: string;
  desiredStart: string;
  plan: string;
  attribution: string;
  consentTerms: boolean;
  subscribeNewsletter: boolean;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  contactMethod: "email",
  contactId: "",
  topics: [],
  specificProblem: "",
  expectedOutcome: "",
  level: "",
  desiredStart: "",
  plan: "",
  attribution: "",
  consentTerms: false,
  subscribeNewsletter: false,
};

interface Props {
  prefillTopic?: string;
}

const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: "email", label: "E-mail" },
  { value: "line", label: "LINE" },
  { value: "ig", label: "IG DM" },
];

export function LeadForm({ prefillTopic }: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(() =>
    prefillTopic ? { ...INITIAL, topics: [prefillTopic] } : INITIAL,
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const toggleTopic = (slug: string) => {
    setState((s) => ({
      ...s,
      topics: s.topics.includes(slug)
        ? s.topics.filter((t) => t !== slug)
        : [...s.topics, slug],
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // 客端必填檢查
    const reqErrors: Record<string, string> = {};
    if (!state.name.trim()) reqErrors.name = "請填姓名";
    if (!state.email.trim()) reqErrors.email = "請填 E-mail";
    if (state.contactMethod !== "email" && !state.contactId.trim()) {
      reqErrors.contactId = `請填寫 ${state.contactMethod.toUpperCase()} ID`;
    }
    if (state.topics.length === 0) reqErrors.topics = "請至少勾一個主題";
    if (state.specificProblem.trim().length < 30)
      reqErrors.specificProblem = "請至少描述 30 字";
    if (!state.level) reqErrors.level = "請選擇程度";
    if (!state.plan) reqErrors.plan = "請選擇時數方案";
    if (!state.consentTerms) reqErrors.consentTerms = "需勾選同意條款";
    if (Object.keys(reqErrors).length > 0) {
      setErrors(reqErrors);
      setSubmitting(false);
      return;
    }

    const payload = {
      name: state.name.trim(),
      email: state.email.trim(),
      contactMethod: state.contactMethod,
      contactId: state.contactId.trim() || undefined,
      topics: state.topics,
      specificProblem: state.specificProblem.trim(),
      expectedOutcome: state.expectedOutcome.trim() || undefined,
      level: state.level,
      desiredStart: state.desiredStart || undefined,
      plan: state.plan,
      attribution: state.attribution || undefined,
      consentTerms: true as const,
      subscribeNewsletter: state.subscribeNewsletter,
    };

    try {
      const res = await fetch("/api/consulting/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        else setErrors({ _form: data.error ?? "送出失敗，請稍後再試。" });
        setSubmitting(false);
        return;
      }

      router.push(`/consulting/thanks?lead_id=${data.leadId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "未知錯誤";
      setErrors({ _form: `送出時出錯：${msg}` });
      setSubmitting(false);
    }
  }

  return (
    <form id="lead-form" onSubmit={handleSubmit} className="space-y-10" noValidate>
      {/* ───────────────────────────────── 一、聯絡方式 ───────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">一、聯絡方式</legend>

        <div className="space-y-1.5">
          <Label htmlFor="name">
            姓名 <span className="text-rose-600">*</span>
          </Label>
          <Input
            id="name"
            value={state.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="王大明"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            E-mail <span className="text-rose-600">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={state.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            偏好聯絡方式 <span className="text-rose-600">*</span>
          </Label>
          <div className="flex flex-wrap gap-4">
            {CONTACT_METHODS.map((m) => (
              <label
                key={m.value}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={m.value}
                  checked={state.contactMethod === m.value}
                  onChange={() => update("contactMethod", m.value)}
                  className="h-4 w-4 accent-primary"
                />
                <span>{m.label}</span>
              </label>
            ))}
          </div>
          {state.contactMethod !== "email" && (
            <div className="mt-2 space-y-1.5">
              <Label htmlFor="contactId">
                {state.contactMethod === "line" ? "LINE" : "IG"} ID{" "}
                <span className="text-rose-600">*</span>
              </Label>
              <Input
                id="contactId"
                value={state.contactId}
                onChange={(e) => update("contactId", e.target.value)}
                placeholder={
                  state.contactMethod === "line"
                    ? "@your_line_id 或顯示名稱"
                    : "@your_ig_handle"
                }
              />
              {errors.contactId && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.contactId}
                </p>
              )}
            </div>
          )}
        </div>
      </fieldset>

      {/* ───────────────────────────────── 二、想學什麼 ───────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">二、想學什麼</legend>

        <div className="space-y-2">
          <Label>
            主題範圍（可複選）<span className="text-rose-600">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">
            勾選一個或多個您想討論的主題。
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {CONSULTING_TOPICS.map((topic) => {
              const checked = state.topics.includes(topic.slug);
              return (
                <label
                  key={topic.slug}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    checked
                      ? "border-primary bg-amber-50/50"
                      : "border-stone-200 bg-card hover:border-stone-300"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleTopic(topic.slug)}
                    className="mt-0.5"
                  />
                  <span className="flex-1 text-sm">
                    <span className="mr-1">{topic.emoji}</span>
                    <span className="font-medium">{topic.title}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.topics && (
            <p className="mt-1 text-sm text-destructive">{errors.topics}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="specificProblem">
            想解決的具體問題 <span className="text-rose-600">*</span>
            <span className="ml-1 text-xs text-muted-foreground">
              （至少 30 字）
            </span>
          </Label>
          <Textarea
            id="specificProblem"
            rows={5}
            value={state.specificProblem}
            onChange={(e) => update("specificProblem", e.target.value)}
            placeholder="我想用 AI 整合筆記，但不知道從哪開始？"
          />
          <p className="text-xs text-muted-foreground">
            已填 {state.specificProblem.trim().length} 字
          </p>
          {errors.specificProblem && (
            <p className="mt-1 text-sm text-destructive">
              {errors.specificProblem}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expectedOutcome">
            期待上完課後帶走什麼產出（選填）
          </Label>
          <Textarea
            id="expectedOutcome"
            rows={3}
            value={state.expectedOutcome}
            onChange={(e) => update("expectedOutcome", e.target.value)}
            placeholder="例如：希望帶走一個可用的 Vibe Coding starter 模板"
          />
        </div>
      </fieldset>

      {/* ───────────────────────────────── 三、了解您 ───────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">三、了解您</legend>

        <div className="space-y-2">
          <Label>
            目前的 AI / Coding 程度 <span className="text-rose-600">*</span>
          </Label>
          <div className="space-y-2">
            {CONSULTING_LEVELS.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                  state.level === opt.value
                    ? "border-primary bg-amber-50/50"
                    : "border-stone-200 bg-card hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="level"
                  value={opt.value}
                  checked={state.level === opt.value}
                  onChange={() => update("level", opt.value)}
                  className="h-4 w-4 accent-primary"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.level && (
            <p className="mt-1 text-sm text-destructive">{errors.level}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="desiredStart">預計開始時間（選填）</Label>
          <select
            id="desiredStart"
            value={state.desiredStart}
            onChange={(e) => update("desiredStart", e.target.value)}
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] md:text-sm"
          >
            <option value="">請選擇…</option>
            {CONSULTING_DESIRED_START.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* ───────────────────────────────── 四、購買意向 ───────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">四、購買意向</legend>

        <div className="space-y-2">
          <Label>
            我想預約的時數 <span className="text-rose-600">*</span>
          </Label>
          <div className="space-y-2">
            {CONSULTING_PLANS.map((plan) => (
              <label
                key={plan.slug}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors ${
                  state.plan === plan.slug
                    ? "border-primary bg-amber-50/50"
                    : "border-stone-200 bg-card hover:border-stone-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value={plan.slug}
                    checked={state.plan === plan.slug}
                    onChange={() => update("plan", plan.slug)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="font-medium">{plan.label}</span>
                </span>
                <span className="font-semibold text-primary">
                  NT${plan.totalPrice.toLocaleString()}
                </span>
              </label>
            ))}
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                state.plan === "undecided"
                  ? "border-primary bg-amber-50/50"
                  : "border-stone-200 bg-card hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="plan"
                value="undecided"
                checked={state.plan === "undecided"}
                onChange={() => update("plan", "undecided")}
                className="h-4 w-4 accent-primary"
              />
              <span>還沒決定，想先聊聊</span>
            </label>
          </div>
          {errors.plan && (
            <p className="mt-1 text-sm text-destructive">{errors.plan}</p>
          )}
        </div>
      </fieldset>

      {/* ───────────────────────────────── 五、其他 ───────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="text-xl font-semibold">五、其他</legend>

        <div className="space-y-1.5">
          <Label htmlFor="attribution">怎麼知道 solo.tw（選填）</Label>
          <select
            id="attribution"
            value={state.attribution}
            onChange={(e) => update("attribution", e.target.value)}
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] md:text-sm"
          >
            <option value="">請選擇…</option>
            {CONSULTING_ATTRIBUTION.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-start gap-3 rounded-lg border bg-stone-50 p-4">
          <Checkbox
            id="consentTerms"
            checked={state.consentTerms}
            onCheckedChange={(checked) => update("consentTerms", !!checked)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label
              htmlFor="consentTerms"
              className="cursor-pointer text-sm font-normal leading-relaxed"
            >
              我了解費率，且本服務不退費{" "}
              <span className="text-rose-600">*</span>
            </Label>
            {errors.consentTerms && (
              <p className="mt-1 text-sm text-destructive">
                {errors.consentTerms}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border bg-stone-50 p-4">
          <Checkbox
            id="subscribeNewsletter"
            checked={state.subscribeNewsletter}
            onCheckedChange={(checked) =>
              update("subscribeNewsletter", !!checked)
            }
            className="mt-0.5"
          />
          <Label
            htmlFor="subscribeNewsletter"
            className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground"
          >
            訂閱《Vista 電子報》接收後續更新（選填）
          </Label>
        </div>
      </fieldset>

      {/* ───────────────────────────────── 送出 ───────────────────────────────── */}
      {errors._form && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {errors._form}
        </div>
      )}

      <Button type="submit" disabled={submitting} size="lg" className="w-full">
        {submitting ? "送出中…" : "送出申請"}
      </Button>
    </form>
  );
}
