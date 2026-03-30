import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "付款未完成 | solo.tw",
};

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:py-28">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
        <XCircle className="h-8 w-8 text-stone-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-stone-900 sm:text-3xl">
        付款未完成
      </h1>
      <p className="mt-3 text-base text-stone-500">
        你的付款尚未完成或已取消。
        <br />
        如果有任何問題，請聯繫我們。
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Button asChild>
          <Link href="/courses">
            重新選擇
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <a href="mailto:vista@solo.tw">聯繫客服</a>
        </Button>
      </div>
    </div>
  );
}
