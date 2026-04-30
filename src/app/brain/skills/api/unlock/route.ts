import { NextResponse } from "next/server";

const COOKIE_NAME = "brain_skills_unlocked";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getPassword() {
  return process.env.BRAIN_SKILLS_PASSWORD || "brain2026";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const expected = getPassword();

  const url = new URL(request.url);
  // request.url is the rewritten internal path; use host header for redirect base
  const host = request.headers.get("host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const baseExternal = `${proto}://${host}`;
  const isBrainHost = host.startsWith("brain.");
  const skillsPath = isBrainHost ? "/skills" : "/brain/skills";
  const unlockPath = isBrainHost ? "/skills/unlock" : "/brain/skills/unlock";

  if (password !== expected) {
    return NextResponse.redirect(`${baseExternal}${unlockPath}?error=1`, { status: 303 });
  }

  const response = NextResponse.redirect(`${baseExternal}${skillsPath}`, { status: 303 });
  response.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}
