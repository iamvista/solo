import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import {
  getEnrollmentWithBalance,
  listSessionsForEnrollment,
} from "@/lib/consulting-db";
import { EnrollmentDetail } from "@/components/admin/consulting/EnrollmentDetail";

export const metadata: Metadata = {
  title: "學員詳情 | 後臺",
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const adminAccess = await isAdmin();
  if (!adminAccess) redirect("/");

  const { id } = await params;
  const enrollment = await getEnrollmentWithBalance(id).catch(() => null);
  if (!enrollment) notFound();
  const sessions = await listSessionsForEnrollment(id);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline">後臺</Badge>
        <Button variant="outline" asChild>
          <Link href="/admin/consulting/enrollments">← 回學員清單</Link>
        </Button>
      </div>
      <EnrollmentDetail enrollment={enrollment} sessions={sessions} />
    </section>
  );
}
