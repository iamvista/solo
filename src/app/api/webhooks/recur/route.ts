import { Recur } from "recur-tw/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";
import { AICoachKitPurchaseEmail } from "@/components/emails/ai-coach-kit-purchase";
import { GenericPurchaseEmail } from "@/components/emails/generic-purchase";
import {
  AI_COACH_KIT_PRODUCT_ID,
  resolveProductConfig,
  type ProductEmailConfig,
} from "@/lib/recur-product-config";
import { getCourseConfig } from "@/lib/courses-config";

let _recur: Recur | null = null;
function getRecur(): Recur {
  if (!_recur) {
    const key = process.env.RECUR_SECRET_KEY;
    if (!key) throw new Error("RECUR_SECRET_KEY not set");
    _recur = new Recur(key);
  }
  return _recur;
}

const DOWNLOAD_TTL_HOURS = 72;
const MAX_DOWNLOADS = 3;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.solo.tw";

type OrderPaidData = {
  id: string;
  amount?: number;
  product_id?: string;
  customer?: { email?: string; name?: string | null };
  items?: Array<{ product_id?: string; product_name?: string }>;
  metadata?: Record<string, string>;
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
    event = getRecur().webhooks.verify(payload, signature, secret);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    if (event.type === "order.paid") {
      await handleOrderPaid(event.id, event.data as unknown as OrderPaidData);
    } else if (event.type === "order.payment_failed") {
      await handleOrderFailed(event.id, event.data as unknown as OrderPaidData);
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

function pickProductId(data: OrderPaidData): string | undefined {
  return data.product_id ?? data.items?.[0]?.product_id;
}

function pickProductName(data: OrderPaidData): string | undefined {
  return data.items?.[0]?.product_name;
}

async function handleOrderPaid(eventId: string, data: OrderPaidData) {
  const orderId = data.id;
  const email = data.customer?.email;
  const productId = pickProductId(data);
  const amount = data.amount;

  if (!email) {
    console.warn("[recur webhook] order.paid missing email", eventId, orderId);
    return;
  }

  const config = resolveProductConfig(productId, pickProductName(data));

  // 嘗試找對應的 enrollment：先看 metadata（recur SDK 目前不支援，但留著未來相容），
  // 再用 email + product_id 反查最新一筆 pending enrollment（fallback 路徑）
  let enrollmentId: string | undefined = data.metadata?.enrollment_id;
  if (!enrollmentId) {
    enrollmentId = (await findPendingEnrollment(email, productId)) ?? undefined;
    if (enrollmentId) {
      console.log(
        "[recur webhook] enrollment matched by email fallback",
        enrollmentId,
        "for order",
        orderId,
      );
    }
  }

  if (enrollmentId) {
    await markEnrollmentPaid({ enrollmentId, orderId, productId, amount });
  } else {
    console.warn(
      "[recur webhook] no enrollment found for paid order",
      orderId,
      "email",
      email,
      "product",
      productId,
    );
  }

  if (config.kind === "ai-coach-kit") {
    await fulfilAiCoachKit({ orderId, email, amount });
    return;
  }

  await sendGenericConfirmation({ config, orderId, email, amount });

  // 若是課程，再嘗試發 SMS（從 enrollment 撈 phone）+ 雙人同行夥伴 email
  if (config.kind === "course" && enrollmentId) {
    await sendCourseSms({ enrollmentId, config });
    await sendCompanionEmail({ enrollmentId, config });
  }
}

function getSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** 用 email + product 反查最新一筆 pending enrollment id，fallback 用，因為 SDK 沒帶 metadata */
async function findPendingEnrollment(
  email: string,
  productId: string | undefined,
): Promise<string | null> {
  try {
    const sb = getSupabase();
    let query = sb
      .from("course_enrollments")
      .select("id")
      .eq("email", email)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1);
    if (productId) {
      query = query.eq("recur_product_id", productId);
    }
    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("[recur webhook] findPendingEnrollment query error", error);
      return null;
    }
    return data?.id ?? null;
  } catch (e) {
    console.error("[recur webhook] findPendingEnrollment threw", e);
    return null;
  }
}

async function markEnrollmentPaid({
  enrollmentId,
  orderId,
  productId,
  amount,
}: {
  enrollmentId: string;
  orderId: string;
  productId?: string;
  amount?: number;
}) {
  try {
    const sb = getSupabase();
    const { error } = await sb
      .from("course_enrollments")
      .update({
        status: "paid",
        recur_order_id: orderId,
        recur_product_id: productId,
        amount,
        paid_at: new Date().toISOString(),
        email_confirmation_sent_at: new Date().toISOString(),
      })
      .eq("id", enrollmentId);
    if (error) {
      console.error("[recur webhook] mark enrollment paid failed", error);
    }
  } catch (e) {
    console.error("[recur webhook] markEnrollmentPaid threw", e);
  }
}

async function sendCourseSms({
  enrollmentId,
  config,
}: {
  enrollmentId: string;
  config: Extract<ProductEmailConfig, { kind: "course" }>;
}) {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("course_enrollments")
      .select(
        "phone, name, course_id, plan, companion_name, companion_email, companion_phone",
      )
      .eq("id", enrollmentId)
      .maybeSingle();
    if (error || !data?.phone) {
      console.warn("[recur webhook] no phone for enrollment", enrollmentId, error);
      return;
    }
    const courseConfig = getCourseConfig(data.course_id);
    const dateLine = courseConfig
      ? `${courseConfig.date} ${courseConfig.time}`
      : "開課時間請見 email";
    const body = `【${config.productName}】${data.name ?? "你"}的報名確認！${dateLine}・地點報名後告知。詳細資訊已寄到你的 email。— solo.tw`;
    const result = await sendSms(data.phone, body);
    if (result.success) {
      await sb
        .from("course_enrollments")
        .update({ sms_confirmation_sent_at: new Date().toISOString() })
        .eq("id", enrollmentId);
    }
    // 雙人同行：也發給夥伴
    if (data.plan === "dual" && data.companion_phone) {
      const companionBody = `【${config.productName}】${
        data.companion_name ?? "同行夥伴"
      } 的報名確認！${dateLine}・地點報名後告知。— solo.tw`;
      await sendSms(data.companion_phone, companionBody);
    }
  } catch (e) {
    console.error("[recur webhook] sendCourseSms threw", e);
  }
}

async function sendCompanionEmail({
  enrollmentId,
  config,
}: {
  enrollmentId: string;
  config: Extract<ProductEmailConfig, { kind: "course" }>;
}) {
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from("course_enrollments")
      .select(
        "plan, companion_name, companion_email, recur_order_id, amount",
      )
      .eq("id", enrollmentId)
      .maybeSingle();
    if (!data || data.plan !== "dual" || !data.companion_email) return;

    const amountFormatted =
      typeof data.amount === "number"
        ? `NT$${data.amount.toLocaleString()}`
        : undefined;

    await sendEmail({
      to: data.companion_email,
      subject: `感謝報名《${config.productName}》——課堂見`,
      react: GenericPurchaseEmail({
        kind: "course",
        productName: config.productName,
        orderNumber: data.recur_order_id ?? enrollmentId,
        amountFormatted,
        whatsNext: config.whatsNext,
        detailUrl: config.detailUrl,
      }),
    });
  } catch (e) {
    console.error("[recur webhook] sendCompanionEmail threw", e);
  }
}

async function handleOrderFailed(eventId: string, data: OrderPaidData) {
  const orderId = data.id;
  const email = data.customer?.email;
  const productId = pickProductId(data);
  const enrollmentId = data.metadata?.enrollment_id;
  // 標記 enrollment 為失敗，方便主動聯繫補刷
  if (enrollmentId) {
    try {
      const sb = getSupabase();
      await sb
        .from("course_enrollments")
        .update({ status: "failed", recur_order_id: orderId })
        .eq("id", enrollmentId);
    } catch (e) {
      console.error("[recur webhook] mark enrollment failed threw", e);
    }
  }
  console.warn(
    "[recur webhook] order.payment_failed",
    eventId,
    "order",
    orderId,
    "product",
    productId,
    "email",
    email ?? "(unknown)",
  );
  // 內部告警：寄一封到 admin 信箱，方便主動聯繫客戶補刷
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return;
  try {
    await sendEmail({
      to: adminEmail,
      subject: `[recur] 付款失敗 — ${orderId}`,
      react: GenericPurchaseEmail({
        kind: "default",
        productName: pickProductName(data) ?? `(product_id=${productId ?? "?"})`,
        orderNumber: orderId,
        amountFormatted:
          typeof data.amount === "number"
            ? `NT$${data.amount.toLocaleString()}`
            : undefined,
        whatsNext: [
          `客戶 email：${email ?? "(未提供)"}`,
          "請主動聯繫確認是否要協助補刷或換卡",
        ],
      }),
    });
  } catch (e) {
    console.error("[recur webhook] admin notify failed", e);
  }
}

async function fulfilAiCoachKit({
  orderId,
  email,
  amount,
}: {
  orderId: string;
  email: string;
  amount?: number;
}) {
  const supabase = getSupabase();

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
  // 標記避免 unused
  void AI_COACH_KIT_PRODUCT_ID;
}

async function sendGenericConfirmation({
  config,
  orderId,
  email,
  amount,
}: {
  config: Exclude<ProductEmailConfig, { kind: "ai-coach-kit" }>;
  orderId: string;
  email: string;
  amount?: number;
}) {
  const amountFormatted =
    typeof amount === "number" ? `NT$${amount.toLocaleString()}` : undefined;

  const subjectByKind: Record<typeof config.kind, string> = {
    course: `感謝報名《${config.productName}》——課堂見`,
    donation: `謝謝你的支持——${config.productName}`,
    default: `已收到你的款項——${config.productName}`,
  };

  const result = await sendEmail({
    to: email,
    subject: subjectByKind[config.kind],
    react: GenericPurchaseEmail({
      kind: config.kind,
      productName: config.productName,
      orderNumber: orderId,
      amountFormatted,
      whatsNext: config.kind === "course" ? config.whatsNext : undefined,
      detailUrl: config.kind === "course" ? config.detailUrl : undefined,
    }),
  });

  if (!result.success) {
    console.error("[recur webhook] generic email send failed", result.error);
    throw result.error;
  }
  console.log(
    "[recur webhook] sent",
    config.kind,
    "email to",
    email,
    "order",
    orderId,
    "product",
    config.productId,
  );
}
