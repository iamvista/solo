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
            <Text style={text}>{updateContent}</Text>
          </Section>
          {(eventDate || venue) && (
            <Section style={eventInfoBox}>
              <Text style={eventInfoTitle}>📋 活動資訊</Text>
              {eventDate && (
                <Text style={eventInfoText}>
                  📅 {eventDate} {eventTime || ""}
                </Text>
              )}
              {venue && <Text style={eventInfoText}>📍 {venue}</Text>}
              {venueAddress && (
                <Text style={eventInfoText}>📮 地址：{venueAddress}</Text>
              )}
              {onlineUrl && (
                <Text style={eventInfoText}>
                  🔗 線上連結：<Link href={onlineUrl}>{onlineUrl}</Link>
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

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "'Noto Sans TC', sans-serif",
};
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};
const tag = {
  color: "#6366f1",
  fontSize: "13px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};
const h1 = {
  color: "#1a1a1a",
  fontSize: "22px",
  fontWeight: "bold" as const,
  margin: "0 0 20px",
};
const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 10px",
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
};
const eventInfoBox = {
  backgroundColor: "#f0f4f8",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
};
const eventInfoTitle = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};
const eventInfoText = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 4px",
};
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = {
  backgroundColor: "#0f172a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  padding: "12px 24px",
  textDecoration: "none",
};
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
