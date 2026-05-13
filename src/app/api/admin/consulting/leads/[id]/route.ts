import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { updateLeadStatus } from "@/lib/consulting-db";
import { sendEmail } from "@/lib/email";
import { ConsultingCheckoutLinkEmail } from "@/components/emails/consulting-checkout-link";
import { getPlanBySlug } from "@/lib/consulting-config";

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
    if (plan) {
      const checkoutUrl = `https://recur.tw/checkout/${plan.recurProductId}?lead_id=${id}`;
      try {
        await sendEmail({
          to: updated.email,
          subject: `${updated.name}，您的 1-on-1 量身陪跑付款連結`,
          react: ConsultingCheckoutLinkEmail({
            name: updated.name,
            plan: plan.label,
            checkoutUrl,
            vistaMessage: body.vistaNotes ?? "",
          }),
        });
      } catch (err) {
        console.error("[admin consulting leads PATCH] sendEmail failed", err);
        return NextResponse.json(
          { ok: true, lead: updated, emailError: true },
          { status: 200 },
        );
      }
    }
  }

  return NextResponse.json({ ok: true, lead: updated });
}
