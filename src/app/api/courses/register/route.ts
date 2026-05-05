import { createClient } from "@supabase/supabase-js";
import {
  getCourseConfig,
  resolvePricing,
  type PricingPlan,
} from "@/lib/courses-config";
import { normalizePhone } from "@/lib/phone";

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
  lineId?: string;
  facebook?: string;
  dietary?: string;
  invoiceCompany?: string;
  invoiceTaxId?: string;
  marketingConsent?: boolean;
  companionName?: string;
  companionEmail?: string;
  companionPhone?: string;
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

  // 解析方案，預設用 resolvePricing 的預設邏輯
  const plan: PricingPlan = body.plan ?? "early_bird";
  const pricing = resolvePricing(course, new Date(), plan);

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

  const { data: row, error } = await supabase
    .from("course_enrollments")
    .insert({
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
      line_id: body.lineId?.trim() || null,
      facebook: body.facebook?.trim() || null,
      dietary: body.dietary?.trim() || null,
      invoice_company: body.invoiceCompany?.trim() || null,
      invoice_tax_id: taxId || null,
      marketing_consent: !!body.marketingConsent,
      status: "pending",
      recur_product_id: pricing.productId,
      amount: pricing.amount,
      companion_name: body.companionName?.trim() || null,
      companion_email: companionEmailNorm,
      companion_phone: companionPhoneNorm?.e164 ?? null,
      companion_phone_country: companionPhoneNorm?.country ?? null,
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("[/api/courses/register] insert failed", error);
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
