import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import LeadMagnetForm from "./LeadMagnetForm";

// ISR: revalidate every 1 hour（Lead magnet 內容很少變動）
export const revalidate = 3600;

const RESOURCE_TYPE_LABELS: Record<string, { icon: string; label: string }> = {
  pdf: { icon: "📄", label: "PDF 文件" },
  checklist: { icon: "✅", label: "檢查清單" },
  template: { icon: "📋", label: "模板" },
  toolkit: { icon: "🧰", label: "工具包" },
  video: { icon: "🎬", label: "影片" },
  other: { icon: "🎁", label: "免費資源" },
};

async function getMagnet(slug: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("lead_magnets")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const magnet = await getMagnet(slug);
  if (!magnet) return {};

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw").trim();
  const magnetUrl = `${baseUrl}/m/${slug}`;
  return {
    title: `${magnet.title} | 免費下載 — solo.tw`,
    description: magnet.description || `免費下載《${magnet.title}》`,
    alternates: { canonical: magnetUrl },
    openGraph: {
      title: magnet.title,
      description: magnet.description || `免費下載《${magnet.title}》`,
      url: magnetUrl,
      images: magnet.cover_image ? [{ url: magnet.cover_image }] : [],
    },
  };
}

export default async function LeadMagnetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const magnet = await getMagnet(slug);
  if (!magnet) notFound();

  const resourceType = RESOURCE_TYPE_LABELS[magnet.resource_type] || RESOURCE_TYPE_LABELS.other;

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Resource type badge */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
            {resourceType.icon} {resourceType.label}
          </span>
        </div>

        {/* Title & description */}
        <h1 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {magnet.title}
        </h1>
        {magnet.description && (
          <p className="mt-4 text-center text-lg text-stone-600 leading-relaxed">
            {magnet.description}
          </p>
        )}

        {/* Cover image */}
        {magnet.cover_image && (
          <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={magnet.cover_image}
              alt={magnet.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Benefits */}
        {magnet.benefits && magnet.benefits.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-center text-lg font-semibold text-stone-800">
              你將獲得
            </h2>
            <ul className="space-y-3">
              {magnet.benefits.map((benefit: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm">
                    ✓
                  </span>
                  <span className="text-stone-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Capture form */}
        <div className="mt-10 rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-1 text-center text-lg font-semibold text-stone-900">
            {magnet.cta_text || "免費下載"}
          </h2>
          <p className="mb-6 text-center text-sm text-stone-500">
            輸入 Email，我們會立即寄送到你的信箱
          </p>
          <LeadMagnetForm
            leadMagnetId={magnet.id}
            ctaText={magnet.cta_text || "免費下載"}
          />
        </div>

        {/* Social proof */}
        {magnet.capture_count > 10 && (
          <p className="mt-4 text-center text-sm text-stone-400">
            已有 {magnet.capture_count.toLocaleString()} 人下載
          </p>
        )}
      </div>
    </div>
  );
}
