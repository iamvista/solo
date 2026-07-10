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
  bundleLabel: string;
  downloadUrl: string;
  orderNumber: string;
  amountFormatted?: string;
  expiresInHours: number;
  maxDownloads: number;
}

export function ArsBundlePurchaseEmail({
  bundleLabel,
  downloadUrl,
  orderNumber,
  amountFormatted,
  expiresInHours,
  maxDownloads,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>感謝購買 AI 學術研究工作臺——點此下載你的模組</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>🎉 付款成功</Text>
          <Heading style={h1}>感謝購買 AI 學術研究工作臺・{bundleLabel}</Heading>
          <Text style={subtext}>
            哈囉，感謝你購買《AI 學術研究工作臺・{bundleLabel}》。以下是你的下載頁連結，請在 {expiresInHours} 小時內完成下載。
          </Text>

          <Section style={buttonSection}>
            <Link href={downloadUrl} style={button}>
              前往下載頁
            </Link>
          </Section>

          <Section style={infoBox}>
            <Text style={infoTitle}>📋 訂單資訊</Text>
            <Text style={infoText}>訂單編號：{orderNumber}</Text>
            {amountFormatted && (
              <Text style={infoText}>金額：{amountFormatted}</Text>
            )}
            <Text style={infoText}>
              下載連結有效 {expiresInHours} 小時，最多可下載 {maxDownloads} 次
            </Text>
          </Section>

          <Text style={text}>
            若你的方案需要自選學科垂直，下載頁會請你先選定 1 個（醫學／社會科學／商管／理工），選定後不可更改。
          </Text>
          <Text style={text}>
            若連結逾期或次數用盡，歡迎寄信至{" "}
            <Link href="mailto:iamvista@gmail.com" style={link}>
              iamvista@gmail.com
            </Link>
            {" "}要求重新寄送。
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
