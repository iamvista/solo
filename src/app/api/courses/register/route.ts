import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  getCourseConfig,
  resolvePricing,
  type PricingPlan,
} from "@/lib/courses-config";
import { normalizePhone } from "@/lib/phone";
import { findActiveAffiliateByCode } from "@/lib/affiliates";
import { sendCapiEvent, parseFbCookies } from "@/lib/meta-capi";

export const runtime = "nodejs";

interface RegisterRequest {
  courseSlug: string;
  plan?: PricingPlan;
  email: string;
  name: string;
  phone: string;
  organization?: string;
  jobTitle?: string;
  attribution?: string;
  question?: string;
  currentProposalPain?: string;
  alumniCertificate?: string;
  lineId?: string;
  facebook?: string;
  dietary?: string;
  invoiceCompany?: string;
  invoiceTaxId?: string;
  marketingConsent?: boolean;
  companionName?: string;
  companionEmail?: string;
  companionPhone?: string;
  referralCode?: string;
}

function bad(msg: string, status = 400) {
  return Response.json({ ok: false, error: msg }, { status });
}

export async function POST(request: Request) {
  let body: RegisterRequest;
  try {
    body = (await request.json()) as RegisterRequest;
  } catch {
    return bad("Invalid JSON");
  }

  const courseSlug = body.courseSlug?.trim();
  if (!courseSlug) return bad("Missing courseSlug");

  const course = getCourseConfig(courseSlug);
  if (!course) return bad("Unknown course");

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  const phoneRaw = body.phone?.trim();
  if (!email || !name || !phoneRaw) {
    return bad("E-mail、姓名、手機為必填");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad("E-mail 格式不正確");
  }

  const phoneParsed = normalizePhone(phoneRaw);
  if (!phoneParsed) {
    return bad("手機格式無法辨識（請含國碼，例 +886912345678 或 0912345678）");
  }

  const taxId = body.invoiceTaxId?.trim();
  if (taxId && !/^\d{8}$/.test(taxId)) {
    return bad("統一編號需為 8 碼數字");
  }

  // 解析來源代碼（分潤歸因用）：手動填的優先，否則讀 ?ref 寫入的 cookie。
  // 推薦碼只記歸因／算分潤，不影響價格（折扣已與分潤脫鉤，改用 Recur 結帳優惠碼）。
  const cookieStore = await cookies();
  const rawReferral =
    body.referralCode?.trim() || cookieStore.get("solo_ref")?.value || "";
  let referralCode: string | null = null;
  if (rawReferral) {
    const affiliate = await findActiveAffiliateByCode(rawReferral, course.slug);
    referralCode = affiliate ? affiliate.code : null;
  }

  // 解析方案與價格
  const plan: PricingPlan = body.plan ?? "early_bird";
  const pricing = resolvePricing(course, new Date(), plan);

  // 舊生優惠：必須提供報名憑證
  const alumniCertificate = body.alumniCertificate?.trim();
  if (pricing.plan === "alumni") {
    if (!alumniCertificate) {
      return bad(
        "舊生優惠請在備註欄填寫過去報名憑證（梯次／日期／訂單號等）。",
      );
    }
    if (alumniCertificate.length < 4) {
      return bad("舊生報名憑證請寫清楚一些（至少 4 個字以上）。");
    }
  }

  // 雙人同行：驗證夥伴資料
  let companionEmailNorm: string | null = null;
  let companionPhoneNorm: ReturnType<typeof normalizePhone> = null;
  if (pricing.plan === "dual") {
    const cName = body.companionName?.trim();
    const cEmail = body.companionEmail?.trim().toLowerCase();
    const cPhone = body.companionPhone?.trim();
    if (!cName || !cEmail || !cPhone) {
      return bad("雙人同行方案需提供同行夥伴的姓名、E-mail、手機。");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail)) {
      return bad("夥伴 E-mail 格式不正確");
    }
    const cPhoneParsed = normalizePhone(cPhone);
    if (!cPhoneParsed) {
      return bad("夥伴手機格式無法辨識（請含國碼或 09 開頭）");
    }
    companionEmailNorm = cEmail;
    companionPhoneNorm = cPhoneParsed;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 已付款守門：同一 (course, email) 已完成報名就擋下，避免重複建單／重複付款。
  const { data: paidRow } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("course_id", course.slug)
    .eq("email", email)
    .eq("status", "paid")
    .limit(1)
    .maybeSingle();
  if (paidRow) {
    return Response.json(
      {
        ok: false,
        alreadyPaid: true,
        error:
          "你已經完成這堂課的報名了，不需要再次付款。若要修改資料或有任何疑問，請直接寫信給我們。",
      },
      { status: 409 },
    );
  }

  const enrollmentValues = {
    course_id: course.slug,
    plan: pricing.plan,
    email,
    name,
    phone: phoneParsed.e164,
    phone_country: phoneParsed.country,
    organization: body.organization?.trim() || null,
    job_title: body.jobTitle?.trim() || null,
    attribution: body.attribution?.trim() || null,
    question: body.question?.trim() || null,
    current_proposal_pain: body.currentProposalPain?.trim() || null,
    alumni_certificate: alumniCertificate || null,
    line_id: body.lineId?.trim() || null,
    facebook: body.facebook?.trim() || null,
    dietary: body.dietary?.trim() || null,
    invoice_company: body.invoiceCompany?.trim() || null,
    invoice_tax_id: taxId || null,
    marketing_consent: !!body.marketingConsent,
    referral_code: referralCode,
    status: "pending",
    recur_product_id: pricing.productId,
    amount: pricing.amount,
    companion_name: body.companionName?.trim() || null,
    companion_email: companionEmailNorm,
    companion_phone: companionPhoneNorm?.e164 ?? null,
    companion_phone_country: companionPhoneNorm?.country ?? null,
  };

  // 去重：同一 (course, email) 已有 pending 就更新該筆並重用其 id，不再每次送出都新增一列
  //（避免「待付款」被同一人的重試／放棄灌爆）。
  const { data: existingPending } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("course_id", course.slug)
    .eq("email", email)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const writeResult = existingPending
    ? await supabase
        .from("course_enrollments")
        .update(enrollmentValues)
        .eq("id", existingPending.id)
        .select("id")
        .single()
    : await supabase
        .from("course_enrollments")
        .insert(enrollmentValues)
        .select("id")
        .single();
  const row = writeResult.data;
  const error = writeResult.error;

  if (error || !row) {
    console.error("[/api/courses/register] enrollment write failed", error);
    return bad("名單寫入失敗，請稍後再試。", 500);
  }

  const metadata: Record<string, string> = {
    enrollment_id: row.id,
    course_id: course.slug,
    plan: pricing.plan,
    phone: phoneParsed.e164,
  };
  if (body.lineId?.trim()) metadata.line_id = body.lineId.trim();
  if (body.invoiceTaxId) metadata.invoice_tax_id = body.invoiceTaxId.trim();
  if (companionEmailNorm) metadata.companion_email = companionEmailNorm;
  if (alumniCertificate) {
    // 截短到 200 字以內，避免超過 Recur metadata 限制
    metadata.alumni_certificate = alumniCertificate.slice(0, 200);
  }
  if (referralCode) metadata.referral_code = referralCode;

  const { fbp, fbc } = parseFbCookies(request.headers.get("cookie"));
  await sendCapiEvent({
    eventName: "Lead",
    eventId: row.id,
    eventSourceUrl: request.headers.get("referer") || "https://www.solo.tw/",
    actionSource: "website",
    user: {
      email,
      phone: phoneParsed.e164,
      firstName: name,
      fbp,
      fbc,
      clientIp: (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    },
  });

  return Response.json({
    ok: true,
    enrollmentId: row.id,
    productId: pricing.productId,
    amount: pricing.amount,
    plan: pricing.plan,
    customerEmail: email,
    customerName: name,
    metadata,
  });
}
