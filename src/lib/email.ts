import { Resend } from "resend";

let resend: Resend;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "events@solo.tw";
const FROM_NAME = process.env.FROM_NAME || "自由人學院";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
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
