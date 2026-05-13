import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Mic,
  Users,
  Lightbulb,
  Mail,
  Pen,
} from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "關於 Vista | solo.tw",
  description:
    "Vista Cheng（鄭緯筌），AI 應用講師、一人事業教練。幫助自由工作者、講師和顧問用 AI 放大產出。18,000+ 電子報讀者、50+ 場工作坊。",
};

const milestones = [
  {
    year: "2005–2015",
    title: "媒體與內容策略",
    desc: "歷任多家網路媒體主編與內容策略顧問，深耕數位內容產業超過十年。",
  },
  {
    year: "2016–2020",
    title: "企業培訓與寫作教學",
    desc: "開始以個人品牌經營寫作與內容行銷培訓，累積上百場企業內訓與公開演講經驗。",
  },
  {
    year: "2021–2023",
    title: "一人事業實踐",
    desc: "全面投入一人事業，從課程、顧問到電子報，驗證一個人也能建立可持續的事業模式。",
  },
  {
    year: "2024–now",
    title: "AI × 一人事業",
    desc: "將 AI 工具深度整合到一人事業的每個環節，創辦 solo.tw，幫助更多人用 AI 放大產出。",
  },
];

const beliefs = [
  {
    icon: Lightbulb,
    title: "一個人不是做小，是做精",
    desc: "一人事業不是沒有團隊的無奈之舉，而是刻意選擇的經營模式。用系統取代人力，用深度取代廣度。",
  },
  {
    icon: Users,
    title: "先給價值，再談生意",
    desc: "免費健檢、免費初談、免費電子報——先讓人感受到你的價值，信任自然會來，生意也會來。",
  },
  {
    icon: Pen,
    title: "寫作是最好的槓桿",
    desc: "一篇好文章可以幫你工作十年。持續寫、持續分享，是一人事業最高效的行銷方式。",
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/iamvista" },
  { name: "Instagram", href: "https://www.instagram.com/vista" },
  { name: "YouTube", href: "https://www.youtube.com/@vistacheng" },
  { name: "Threads", href: "https://www.threads.com/@vista" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/vistacheng/" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero — 照片 + 簡介 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-14 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-5 lg:gap-16">
            {/* 照片 */}
            <div className="flex justify-center lg:col-span-2">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/20 to-rose-200/30 blur-xl" />
                <Image
                  src="/images/vista-profile.webp"
                  alt="Vista Cheng"
                  width={320}
                  height={320}
                  className="relative h-56 w-56 rounded-2xl object-cover shadow-lg sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                  priority
                />
              </div>
            </div>

            {/* 文字介紹 */}
            <div className="text-center lg:col-span-3 lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                About
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                Vista Cheng
              </h1>
              <p className="mt-1 text-lg font-medium text-stone-400">
                鄭緯筌
              </p>
              <p className="mt-5 text-base leading-relaxed text-stone-600 sm:text-lg">
                AI 應用講師、一人事業教練、內容策略顧問。
                <br className="hidden sm:block" />
                曾任多家網路媒體主編，擁有超過十年的數位內容產業經驗。
                <br className="hidden sm:block" />
                現在專注於幫助自由工作者、講師和顧問，
                <span className="font-medium text-stone-800">
                  用 AI 把一個人做到一個團隊的產出
                </span>
                。
              </p>

              {/* 數字 */}
              <div className="mt-6 flex flex-wrap justify-center gap-6 lg:justify-start">
                {[
                  { num: SOCIAL_PROOF.newsletterSubscribers, label: "電子報讀者" },
                  { num: SOCIAL_PROOF.workshopCount, label: "場工作坊" },
                  { num: SOCIAL_PROOF.diagnoseCount, label: "事業健檢完成" },
                ].map((s) => (
                  <div key={s.label} className="text-center lg:text-left">
                    <p className="text-2xl font-bold text-stone-900">{s.num}</p>
                    <p className="text-xs text-stone-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/consulting">
                    預約 1-on-1 諮詢
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-stone-300">
                  <a
                    href="https://iamvista.substack.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    訂閱電子報
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 我相信的事 */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              我相信的事
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3 sm:gap-8">
            {beliefs.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-stone-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-stone-900">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 經歷時間軸 */}
      <section className="bg-stone-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              走過的路
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-stone-200">
              {milestones.map((m) => (
                <div key={m.year} className="relative">
                  <div className="absolute -left-8 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-primary">
                      {m.year}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-stone-900">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-500">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 我能幫你什麼 */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              我能幫你什麼
            </h2>
            <p className="mt-3 text-base text-stone-500">
              不管你在一人事業的哪個階段，都有適合的方式。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6">
            {[
              {
                icon: Mic,
                title: "AI 工作坊 & 企業內訓",
                desc: "小班制實戰教學，從社群內容到 AI 指揮中心，即學即用。",
                href: "/courses",
              },
              {
                icon: Users,
                title: "1-on-1 諮詢 & 陪跑",
                desc: "30 分鐘免費初談，幫你釐清方向。覺得適合再深入合作。",
                href: "/consulting",
              },
              {
                icon: BookOpen,
                title: "線上課程",
                desc: "Vibe Coding、AI 內容產製……隨時學、反覆看。",
                href: "/courses",
              },
              {
                icon: Pen,
                title: "電子報 & 部落格",
                desc: "每週一封 AI 工具箱、經營心得、實戰覆盤。免費訂閱。",
                href: "https://iamvista.substack.com/",
              },
            ].map((item) => {
              const Icon = item.icon;
              const isExternal = item.href.startsWith("http");
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  {...(isExternal
                    ? {
                        target: "_blank" as const,
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="group flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-5 transition-all hover:border-stone-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 社群連結 + CTA */}
      <section className="bg-gradient-to-b from-stone-50 to-stone-100 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            在這些地方找到我
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition-all hover:border-stone-300 hover:text-stone-900 hover:shadow-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-stone-900">
              想聊聊嗎？
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              不管是合作邀約、媒體採訪，還是單純想聊聊一人事業的心得，都歡迎。
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/consulting">
                  預約 1-on-1 諮詢
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-stone-300">
                <a href="mailto:iamvista@gmail.com">
                  來信聊聊
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
