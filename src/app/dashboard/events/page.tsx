import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRegistrations } from "@/lib/supabase/events";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MyEventCard from "@/components/dashboard/MyEventCard";

export const metadata: Metadata = {
  title: "我的活動 | 自由人學院",
  description: "查看你已報名的活動",
};

export default async function MyEventsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/events");
  }

  const registrations = await getUserRegistrations(user.id);

  const now = new Date();

  const upcoming = registrations.filter((r) => {
    const event = r.events as { starts_at: string } | null;
    if (!event) return false;
    return new Date(event.starts_at) >= now;
  });

  const past = registrations.filter((r) => {
    const event = r.events as { starts_at: string } | null;
    if (!event) return false;
    return new Date(event.starts_at) < now;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">我的活動</h1>
          <p className="mt-1 text-base text-muted-foreground">
            查看你已報名的活動
          </p>
        </div>
        <Button variant="outline" asChild className="h-11 w-full px-4 text-base sm:w-auto">
          <Link href="/events">瀏覽更多活動</Link>
        </Button>
      </div>

      {registrations.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">還沒有報名任何活動</h3>
          <p className="mt-1 text-base text-muted-foreground">
            瀏覽活動頁面，找到感興趣的活動報名吧
          </p>
          <Button asChild className="mt-6 h-11 px-6 text-base">
            <Link href="/events">瀏覽活動</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Upcoming Events */}
          <section>
            <h2 className="mb-4 text-xl font-bold">
              即將到來
              {upcoming.length > 0 && (
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  ({upcoming.length})
                </span>
              )}
            </h2>
            {upcoming.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((reg) => (
                  <MyEventCard key={reg.id} registration={reg} isUpcoming />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                沒有即將到來的活動
              </p>
            )}
          </section>

          {/* Past Events */}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">
                已結束
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  ({past.length})
                </span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((reg) => (
                  <MyEventCard key={reg.id} registration={reg} isUpcoming={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
