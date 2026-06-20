import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { isAdmin } from "@/lib/supabase/admin";
import EventForm from "@/components/admin/EventForm";

export default async function NewEventPage() {
  if (!(await isAdmin())) redirect("/");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/admin/events"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回活動列表
      </Link>
      <Badge variant="outline" className="mb-2 mt-4">新增活動</Badge>
      <h1 className="mb-8 text-2xl font-bold">建立新活動</h1>
      <EventForm mode="create" />
    </div>
  );
}
