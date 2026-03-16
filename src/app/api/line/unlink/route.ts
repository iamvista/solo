import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: Unlink LINE account
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const { error } = await supabase
    .from("profiles")
    .update({
      line_uid: null,
      line_display_name: null,
      line_picture_url: null,
      line_linked_at: null,
    })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
