import type { Metadata } from "next";
import { Hero } from "@/components/consulting/Hero";
import { WhyOneOnOne } from "@/components/consulting/WhyOneOnOne";
import { ServiceFormat } from "@/components/consulting/ServiceFormat";
import { ThemeGrid } from "@/components/consulting/ThemeGrid";
import { PricingLadder } from "@/components/consulting/PricingLadder";
import { ProcessSteps } from "@/components/consulting/ProcessSteps";
import { LeadForm } from "@/components/consulting/LeadForm";
import { FAQ } from "@/components/consulting/FAQ";
import {
  JsonLd,
  serviceSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/schema";
import { CONSULTING_PLANS } from "@/lib/consulting-config";

export const metadata: Metadata = {
  title: "1-on-1 量身陪跑｜Vista Cheng AI 諮詢與陪跑 | solo.tw",
  description:
    "Vista Cheng 親自帶的 Google Meet 一對一線上諮詢。1 小時 NT$3,000 起，5 種方案（1/3/5/10/20 小時）。涵蓋 Vibe Coding、個人網站、Solo OS、內容流水線、第二大腦、AI 學術寫作、一人事業七大主題。",
  keywords: [
    "1-on-1 諮詢",
    "AI 諮詢",
    "AI 教練",
    "AI 陪跑",
    "Vibe Coding 教學",
    "Claude Code 諮詢",
    "個人網站建置",
    "Solo OS",
    "內容生產流水線",
    "AI 學術寫作",
    "一人公司",
    "自由工作者",
    "Vista Cheng",
    "鄭緯筌",
    "solo.tw",
    "自由人學院",
  ],
  authors: [{ name: "Vista Cheng", url: "https://www.solo.tw/about" }],
  creator: "Vista Cheng",
  publisher: "solo.tw（自由人學院）",
  alternates: { canonical: "https://www.solo.tw/consulting" },
  openGraph: {
    title: "1-on-1 量身陪跑｜Vista Cheng AI 諮詢與陪跑",
    description:
      "Vista Cheng 親自帶的 Google Meet 一對一線上諮詢。NT$3,000 起，從 1 小時到 20 小時，涵蓋 AI 應用、Vibe Coding、個人網站、學術寫作等七大主題。",
    url: "https://www.solo.tw/consulting",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.solo.tw/og",
        width: 1200,
        height: 630,
        alt: "1-on-1 量身陪跑 — Vista Cheng × solo.tw",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "1-on-1 量身陪跑｜Vista Cheng AI 諮詢",
    description:
      "Google Meet 一對一線上諮詢。NT$3,000 起，5 種方案，涵蓋 AI 應用七大主題。",
    images: ["https://www.solo.tw/og"],
  },
};

const FAQ_FOR_SCHEMA = [
  {
    question: "1-on-1 量身陪跑是什麼？",
    answer:
      "1-on-1 量身陪跑是由 Vista Cheng 親自提供的 Google Meet 一對一線上諮詢服務，從 1 小時單點問題到 20 小時長期陪跑，整堂課時間都用來處理您的具體問題。涵蓋 Vibe Coding、個人網站、Solo OS、內容流水線、第二大腦、AI 學術寫作、一人事業起步七大主題，也接受其他客製需求。",
  },
  {
    question: "1-on-1 諮詢多少錢？",
    answer:
      "提供 5 種方案：1 小時 NT$3,000（單價 NT$3,000/hr）、3 小時套票 NT$8,400（NT$2,800/hr）、5 小時套票 NT$13,500（NT$2,700/hr）、10 小時套票 NT$26,000（NT$2,600/hr）、20 小時套票 NT$48,000（NT$2,400/hr）。買越多單價越優惠，套票 6 個月內使用完畢。",
  },
  {
    question: "誰適合 1-on-1 諮詢？",
    answer:
      "適合三類人：(1) 上過 AI 工作坊但卡在自己場景無法落地的學員；(2) 講師、顧問、自由工作者想用 AI 升級工作流；(3) 研究者、創作者想把 AI 整合進專案 pipeline。如果您只想學 ChatGPT 基本操作，請優先看 solo.tw 的免費資源與工作坊。",
  },
  {
    question: "跟 AI 教練 APP（ChatPlus、AI 峰哥等）有什麼差別？",
    answer:
      "AI 教練 APP 給的是通用模板與課程；1-on-1 量身陪跑針對您當下的具體專案或卡點，由 Vista 親自看您的程式碼、文件、工作流，給可立即執行的修改。AI APP 適合自學者打基礎，1-on-1 適合已有具體目標、需要被人推一把的進階工作者。",
  },
  {
    question: "諮詢涵蓋哪些主題？",
    answer:
      "七個常見主題：Vibe Coding 入門（建第一個 web app）、個人網站系統（仿 solo.tw / vista.tw 架構）、Solo OS 個人作業系統建置（Calendar / Notion / Anytype / Obsidian 串接）、內容產製流水線（研究→撰稿→去 AI 味→多平臺分發）、第二大腦與知識管理、AI 輔助學術寫作、一人事業起步診斷。其他需求也可在填表時描述。",
  },
  {
    question: "跟你的工作坊有什麼不同？",
    answer:
      "工作坊是我教大家一個系統方法論，1-on-1 是我陪您解決您的問題。工作坊節奏固定、內容固定；1-on-1 整堂課的時間都用來處理您所遇到的問題。",
  },
  {
    question: "一定要先填表嗎？我已經確定要買 1 小時諮詢。",
    answer:
      "是的。需求表單是我判斷能不能幫您的依據，半小時內就能填完。填完我會 24 小時內回信，合適就寄付款連結，不合適會誠實告訴您。",
  },
  {
    question: "不在臺灣可以嗎？",
    answer: "可以。Google Meet 跨時區沒問題，議時段時告訴我時差即可。",
  },
  {
    question: "上完課可以加購嗎？",
    answer:
      "當然。可以隨時跨方案升級（如 1hr 諮詢後再買 10hr 套票），已付的時數獨立計算、不退費也不被吃掉。",
  },
  {
    question: "套票可以轉讓嗎？",
    answer:
      "可以，單張套票可一次性轉讓給 1 位他人，請來信申請。建議轉讓給有類似需求的人，效率最好。",
  },
  {
    question: "取消政策？",
    answer:
      "開課前 48 小時取消 → 退回時數；24–48 小時 → 扣 0.5 小時；24 小時內 → 扣該場全部時數。",
  },
  {
    question: "我的需求不在 7 個主題裡。",
    answer:
      "在表單裡選「我有別的需求」並描述。您的題目如果剛好我有把握，我會接；不是，會誠實告訴您比較適合的人。",
  },
  {
    question: "我怎麼知道還剩多少時數？",
    answer: "每堂課後 24 小時內，我會寄信通知。",
  },
  {
    question: "可以錄影嗎？",
    answer: "學員可自行錄影自留，我這端不主動錄製。",
  },
];

export default function ConsultingPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "1-on-1 量身陪跑 — Vista Cheng AI 諮詢與陪跑",
          description:
            "由 Vista Cheng 親自提供的 Google Meet 1-on-1 諮詢，涵蓋 Vibe Coding、個人網站、Solo OS、內容流水線、第二大腦、AI 學術寫作、一人事業起步等主題；從 1 小時單點問題到 20 小時長期陪跑，您決定節奏。",
          url: "https://www.solo.tw/consulting",
          serviceType: "Coaching & Consulting",
          areaServed: ["臺灣", "全球（線上）"],
          priceRange: "NT$3,000–NT$48,000",
          image: "https://www.solo.tw/og",
          offers: CONSULTING_PLANS.map((p) => ({
            name: p.label,
            price: p.totalPrice,
            description: `${p.suitedFor}。單價 NT$${p.pricePerHour.toLocaleString()}/小時。`,
            url: "https://www.solo.tw/consulting#pricing",
          })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Consulting", href: "/consulting" },
        ])}
      />
      <JsonLd data={faqSchema(FAQ_FOR_SCHEMA)} />

      <Hero />
      <WhyOneOnOne />
      <ServiceFormat />
      <ThemeGrid />
      <PricingLadder />
      <ProcessSteps />
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center">告訴我您的需求</h2>
          <p className="mt-3 text-center text-muted-foreground">
            5 分鐘填完，我 24 小時內回信。
          </p>
          <div className="mt-12">
            <LeadForm />
          </div>
        </div>
      </section>
      <FAQ />
    </>
  );
}
