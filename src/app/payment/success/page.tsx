import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "付款成功 | solo.tw",
};

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:py-28">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-stone-900 sm:text-3xl">
        付款成功！
      </h1>
      <p className="mt-3 text-base text-stone-500">
        感謝你的購買。確認信已寄到你的 Email，
        <br />
        請查收信箱了解後續步驟。
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Button asChild>
          <Link href="/courses">
            查看課程
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">回到首頁</Link>
        </Button>
      </div>
    </div>
  );
}
