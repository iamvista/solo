import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getCourseConfig, availablePlans } from "@/lib/courses-config";
import { findActiveAffiliateByCode } from "@/lib/affiliates";
import { CourseRegistrationForm } from "./CourseRegistrationForm";

interface PageProps {
  params: Promise<{ course: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourseConfig(slug);
  if (!course) return { title: "課程報名 | solo.tw" };
  return {
    title: `報名《${course.title}》| solo.tw`,
    description: `${course.subtitle}・${course.date} ${course.time}・限 ${course.capacity} 名`,
    robots: { index: false, follow: true },
  };
}

export default async function RegisterPage({ params }: PageProps) {
  const { course: slug } = await params;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  const plans = availablePlans(course);
  const defaultPlan = plans[0]?.plan ?? "regular";
  const headlinePlan = plans[0];
  const publishableKey = process.env.NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY ?? "";

  // 推薦折扣：若帶 ?ref cookie 且為有效碼，預填代碼並讓表單預先顯示折扣
  const referralDiscount = course.referralDiscount ?? 0;
  let initialReferralCode = "";
  let initialReferralValid = false;
  if (referralDiscount > 0) {
    const cookieRef = (await cookies()).get("solo_ref")?.value ?? "";
    if (cookieRef) {
      const affiliate = await findActiveAffiliateByCode(cookieRef, course.slug);
      if (affiliate) {
        initialReferralCode = affiliate.code;
        initialReferralValid = true;
      }
    }
  }

  return (
    <div className="bg-gradient-to-b from-amber-50/40 to-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href={course.detailUrl}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 回到課程介紹
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            報名《{course.title}》
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{course.subtitle}</p>

          <div className="mt-5 grid gap-3 rounded-2xl border bg-card p-5 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{course.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕘</span>
              <span>{course.time}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <span>📍</span>
              <span>{course.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>限 {course.capacity} 名</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span>
                {headlinePlan
                  ? `NT$${headlinePlan.amount.toLocaleString()} 起`
                  : "—"}
                {headlinePlan?.plan === "early_bird" && (
                  <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    早鳥
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {course.preRegistrationNotice && (
          <div className="mt-5 rounded-xl border-2 border-amber-300 bg-amber-50/60 p-4 text-sm leading-relaxed text-amber-900">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold text-amber-950">報名前請先確認</p>
                <p className="mt-1 text-amber-900/90">
                  {course.preRegistrationNotice}
                </p>
              </div>
            </div>
          </div>
        )}

        {!publishableKey ? (
          <div className="mt-10 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">
            尚未設定 Recur publishable key（NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY）。
            請聯絡 iamvista@gmail.com 或稍後再試。
            <Button asChild variant="outline" className="mt-3">
              <a href="mailto:iamvista@gmail.com?subject=AI%20%E6%8F%90%E6%A1%88%E4%BA%AE%E9%BB%9E%E5%AF%A6%E6%88%B0%E8%AA%B2%E5%A0%B1%E5%90%8D">
                寫信報名
              </a>
            </Button>
          </div>
        ) : (
          <div className="mt-10">
            <CourseRegistrationForm
              course={course}
              plans={plans}
              defaultPlan={defaultPlan}
              publishableKey={publishableKey}
              referralDiscount={referralDiscount}
              initialReferralCode={initialReferralCode}
              initialReferralValid={initialReferralValid}
            />
          </div>
        )}
      </div>
    </div>
  );
}
