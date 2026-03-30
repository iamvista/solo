import { NextRequest, NextResponse } from "next/server";
import { verifyCallback } from "@/lib/payuni";

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
      return NextResponse.redirect(
        new URL(`/payment/success?order=${orderNo}`, request.url)
      );
    }

    return NextResponse.redirect(new URL("/payment/cancel", request.url));
  } catch {
    return NextResponse.redirect(new URL("/payment/cancel", request.url));
  }
}
