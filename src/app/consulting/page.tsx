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

export const metadata: Metadata = {
  title: "1-on-1 量身陪跑 | solo.tw",
  description:
    "不只是教您 AI，更是陪您突破卡關瓶頸。Google Meet 1-on-1，從 1 小時諮詢到 20 小時長期陪跑，您的問題就是這堂課。",
  alternates: { canonical: "https://www.solo.tw/consulting" },
  openGraph: {
    title: "1-on-1 量身陪跑 | solo.tw",
    description: "不只是教您 AI，更是陪您突破卡關瓶頸。",
    url: "https://www.solo.tw/consulting",
    type: "website",
  },
};

const FAQ_FOR_SCHEMA = [
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
          name: "1-on-1 量身陪跑",
          description:
            "Google Meet 1-on-1，從 1 小時諮詢到 20 小時長期陪跑。",
          url: "https://www.solo.tw/consulting",
          price: 3000,
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
