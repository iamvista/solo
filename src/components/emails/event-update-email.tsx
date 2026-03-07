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
  name: string;
  eventTitle: string;
  updateTitle: string;
  updateContent: string;
  eventUrl: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  venueAddress?: string;
  onlineUrl?: string;
}

// Auto-linkify URLs in plain text
function renderLineWithLinks(line: string) {
  const parts = line.split(/(https?:\/\/[^\s]+)/g);
  if (parts.length === 1) return line;
  return parts.map((part, j) =>
    part.startsWith("http://") || part.startsWith("https://") ? (
      <Link key={j} href={part} style={link}>
        {part}
      </Link>
    ) : (
      <React.Fragment key={j}>{part}</React.Fragment>
    ),
  );
}

export function EventUpdateEmail({
  name,
  eventTitle,
  updateTitle,
  updateContent,
  eventUrl,
  eventDate,
  eventTime,
  venue,
  venueAddress,
  onlineUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        《{eventTitle}》活動公告：{updateTitle}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>📢 活動公告</Text>
          <Heading style={h1}>{updateTitle}</Heading>
          <Text style={text}>哈囉，{name}</Text>
          <Text style={subtext}>
            關於你報名的《{eventTitle}》，主辦人有新的公告：
          </Text>
          <Section style={contentBox}>
            <Text style={contentText}>
              {updateContent.split("\n").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {renderLineWithLinks(line)}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </Text>
          </Section>
          {(eventDate || venue) && (
            <Section style={infoBox}>
              <Text style={infoTitle}>📋 活動資訊</Text>
              {eventDate && (
                <Text style={infoText}>
                  📅 {eventDate} {eventTime || ""}
                </Text>
              )}
              {venue && <Text style={infoText}>📍 {venue}</Text>}
              {venueAddress && <Text style={infoText}>📮 {venueAddress}</Text>}
              {onlineUrl && (
                <Text style={infoText}>
                  🔗 線上連結：
                  <Link href={onlineUrl} style={link}>
                    {onlineUrl}
                  </Link>
                </Text>
              )}
            </Section>
          )}
          <Section style={buttonSection}>
            <Link href={eventUrl} style={button}>
              查看活動頁面
            </Link>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───

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
  color: "#6366f1",
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
const contentBox = {
  backgroundColor: "#fafafa",
  borderLeft: "3px solid #6366f1",
  padding: "16px 20px",
  margin: "16px 0",
  borderRadius: "0 6px 6px 0",
  overflowWrap: "break-word" as const,
  wordBreak: "break-word" as const,
};
const contentText = {
  color: "#333",
  fontSize: "15px",
  lineHeight: "26px",
  margin: "0",
  overflowWrap: "break-word" as const,
  wordBreak: "break-word" as const,
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
