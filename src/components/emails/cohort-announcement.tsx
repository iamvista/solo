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
  courseTitle: string;
  /** 由操作者於廣播時輸入，不讀自 workshops.ts */
  cohortDate: string;
  enrolUrl: string;
  unsubscribeUrl: string;
  note?: string;
}

export function CohortAnnouncementEmail({
  name,
  courseTitle,
  cohortDate,
  enrolUrl,
  unsubscribeUrl,
  note,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        《{courseTitle}》新梯次開課：{cohortDate}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>🔔 新梯次開課</Text>
          <Heading style={h1}>{name}，你等的這門課開課了</Heading>
          <Text style={text}>
            你先前登記想收到《<strong>{courseTitle}</strong>
            》的開課通知。新的一梯已經排定：
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>📅 開課時間</Text>
            <Text style={infoText}>{cohortDate}</Text>
          </Section>

          {note && (
            <Section style={highlightBox}>
              <Text style={highlightText}>{note}</Text>
            </Section>
          )}

          <Section style={buttonSection}>
            <Link href={enrolUrl} style={button}>
              查看課程並報名
            </Link>
          </Section>

          <Text style={smallText}>
            名單上的人會比公開招生早收到通知，位子有限，建議盡早決定。
          </Text>

          <Hr style={hr} />
          <Text style={smallText}>
            不想再收到這門課的開課通知？
            <Link href={unsubscribeUrl} style={link}>
              點此退出名單
            </Link>
            。
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© solo.tw — AI × 一人事業</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles（比照 registration-confirm.tsx）───

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
  whiteSpace: "pre-wrap" as const,
};
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = {
  backgroundColor: "#0f172a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600" as const,
  padding: "12px 28px",
  textDecoration: "none",
  display: "inline-block",
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
