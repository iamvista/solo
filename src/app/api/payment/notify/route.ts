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
    const status = data.Status;
    const paymentMethod = data.PaymentType;
    const paidAmount = Number(data.TradeAmt);

    // 使用 service role 操作
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ✅ 先查詢訂單，驗證金額是否一致
    const { data: order, error: queryError } = await supabase
      .from("orders")
      .select("amount, payment_status, product_id, product_type, buyer_email")
      .eq("order_no", orderNo)
      .single();

    if (queryError || !order) {
      console.error(`Order not found: ${orderNo}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ 防止重複處理（冪等性）
    if (order.payment_status === "paid") {
      console.log(`Order ${orderNo} already paid, skipping`);
      return new NextResponse("SUCCESS", { status: 200 });
    }

    // ✅ 驗證付款金額與訂單金額一致
    if (status === "SUCCESS" && paidAmount !== order.amount) {
      console.error(
        `Amount mismatch for order ${orderNo}: expected ${order.amount}, got ${paidAmount}`
      );
      // 記錄異常但不更新為 paid
      await supabase
        .from("orders")
        .update({
          payment_status: "amount_mismatch",
          payuni_response: data,
          updated_at: new Date().toISOString(),
        })
        .eq("order_no", orderNo);
      return new NextResponse("SUCCESS", { status: 200 });
    }

    // 更新訂單狀態
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

    // Generate download token for digital products
    if (status === "SUCCESS" && (order.product_id === "ai-coach-kit" || order.product_type === "product")) {
      const { randomUUID } = await import("crypto");
      const downloadToken = randomUUID();
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

      const { error: tokenError } = await supabase.from("download_tokens").insert({
        order_id: orderNo,
        product_id: "ai-coach-kit",
        token: downloadToken,
        email: order.buyer_email || null,
        expires_at: expiresAt,
      });

      if (tokenError) {
        console.error(`Failed to create download token for order ${orderNo}:`, tokenError);
      } else {
        console.log(`Download token created for order ${orderNo}`);
      }
    }

    console.log(`Payment ${status} for order ${orderNo} (trade: ${tradeNo}, amount: ${paidAmount})`);
    return new NextResponse("SUCCESS", { status: 200 });
  } catch (error) {
    console.error("Payment notify error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
