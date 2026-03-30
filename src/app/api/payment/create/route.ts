import { NextRequest, NextResponse } from "next/server";
import { createPaymentForm, isConfigured } from "@/lib/payuni";
import { createClient } from "@supabase/supabase-js";

/**
 * 產品定價表（伺服器端唯一真相來源）
 * 金額由伺服器決定，不信任客戶端傳來的 amount
 */
const PRODUCT_PRICES: Record<string, number> = {
  "consulting:direction": 2490,
  "consulting:ai-setup": 3990,
  "consulting:coaching": 9900,
  // 工作坊和課程之後從資料庫查詢
};

/**
 * 簡易 IP Rate Limiting（記憶體內，每個 serverless instance 獨立）
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 每分鐘最多 10 次
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

/**
 * POST /api/payment/create
 * 建立 PAYUNi 付款訂單，回傳付款表單資料
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "請求過於頻繁，請稍後再試" }, { status: 429 });
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: "付款系統維護中" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { productType, productId, productName, buyerEmail, buyerName } = body;

    if (!productType || !productId || !buyerEmail) {
      return NextResponse.json(
        { error: "缺少必要參數" },
        { status: 400 }
      );
    }

    // 驗證 Email 格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    // ✅ 伺服器端查詢真實價格（不信任客戶端傳來的 amount）
    const priceKey = `${productType}:${productId}`;
    const verifiedAmount = PRODUCT_PRICES[priceKey];

    if (!verifiedAmount) {
      return NextResponse.json(
        { error: "無效的產品" },
        { status: 400 }
      );
    }

    // 產生訂單編號
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNo = `SOLO${timestamp}${random}`;

    // 使用 service role 儲存訂單（繞過 RLS）
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase.from("orders").insert({
      order_no: orderNo,
      product_type: productType,
      product_id: productId,
      amount: verifiedAmount,
      buyer_email: buyerEmail,
      buyer_name: buyerName || null,
      payment_status: "pending",
    });

    if (dbError) {
      console.error("Failed to save order:", dbError);
      return NextResponse.json({ error: "訂單建立失敗" }, { status: 500 });
    }

    // 建立 PAYUNi 付款表單（使用伺服器驗證過的金額）
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.solo.tw";
    const paymentForm = createPaymentForm({
      orderNo,
      amount: verifiedAmount,
      productName: productName || priceKey,
      buyerEmail,
      returnUrl: `${baseUrl}/api/payment/return`,
      notifyUrl: `${baseUrl}/api/payment/notify`,
    });

    return NextResponse.json({
      orderNo,
      amount: verifiedAmount,
      ...paymentForm,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "付款建立失敗" }, { status: 500 });
  }
}
