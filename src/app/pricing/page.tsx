import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Video,
  BookOpen,
  FileDown,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "服務方案與定價 | solo.tw",
  description:
    "工作坊、1-on-1 諮詢、線上課程、模板工具包——選擇適合你的方式，開始放大你的一人事業。",
};

const services = [
  {
    icon: Users,
    category: "工作坊",
    title: "AI 工作坊",
    subtitle: "小班制、即學即用",
    price: "NT$2,500",
    unit: "起 / 人",
    features: [
      "10-20 人小班制教學",
      "半天或全天制，依主題而異",
      "現場實作，帶著成果走",
      "課後社群交流",
    ],
    cta: "查看近期場次",
    href: "/courses",
    highlight: true,
  },
  {
    icon: Video,
    category: "諮詢",
    title: "1-on-1 諮詢 & 陪跑",
    subtitle: "針對你的狀況深度對話",
    price: "NT$3,000",
    unit: "/ 小時",
    features: [
      "Google Meet 線上進行",
      "個人化行動計畫",
      "課後 Email 追蹤",
      "陪跑方案：NT$10,000 / 4 次",
    ],
    cta: "預約諮詢",
    href: "/consulting",
    highlight: false,
  },
  {
    icon: BookOpen,
    category: "線上課程",
    title: "系統化學習",
    subtitle: "隨時看、反覆學",
    price: "NT$2,980",
    unit: "起 / 門",
    features: [
      "錄播影片，自由安排學習進度",
      "章節式架構，由淺入深",
      "Cloudflare Stream 高品質影片",
      "持續更新課程內容",
    ],
    cta: "瀏覽課程",
    href: "https://learn.solo.tw",
    highlight: false,
  },
  {
    icon: FileDown,
    category: "數位產品",
    title: "模板 & 工具包",
    subtitle: "即買即用",
    price: "NT$300",
    unit: "起",
    features: [
      "Notion 模板、Prompt 工具包",
      "購買後立即下載",
      "定期更新維護",
      "含使用教學說明",
    ],
    cta: "查看產品",
    href: "/products",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              服務方案
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              選擇適合你的方式
            </h1>
            <p className="mt-4 text-lg text-stone-500 sm:text-xl">
              不管你是剛開始、正在成長、還是想突破瓶頸，
              <br className="hidden sm:block" />
              都有適合的服務幫你往前一步。
            </p>
          </div>
        </div>
      </section>

      {/* 服務方案 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              const isExternal = service.href.startsWith("http");
              return (
                <div
                  key={service.title}
                  className={`group relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-8 ${
                    service.highlight
                      ? "border-primary/30 ring-1 ring-primary/10"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {service.highlight && (
                    <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      最多人選擇
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        service.highlight
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-stone-900">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-400">
                    {service.subtitle}
                  </p>

                  {/* 價格 */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-stone-900">
                      {service.price}
                    </span>
                    <span className="text-sm text-stone-400">
                      {service.unit}
                    </span>
                  </div>

                  {/* 功能列表 */}
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-stone-100 pt-5">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-6">
                    <Button
                      variant={service.highlight ? "default" : "outline"}
                      className={`w-full ${
                        service.highlight
                          ? "shadow-sm shadow-primary/15"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50"
                      }`}
                      asChild
                    >
                      {isExternal ? (
                        <a
                          href={service.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {service.cta}
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </a>
                      ) : (
                        <Link href={service.href}>
                          {service.cta}
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 企業方案 */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-900 to-stone-800">
            <div className="grid items-center gap-8 p-8 sm:p-10 md:grid-cols-2 lg:p-12">
              <div>
                <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400">
                  企業方案
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  企業內訓 / 客製工作坊
                </h3>
                <p className="mt-3 text-base text-stone-400">
                  為團隊量身打造的培訓方案，涵蓋 AI 應用、創新思維、內容經營等主題。
                </p>
                <p className="mt-4 text-sm text-stone-500">
                  半天 NT$30,000 起，依主題與人數客製報價
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
                <Button
                  size="lg"
                  asChild
                  className="bg-amber-400 text-stone-900 hover:bg-amber-500"
                >
                  <a href="mailto:vista@solo.tw?subject=企業內訓洽詢">
                    聯繫洽談
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 免費資源 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            還沒準備好付費？
          </h2>
          <p className="mt-3 text-base text-stone-500">
            這些免費資源可以幫你先了解自己的狀況。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button size="lg" asChild className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/15 sm:text-lg">
              <Link href="/diagnose">
                免費事業健檢
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 border-stone-300 px-8 text-base text-stone-700 hover:bg-stone-50 sm:text-lg">
              <a
                href="https://iamvista.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="mr-2 h-5 w-5" />
                訂閱免費電子報
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
