import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import { listLeads, markStaleApprovedLeads } from "@/lib/consulting-db";
import { LeadList } from "@/components/admin/consulting/LeadList";

export const metadata: Metadata = {
  title: "Consulting Leads | 後臺",
  robots: { index: false, follow: false },
};

export default async function AdminConsultingLeadsPage() {
  const adminAccess = await isAdmin();
  if (!adminAccess) redirect("/");

  const staleCount = await markStaleApprovedLeads().catch(() => 0);
  const leads = await listLeads();

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2">後臺</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">Consulting Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {leads.length} 筆需求單，按建立時間排序。
            {staleCount > 0 && (
              <span className="ml-2 text-orange-600">
                （本次自動標 {staleCount} 筆 approved &gt; 7 天 的為 stale）
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/consulting/enrollments">🎓 學員清單</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">← 返回後臺</Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <LeadList leads={leads} />
      </div>
    </section>
  );
}
