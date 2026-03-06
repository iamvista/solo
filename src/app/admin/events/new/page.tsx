import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { isAdmin } from "@/lib/supabase/admin";
import EventForm from "@/components/admin/EventForm";

export default async function NewEventPage() {
  if (!(await isAdmin())) redirect("/");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Badge variant="outline" className="mb-2">新增活動</Badge>
      <h1 className="mb-8 text-2xl font-bold">建立新活動</h1>
      <EventForm mode="create" />
    </div>
  );
}
