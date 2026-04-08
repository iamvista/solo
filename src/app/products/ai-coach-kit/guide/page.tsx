import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Monitor,
  Terminal,
  Download,
  Settings,
  MessageSquare,
  RotateCcw,
  Wrench,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI 教練工坊 — 安裝與使用教學 | solo.tw",
  description:
    "從零開始設定你的 AI 實踐教練。8 篇圖文教學，零基礎也能上手。",
};

const guides = [
  {
    slug: "choose-method",
    icon: ArrowRight,
    number: "0",
    title: "選擇你的安裝方式",
    desc: "根據你的技術程度，選擇最適合你的方式。不確定的話，看這篇就對了。",
  },
  {
    slug: "desktop-setup",
    icon: Monitor,
    number: "0a",
    title: "用 Claude Desktop App 設定（推薦新手）",
    desc: "不需要終端機、不需要指令。用滑鼠拖拉就能完成，全程 10 分鐘。",
    highlight: true,
  },
  {
    slug: "install-claude-code",
    icon: Terminal,
    number: "1",
    title: "安裝 Claude Code CLI",
    desc: "進階用戶適用。從零開始安裝 Claude Code，讓你的電腦可以執行 AI 教練系統。",
  },
  {
    slug: "install-coach",
    icon: Download,
    number: "2",
    title: "安裝教練系統",
    desc: "把下載的工具包解壓縮並完成安裝，讓教練系統在你的電腦上就位。",
  },
  {
    slug: "first-session",
    icon: Settings,
    number: "3",
    title: "第一次啟動教練",
    desc: "完成設定、回答校準問題，讓教練了解你的目標和現況。",
  },
  {
    slug: "daily-loop",
    icon: RotateCcw,
    number: "4",
    title: "每日使用迴圈",
    desc: "建立每天與教練互動的習慣。早上覆盤、下午回報、週日總結。",
  },
  {
    slug: "build-your-own",
    icon: Wrench,
    number: "5",
    title: "建立你自己的教練",
    desc: "用你最欣賞的導師或作者的內容，打造專屬你的 AI 教練。",
  },
  {
    slug: "notebooklm",
    icon: BookOpen,
    number: "6",
    title: "NotebookLM 知識庫建立教學",
    desc: "用 Google 的免費工具建立 AI 可讀的知識庫，作為你自建教練的知識來源。",
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          安裝與使用教學
        </h1>
        <p className="mt-3 text-lg text-stone-500">
          從零開始設定你的 AI 實踐教練。按順序閱讀，或直接跳到你需要的章節。
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/products/ai-coach-kit/guide/${guide.slug}`}
            className="block"
          >
            <Card
              className={`border-stone-200 transition hover:border-primary/30 hover:shadow-md ${
                guide.highlight
                  ? "border-2 border-primary/30 bg-primary/5"
                  : ""
              }`}
            >
              <CardContent className="flex items-start gap-4 p-5 sm:p-6">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    guide.highlight ? "bg-primary/20" : "bg-stone-100"
                  }`}
                >
                  <guide.icon
                    className={`h-5 w-5 ${
                      guide.highlight ? "text-primary" : "text-stone-500"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-400">
                      {guide.number}
                    </span>
                    <h2 className="text-lg font-semibold text-stone-900">
                      {guide.title}
                    </h2>
                    {guide.highlight && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                        推薦新手
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-base text-stone-500">{guide.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-stone-300" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-base text-stone-500">
          需要更多幫助？來信{" "}
          <a
            href="mailto:iamvista@gmail.com"
            className="text-primary underline"
          >
            iamvista@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
