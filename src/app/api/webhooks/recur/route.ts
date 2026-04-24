import { Recur } from "recur-tw/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { sendEmail } from "@/lib/email";
import { AICoachKitPurchaseEmail } from "@/components/emails/ai-coach-kit-purchase";

const recur = new Recur(process.env.RECUR_SECRET_KEY ?? "");

const DOWNLOAD_TTL_HOURS = 72;
const MAX_DOWNLOADS = 3;
const AI_COACH_KIT_PRODUCT_ID = "xqvb9nqxtehhfesuhequm9jp";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.solo.tw";

type OrderPaidData = {
  id: string;
  amount?: number;
  product_id?: string;
  customer?: { email?: string };
};

export async function POST(request: Request) {
  const secret = process.env.RECUR_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[recur webhook] RECUR_WEBHOOK_SECRET not set");
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const payload = await request.text();
  const signature = request.headers.get("x-recur-signature");

  let event;
  try {
    event = recur.webhooks.verify(payload, signature, secret);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    if (event.type === "order.paid") {
      await handleOrderPaid(event.id, event.data as unknown as OrderPaidData);
    } else if (event.type === "checkout.completed") {
      console.log(
        "[recur webhook] checkout.completed acknowledged; fulfillment runs on order.paid",
        event.id,
      );
    } else if (event.type === "invoice.payment_failed") {
      console.warn("[recur webhook] payment failed", event.id, event.data);
    } else {
      console.log("[recur webhook] unhandled", event.type, event.id);
    }
  } catch (e) {
    // Always return 200 so recur doesn't retry forever; error is logged above.
    console.error("[recur webhook] handler error", event.type, event.id, e);
  }

  return Response.json({ received: true });
}

async function handleOrderPaid(eventId: string, data: OrderPaidData) {
  const orderId = data.id;
  const email = data.customer?.email;
  const productId = data.product_id;
  const amount = data.amount;

  if (!email) {
    console.warn("[recur webhook] order.paid missing email", eventId, orderId);
    return;
  }

  if (productId && productId !== AI_COACH_KIT_PRODUCT_ID) {
    console.log(
      "[recur webhook] order.paid for non-AI-coach-kit product, skipping",
      productId,
    );
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: existing } = await supabase
    .from("download_tokens")
    .select("token")
    .eq("order_id", orderId)
    .maybeSingle();

  let token: string;
  if (existing?.token) {
    token = existing.token as string;
    console.log("[recur webhook] reusing existing token for order", orderId);
  } else {
    token = randomUUID();
    const expiresAt = new Date(
      Date.now() + DOWNLOAD_TTL_HOURS * 3600_000,
    ).toISOString();
    const { error } = await supabase.from("download_tokens").insert({
      order_id: orderId,
      product_id: "ai-coach-kit",
      token,
      email,
      expires_at: expiresAt,
    });
    if (error) {
      console.error("[recur webhook] failed to insert token", error);
      throw error;
    }
  }

  const downloadUrl = `${SITE_URL}/payment/success?type=download&token=${token}`;
  const amountFormatted =
    typeof amount === "number" ? `NT$${amount.toLocaleString()}` : undefined;

  const result = await sendEmail({
    to: email,
    subject: "感謝購買 AI 教練工坊——你的下載連結",
    react: AICoachKitPurchaseEmail({
      downloadUrl,
      orderNumber: orderId,
      amountFormatted,
      expiresInHours: DOWNLOAD_TTL_HOURS,
      maxDownloads: MAX_DOWNLOADS,
    }),
  });

  if (!result.success) {
    console.error("[recur webhook] sendEmail failed", result.error);
    throw result.error;
  }
  console.log(
    "[recur webhook] sent ai-coach-kit email to",
    email,
    "order",
    orderId,
  );
}
