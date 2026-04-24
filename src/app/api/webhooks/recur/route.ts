import { Recur } from "recur-tw/server";

const recur = new Recur(process.env.RECUR_SECRET_KEY ?? "");

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

  switch (event.type) {
    case "order.paid":
    case "checkout.completed":
      // TODO: 發貨邏輯——寄下載連結 email / 寫 Supabase 購買紀錄 / 授權存取
      console.log("[recur webhook]", event.type, event.id, event.data);
      break;
    case "invoice.payment_failed":
      console.warn("[recur webhook] payment failed", event.id, event.data);
      break;
    default:
      console.log("[recur webhook] unhandled", event.type, event.id);
  }

  return Response.json({ received: true });
}
