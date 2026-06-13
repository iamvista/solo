import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
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

interface EnrollmentSummary {
  amount: number | null;
  status: string | null;
  email: string | null;
  phone: string | null;
}

async function fetchEnrollment(id: string): Promise<EnrollmentSummary | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const sb = createClient(url, key);
    const { data, error } = await sb
      .from("course_enrollments")
      .select("amount, status, email, phone")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as EnrollmentSummary;
  } catch {
    return null;
  }
}

export default async function RegisterSuccessPage({ params, searchParams }: PageProps) {
  const { course: slug } = await params;
  const { enrollment_id } = await searchParams;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  const enrollment = enrollment_id ? await fetchEnrollment(enrollment_id) : null;
  // 顯示金額：優先用 enrollment.amount（建立時已落地）；fallback 課程當前定價
  const expectedAmount = enrollment?.amount ?? null;
  const amountLabel = expectedAmount
    ? `NT$${expectedAmount.toLocaleString()}`
    : null;
  const isPaid = enrollment?.status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {isPaid ? "報名成功，課堂見！" : "報名資料已收到"}
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        {isPaid
          ? "付款已確認、名額已保留。"
          : "信用卡授權已送出。請依照下方說明確認你真的有完成付款。"}
      </p>

      {/* 最後一步：加入 LINE 領取上課資訊。第二聯絡管道，就算 Email 打錯也聯絡得上 */}
      <div
        className="mx-auto mt-8 max-w-md rounded-2xl border-2 p-6 text-left"
        style={{ borderColor: "#06C755", backgroundColor: "rgba(6,199,85,0.06)" }}
      >
        <p className="text-base font-bold text-foreground">
          ✅ 最後一步：加入 LINE 領取上課資訊
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          上課提醒、教室地址、課前準備都會透過 LINE 傳給你。就算 Email 沒收到，加了 LINE 一定聯絡得上。
        </p>
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
          <Image
            src="/images/line-oa-qr.png"
            alt="加入 Vista LINE 官方帳號 QR Code"
            width={132}
            height={132}
            className="rounded-lg border bg-white p-1"
          />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <a
              href="https://line.me/R/ti/p/@016mxqyl"
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg px-6 text-base font-semibold text-white sm:w-auto"
              style={{ backgroundColor: "#06C755" }}
            >
              加入 LINE 好友
            </a>
            <p className="text-xs text-muted-foreground">
              或在 LINE 搜尋 ID：
              <span className="font-mono font-semibold text-foreground">
                @016mxqyl
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6 text-left">
        <p className="text-sm font-semibold text-foreground">📋 你的下一步</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            1. 看你信用卡 App / 簡訊有沒有跳出
            {amountLabel ? (
              <>
                <strong className="text-foreground"> {amountLabel}</strong> 的扣款通知
              </>
            ) : (
              " 對應金額的扣款通知"
            )}
          </li>
          <li>
            2. 確認的話，<strong className="text-foreground">5 分鐘內</strong>
            會收到一封報名確認 E-mail。
            收不到請看垃圾信件匣或聯絡客服。
          </li>
          <li>3. 開課前 2 天會再寄一封含教室地址、課前準備清單等資訊的提醒信。</li>
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
