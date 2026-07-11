import { createServiceClient } from "@/lib/supabase/service";
import {
  AI_COACH_KIT_PRODUCT_NAME,
  DOWNLOAD_TTL_HOURS as AI_COACH_KIT_DOWNLOAD_TTL_HOURS,
  MAX_DOWNLOADS as AI_COACH_KIT_MAX_DOWNLOADS,
} from "@/lib/ai-coach-kit";
import {
  ARMY_KIT_PRODUCT_NAME,
  DOWNLOAD_TTL_HOURS as ARMY_DOWNLOAD_TTL_HOURS,
  MAX_DOWNLOADS as ARMY_MAX_DOWNLOADS,
} from "@/lib/army-kit";

type DownloadInfo = {
  productName: string;
  downloadHref: string;
  ttlHours: number;
  maxDownloads: number;
};

// type=download 分支的產品識別：一律出自 DB（token 查回的 product_id），query string
// 只帶 token。目前涵蓋 ai-coach-kit 與 army-kit 兩種單檔下載商品；ars 走獨立的 type=ars
// 分支（ArsDownloadPanel 不動）。
export async function getDownloadInfo(token: string): Promise<DownloadInfo | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("download_tokens")
    .select("product_id")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;

  const productId: string = data.product_id;
  if (productId === "ai-coach-kit") {
    return {
      productName: AI_COACH_KIT_PRODUCT_NAME,
      downloadHref: `/api/download/ai-coach-kit?token=${token}`,
      ttlHours: AI_COACH_KIT_DOWNLOAD_TTL_HOURS,
      maxDownloads: AI_COACH_KIT_MAX_DOWNLOADS,
    };
  }
  if (productId === "army-kit") {
    return {
      productName: ARMY_KIT_PRODUCT_NAME,
      downloadHref: `/api/download/army?token=${token}`,
      ttlHours: ARMY_DOWNLOAD_TTL_HOURS,
      maxDownloads: ARMY_MAX_DOWNLOADS,
    };
  }
  return null;
}
