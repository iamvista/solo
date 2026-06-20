import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/supabase/admin";
import { AffiliateForm } from "../AffiliateForm";

export const metadata: Metadata = {
  title: "新增聯盟代碼 | 後台",
  robots: { index: false, follow: false },
};

export default async function NewAffiliatePage() {
  if (!(await isAdmin())) redirect("/");
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">新增聯盟代碼</h1>
      <AffiliateForm />
    </div>
  );
}
