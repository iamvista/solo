import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 py-20 sm:py-28 lg:py-36">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            準備好
            <span className="text-primary">放大你的事業</span>了嗎？
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-500 sm:mt-6 sm:text-xl">
            先聊 30 分鐘，零風險了解我能怎麼幫你。
            <br className="hidden sm:block" />
            或者做個免費健檢，找出你的下一步。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-5">
            <Button
              size="lg"
              asChild
              className="h-14 w-full px-8 text-base font-semibold shadow-lg shadow-primary/15 sm:w-auto sm:text-lg"
            >
              <Link href="/consulting">
                預約免費諮詢
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 w-full border-stone-300 px-8 text-base text-stone-700 hover:bg-white sm:w-auto sm:text-lg"
            >
              <Link href="/diagnose">免費事業健檢</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-stone-400">
            已有超過 {SOCIAL_PROOF.diagnoseCount} 位一人創業者開始行動
          </p>
        </div>
      </div>
    </section>
  );
}
