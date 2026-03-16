import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 sm:py-28 lg:py-36">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            準備好打造你的
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
              一人事業
            </span>
            了嗎？
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400 sm:mt-6 sm:text-xl">
            3 分鐘事業健檢，找出你的定位和下一步。
            <br />
            已有超過 1,000 位一人創業者開始行動。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-5">
            <Button
              size="lg"
              asChild
              className="h-14 w-full bg-gradient-to-r from-primary to-rose-500 px-8 text-base font-semibold shadow-lg shadow-primary/25 sm:w-auto sm:text-lg"
            >
              <Link href="/diagnose">
                開始免費健檢
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 w-full border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto sm:text-lg"
            >
              <Link href="/auth/signup">免費註冊帳號</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
