import { NextRequest, NextResponse } from "next/server";
import { verifyCallback } from "@/lib/payuni";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/payment/return
 * 付款完成後使用者瀏覽器跳轉到這裡
 * 根據付款結果重導到成功或失敗頁面
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const encryptInfo = formData.get("EncryptInfo") as string;
    const hashInfo = formData.get("HashInfo") as string;

    if (!encryptInfo || !hashInfo) {
      return NextResponse.redirect(new URL("/payment/cancel", request.url));
    }

    const { valid, data } = verifyCallback(encryptInfo, hashInfo);

    if (valid && data && data.Status === "SUCCESS") {
      const orderNo = data.MerTradeNo || "";

      // 查詢訂單的 product_type，決定導向哪個成功頁
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: order } = await supabase
        .from("orders")
        .select("product_id, product_type")
        .eq("order_no", orderNo)
        .single();

      // 數位產品導向下載頁（帶 token）
      if (order?.product_id === "ai-coach-kit" || order?.product_type === "product") {
        const { data: tokenRow } = await supabase
          .from("download_tokens")
          .select("token")
          .eq("order_id", orderNo)
          .single();

        if (tokenRow?.token) {
          console.log(`Return redirect to download page for order ${orderNo}`);
          return NextResponse.redirect(
            new URL(`/payment/success?type=download&token=${tokenRow.token}`, request.url)
          );
        }
        // token 尚未產生（notify 可能稍慢），仍導向一般成功頁帶 order
        console.warn(`Download token not yet available for order ${orderNo}, falling back to success page`);
      }

      console.log(`Return redirect to success page for order ${orderNo}`);
      return NextResponse.redirect(
        new URL(`/payment/success?order=${orderNo}`, request.url)
      );
    }

    return NextResponse.redirect(new URL("/payment/cancel", request.url));
  } catch (err) {
    console.error("Payment return error:", err);
    return NextResponse.redirect(new URL("/payment/cancel", request.url));
  }
}
