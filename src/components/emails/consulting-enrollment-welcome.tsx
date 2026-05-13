import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  name: string;
  plan: string; // human readable
  totalHours: number;
  expiresAt: string; // ISO datetime, render as zh-TW date
}

function formatZhDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y} 年 ${m} 月 ${day} 日`;
  } catch {
    return iso;
  }
}

export function ConsultingEnrollmentWelcomeEmail({
  name,
  plan,
  totalHours,
  expiresAt,
}: Props) {
  const expiresLabel = formatZhDate(expiresAt);

  return (
    <Html>
      <Head />
      <Preview>{`${name}，您的 1-on-1 量身陪跑已啟動 🎯`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>🎯 已啟動</Text>
          <Heading style={h1}>{`${name}，您的 1-on-1 量身陪跑已啟動 🎯`}</Heading>
          <Text style={text}>付款已收到，我們可以開始了。</Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>📋 您的方案</Text>
            <Text style={infoText}>
              <strong>套票方案：</strong>
              {plan}
            </Text>
            <Text style={infoText}>
              <strong>總時數：</strong>
              {`${totalHours} 小時`}
            </Text>
            <Text style={infoText}>
              <strong>到期日：</strong>
              {expiresLabel}
            </Text>
          </Section>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              請回信告知您方便的時段（含時區），我會盡快約定首場 Google Meet。
            </Text>
          </Section>

          <Section style={noteBox}>
            <Text style={noteText}>
              每堂課後 24 小時內我會寄信通知本堂使用時數與剩餘時數，您可以隨時掌握剩餘額度。
            </Text>
          </Section>

          <Text style={text}>
            如有任何問題，歡迎直接回信，或寄到{" "}
            <Link href="mailto:iamvista@gmail.com" style={link}>
              iamvista@gmail.com
            </Link>
            。
          </Text>

          <Hr style={hr} />
          <Text style={text}>
            <strong>Vista｜solo.tw</strong>
            <br />
            <Link href="https://www.solo.tw/consulting" style={link}>
              https://www.solo.tw/consulting
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© solo.tw — AI × 一人事業</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ConsultingEnrollmentWelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "560px",
  borderRadius: "8px",
};
const tag = {
  color: "#16a34a",
  fontSize: "13px",
  fontWeight: "600" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px",
};
const h1 = {
  color: "#1a1a1a",
  fontSize: "22px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
  lineHeight: "30px",
};
const text = {
  color: "#333",
  fontSize: "15px",
  lineHeight: "26px",
  margin: "0 0 12px",
};
const infoBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};
const infoTitle = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};
const infoText = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 6px",
};
const highlightBox = {
  backgroundColor: "#fffbeb",
  borderLeft: "3px solid #f59e0b",
  padding: "12px 16px",
  margin: "16px 0",
  borderRadius: "0 6px 6px 0",
};
const highlightText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};
const noteBox = {
  backgroundColor: "#f0fdf4",
  borderLeft: "3px solid #22c55e",
  padding: "12px 16px",
  margin: "16px 0",
  borderRadius: "0 6px 6px 0",
};
const noteText = {
  color: "#166534",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};
const link = {
  color: "#2563eb",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
