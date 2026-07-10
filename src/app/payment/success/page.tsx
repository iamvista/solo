import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Download } from "lucide-react";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import {
  ARS_BUNDLE_ALLOWED_PARTS,
  ARS_BUNDLE_LABELS,
  ARS_BUNDLE_MAX_DOWNLOADS,
  DOWNLOAD_TTL_HOURS as ARS_DOWNLOAD_TTL_HOURS,
  isArsBundle,
  isArsVertical,
} from "@/lib/ars-bundles";
import { ArsDownloadPanel } from "./ArsDownloadPanel";

export const metadata: Metadata = {
  title: "付款成功 | solo.tw",
};

// entitlement 一律出自 DB（token 查回的 product_id/chosen_vertical），query string 只帶 token。
async function getArsDownloadInfo(token: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("download_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;

  const productId: string = data.product_id;
  if (!isArsBundle(productId)) return null;
  const bundle = productId;
  const chosenVertical: string | null = data.chosen_vertical;

  const allowedParts = ARS_BUNDLE_ALLOWED_PARTS[bundle];
  return {
    bundleLabel: ARS_BUNDLE_LABELS[bundle],
    maxDownloads: ARS_BUNDLE_MAX_DOWNLOADS[bundle],
    chosenVertical: isArsVertical(chosenVertical) ? chosenVertical : null,
    showCore: allowedParts.includes("core"),
    showTeaching: allowedParts.includes("teaching"),
    showAll: allowedParts.includes("all"),
    showVertical: allowedParts.includes("vertical"),
  };
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; type?: string }>;
}) {
  const params = await searchParams;
  const isDigitalProduct = params.type === "download" && params.token;
  const isConsulting = params.type === "consulting";
  const isArs = params.type === "ars";
  const arsInfo =
    isArs && params.token ? await getArsDownloadInfo(params.token) : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:py-28">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-stone-900 sm:text-3xl">
        付款成功！
      </h1>
      <p className="mt-3 text-base text-stone-500">
        {isDigitalProduct
          ? "感謝購買！請點擊下方按鈕下載你的教練工坊套件。"
          : arsInfo
            ? `感謝購買 AI 學術研究工作臺・${arsInfo.bundleLabel}！請在下方下載你的模組。`
            : isArs
              ? "感謝購買！訂單完成，下載連結已寄到你的信箱，請收信點擊連結進入下載頁。"
              : "感謝你的購買，我們正在處理你的訂單。"}
        {!isDigitalProduct && !arsInfo && !isArs && <br />}
        {!isDigitalProduct && !arsInfo && !isArs &&
          "購買確認信會在幾秒內寄到你的 Email，請留意收件匣與垃圾信匣。"}
        {isConsulting && (
          <>
            <br />
            請回信告知您方便的時段（含時區），我會盡快約定首場 Google Meet。
          </>
        )}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        {isDigitalProduct ? (
          <>
            <Button asChild>
              <a
                href={`/api/download/ai-coach-kit?token=${params.token}`}
                className="inline-flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                下載 AI 教練工坊
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">回到首頁</Link>
            </Button>
          </>
        ) : isArs ? (
          <Button variant="outline" asChild>
            <Link href="/">回到首頁</Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link href="/courses">
                查看課程
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">回到首頁</Link>
            </Button>
          </>
        )}
      </div>
      {isDigitalProduct && (
        <p className="mt-4 text-xs text-stone-400">
          下載連結有效 72 小時，最多可下載 3 次
        </p>
      )}
      {arsInfo && params.token && (
        <>
          <ArsDownloadPanel
            token={params.token}
            initialVertical={arsInfo.chosenVertical}
            showCore={arsInfo.showCore}
            showTeaching={arsInfo.showTeaching}
            showAll={arsInfo.showAll}
            showVertical={arsInfo.showVertical}
          />
          <p className="mt-4 text-xs text-stone-400">
            下載連結有效 {ARS_DOWNLOAD_TTL_HOURS} 小時，最多可下載{" "}
            {arsInfo.maxDownloads} 次
          </p>
        </>
      )}
    </div>
  );
}
