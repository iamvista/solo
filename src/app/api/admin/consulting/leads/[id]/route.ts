import { NextResponse } from "next/server";
import { Recur } from "recur-tw/server";
import { isAdmin } from "@/lib/supabase/admin";
import { updateLeadStatus, deleteLead } from "@/lib/consulting-db";
import { sendEmail } from "@/lib/email";
import { ConsultingCheckoutLinkEmail } from "@/components/emails/consulting-checkout-link";
import { getPlanBySlug } from "@/lib/consulting-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.solo.tw";

let _recur: Recur | null = null;
function getRecur(): Recur {
  if (!_recur) {
    const key = process.env.RECUR_SECRET_KEY;
    if (!key) throw new Error("RECUR_SECRET_KEY not set");
    _recur = new Recur(key);
  }
  return _recur;
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { id } = await ctx.params;
  try {
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

type LeadStatus = "approved" | "rejected" | "enrolled" | "stale";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  let body: { status?: LeadStatus; vistaNotes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const status = body.status;
  if (
    !status ||
    !["approved", "rejected", "enrolled", "stale"].includes(status)
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_status" },
      { status: 400 },
    );
  }

  let updated;
  try {
    updated = await updateLeadStatus(id, status, body.vistaNotes);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }

  if (status === "approved") {
    const plan = getPlanBySlug(updated.plan);
    if (!plan) {
      // 學員選 'undecided' → 沒對應方案，approve 但不寄付款連結
      return NextResponse.json({
        ok: true,
        lead: updated,
        emailSkipped: true,
        emailSkippedReason:
          "學員方案為「還沒決定」（undecided），無對應 productId，未寄付款連結。請手動回信討論方案。",
      });
    }

    let checkoutUrl: string;
    try {
      const link = await getRecur().paymentLinks.create({
        productId: plan.recurProductId,
        successUrl: `${SITE_URL}/payment/success?type=consulting`,
        maxCompletions: 1,
        metadata: { lead_id: id },
      });
      checkoutUrl = link.url;
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error(
        "[admin consulting leads PATCH] paymentLinks.create failed",
        err,
      );
      return NextResponse.json({
        ok: true,
        lead: updated,
        paymentLinkError: true,
        paymentLinkErrorDetail: detail,
      });
    }

    const result = await sendEmail({
      to: updated.email,
      subject: `${updated.name}，您的 1-on-1 量身陪跑付款連結`,
      react: ConsultingCheckoutLinkEmail({
        name: updated.name,
        plan: plan.label,
        checkoutUrl,
        vistaMessage: body.vistaNotes ?? "",
      }),
    });

    if (!result.success) {
      const detail =
        result.error instanceof Error
          ? result.error.message
          : typeof result.error === "object"
            ? JSON.stringify(result.error)
            : String(result.error);
      console.error(
        "[admin consulting leads PATCH] sendEmail failed",
        result.error,
      );
      return NextResponse.json({
        ok: true,
        lead: updated,
        emailError: true,
        emailErrorDetail: detail,
        checkoutUrl, // 讓 Vista 手動複製寄出
      });
    }

    return NextResponse.json({
      ok: true,
      lead: updated,
      emailSent: true,
      checkoutUrl,
    });
  }

  return NextResponse.json({ ok: true, lead: updated });
}
