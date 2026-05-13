import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import { listEnrollmentsWithBalance } from "@/lib/consulting-db";
import { EnrollmentList } from "@/components/admin/consulting/EnrollmentList";

export const metadata: Metadata = {
  title: "Consulting Enrollments | 後臺",
  robots: { index: false, follow: false },
};

export default async function AdminConsultingEnrollmentsPage() {
  const adminAccess = await isAdmin();
  if (!adminAccess) redirect("/");

  const enrollments = await listEnrollmentsWithBalance();

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2">後臺</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Consulting Enrollments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {enrollments.length} 位學員。
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/consulting/leads">📋 需求單</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">← 返回後臺</Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <EnrollmentList enrollments={enrollments} />
      </div>
    </section>
  );
}
