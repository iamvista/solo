"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WORKSHOP_URL = "/courses/innovation-workshop";

const painPoints = [
  {
    emoji: "😩",
    text: "工作一直做、一直忙，卻感覺成果停在六、七十分",
  },
  {
    emoji: "🤔",
    text: "遇到問題只能硬幹，想不出更好的解法",
  },
  {
    emoji: "💬",
    text: "提案常被打回票，卻不知道哪裡出了問題",
  },
  {
    emoji: "🧠",
    text: "覺得「創新」是天才的事，跟自己無關",
  },
];

const chapters = [
  { title: "為什麼多數人誤會了創新？", desc: "拆掉對創新的常見誤解" },
  { title: "AI 時代，更要看懂人類真正的優勢", desc: "人類觀察力 vs AI 的差別" },
  { title: "想像力，不是天馬行空", desc: "從生活中找回想像力的三個練習" },
  {
    title: "設計思考的起點，不是點子，而是感受",
    desc: "創新不是炫技，而是回應人心",
  },
  { title: "從問題中找靈感：創新的第一個入口", desc: "三個問題，打開創新的門" },
  {
    title: "創新方程式：把靈感變成果的實戰流程",
    desc: "五步驟可複製的工作流程",
  },
];

const bookHighlights = [
  {
    title: "創新方程式",
    description: "一套五步驟的實戰流程，讓你在沒有靈感時也知道下一步該怎麼做",
  },
  {
    title: "角色扮演法",
    description: "讓大腦分工，讓不同思考角色依序出場，創意就不容易被過早否決",
  },
  {
    title: "AI + 創新思維",
    description: "如何用 ChatGPT 當創意助手，讓 AI 放大你的想像，而不是取代你",
  },
  {
    title: "30 個企業創新題目",
    description: "從流程、業績、顧客體驗到團隊合作，直接帶回去練",
  },
];

const faqs = [
  {
    q: "這本電子書適合誰？",
    a: "適合所有想在工作中做出改變、但不知道如何開始的人。不需要任何創新背景，只要願意嘗試就好。",
  },
  {
    q: "電子書是什麼格式？",
    a: "PDF 格式，共 44 頁，可在手機、平板、電腦上閱讀。圖文並茂，閱讀體驗佳。",
  },
  {
    q: "真的完全免費嗎？",
    a: "是的，完全免費。填寫 Email 後即可下載，我們不會寄送垃圾信件。",
  },
  {
    q: "跟創新實戰工作坊有什麼關係？",
    a: "電子書是方法論的入門，工作坊則是帶你實際走完一次創新流程。如果看完書覺得想深入體驗，歡迎報名工作坊。",
  },
];

function EmailForm({
  id,
  email,
  setEmail,
  name,
  setName,
  status,
  errorMsg,
  onSubmit,
}: {
  id?: string;
  email: string;
  setEmail: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  status: "idle" | "loading" | "success" | "error";
  errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div id={id}>
      {status === "success" ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <p className="text-2xl">🎉</p>
            <p className="mt-2 text-lg font-semibold text-green-800">
              電子書已寄出！
            </p>
            <p className="mt-1 text-base text-green-700">
              請到信箱查收（記得也看一下垃圾郵件匣）
            </p>
            <div className="mt-6 rounded-lg border border-green-200 bg-white p-4">
              <p className="text-sm text-muted-foreground">
                想把書中的方法實際走一遍？
              </p>
              <Button className="mt-3" asChild>
                <Link href={WORKSHOP_URL}>了解創新實戰工作坊</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="你的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={status === "loading"}
          />
          <Input
            type="email"
            placeholder="你的 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full text-base"
            disabled={status === "loading"}
          >
            {status === "loading" ? "送出中..." : "免費下載電子書"}
          </Button>
          {status === "error" && (
            <p className="text-center text-sm text-red-500">{errorMsg}</p>
          )}
          <p className="text-center text-xs text-muted-foreground">
            我們尊重你的隱私，不會寄送垃圾信件。
          </p>
        </form>
      )}
    </div>
  );
}

export default function InnovationEbookPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");
    try {
      const res = await fetch("https://www.vista.tw/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          leadMagnetSlug: "innovation-ebook",
          sourcePage: window.location.href,
          newsletter: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "送出失敗，請稍後再試");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "送出失敗，請稍後再試");
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
            {/* Book Cover */}
            <div className="shrink-0">
              <div className="relative w-48 sm:w-56">
                <div className="rounded-lg shadow-2xl overflow-hidden">
                  <Image
                    src="/images/workshops/innovation-ebook-cover.webp"
                    alt="《創新不是天才，是方法》電子書封面"
                    width={618}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center sm:text-left">
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-2 text-sm sm:text-base"
              >
                免費電子書
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                創新不是天才，是方法
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
                把問題變點子，把點子變成果
              </p>
              <p className="mt-3 text-base text-muted-foreground">
                創新先生 陳建銘 著｜44 頁圖文｜完全免費
              </p>

              {/* CTA */}
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <a href="#download">立即免費下載</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <a href="#content">看看書裡有什麼</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4">
            <div className="rounded-lg border bg-white/80 p-3 text-center">
              <p className="text-2xl font-bold text-primary">20+</p>
              <p className="text-xs text-muted-foreground">年創新實戰經驗</p>
            </div>
            <div className="rounded-lg border bg-white/80 p-3 text-center">
              <p className="text-2xl font-bold text-primary">14</p>
              <p className="text-xs text-muted-foreground">章精華內容</p>
            </div>
            <div className="rounded-lg border bg-white/80 p-3 text-center">
              <p className="text-2xl font-bold text-primary">30</p>
              <p className="text-xs text-muted-foreground">個企業創新題目</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 痛點共鳴 */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            你是不是也有這些困擾？
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="text-2xl shrink-0">{point.emoji}</span>
                  <p className="text-base text-muted-foreground">
                    {point.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-foreground">
              創新不是額外工作，而是優化工作。
            </p>
            <p className="mt-1 text-lg text-muted-foreground">
              當你把創新理解成「把事情做得更好」，它就不是負擔，而是
              <span className="font-medium text-foreground">升級</span>。
            </p>
          </div>
        </section>

        {/* 書中精華 */}
        <section id="content" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這本書會給你什麼？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            不只談創意點子，而是從觀察、感受、提問、方法到行動，帶你一步步把創新變成可練習、可落地的能力。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {bookHighlights.map((item, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <p className="mt-3 text-base font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 目錄預覽 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            目錄搶先看
          </h2>
          <div className="mx-auto mt-8 max-w-lg space-y-2">
            {chapters.map((ch, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {i + 1}
                </div>
                <div>
                  <p className="text-base font-medium">{ch.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {ch.desc}
                  </p>
                </div>
              </div>
            ))}
            <p className="pt-2 text-center text-sm text-muted-foreground">
              ⋯⋯以及更多：ChatGPT 與 AI 創意助手、角色扮演法、30
              個企業創新題目等
            </p>
          </div>
        </section>

        {/* Email Capture */}
        <section id="download" className="border-t py-14 sm:py-16">
          <Card className="border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center">
                <p className="text-3xl font-bold">📖</p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  免費下載《創新不是天才，是方法》
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  44 頁完整圖文電子書，填寫 Email 立即寄送到你的信箱
                </p>
              </div>

              <div className="mx-auto mt-6 max-w-sm">
                <EmailForm
                  email={email}
                  setEmail={setEmail}
                  name={name}
                  setName={setName}
                  status={status}
                  errorMsg={errorMsg}
                  onSubmit={handleSubmit}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 作者介紹 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            關於作者
          </h2>
          <Card className="mt-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
                  <img
                    src="/images/workshops/instructor-jianming.webp"
                    alt="陳建銘老師"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">陳建銘</h3>
                    <span className="text-base text-muted-foreground">
                      （創新先生）
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    超過 20 年以上職場創新實戰經驗
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2 text-base text-muted-foreground">
                      <span className="shrink-0 text-primary">✓</span>
                      <span>
                        「伸縮電蚊拍」「會跑的鬧鐘」發明人，20+ 項國內外發明專利
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-base text-muted-foreground">
                      <span className="shrink-0 text-primary">✓</span>
                      <span>從業績最後一名的銷售員，到龍頭企業 Top Sales</span>
                    </div>
                    <div className="flex items-start gap-2 text-base text-muted-foreground">
                      <span className="shrink-0 text-primary">✓</span>
                      <span>
                        媒體稱為「生活發明王」，獲國內外多家媒體採訪報導
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-base text-muted-foreground">
                      <span className="shrink-0 text-primary">✓</span>
                      <span>獨創「創新方程式」和「靈感製造機法則」</span>
                    </div>
                  </div>

                  <p className="mt-4 text-base italic text-muted-foreground">
                    「如果你堅持自己的夢想，全世界都會為你開路。」
                  </p>

                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <a
                      href="https://www.innovators.tw"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="flex items-center gap-1.5">
                        創新先生網站
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </span>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 課程推薦 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            想把書中的方法實際走一遍？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            電子書是入門，工作坊才是完整體驗。
          </p>

          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Badge className="mb-3">實體工作坊</Badge>
                  <h3 className="text-xl font-bold">創新實戰工作坊</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    6
                    個小時，用創新方程式六步驟，帶你從真實工作難題走到可執行方案。
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>2026/4/18（六）9:00–16:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>臺北市區</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>限 10 名・50% 方法拆解 + 50% 現場實作</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-base">
                      <span className="text-primary">✓</span>
                      <span>帶走一份《解法設計藍圖》</span>
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <span className="text-primary">✓</span>
                      <span>現場完成一次完整的創新流程</span>
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <span className="text-primary">✓</span>
                      <span>小組協作 + 遊戲化引導思考</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      早鳥價（4 月 11 日前）
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      NT$3,600{" "}
                      <span className="text-sm font-normal text-muted-foreground line-through">
                        NT$7,200
                      </span>
                    </p>
                  </div>

                  <Button className="mt-4" size="lg" asChild>
                    <Link href={WORKSHOP_URL}>了解更多 & 報名</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            常見問題
          </h2>
          <div className="mx-auto mt-8 max-w-lg space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border p-4">
                <p className="text-base font-semibold">{faq.q}</p>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t py-14 sm:py-16">
          <div className="text-center">
            <h2 className="text-xl font-bold sm:text-2xl">
              創新，從翻開這本書開始
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              不需要是天才，只需要願意開始。
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-sm">
            <EmailForm
              id="download-bottom"
              email={email}
              setEmail={setEmail}
              name={name}
              setName={setName}
              status={status}
              errorMsg={errorMsg}
              onSubmit={handleSubmit}
            />
          </div>
        </section>

        {/* 返回 */}
        <div className="border-t pb-16 pt-10 text-center sm:pb-20">
          <Button variant="outline" asChild>
            <Link href="/courses">← 回到所有課程</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
