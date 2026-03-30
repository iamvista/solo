import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Clock, BarChart3, Zap, ArrowRight } from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

const features = [
  { icon: Clock, text: "只要 3 分鐘" },
  { icon: BarChart3, text: "五大維度分析" },
  { icon: Zap, text: "立即看結果" },
];

export function DiagnoseEntrySection() {
  return (
    <section id="diagnose" className="bg-stone-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="grid items-center lg:grid-cols-5">
            {/* 左側：內容 */}
            <div className="p-8 sm:p-10 lg:col-span-3 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  免費工具
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                不確定自己的事業健康嗎？
                <br />
                <span className="text-primary">先做個免費健檢吧</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-stone-500">
                回答 7 個問題，AI
                幫你分析市場定位、服務交付、客戶信任、商業變現、事業永續五大面向，找出你的強項和突破點。
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
                <Link href="/diagnose">
                  開始免費健檢
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-3 text-sm text-stone-400">
                已有 {SOCIAL_PROOF.diagnoseCount} 位一人創業者完成健檢
              </p>
            </div>

            {/* 右側：視覺化示意 */}
            <div className="hidden bg-gradient-to-br from-primary/5 via-rose-50 to-amber-50 p-8 lg:col-span-2 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-10">
              <div className="w-full max-w-[220px] space-y-4">
                {[
                  { label: "市場定位", value: 82, color: "bg-amber-400" },
                  { label: "服務交付", value: 65, color: "bg-blue-400" },
                  { label: "客戶信任", value: 73, color: "bg-emerald-400" },
                  { label: "商業變現", value: 45, color: "bg-violet-400" },
                  { label: "事業永續", value: 58, color: "bg-rose-400" },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-stone-700">
                        {dim.label}
                      </span>
                      <span className="text-stone-500">{dim.value}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-200/60">
                      <div
                        className={`h-full rounded-full ${dim.color}`}
                        style={{ width: `${dim.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="pt-2 text-center text-xs text-stone-400">
                  範例結果，非實際數據
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
