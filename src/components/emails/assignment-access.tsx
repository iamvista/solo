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
  accessUrl: string;
  expiresInMinutes: number;
}

export function AssignmentAccessEmail({
  studentName,
  courseName,
  accessUrl,
  expiresInMinutes,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`${expiresInMinutes} 分鐘內有效，點一下就能進去交作業`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>🔑 作業區入口</Text>
          <Heading style={h1}>進入 {courseName} 作業區</Heading>
          <Text style={subtext}>
            哈囉 {studentName}，這是你的作業區入口。點下面的按鈕就能進去，不需要密碼，也不需要註冊帳號。
          </Text>

          <Section style={buttonSection}>
            <Link href={accessUrl} style={button}>
              進入作業區
            </Link>
          </Section>

          <Section style={infoBox}>
            <Text style={infoTitle}>📋 關於這個連結</Text>
            <Text style={infoText}>{expiresInMinutes} 分鐘內有效</Text>
            <Text style={infoText}>只能使用一次</Text>
            <Text style={infoText}>
              進去之後會記住你 30 天，同一臺裝置不用再收信
            </Text>
          </Section>

          <Text style={text}>
            交完作業，要給你的相關資源就會直接出現在作業頁上。
          </Text>

          <Text style={subtext}>
            如果這封信不是你要求的，直接忽略就好，不會有任何事發生。
          </Text>

          <Text style={subtext}>
            按鈕點不開的話，把這段網址貼到瀏覽器：
            <br />
            <Link href={accessUrl} style={link}>
              {accessUrl}
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
  overflowWrap: "break-word" as const,
  wordBreak: "break-word" as const,
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
