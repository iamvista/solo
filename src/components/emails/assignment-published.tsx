import React from "react";
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
  studentName: string;
  courseName: string;
  assignmentTitle: string;
  assignmentUrl: string;
  dueLabel?: string | null;
}

export function AssignmentPublishedEmail({
  studentName,
  courseName,
  assignmentTitle,
  assignmentUrl,
  dueLabel,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`${courseName} 有新作業：${assignmentTitle}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>📝 新作業</Text>
          <Heading style={h1}>{assignmentTitle}</Heading>
          <Text style={subtext}>
            哈囉 {studentName}，{courseName} 有一份新作業給你。
          </Text>

          <Section style={buttonSection}>
            <Link href={assignmentUrl} style={button}>
              去看作業
            </Link>
          </Section>

          {dueLabel && (
            <Text style={subtext}>建議在 {dueLabel} 前完成，逾期還是收。</Text>
          )}

          <Text style={text}>交完之後，要給你的相關資源就會出現在同一頁上。</Text>

          <Text style={subtext}>
            按鈕點不開的話，把這段網址貼到瀏覽器：
            <br />
            <Link href={assignmentUrl} style={link}>
              {assignmentUrl}
            </Link>
          </Text>

          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

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
  color: "#059669",
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
const subtext = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 16px",
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
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
