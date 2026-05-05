import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getCourseConfig } from "@/lib/courses-config";

interface PageProps {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ enrollment_id?: string }>;
}

export const metadata: Metadata = {
  title: "報名完成 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function RegisterSuccessPage({ params, searchParams }: PageProps) {
  const { course: slug } = await params;
  const { enrollment_id } = await searchParams;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        報名資料已收到
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        信用卡授權已送出。請依照下方說明確認你真的有完成付款。
      </p>

      <div className="mt-8 rounded-xl border bg-card p-6 text-left">
        <p className="text-sm font-semibold text-foreground">📋 你的下一步</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>1. 看你信用卡 App / 簡訊有沒有跳出 NT${course.regularPrice.toLocaleString()} 左右的扣款通知</li>
          <li>
            2. 確認的話，<strong className="text-foreground">5 分鐘內</strong>會收到一封報名確認 Email + 簡訊。
            收不到請看看垃圾信夾或聯絡客服。
          </li>
          <li>
            3. 開課前 7 天會再寄一封含教室地址、停車資訊、課前準備清單的提醒信。
          </li>
        </ul>
      </div>

      {enrollment_id && (
        <p className="mt-6 text-xs text-muted-foreground">
          報名編號：{enrollment_id}
        </p>
      )}

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href={course.detailUrl}>回到課程介紹</Link>
        </Button>
        <Button asChild variant="outline">
          <a href="mailto:iamvista@gmail.com?subject=課程報名問題">寫信給客服</a>
        </Button>
      </div>
    </div>
  );
}
