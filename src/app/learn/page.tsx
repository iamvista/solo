import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "一人事業入門指南：從定位到穩定成長 | solo.tw",
  description: "給自由工作者、顧問與創作者的一人事業入門指南，依序完成定位、驗證、交付與系統化，並找到 solo.tw 的課程、工具與實作資源。",
  alternates: { canonical: "https://www.solo.tw/learn" },
  openGraph: {
    title: "一人事業入門指南：從定位到穩定成長",
    description: "用四個階段建立可持續的一人事業：定位、驗證、交付與系統化。",
    url: "https://www.solo.tw/learn",
    type: "website",
  },
};

const steps = [
  {
    number: "01",
    title: "釐清定位",
    description: "先定義你服務的對象、要解決的問題，以及客戶願意付費的成果。定位愈清楚，內容、產品與銷售就愈容易對焦。",
    action: "用事業健檢找出目前最需要處理的環節。",
    href: "/diagnose",
    label: "開始事業健檢",
  },
  {
    number: "02",
    title: "驗證需求",
    description: "先和真實客戶對話，再投入時間製作完整產品。用小規模提案、諮詢或工作坊測試問題是否迫切。",
    action: "需要一起拆解方向時，可從一對一諮詢開始。",
    href: "/consulting",
    label: "了解諮詢服務",
  },
  {
    number: "03",
    title: "建立可重複的交付",
    description: "把每次服務的流程、範本與判斷標準留下來，逐步形成穩定品質，也讓經驗有機會轉化成產品。",
    action: "依照目前階段選擇一門實作課程。",
    href: "/courses",
    label: "瀏覽課程與工作坊",
  },
  {
    number: "04",
    title: "運用 AI 與系統放大成果",
    description: "把重複工作交給工具，把關鍵判斷留給自己。先建立可靠流程，再用 AI 加快研究、內容、生產與服務。",
    action: "從經過整理的工具清單挑選合適方案。",
    href: "/tools",
    label: "查看工具與資源",
  },
];

const faqs = [
  {
    question: "solo.tw 適合哪些人？",
    answer: "solo.tw 適合正在經營或準備開始一人事業的自由工作者、顧問、講師、創作者與小型服務業者。內容聚焦於定位、產品化、客戶經營，以及運用 AI 提升個人產能。",
  },
  {
    question: "完全沒有客戶，也可以從這裡開始嗎？",
    answer: "可以。建議先完成事業健檢，接著訪談潛在客戶並驗證問題，而不是先投入大量時間製作產品。這份指南的四個階段可作為起步順序。",
  },
  {
    question: "一人事業等於所有事情都自己做嗎？",
    answer: "不等於。一人事業強調由一位主理人掌握核心價值與決策，但可以運用 AI、自動化工具、外部夥伴與標準流程完成交付。重點是保持組織精簡，而非拒絕協作。",
  },
  {
    question: "應該先做個人品牌，還是先設計產品？",
    answer: "先確認服務對象與真實需求，再讓品牌內容呈現你的觀點與解法。產品可以從小規模服務開始驗證，品牌與產品則在回饋中同步調整。",
  },
  {
    question: "solo.tw 的內容如何產製與查證？",
    answer: "內容以實務經驗、第一手資料與可追溯來源為基礎，必要時使用 AI 協助整理與校對，但最終選題、判斷與發布責任由編輯者承擔。完整原則可查閱內容方法與編輯政策。",
  },
];

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.solo.tw/learn#webpage",
  url: "https://www.solo.tw/learn",
  name: "一人事業入門指南：從定位到穩定成長",
  description: metadata.description,
  inLanguage: "zh-Hant-TW",
  isPartOf: {
    "@type": "WebSite",
    name: "solo.tw | 用 AI 放大你的一人事業",
    url: "https://www.solo.tw",
  },
  about: ["一人事業", "自由工作", "個人品牌", "AI 生產力"],
};

export default function LearnPage() {
  return (
    <main>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema([{ name: "首頁", href: "/" }, { name: "一人事業入門指南", href: "/learn" }])} />
      <JsonLd data={faqSchema(faqs)} />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Badge variant="secondary" className="mb-5 px-4 py-2 text-sm">一人事業學習地圖</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            從專業能力，到可持續的一人事業
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
            不必一次把所有事情做好。先找對問題，再建立可靠的服務與流程。這份指南整理四個起步階段，幫助你知道現在該做什麼。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="#roadmap">查看四階段路徑</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/diagnose">評估目前階段</Link></Button>
          </div>
        </div>
      </section>

      <section id="roadmap" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wider text-primary">建議順序</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-4xl">四個階段，建立你的事業底盤</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">每個階段都先完成最小可行的成果，再根據客戶回饋前進，不需要等到萬事俱備。</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {steps.map((step) => (
              <Card key={step.number} className="flex h-full flex-col">
                <CardHeader>
                  <span className="text-sm font-semibold tracking-widest text-primary">階段 {step.number}</span>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                  <CardDescription className="text-base leading-7">{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <p className="mb-5 text-sm leading-6 text-muted-foreground">{step.action}</p>
                  <Button asChild variant="outline"><Link href={step.href}>{step.label}</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-xl font-bold">想建立基礎</h2>
            <p className="mt-3 leading-7 text-muted-foreground">從部落格理解定位、內容與一人事業的核心觀念。</p>
            <Button asChild variant="link" className="mt-3 px-0"><Link href="/blog">閱讀部落格</Link></Button>
          </div>
          <div>
            <h2 className="text-xl font-bold">想動手實作</h2>
            <p className="mt-3 leading-7 text-muted-foreground">選擇工作坊，跟著明確步驟完成一項可用成果。</p>
            <Button asChild variant="link" className="mt-3 px-0"><Link href="/courses">探索課程</Link></Button>
          </div>
          <div>
            <h2 className="text-xl font-bold">想獲得個別建議</h2>
            <p className="mt-3 leading-7 text-muted-foreground">帶著你的現況與問題，在諮詢中一起釐清下一步。</p>
            <Button asChild variant="link" className="mt-3 px-0"><Link href="/consulting">預約諮詢</Link></Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="learn-faq">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wider text-primary">常見問題</p>
            <h2 id="learn-faq" className="mt-2 text-2xl font-bold sm:text-4xl">開始之前，你可能想知道</h2>
          </div>
          <div className="mt-10 divide-y rounded-xl border bg-card px-5 sm:px-8">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">
                  {faq.question}
                  <span aria-hidden="true" className="float-right -mr-8 text-muted-foreground group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-4 leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            想了解內容如何產製與更正？請參閱 <Link className="underline underline-offset-4 hover:text-foreground" href="/methodology">內容方法</Link> 與 <Link className="underline underline-offset-4 hover:text-foreground" href="/editorial-policy">編輯與更正政策</Link>。
          </p>
        </div>
      </section>
    </main>
  );
}
