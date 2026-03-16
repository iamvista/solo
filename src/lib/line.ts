const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;

interface LineMessage {
  type: "text";
  text: string;
}

/**
 * Send a push message to a LINE user via Messaging API.
 * Requires LINE Messaging API channel access token.
 */
export async function sendLinePush(
  lineUid: string,
  messages: LineMessage[],
): Promise<{ success: boolean; error?: string }> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.warn("LINE Messaging API token not configured");
    return { success: false, error: "LINE not configured" };
  }

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: lineUid,
        messages,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("LINE push error:", errBody);
      return { success: false, error: errBody };
    }

    return { success: true };
  } catch (err) {
    console.error("LINE push exception:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send a simple text notification to a LINE user.
 */
export async function notifyLineUser(
  lineUid: string,
  text: string,
): Promise<{ success: boolean }> {
  return sendLinePush(lineUid, [{ type: "text", text }]);
}
