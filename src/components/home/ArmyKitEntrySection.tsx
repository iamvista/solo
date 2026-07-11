import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Network, ShieldCheck, ArrowRight, Bot } from "lucide-react";
import { ARMY_KIT_PRICE, ARMY_KIT_PRODUCT_NAME } from "@/lib/army-kit";

const methods = [
  { icon: Network, text: "指揮官不下場的派工原則" },
  { icon: Users, text: "AI 團隊的人設設計手法" },
  { icon: ShieldCheck, text: "對抗式驗收流程" },
];

const roster = [
  "制度檔總綱＋核心規則",
  "秘書團隊全套角色檔",
  "工程協作角色範本",
  "獨立驗收角色範本",
  "業務規劃與部門範本",
];

export function ArmyKitEntrySection() {
  return (
    <section id="army-kit-entry" className="bg-stone-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="grid items-center lg:grid-cols-5">
            {/* 左側：內容 */}
            <div className="p-8 sm:p-10 lg:col-span-3 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  新品・數位工具包
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                不用寫程式，
                <br />
                也能建一支
                <span className="text-primary">AI 軍團</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-stone-500">
                {ARMY_KIT_PRODUCT_NAME}把派工原則、角色人設、對抗式驗收流程全部寫成制度檔，直接鋪進 Claude Code 就能用。一份可複製的一人公司作業系統。
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {methods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.text}
                      className="flex items-center gap-2.5 text-sm text-stone-600"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-stone-400" />
                      {m.text}
                    </div>
                  );
                })}
              </div>

              <Button
                size="lg"
                asChild
                className="mt-8 h-12 px-8 text-base font-semibold shadow-lg shadow-primary/15"
              >
                <Link href="/products/solo-army-kit">
                  NT${ARMY_KIT_PRICE.toLocaleString()} 立即入手
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-3 text-sm text-stone-400">
                一次買斷・永久使用・附完整安裝指南
              </p>
            </div>

            {/* 右側：團隊編制示意 */}
            <div className="hidden bg-gradient-to-br from-primary/5 via-rose-50 to-amber-50 p-8 lg:col-span-2 lg:flex lg:flex-col lg:justify-center lg:p-10">
              <div className="w-full max-w-[240px]">
                <p className="mb-3 text-xs font-medium tracking-wide text-stone-400">
                  包裡的角色編制
                </p>
                <div className="space-y-2">
                  {roster.map((role) => (
                    <div
                      key={role}
                      className="rounded-xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-stone-700"
                    >
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
