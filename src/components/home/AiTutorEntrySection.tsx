import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, UserCheck, Briefcase, Route, ArrowRight } from "lucide-react";
import { AI_TUTOR_TIERS } from "@/lib/ai-tutor-config";

const features = [
  { icon: UserCheck, text: "課綱完全客製" },
  { icon: Briefcase, text: "用你的真實業務" },
  { icon: Route, text: "由淺到深陪學" },
];

export function AiTutorEntrySection() {
  return (
    <section id="ai-tutor-entry" className="bg-stone-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="grid items-center lg:grid-cols-5">
            {/* 左側：內容 */}
            <div className="p-8 sm:p-10 lg:col-span-3 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  一對一・高階家教
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                想真正學會用 AI，
                <br />
                <span className="text-primary">找一位私人家教</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-stone-500">
                不是聽課，是有人坐在你旁邊，用你自己的真實業務，把你從不會帶到會用。給時間很貴、要客製、重隱私的資深決策者。
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.text}
                      className="flex items-center gap-2 text-sm text-stone-600"
                    >
                      <Icon className="h-4 w-4 text-stone-400" />
                      {f.text}
                    </div>
                  );
                })}
              </div>

              <Button
                size="lg"
                asChild
                className="mt-8 h-12 px-8 text-base font-semibold shadow-lg shadow-primary/15"
              >
                <Link href="/ai-tutor">
                  預約免費諮詢
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-3 text-sm text-stone-400">
                已陪伴電商創辦人、上市公司獨董、心理諮商師等資深決策者
              </p>
            </div>

            {/* 右側：方案示意 */}
            <div className="hidden bg-gradient-to-br from-primary/5 via-rose-50 to-amber-50 p-8 lg:col-span-2 lg:flex lg:flex-col lg:justify-center lg:p-10">
              <div className="w-full max-w-[240px] space-y-3">
                {AI_TUTOR_TIERS.map((t) => (
                  <div
                    key={t.slug}
                    className={`rounded-xl border bg-white/70 px-4 py-3 ${
                      t.highlight ? "border-primary ring-1 ring-primary/20" : "border-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800">{t.name}</span>
                      <span className="text-sm font-semibold text-primary">
                        NT${t.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-stone-500">{t.hours} 小時</p>
                  </div>
                ))}
                <p className="pt-1 text-center text-xs text-stone-400">
                  參考方案，諮詢後客製
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
