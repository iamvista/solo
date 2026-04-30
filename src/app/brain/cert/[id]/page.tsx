import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import certData from "@/content/brain-certificates.json";

interface Cohort {
  label: string;
  period: string;
  duration_days: number;
  instructor: string;
}

interface Certificate {
  id: string;
  name: string;
  cohort: string;
  issued_date: string;
  achievements: string[];
}

interface CertData {
  cohorts: Record<string, Cohort>;
  certificates: Certificate[];
}

const data = certData as unknown as CertData;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cert = data.certificates.find((c) => c.id === id.toUpperCase());

  if (!cert) {
    return {
      title: "證書編號不存在｜副腦計畫",
      robots: { index: false, follow: false },
    };
  }

  const cohort = data.cohorts[cert.cohort];
  return {
    title: `${cert.name}｜副腦計畫結業認證｜${cert.id}`,
    description: `${cert.name} 完成副腦計畫｜Brain+1 Lab 35 天 AI 副腦陪跑營（${cohort?.label ?? cert.cohort}），正式認證為 Certified Personal AI Engineer。`,
    metadataBase: new URL("https://brain.solo.tw"),
    alternates: { canonical: `https://brain.solo.tw/cert/${cert.id}` },
    openGraph: {
      title: `${cert.name}｜Certified Personal AI Engineer`,
      description: `副腦計畫結業認證 · ${cert.id} · ${cert.issued_date}`,
      type: "profile",
      url: `https://brain.solo.tw/cert/${cert.id}`,
    },
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { id } = await params;
  const certId = id.toUpperCase();
  const cert = data.certificates.find((c) => c.id === certId);

  if (!cert) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-stone-50">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-900/50 bg-red-950/30 px-4 py-2">
            <span className="text-sm font-medium text-red-300">無效證書</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            證書編號不存在
          </h1>
          <p className="mt-6 max-w-md text-stone-400">
            找不到 <code className="mx-1 rounded bg-stone-800 px-2 py-0.5 font-mono text-amber-400">{id}</code> 這個證書編號。
          </p>
          <p className="mt-4 max-w-md text-sm text-stone-500">
            可能原因：編號輸入錯誤、證書已撤銷、或這個編號從未發出過。
          </p>
          <div className="mt-10">
            <Button size="lg" asChild className="bg-amber-500 text-stone-900 hover:bg-amber-400">
              <Link href="https://brain.solo.tw">
                了解副腦計畫
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const cohort = data.cohorts[cert.cohort];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-stone-50">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Header badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-950/30 px-4 py-2 backdrop-blur-sm">
            <Check className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">
              此證書為有效證書
            </span>
          </div>
        </div>

        {/* Cert ID */}
        <p className="text-center font-mono text-sm tracking-widest text-amber-400">
          {cert.id}
        </p>

        {/* Title */}
        <h1 className="mt-6 text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {cert.name}
        </h1>

        <p className="mt-4 text-center text-lg text-stone-300">
          完成副腦計畫｜Brain+1 Lab 35 天 AI 副腦陪跑營
        </p>

        <p className="mt-2 text-center text-stone-400">
          正式認證為
        </p>

        <p className="mt-4 text-center text-2xl font-bold text-amber-400 sm:text-3xl">
          Certified Personal AI Engineer
        </p>

        {/* Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-stone-700" />
          <span className="text-xs uppercase tracking-widest text-stone-500">證書資訊</span>
          <div className="h-px flex-1 bg-stone-700" />
        </div>

        {/* Details grid */}
        <dl className="grid gap-6 rounded-xl border border-stone-700 bg-stone-900/60 p-8 backdrop-blur-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-stone-500">證書編號</dt>
            <dd className="mt-1 font-mono text-stone-200">{cert.id}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-stone-500">持有人</dt>
            <dd className="mt-1 text-stone-200">{cert.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-stone-500">梯次</dt>
            <dd className="mt-1 text-stone-200">{cohort?.label ?? cert.cohort}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-stone-500">完成日期</dt>
            <dd className="mt-1 text-stone-200">{cert.issued_date}</dd>
          </div>
          {cohort && (
            <>
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-500">訓練營期間</dt>
                <dd className="mt-1 text-stone-200">{cohort.period}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-500">講師</dt>
                <dd className="mt-1 text-stone-200">{cohort.instructor}</dd>
              </div>
            </>
          )}
        </dl>

        {/* Achievements */}
        {cert.achievements && cert.achievements.length > 0 && (
          <div className="mt-8 rounded-xl border border-stone-700 bg-stone-900/60 p-8 backdrop-blur-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
              完成項目
            </h2>
            <ul className="mt-4 space-y-3">
              {cert.achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                  <span className="text-stone-200">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* About */}
        <div className="mt-16 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-rose-500/5 p-8">
          <h2 className="text-2xl font-bold">關於副腦計畫</h2>
          <p className="mt-4 leading-relaxed text-stone-300">
            副腦計畫｜Brain+1 Lab 是 Vista Cheng 設計的 35 天 AI 副腦陪跑營。
            學員透過 NotebookLM、Obsidian 與 Claude Code 6 個專屬 skills，
            把累積多年的素材變成可問答的個人 AI 副腦。
          </p>
          <p className="mt-4 leading-relaxed text-stone-300">
            結業學員獲得「Certified Personal AI Engineer」認證，
            可放 LinkedIn 個人檔案展示。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="bg-amber-500 text-stone-900 hover:bg-amber-400">
              <Link href="https://brain.solo.tw">
                了解副腦計畫
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="text-stone-200 hover:bg-stone-800 hover:text-stone-50">
              <Link href="https://brain.solo.tw#enroll">
                下一梯次報名
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-stone-500">
          <p>
            此證書由{" "}
            <Link href="https://brain.solo.tw" className="text-amber-400 hover:text-amber-300">
              brain.solo.tw
            </Link>
            {" "}簽發並驗證
          </p>
          <p className="mt-2">
            驗證 URL：
            <code className="ml-1 font-mono text-stone-400">
              brain.solo.tw/cert/{cert.id}
            </code>
          </p>
        </footer>
      </div>
    </div>
  );
}
