import { Recur } from "recur-tw/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { sendEmail } from "@/lib/email";
import { AICoachKitPurchaseEmail } from "@/components/emails/ai-coach-kit-purchase";
import { ArsBundlePurchaseEmail } from "@/components/emails/ars-bundle-purchase";
import { ArmyKitPurchaseEmail } from "@/components/emails/army-kit-purchase";
import { GenericPurchaseEmail } from "@/components/emails/generic-purchase";
import { ConsultingEnrollmentWelcomeEmail } from "@/components/emails/consulting-enrollment-welcome";
import {
  AI_COACH_KIT_PRODUCT_ID,
  resolveProductConfig,
  type ProductEmailConfig,
} from "@/lib/recur-product-config";
import {
  DOWNLOAD_TTL_HOURS,
  MAX_DOWNLOADS,
} from "@/lib/ai-coach-kit";
import {
  ARS_BUNDLE_LABELS,
  ARS_BUNDLE_MAX_DOWNLOADS,
  DOWNLOAD_TTL_HOURS as ARS_DOWNLOAD_TTL_HOURS,
} from "@/lib/ars-bundles";
import {
  ARMY_KIT_PRODUCT_NAME,
  DOWNLOAD_TTL_HOURS as ARMY_DOWNLOAD_TTL_HOURS,
  MAX_DOWNLOADS as ARMY_MAX_DOWNLOADS,
} from "@/lib/army-kit";
import {
  createEnrollment,
  updateLeadStatus,
  findRecentApprovedLead,
  attachLeadToEnrollment,
} from "@/lib/consulting-db";
import {
  recordCommissionForEnrollment,
  voidCommissionByOrderId,
} from "@/lib/affiliates";

/** 數位下載型商品（ars-bundle／army-kit）fulfilment 失敗時拋出，讓 POST 對該事件回 500（其餘 kind 維持既有 200 慣例）。 */
class DigitalFulfilmentError extends Error {}

let _recur: Recur | null = null;
function getRecur(): Recur {
  if (!_recur) {
    const key = process.env.RECUR_SECRET_KEY;
    if (!key) throw new Error("RECUR_SECRET_KEY not set");
    _recur = new Recur(key);
  }
  return _recur;
}

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
    } else if (event.type === "refund.succeeded") {
      const data = event.data as unknown as {
        id?: string;
        order_id?: string;
        order?: { id?: string };
      };
      const orderId = data.order_id ?? data.order?.id ?? data.id ?? "";
      console.log(
        "[recur webhook] refund.succeeded; voiding referral for order",
        orderId,
        "payload keys:",
        Object.keys(data),
      );
      await voidCommissionByOrderId(orderId);
      await revokeDownloadTokensByOrderId(orderId);
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
    if (e instanceof DigitalFulfilmentError) {
      // 數位下載型商品（ars-bundle／army-kit）fulfilment 失敗要讓 Recur 重送（冪等已由
      // order_id 保證重送安全），只改這條路徑的回應碼，其餘 kind 仍走下面「一律回 200」的既有慣例。
      console.error(
        "[recur webhook] digital fulfilment failed, returning 500 for retry",
        event.type,
        event.id,
        e,
      );
      return Response.json({ error: "digital fulfilment failed" }, { status: 500 });
    }
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

  const config = resolveProductConfig(productId, pickProductName(data));

  if (!email) {
    console.warn("[recur webhook] order.paid missing email", eventId, orderId);
    if (config.kind === "ars-bundle") {
      // 純數位下載沒有 email 就無法交付，且 ars 沒有 enrollment 兜底，必須主動告警補救。
      await notifyAdminEmailFailure({
        reason: "ars-bundle 訂單缺少 customer.email，無法交付下載連結",
        orderId,
        customerEmail: "(未提供)",
        productName: ARS_BUNDLE_LABELS[config.bundle],
        amount,
        recoveryNote: "請至 Recur 後臺查該筆訂單找出買家聯絡方式，人工補寄下載連結。",
      });
    } else if (config.kind === "army-kit") {
      // 純數位下載沒有 email 就無法交付，且 army-kit 沒有 enrollment 兜底，必須主動告警補救。
      await notifyAdminEmailFailure({
        reason: "army-kit 訂單缺少 customer.email，無法交付下載連結",
        orderId,
        customerEmail: "(未提供)",
        productName: ARMY_KIT_PRODUCT_NAME,
        amount,
        recoveryNote: "請至 Recur 後臺查該筆訂單找出買家聯絡方式，人工補寄下載連結。",
      });
    }
    return;
  }

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
    try {
      await recordCommissionForEnrollment({
        enrollmentId,
        orderId,
        orderAmount: amount,
      });
    } catch (e) {
      console.error("[recur webhook] recordCommissionForEnrollment threw", e);
    }
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

  if (config.kind === "ars-bundle") {
    try {
      await fulfilArsBundle({ config, orderId, email, amount });
    } catch (err) {
      throw new DigitalFulfilmentError(
        err instanceof Error ? err.message : String(err),
      );
    }
    return;
  }

  if (config.kind === "army-kit") {
    try {
      await fulfilArmyKit({ orderId, email, amount });
    } catch (err) {
      throw new DigitalFulfilmentError(
        err instanceof Error ? err.message : String(err),
      );
    }
    return;
  }

  if (config.kind === "consulting") {
    await fulfilConsulting({ config, orderId, data });
    return;
  }

  await sendGenericConfirmation({ config, orderId, email, amount });

  // 若是課程，通知雙人同行夥伴 email
  if (config.kind === "course" && enrollmentId) {
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
    } else {
      // 付款成功後，把同人同課其他 pending（放棄／刷卡失敗留下的殘留）標記為 superseded，
      // 名單與「待付款」數字才不會被同一人的重複嘗試灌爆。
      const { data: paidRow } = await sb
        .from("course_enrollments")
        .select("email, course_id")
        .eq("id", enrollmentId)
        .maybeSingle();
      if (paidRow?.email && paidRow?.course_id) {
        const { error: supErr } = await sb
          .from("course_enrollments")
          .update({ status: "superseded" })
          .eq("course_id", paidRow.course_id)
          .eq("email", paidRow.email)
          .eq("status", "pending")
          .neq("id", enrollmentId);
        if (supErr) {
          console.error("[recur webhook] supersede siblings failed", supErr);
        }
      }
    }
  } catch (e) {
    console.error("[recur webhook] markEnrollmentPaid threw", e);
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
    await notifyAdminEmailFailure({
      reason: "AI 教練工坊下載信寄送失敗",
      orderId,
      customerEmail: email,
      productName: "AI 教練工坊",
      amount,
      recoveryNote: [
        `下載連結：${downloadUrl}`,
        `Token 已寫入 download_tokens 表，${DOWNLOAD_TTL_HOURS} 小時內有效，最多下載 ${MAX_DOWNLOADS} 次。`,
        "請手動轉寄上方連結給客戶。",
      ].join("\n"),
      error: result.error,
    });
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

async function fulfilArsBundle({
  config,
  orderId,
  email,
  amount,
}: {
  config: Extract<ProductEmailConfig, { kind: "ars-bundle" }>;
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
    console.log("[recur webhook] reusing existing ars token for order", orderId);
  } else {
    token = randomUUID();
    const expiresAt = new Date(
      Date.now() + ARS_DOWNLOAD_TTL_HOURS * 3600_000,
    ).toISOString();
    // clinician 的垂直是固定的（醫學），落地時就直接鎖定，下載 route 不必再為它特判。
    const chosenVertical = config.bundle === "clinician" ? "medical" : null;
    const { error } = await supabase.from("download_tokens").insert({
      order_id: orderId,
      product_id: config.bundle,
      token,
      email,
      expires_at: expiresAt,
      max_downloads: ARS_BUNDLE_MAX_DOWNLOADS[config.bundle],
      chosen_vertical: chosenVertical,
    });
    if (error) {
      // 併發雙寫撞到 order_id 的 unique index（Postgres 23505）：代表另一個並發請求
      // 已經贏了 insert 並會負責寄信。這裡改為重查既有 token 當冪等成功，不寄第二封信、
      // 不當一般錯誤丟 500（否則 Recur 會一直重送，且我們每次都會再撞一次 23505）。
      if (error.code === "23505") {
        console.log(
          "[recur webhook] ars token insert hit unique violation on order_id (concurrent winner already fulfilled); treating as idempotent success",
          orderId,
        );
        const { data: winner, error: reselectError } = await supabase
          .from("download_tokens")
          .select("token")
          .eq("order_id", orderId)
          .maybeSingle();
        if (reselectError || !winner?.token) {
          console.error(
            "[recur webhook] ars token unique violation but reselect found no token",
            orderId,
            reselectError,
          );
        }
        return;
      }
      console.error("[recur webhook] failed to insert ars token", error);
      throw error;
    }
  }

  const bundleLabel = ARS_BUNDLE_LABELS[config.bundle];
  const maxDownloads = ARS_BUNDLE_MAX_DOWNLOADS[config.bundle];
  const downloadUrl = `${SITE_URL}/payment/success?type=ars&token=${token}`;
  const amountFormatted =
    typeof amount === "number" ? `NT$${amount.toLocaleString()}` : undefined;

  const result = await sendEmail({
    to: email,
    subject: `感謝購買 AI 學術研究工作臺：${bundleLabel}下載連結`,
    react: ArsBundlePurchaseEmail({
      bundleLabel,
      downloadUrl,
      orderNumber: orderId,
      amountFormatted,
      expiresInHours: ARS_DOWNLOAD_TTL_HOURS,
      maxDownloads,
    }),
  });

  if (!result.success) {
    // Token 已建立成功，只是寄信失敗：改為 admin 告警 + 正常返回（webhook 回 200），
    // 不再 throw ArsFulfilmentError。永久性 email 失敗（如網域被封鎖）會讓 Recur
    // 無限重試 webhook，只會 spam 而換不回一封信；補救走人工重寄（告警信已附下載連結）。
    console.error("[recur webhook] sendEmail failed (ars)", result.error);
    await notifyAdminEmailFailure({
      reason: `${bundleLabel} 下載信寄送失敗`,
      orderId,
      customerEmail: email,
      productName: bundleLabel,
      amount,
      recoveryNote: [
        `下載連結：${downloadUrl}`,
        `Token 已寫入 download_tokens 表，${ARS_DOWNLOAD_TTL_HOURS} 小時內有效，最多下載 ${maxDownloads} 次。`,
        "請手動轉寄上方連結給客戶。",
      ].join("\n"),
      error: result.error,
    });
    return;
  }
  console.log(
    "[recur webhook] sent ars-bundle email to",
    email,
    "order",
    orderId,
    "bundle",
    config.bundle,
  );
}

async function fulfilArmyKit({
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

  if (existing?.token) {
    // 這筆 order_id 已經 fulfil 過（同一 webhook 事件重送）：token 已存在，直接跳出，
    // 不再寄第二封信（比對 23505 併發分支同樣的「已處理過，return 不寄信」慣例）。
    console.log(
      "[recur webhook] army-kit order already fulfilled, skipping duplicate email for order",
      orderId,
    );
    return;
  }

  const token = randomUUID();
  const expiresAt = new Date(
    Date.now() + ARMY_DOWNLOAD_TTL_HOURS * 3600_000,
  ).toISOString();
  const { error } = await supabase.from("download_tokens").insert({
    order_id: orderId,
    product_id: "army-kit",
    token,
    email,
    expires_at: expiresAt,
    max_downloads: ARMY_MAX_DOWNLOADS,
  });
  if (error) {
    // 併發雙寫撞到 order_id 的 unique index（Postgres 23505）：代表另一個並發請求
    // 已經贏了 insert 並會負責寄信。這裡改為重查既有 token 當冪等成功，不寄第二封信、
    // 不當一般錯誤丟 500（否則 Recur 會一直重送，且我們每次都會再撞一次 23505）。
    if (error.code === "23505") {
      console.log(
        "[recur webhook] army-kit token insert hit unique violation on order_id (concurrent winner already fulfilled); treating as idempotent success",
        orderId,
      );
      const { data: winner, error: reselectError } = await supabase
        .from("download_tokens")
        .select("token")
        .eq("order_id", orderId)
        .maybeSingle();
      if (reselectError || !winner?.token) {
        console.error(
          "[recur webhook] army-kit token unique violation but reselect found no token",
          orderId,
          reselectError,
        );
      }
      return;
    }
    console.error("[recur webhook] failed to insert army-kit token", error);
    throw error;
  }

  const downloadUrl = `${SITE_URL}/payment/success?type=download&token=${token}`;
  const amountFormatted =
    typeof amount === "number" ? `NT$${amount.toLocaleString()}` : undefined;

  const result = await sendEmail({
    to: email,
    subject: `感謝購買${ARMY_KIT_PRODUCT_NAME}：你的下載連結`,
    react: ArmyKitPurchaseEmail({
      productName: ARMY_KIT_PRODUCT_NAME,
      downloadUrl,
      orderNumber: orderId,
      amountFormatted,
      expiresInHours: ARMY_DOWNLOAD_TTL_HOURS,
      maxDownloads: ARMY_MAX_DOWNLOADS,
    }),
  });

  if (!result.success) {
    // Token 已建立成功，只是寄信失敗：改為 admin 告警 + 正常返回（webhook 回 200），
    // 不再 throw DigitalFulfilmentError（比對 fulfilArsBundle 的既有降級慣例）。
    console.error("[recur webhook] sendEmail failed (army-kit)", result.error);
    await notifyAdminEmailFailure({
      reason: `${ARMY_KIT_PRODUCT_NAME}下載信寄送失敗`,
      orderId,
      customerEmail: email,
      productName: ARMY_KIT_PRODUCT_NAME,
      amount,
      recoveryNote: [
        `下載連結：${downloadUrl}`,
        `Token 已寫入 download_tokens 表，${ARMY_DOWNLOAD_TTL_HOURS} 小時內有效，最多下載 ${ARMY_MAX_DOWNLOADS} 次。`,
        "請手動轉寄上方連結給客戶。",
      ].join("\n"),
      error: result.error,
    });
    return;
  }
  console.log(
    "[recur webhook] sent army-kit email to",
    email,
    "order",
    orderId,
  );
}

// 退款作廢下載 token：refund.succeeded 時把該 order 的未過期 token 設為立即過期，
// 退款後不可再下載。失敗只記 log 不拋錯（避免退款事件進入 500 重試迴圈，補救走人工）。
async function revokeDownloadTokensByOrderId(orderId: string) {
  if (!orderId) return;
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("download_tokens")
      .update({ expires_at: new Date().toISOString() })
      .eq("order_id", orderId)
      .gt("expires_at", new Date().toISOString())
      .select("token");
    if (error) {
      console.error(
        "[recur webhook] revoke download tokens failed for order",
        orderId,
        error.message,
      );
      return;
    }
    if (data && data.length > 0) {
      console.log(
        "[recur webhook] revoked",
        data.length,
        "download token(s) for refunded order",
        orderId,
      );
    }
  } catch (err) {
    console.error(
      "[recur webhook] revoke download tokens threw for order",
      orderId,
      err,
    );
  }
}

async function fulfilConsulting({
  config,
  orderId,
  data,
}: {
  config: Extract<ProductEmailConfig, { kind: "consulting" }>;
  orderId: string;
  data: OrderPaidData;
}) {
  const email = data.customer?.email;
  if (!email) {
    console.warn("[recur webhook] consulting fulfilment missing email", orderId);
    return;
  }
  const customerName = data.customer?.name?.trim() || email;
  let leadId = data.metadata?.leadId ?? data.metadata?.lead_id ?? null;
  const contactMethod = data.metadata?.contactMethod ?? data.metadata?.contact_method;
  const contactId = data.metadata?.contactId ?? data.metadata?.contact_id;
  const paymentId = data.metadata?.paymentId ?? data.metadata?.payment_id ?? orderId;
  const purchasedAt = new Date();

  // Fallback：Recur 目前未把 paymentLinks.create 設的 metadata 透傳到 order.paid，
  // 改用 email + plan 找最近一筆 approved lead 對回。
  if (!leadId) {
    const fallback = await findRecentApprovedLead({
      email,
      plan: config.plan,
    });
    if (fallback) {
      leadId = fallback.id;
      console.log(
        "[recur webhook] consulting lead matched by email fallback",
        leadId,
        "for order",
        orderId,
      );
    } else {
      console.warn(
        "[recur webhook] consulting lead NOT matched (no metadata + fallback empty)",
        "email",
        email,
        "plan",
        config.plan,
        "order",
        orderId,
        "data.metadata keys",
        Object.keys(data.metadata ?? {}),
      );
    }
  }

  // 1. 建立 enrollment（hour bank）
  let enrollment: Awaited<ReturnType<typeof createEnrollment>>;
  try {
    enrollment = await createEnrollment({
      leadId: leadId ?? null,
      name: customerName,
      email,
      contactMethod,
      contactId,
      plan: config.plan,
      totalHours: config.hours,
      recurProductId: config.productId,
      recurPaymentId: paymentId,
      purchasedAt,
    });
  } catch (err) {
    console.error("[recur webhook] createEnrollment failed (consulting)", err);
    await notifyAdminEmailFailure({
      reason: "consulting enrollment 建立失敗",
      orderId,
      customerEmail: email,
      productName: config.productName,
      amount: data.amount,
      recoveryNote: [
        `客戶 email：${email}`,
        `Plan：${config.plan}（${config.hours} 小時）`,
        `Recur product：${config.productId}`,
        `Recur payment（or order）：${paymentId}`,
        leadId ? `Lead ID：${leadId}` : "Lead ID：(無 — webhook metadata 未帶)",
        "請手動建立 consulting_enrollments 紀錄並補寄歡迎信。",
      ].join("\n"),
      error: err,
    });
    throw err;
  }

  // 2. 更新 lead.status='enrolled'（若有 leadId）
  if (leadId) {
    try {
      await updateLeadStatus(leadId, "enrolled");
    } catch (err) {
      console.error(
        "[recur webhook] updateLeadStatus failed (consulting)",
        leadId,
        err,
      );
      // 不擋 enrollment 流程
    }
  }

  // 3. 寄歡迎信
  try {
    const result = await sendEmail({
      to: email,
      subject: `${customerName}，您的 1-on-1 量身陪跑已啟動`,
      react: ConsultingEnrollmentWelcomeEmail({
        name: customerName,
        plan: config.productName,
        totalHours: config.hours,
        expiresAt: enrollment.expires_at,
      }),
    });
    if (!result.success) {
      console.error(
        "[recur webhook] consulting welcome email failed",
        result.error,
      );
      await notifyAdminEmailFailure({
        reason: "consulting 歡迎信寄送失敗",
        orderId,
        customerEmail: email,
        productName: config.productName,
        amount: data.amount,
        recoveryNote: [
          `Enrollment 已建立（id=${enrollment.id}），DB 資料無遺失。`,
          "請手動補寄歡迎信，並主動聯繫客戶確認首場時段。",
        ].join("\n"),
        error: result.error,
      });
    }
  } catch (err) {
    console.error(
      "[recur webhook] consulting welcome email threw",
      err,
    );
    // 不擋 enrollment（已建立）
  }

  // 4. 通知 admin（不擋主流程；失敗只 console.error）
  await notifyAdminConsultingPaid({
    orderId,
    customerName,
    customerEmail: email,
    contactMethod,
    contactId,
    plan: config.productName,
    hours: config.hours,
    amount: data.amount,
    leadId,
    enrollmentId: enrollment.id,
  });

  console.log(
    "[recur webhook] consulting enrollment created",
    enrollment.id,
    "plan",
    config.plan,
    "email",
    email,
    "order",
    orderId,
  );
}

async function notifyAdminConsultingPaid({
  orderId,
  customerName,
  customerEmail,
  contactMethod,
  contactId,
  plan,
  hours,
  amount,
  leadId,
  enrollmentId,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  contactMethod?: string;
  contactId?: string;
  plan: string;
  hours: number;
  amount?: number;
  leadId: string | null;
  enrollmentId: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) {
    console.error(
      "[recur webhook] ADMIN_NOTIFY_EMAIL not set; cannot notify consulting paid",
      orderId,
    );
    return;
  }
  try {
    const amountFormatted =
      typeof amount === "number" ? `NT$${amount.toLocaleString()}` : "(未知金額)";
    const contactLine =
      contactMethod && contactId
        ? `${contactMethod.toUpperCase()}：${contactId}`
        : "（未提供）";
    const whatsNext = [
      `學員：${customerName}`,
      `Email：${customerEmail}`,
      `偏好聯絡：${contactLine}`,
      `方案：${plan}（${hours} 小時）`,
      `金額：${amountFormatted}`,
      `Order：${orderId}`,
      leadId ? `Lead：${leadId}` : "Lead：(無)",
      `Enrollment：${enrollmentId}`,
      "",
      "—— 下一步 ——",
      "1. 主動回信／LINE 確認首場時段",
      `2. 後台連結：${SITE_URL}/admin/consulting/enrollments/${enrollmentId}`,
      leadId ? `3. 需求單：${SITE_URL}/admin/consulting/leads` : "",
    ].filter(Boolean);
    await sendEmail({
      to: adminEmail,
      subject: `[諮詢付款] ${customerName} — ${plan} ${amountFormatted}`,
      react: GenericPurchaseEmail({
        kind: "default",
        productName: `諮詢付款成功 — ${plan}`,
        orderNumber: orderId,
        amountFormatted,
        whatsNext,
      }),
    });
  } catch (e) {
    console.error("[recur webhook] notifyAdminConsultingPaid threw", e);
  }
}

async function sendGenericConfirmation({
  config,
  orderId,
  email,
  amount,
}: {
  config: Exclude<
    ProductEmailConfig,
    { kind: "ai-coach-kit" | "ars-bundle" | "army-kit" | "consulting" }
  >;
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
    await notifyAdminEmailFailure({
      reason: `${config.kind} 確認信寄送失敗`,
      orderId,
      customerEmail: email,
      productName: config.productName,
      amount,
      recoveryNote: [
        "Enrollment 已標記為 paid（如有），DB 端無資料遺失。",
        "請手動補寄確認信，或主動聯繫客戶確認資料。",
        config.kind === "course"
          ? "若為課程，後續 SMS 與雙人同行 email 也會中斷，請一併補發。"
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
      error: result.error,
    });
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

async function notifyAdminEmailFailure({
  reason,
  orderId,
  customerEmail,
  productName,
  amount,
  recoveryNote,
  error,
}: {
  reason: string;
  orderId: string;
  customerEmail: string;
  productName?: string;
  amount?: number;
  recoveryNote?: string;
  error?: unknown;
}) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) {
    console.error(
      "[recur webhook] ADMIN_NOTIFY_EMAIL not set; cannot escalate email failure",
      orderId,
    );
    return;
  }
  try {
    const amountFormatted =
      typeof amount === "number"
        ? `NT$${amount.toLocaleString()}`
        : "(未知金額)";
    const errorText =
      error instanceof Error
        ? error.message
        : error
          ? JSON.stringify(error)
          : "(無錯誤訊息)";
    const whatsNext = [
      `客戶 email：${customerEmail}`,
      `產品：${productName ?? "(未知產品)"}`,
      `金額：${amountFormatted}`,
      `失敗原因：${reason}`,
      `Email 服務錯誤：${errorText}`,
    ];
    if (recoveryNote) {
      whatsNext.push("", "—— 補救動作 ——", recoveryNote);
    }
    await sendEmail({
      to: adminEmail,
      subject: `[recur] 商品 email 寄送失敗 — ${orderId}`,
      react: GenericPurchaseEmail({
        kind: "default",
        productName: `[寄信失敗告警] ${productName ?? orderId}`,
        orderNumber: orderId,
        amountFormatted,
        whatsNext,
      }),
    });
  } catch (e) {
    console.error("[recur webhook] notifyAdminEmailFailure threw", e);
  }
}
