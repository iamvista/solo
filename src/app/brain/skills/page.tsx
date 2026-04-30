import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const COOKIE_NAME = "brain_skills_unlocked";

export const metadata: Metadata = {
  title: "副腦計畫｜Skills 教學安裝手冊",
  description: "副腦計畫 6 個 Claude Skills 完整安裝與使用教學。35 天把累積多年的素材變成可問答副腦。",
  robots: { index: false, follow: false },
};

async function getManual() {
  const filePath = path.join(process.cwd(), "src/content/brain-skills-manual.md");
  return fs.readFile(filePath, "utf-8");
}

export default async function SkillsManualPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get(COOKIE_NAME)?.value === "1";

  if (!unlocked) {
    const headersList = await headers();
    const host = headersList.get("host") ?? "";
    const isBrainHost = host.startsWith("brain.");
    redirect(isBrainHost ? "/skills/unlock" : "/brain/skills/unlock");
  }

  const markdown = await getManual();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-stone-900 px-2 py-1 text-xs font-bold text-amber-400">
              BRAIN +1 LAB
            </span>
            <span className="text-sm font-medium text-stone-600">
              Skills 教學手冊
            </span>
          </div>
          <a
            href="https://brain.solo.tw"
            className="text-sm text-stone-500 hover:text-stone-900"
          >
            ← 回首頁
          </a>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="brain-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>

        <hr className="my-16 border-stone-200" />

        <footer className="text-center text-sm text-stone-500">
          <p>副腦計畫｜Brain+1 Lab</p>
          <p className="mt-1">
            <a
              href="https://brain.solo.tw"
              className="text-amber-700 underline decoration-amber-500/40 hover:text-amber-900"
            >
              brain.solo.tw
            </a>
            {" · "}Vista Cheng
          </p>
        </footer>
      </article>
    </div>
  );
}
