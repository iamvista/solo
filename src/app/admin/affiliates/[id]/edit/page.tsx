import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/supabase/admin";
import { getAffiliate } from "@/lib/affiliates";
import { AffiliateForm } from "../../AffiliateForm";

export const metadata: Metadata = {
  title: "編輯聯盟代碼 | 後台",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAffiliatePage({ params }: PageProps) {
  if (!(await isAdmin())) redirect("/");
  const { id } = await params;
  const affiliate = await getAffiliate(id);
  if (!affiliate) notFound();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link
        href="/admin/affiliates"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回代碼列表
      </Link>
      <h1 className="mb-6 mt-4 text-2xl font-bold">
        編輯代碼 <span className="font-mono">{affiliate.code}</span>
      </h1>
      <AffiliateForm affiliate={affiliate} />
    </div>
  );
}
