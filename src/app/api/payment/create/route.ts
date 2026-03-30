import { NextRequest, NextResponse } from "next/server";
import { createPaymentForm, isConfigured } from "@/lib/payuni";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/payment/create
 * 建立 PAYUNi 付款訂單，回傳付款表單資料
 */
export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "PAYUNi 尚未設定。請在環境變數中填入 PAYUNI_MER_ID、PAYUNI_HASH_KEY、PAYUNI_HASH_IV。" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { productType, productId, productName, amount, buyerEmail, buyerName } = body;

    if (!productName || !amount || !buyerEmail) {
      return NextResponse.json(
        { error: "缺少必要參數：productName, amount, buyerEmail" },
        { status: 400 }
      );
    }

    // 產生訂單編號（SOLO + 時間戳 + 隨機碼）
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNo = `SOLO${timestamp}${random}`;

    // 儲存訂單到資料庫
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("orders").insert({
      order_no: orderNo,
      product_type: productType || "general",
      product_id: productId || null,
      amount: Number(amount),
      buyer_email: buyerEmail,
      buyer_name: buyerName || null,
      payment_status: "pending",
    });

    if (dbError) {
      console.error("Failed to save order:", dbError);
      return NextResponse.json(
        { error: "訂單建立失敗" },
        { status: 500 }
      );
    }

    // 建立 PAYUNi 付款表單
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.solo.tw";
    const paymentForm = createPaymentForm({
      orderNo,
      amount: Number(amount),
      productName,
      buyerEmail,
      returnUrl: `${baseUrl}/api/payment/return`,
      notifyUrl: `${baseUrl}/api/payment/notify`,
    });

    return NextResponse.json({
      orderNo,
      ...paymentForm,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "付款建立失敗" },
      { status: 500 }
    );
  }
}
