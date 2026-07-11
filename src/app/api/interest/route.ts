import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

/** 商品興趣登記：停售期間的「開賣時通知我」。同 product_id + email 視為已登記過，冪等回 success。 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(ip, { max: 10, windowMs: 60_000 })) {
    return json({ success: false, error: "請求過於頻繁，請稍後再試" }, 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ success: false, error: "Invalid JSON" }, 400);
  }

  const productId =
    typeof raw.productId === "string" ? raw.productId.trim() : "";
  const email =
    typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";

  if (!productId) {
    return json({ success: false, error: "缺少 productId" }, 400);
  }
  if (!email || !EMAIL_RE.test(email)) {
    return json({ success: false, error: "E-mail 格式不正確" }, 400);
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("product_interest").insert({
    product_id: productId,
    email,
    name: name || null,
  });

  // 23505 = unique_violation：同一 product_id + email 已登記過，視為成功（冪等）
  if (error && error.code !== "23505") {
    console.error("product interest insert error:", error);
    return json({ success: false, error: "儲存失敗，請稍後再試" }, 500);
  }

  return json({ success: true });
}
