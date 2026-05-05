import twilio from "twilio";

let client: twilio.Twilio | null = null;

function getClient(): twilio.Twilio | null {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  if (!client) {
    client = twilio(sid, token);
  }
  return client;
}

export interface SendSmsResult {
  success: boolean;
  sid?: string;
  error?: string;
}

/**
 * 發 SMS。E.164 格式（含 + 與國碼）。
 * 回傳 { success } — 失敗會 log 但不丟錯，避免 webhook 卡住。
 */
export async function sendSms(to: string, body: string): Promise<SendSmsResult> {
  const c = getClient();
  if (!c) {
    console.warn("[sms] Twilio credentials not configured; skipping SMS to", to);
    return { success: false, error: "twilio_not_configured" };
  }

  const from = process.env.TWILIO_FROM_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  if (!from && !messagingServiceSid) {
    console.warn("[sms] Neither TWILIO_FROM_NUMBER nor TWILIO_MESSAGING_SERVICE_SID set");
    return { success: false, error: "twilio_sender_not_configured" };
  }

  try {
    const message = await c.messages.create({
      to,
      body,
      ...(messagingServiceSid
        ? { messagingServiceSid }
        : { from: from! }),
    });
    console.log("[sms] sent", message.sid, "to", to);
    return { success: true, sid: message.sid };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sms] send failed", to, msg);
    return { success: false, error: msg };
  }
}
