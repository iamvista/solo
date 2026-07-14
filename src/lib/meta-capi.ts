import { createHash } from "node:crypto";

const GRAPH = "https://graph.facebook.com/v23.0";

type CapiUserData = {
  email?: string; phone?: string; firstName?: string;
  fbp?: string; fbc?: string; clientIp?: string; userAgent?: string;
};
export type CapiEvent = {
  eventName: "Lead" | "Purchase";
  eventId: string;
  eventSourceUrl: string;
  actionSource?: "website";
  user: CapiUserData;
  customData?: { value?: number; currency?: string };
};

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export function buildUserData(u: CapiUserData): Record<string, unknown> {
  const ud: Record<string, unknown> = {};
  const em = u.email?.trim().toLowerCase();
  if (em) ud.em = [sha256(em)];
  const ph = u.phone?.replace(/[^0-9]/g, "");
  if (ph) ud.ph = [sha256(ph)];
  const fn = u.firstName?.trim().toLowerCase();
  if (fn) ud.fn = [sha256(fn)];
  if (u.fbp) ud.fbp = u.fbp;
  if (u.fbc) ud.fbc = u.fbc;
  if (u.clientIp) ud.client_ip_address = u.clientIp;
  if (u.userAgent) ud.client_user_agent = u.userAgent;
  return ud;
}

export function buildPayload(ev: CapiEvent, nowSec: number): Record<string, unknown> {
  const data: Record<string, unknown> = {
    event_name: ev.eventName,
    event_time: nowSec,
    event_id: ev.eventId,
    event_source_url: ev.eventSourceUrl,
    action_source: ev.actionSource ?? "website",
    user_data: buildUserData(ev.user),
  };
  if (ev.customData && (ev.customData.value != null || ev.customData.currency)) {
    data.custom_data = {
      ...(ev.customData.value != null ? { value: ev.customData.value } : {}),
      ...(ev.customData.currency ? { currency: ev.customData.currency } : {}),
    };
  }
  return data;
}

export function parseFbCookies(cookieHeader?: string | null): { fbp?: string; fbc?: string } {
  if (!cookieHeader) return {};
  const get = (k: string) => {
    const m = cookieHeader.match(new RegExp("(?:^|;\\s*)" + k + "=([^;]+)"));
    return m ? decodeURIComponent(m[1]) : undefined;
  };
  return { fbp: get("_fbp"), fbc: get("_fbc") };
}

export async function sendCapiEvent(ev: CapiEvent): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    console.warn("[meta-capi] missing NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN, skip");
    return false;
  }
  try {
    const nowSec = Math.floor(Date.now() / 1000);
    const body = new URLSearchParams();
    body.set("data", JSON.stringify([buildPayload(ev, nowSec)]));
    body.set("access_token", token);
    const testCode = process.env.META_CAPI_TEST_CODE;
    if (testCode) body.set("test_event_code", testCode);
    const res = await fetch(`${GRAPH}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.warn("[meta-capi] non-ok", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[meta-capi] send failed", (e as Error)?.message);
    return false;
  }
}
