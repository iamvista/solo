import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email";
import { LeadMagnetDeliveryEmail } from "@/components/emails/lead-magnet-delivery";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// POST: public capture endpoint (no auth required)
export async function POST(request: NextRequest) {
  // Rate limiting: 10 captures per minute per IP
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(ip, { max: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "請求過於頻繁，請稍後再試" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { lead_magnet_id, email, name, source_page, utm_source, utm_medium, utm_campaign } = body;

    if (!lead_magnet_id || !email) {
      return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get the lead magnet (must be published)
    const { data: magnet, error: magnetError } = await supabase
      .from("lead_magnets")
      .select("*")
      .eq("id", lead_magnet_id)
      .eq("status", "published")
      .single();

    if (magnetError || !magnet) {
      return NextResponse.json({ error: "找不到此資源" }, { status: 404 });
    }

    // Insert capture (upsert to handle duplicates gracefully)
    const { error: captureError } = await supabase
      .from("lead_captures")
      .upsert(
        {
          lead_magnet_id,
          email,
          name: name || null,
          source_page: source_page || null,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          email_sent: true,
        },
        { onConflict: "lead_magnet_id,email" },
      );

    if (captureError) {
      console.error("Capture insert error:", captureError);
      return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
    }

    // Build download URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw";
    const downloadUrl = magnet.file_url || magnet.redirect_url || `${baseUrl}/m/${magnet.slug}`;

    // Send delivery email
    await sendEmail({
      to: email,
      subject: `你的免費資源：${magnet.title}`,
      react: LeadMagnetDeliveryEmail({
        name: name || undefined,
        magnetTitle: magnet.title,
        downloadUrl,
        thankYouMessage: magnet.thank_you_message || undefined,
      }),
    });

    // Also add to newsletter_subscribers if not exists
    await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          name: name || null,
          source: `lead_magnet:${magnet.slug}`,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
        },
        { onConflict: "email", ignoreDuplicates: true },
      );

    return NextResponse.json({
      success: true,
      message: magnet.thank_you_message || "感謝下載！請檢查你的信箱。",
      // If redirect_url is set, frontend should redirect
      redirect_url: magnet.redirect_url || null,
    });
  } catch (err) {
    console.error("Lead capture error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
