import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { workshops } from "@/lib/workshops";
import { WaitlistForm } from "@/components/instructor/WaitlistForm";

interface PageProps {
  params: Promise<{ course: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { course: slug } = await params;
  const workshop = workshops.find((w) => w.id === slug);
  if (!workshop) return { title: "開課通知 | solo.tw" };
  return {
    title: `《${workshop.title}》開課通知 | solo.tw`,
    description: workshop.subtitle,
    // 廣告落地頁，不需要被索引
    robots: { index: false, follow: false },
  };
}

/**
 * 廣告落地頁。唯一的轉換目標是取得 E-mail，因此刻意不放價格、報名按鈕與
 * 匯款資訊：任何第二個行動點都只會分散這頁唯一該做的事。
 */
export default async function CourseNotifyPage({
  params,
  searchParams,
}: PageProps) {
  const { course: slug } = await params;
  const workshop = workshops.find((w) => w.id === slug);
  if (!workshop) notFound();

  const sp = await searchParams;
  const utm = {
    source: one(sp.utm_source),
    medium: one(sp.utm_medium),
    campaign: one(sp.utm_campaign),
    content: one(sp.utm_content),
  };

  return (
    <div className="bg-gradient-to-b from-amber-50/40 to-background">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-medium text-amber-700">
          {workshop.emoji} 開課通知
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          《{workshop.title}》下次開課，第一個通知你
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          {workshop.subtitle}
        </p>

        <p className="mt-6 text-base leading-relaxed text-foreground">
          {workshop.description}
        </p>

        {workshop.highlights.length > 0 && (
          <ul className="mt-6 space-y-2">
            {workshop.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary">✓</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">
            留下 E-mail，開課前通知你
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            我們只會在這門課開新梯次時寄信給你，隨時可以退出。
          </p>
          <WaitlistForm
            courseSlug={workshop.id}
            courseTitle={workshop.title}
            intent="ad_lead"
            sourcePage={`/courses/${workshop.id}/notify`}
            instructorSlug={workshop.instructor.slug || undefined}
            utm={utm}
            withHoneypot
          />
        </div>
      </div>
    </div>
  );
}
