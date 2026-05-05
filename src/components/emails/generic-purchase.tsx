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

export type GenericPurchaseKind = "course" | "donation" | "default";

interface Props {
  kind: GenericPurchaseKind;
  productName: string;
  orderNumber: string;
  amountFormatted?: string;
  whatsNext?: string[];
  detailUrl?: string;
}

const COPY: Record<
  GenericPurchaseKind,
  { tag: string; heading: string; preview: string; intro: (name: string) => string }
> = {
  course: {
    tag: "🎉 課程報名成功",
    heading: "感謝報名，我們課堂見",
    preview: "感謝報名 — 課前提醒信會在開課前 2 天寄出",
    intro: (name) =>
      `哈囉，感謝你報名《${name}》。你的名額已經保留，以下是訂單資訊與接下來的安排。`,
  },
  donation: {
    tag: "☕ 收到了",
    heading: "謝謝你的支持",
    preview: "謝謝你的支持，這份心意我收到了",
    intro: (name) =>
      `哈囉，謝謝你的「${name}」。獨立寫作者最需要的就是這種具體的鼓勵，這份心意我收到了。`,
  },
  default: {
    tag: "✅ 訂單確認",
    heading: "我收到你的款項了",
    preview: "訂單確認 — 我們會在 24 小時內主動聯繫你",
    intro: (name) =>
      `哈囉，感謝你購買《${name}》。我已經收到你的款項，會在 24 小時內主動寄出更詳細的後續說明。`,
  },
};

export function GenericPurchaseEmail({
  kind,
  productName,
  orderNumber,
  amountFormatted,
  whatsNext,
  detailUrl,
}: Props) {
  const copy = COPY[kind];

  return (
    <Html>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>{copy.tag}</Text>
          <Heading style={h1}>{copy.heading}</Heading>
          <Text style={subtext}>{copy.intro(productName)}</Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>📋 訂單資訊</Text>
            <Text style={infoText}>商品：{productName}</Text>
            <Text style={infoText}>訂單編號：{orderNumber}</Text>
            {amountFormatted && (
              <Text style={infoText}>金額：{amountFormatted}</Text>
            )}
          </Section>

          {whatsNext && whatsNext.length > 0 && (
            <Section style={nextBox}>
              <Text style={infoTitle}>📅 接下來</Text>
              {whatsNext.map((step, i) => (
                <Text key={i} style={infoText}>
                  ・{step}
                </Text>
              ))}
            </Section>
          )}

          {detailUrl && (
            <Section style={buttonSection}>
              <Link href={detailUrl} style={button}>
                查看課程頁面
              </Link>
            </Section>
          )}

          <Text style={text}>
            若有任何問題，歡迎寄信至{" "}
            <Link href="mailto:iamvista@gmail.com" style={link}>
              iamvista@gmail.com
            </Link>
            {" "}聯繫。
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
const nextBox = {
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 20px",
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
