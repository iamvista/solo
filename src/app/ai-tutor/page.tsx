import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiTutorLeadForm } from "@/components/ai-tutor/AiTutorLeadForm";
import {
  AI_TUTOR_TIERS,
  AI_TUTOR_DIRECTIONS,
  AI_TUTOR_PAIN_POINTS,
  AI_TUTOR_COMPARISON,
  AI_TUTOR_PROCESS,
  AI_TUTOR_PERSONAS,
  AI_TUTOR_FAQS,
} from "@/lib/ai-tutor-config";

export const metadata: Metadata = {
  title: "AI 家教班 — 給資深決策者的一對一 AI 私人家教 | solo.tw",
  description:
    "不是聽課，是有人坐在你旁邊，用你自己的真實業務，把你從不會帶到會用。已陪伴電商創辦人、上市公司獨董、心理諮商師等資深決策者。預約免費諮詢，洽談客製課綱。",
  openGraph: {
    title: "AI 家教班 — 給資深決策者的一對一 AI 私人家教",
    description: "用你自己的真實業務，把你從不會帶到會用。預約免費諮詢，洽談客製課綱。",
    images: ["/images/ai-tutor/hero.webp"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AI_TUTOR_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AiTutorPage() {
  return (
    <main className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-rose-50/60 to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <p className="mb-3 inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-primary">一對一・完全客製</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">AI 家教班</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              給資深決策者的一對一 AI 私人家教。不是聽課，是有人坐在你旁邊，
              用你自己的真實業務，把你從不會帶到會用。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="#booking-form">預約免費諮詢 <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="#pricing">看課程方案</Link></Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              已陪伴電商創辦人、上市公司獨立董事、心理諮商師等資深決策者
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-stone-100">
            <Image src="/images/ai-tutor/hero.webp" alt="AI 家教班一對一教學" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* 痛點 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">為什麼資深決策者選一對一</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {AI_TUTOR_PAIN_POINTS.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-card p-6">
              <div className="text-3xl">{p.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 對照表 */}
      <section className="border-y bg-stone-50/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">這不是課程，是私人家教</h2>
          <div className="mt-10 overflow-hidden rounded-2xl border bg-card">
            <div className="grid grid-cols-3 border-b bg-stone-100 text-sm font-semibold">
              <div className="p-4" />
              <div className="p-4 text-center text-muted-foreground">團體課 / 線上課</div>
              <div className="p-4 text-center text-primary">AI 家教班</div>
            </div>
            {AI_TUTOR_COMPARISON.map((row) => (
              <div key={row.dimension} className="grid grid-cols-3 border-b text-sm last:border-0">
                <div className="p-4 font-medium">{row.dimension}</div>
                <div className="flex items-center gap-2 p-4 text-muted-foreground"><X className="h-4 w-4 shrink-0 text-stone-400" />{row.group}</div>
                <div className="flex items-center gap-2 p-4"><Check className="h-4 w-4 shrink-0 text-primary" />{row.tutor}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 流程 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">怎麼上</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {AI_TUTOR_PROCESS.map((s) => (
            <div key={s.step} className="rounded-2xl border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">{s.step}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 適合誰 */}
      <section className="border-y bg-stone-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">他們帶走了什麼</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {AI_TUTOR_PERSONAS.map((p) => (
              <div key={p.role} className="rounded-2xl border bg-card p-6">
                <div className="text-3xl">{p.emoji}</div>
                <h3 className="mt-3 text-lg font-semibold">{p.role}</h3>
                <p className="mt-2 text-muted-foreground">{p.took}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 客製方向 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">課綱是為你客製的</h2>
        <p className="mt-3 text-center text-muted-foreground">以下是常見方向，最終依你的目標量身設計。</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_TUTOR_DIRECTIONS.map((d) => (
            <div key={d.slug} className="rounded-2xl border bg-card p-6">
              <div className="text-2xl">{d.emoji}</div>
              <h3 className="mt-2 font-semibold">{d.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.oneLiner}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 定價 */}
      <section id="pricing" className="border-y bg-stone-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">方案與定價</h2>
          <p className="mt-3 text-center text-muted-foreground">以下為參考方案，實際課綱與時數於免費諮詢後客製。</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {AI_TUTOR_TIERS.map((t) => (
              <div key={t.slug} className={`flex flex-col rounded-2xl border bg-card p-8 ${t.highlight ? "border-primary ring-2 ring-primary/20" : ""}`}>
                {t.highlight && <p className="mb-3 inline-block self-start rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">最多人選</p>}
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.hours} 小時</p>
                <p className="mt-4 text-3xl font-bold">NT${t.price.toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted-foreground">約每小時 NT${t.pricePerHour.toLocaleString()}</p>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">{t.suitedFor}</p>
                <Button asChild className="mt-6 w-full" variant={t.highlight ? "default" : "outline"}><Link href="#booking-form">預約諮詢</Link></Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">常見問題</h2>
        <div className="mt-10 space-y-4">
          {AI_TUTOR_FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border bg-card p-6">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">{f.q}</summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 預約表單 */}
      <section className="border-t bg-stone-50/60">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">預約免費諮詢</h2>
          <p className="mt-3 text-center text-muted-foreground">填好表單，我會親自回信，約 30 分鐘聊聊你的目標。</p>
          <div className="mt-10 rounded-2xl border bg-card p-6 sm:p-8">
            <AiTutorLeadForm />
          </div>
        </div>
      </section>
    </main>
  );
}
