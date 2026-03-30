import { NextRequest, NextResponse } from "next/server";
import { verifyCallback } from "@/lib/payuni";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/payment/notify
 * PAYUNi Server-to-Server 背景通知
 * 付款成功後 PAYUNi 會主動 POST 到這裡
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const encryptInfo = formData.get("EncryptInfo") as string;
    const hashInfo = formData.get("HashInfo") as string;

    if (!encryptInfo || !hashInfo) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // 驗證並解密
    const { valid, data } = verifyCallback(encryptInfo, hashInfo);
    if (!valid || !data) {
      console.error("PAYUNi callback verification failed");
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    const orderNo = data.MerTradeNo;
    const tradeNo = data.TradeNo;
    const status = data.Status; // SUCCESS or FAILED
    const paymentMethod = data.PaymentType; // credit, vacc, cvs, etc.

    // 使用 service role 更新訂單（背景通知無 user session）
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase
      .from("orders")
      .update({
        trade_no: tradeNo,
        payment_status: status === "SUCCESS" ? "paid" : "failed",
        payment_method: paymentMethod || null,
        paid_at: status === "SUCCESS" ? new Date().toISOString() : null,
        payuni_response: data,
        updated_at: new Date().toISOString(),
      })
      .eq("order_no", orderNo);

    if (error) {
      console.error("Failed to update order:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    console.log(`Payment ${status} for order ${orderNo} (trade: ${tradeNo})`);

    // PAYUNi 期望回傳 "SUCCESS"
    return new NextResponse("SUCCESS", { status: 200 });
  } catch (error) {
    console.error("Payment notify error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
