import { Resend } from "resend";

let resend: Resend;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return resend;
}

// 寄件人位址必須在 Resend 已驗證的網域底下，所以維持 solo.tw（無法用 gmail 作 From）。
// 收件人按「回覆」會送到 REPLY_TO（預設 iamvista@gmail.com）。
const FROM_EMAIL = process.env.FROM_EMAIL || "events@solo.tw";
const FROM_NAME = process.env.FROM_NAME || "自由人學院";
const REPLY_TO = process.env.REPLY_TO_EMAIL || "iamvista@gmail.com";

/** Send a single email */
export async function sendEmail({
  to,
  subject,
  react,
  from,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: from || `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      replyTo: replyTo || REPLY_TO,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email service error:", err);
    return { success: false, error: err };
  }
}

/**
 * Send multiple emails via Resend Batch API (up to 100 per call).
 * Much faster than individual sends — Resend handles internal rate limiting.
 */
export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    react: React.ReactElement;
  }>,
): Promise<{ sent: number; failed: number; error?: unknown }> {
  if (emails.length === 0) return { sent: 0, failed: 0 };

  const from = `${FROM_NAME} <${FROM_EMAIL}>`;

  try {
    const { data, error } = await getResend().batch.send(
      emails.map((e) => ({
        from,
        to: [e.to],
        subject: e.subject,
        react: e.react,
        replyTo: REPLY_TO,
      })),
    );

    if (error) {
      console.error("Batch send error:", error);
      return { sent: 0, failed: emails.length, error };
    }

    // data.data is an array of { id } for each successfully queued email
    const sentCount = Array.isArray(data?.data)
      ? data.data.length
      : emails.length;
    return { sent: sentCount, failed: emails.length - sentCount };
  } catch (err) {
    console.error("Batch service error:", err);
    return { sent: 0, failed: emails.length, error: err };
  }
}
