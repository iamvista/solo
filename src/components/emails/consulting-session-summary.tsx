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
  sessionDate: string; // YYYY-MM-DD
  hoursUsed: number;
  hoursRemaining: number;
  topic: string; // topic slug or human readable
}

export function ConsultingSessionSummaryEmail({
  name,
  sessionDate,
  hoursUsed,
  hoursRemaining,
  topic,
}: Props) {
  const isLowBalance = hoursRemaining <= 1;

  return (
    <Html>
      <Head />
      <Preview>{`${name}，${sessionDate} 課程紀錄`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>📒 課程紀錄</Text>
          <Heading style={h1}>{`${name}，${sessionDate} 課程紀錄`}</Heading>
          <Text style={text}>本場已記錄。</Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>📋 本場資訊</Text>
            <Text style={infoText}>
              <strong>日期：</strong>
              {sessionDate}
            </Text>
            <Text style={infoText}>
              <strong>主題：</strong>
              {topic}
            </Text>
            <Text style={infoText}>
              <strong>使用：</strong>
              {`${hoursUsed} 小時`}
            </Text>
            <Text style={infoText}>
              <strong>剩餘：</strong>
              {`${hoursRemaining} 小時`}
            </Text>
          </Section>

          {isLowBalance && (
            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ 您的時數即將用完，若需要續購歡迎告知。
              </Text>
            </Section>
          )}

          <Text style={smallText}>
            若對本場紀錄有任何疑問，歡迎直接回信告訴我。
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

export default ConsultingSessionSummaryEmail;

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
  color: "#0f172a",
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
const warningBox = {
  backgroundColor: "#fef2f2",
  borderLeft: "3px solid #dc2626",
  padding: "12px 16px",
  margin: "16px 0",
  borderRadius: "0 6px 6px 0",
};
const warningText = {
  color: "#991b1b",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  fontWeight: "600" as const,
};
const link = {
  color: "#2563eb",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const smallText = {
  color: "#8898aa",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 6px",
};
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
