import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ username: string; slug: string }>;
};

async function getEventByOwnerAndSlug(username: string, slug: string) {
  const supabase = await createClient();

  // Get the owner's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!profile) return null;

  // Get event owned by this user with matching slug
  const { data: event } = await supabase
    .from("events")
    .select("slug, status, owner_id")
    .eq("slug", slug)
    .eq("owner_id", profile.id)
    .in("status", ["published", "archived"])
    .single();

  return event;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const event = await getEventByOwnerAndSlug(username, slug);

  if (!event) return { title: "找不到活動 — solo.tw" };

  return {
    title: `活動 — @${username} | solo.tw`,
    alternates: { canonical: `/events/${slug}` },
  };
}

// This page redirects to the main event page (/@username/events/slug is a vanity URL)
export default async function UserEventPage({ params }: Props) {
  const { username, slug } = await params;
  const event = await getEventByOwnerAndSlug(username, slug);

  if (!event) notFound();

  // Redirect to the canonical event page
  redirect(`/events/${event.slug}`);
}
