import { createClient } from "@supabase/supabase-js";
import { getCourseConfig, resolvePricing } from "@/lib/courses-config";
import { normalizePhone } from "@/lib/phone";

export const runtime = "nodejs";

interface RegisterRequest {
  courseSlug: string;
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

  // 統編格式驗證（如有填）
  const taxId = body.invoiceTaxId?.trim();
  if (taxId && !/^\d{8}$/.test(taxId)) {
    return bad("統一編號需為 8 碼數字");
  }

  const pricing = resolvePricing(course);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: row, error } = await supabase
    .from("course_enrollments")
    .insert({
      course_id: course.slug,
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
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("[/api/courses/register] insert failed", error);
    return bad("名單寫入失敗，請稍後再試。", 500);
  }

  // 把 enrollment_id 塞進 metadata，webhook 收到付款成功後可反查
  const metadata: Record<string, string> = {
    enrollment_id: row.id,
    course_id: course.slug,
    phone: phoneParsed.e164,
  };
  if (body.lineId?.trim()) metadata.line_id = body.lineId.trim();
  if (body.invoiceTaxId) metadata.invoice_tax_id = body.invoiceTaxId.trim();

  return Response.json({
    ok: true,
    enrollmentId: row.id,
    productId: pricing.productId,
    amount: pricing.amount,
    customerEmail: email,
    customerName: name,
    metadata,
  });
}
