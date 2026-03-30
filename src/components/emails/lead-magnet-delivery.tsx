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
  name?: string;
  magnetTitle: string;
  downloadUrl: string;
  thankYouMessage?: string;
}

export function LeadMagnetDeliveryEmail({
  name,
  magnetTitle,
  downloadUrl,
  thankYouMessage,
}: Props) {
  const greeting = name ? `${name}，` : "";

  return (
    <Html>
      <Head />
      <Preview>你的免費資源：{magnetTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>🎁 免費資源下載</Text>
          <Heading style={h1}>{greeting}你的資源已準備好！</Heading>
          <Text style={text}>
            感謝你的訂閱！以下是你索取的《<strong>{magnetTitle}</strong>》：
          </Text>
          <Section style={buttonSection}>
            <Link href={downloadUrl} style={button}>
              立即下載
            </Link>
          </Section>
          {thankYouMessage && (
            <Section style={messageBox}>
              <Text style={messageText}>{thankYouMessage}</Text>
            </Section>
          )}
          <Hr style={hr} />
          <Text style={smallText}>
            如果按鈕無法點擊，請複製以下連結到瀏覽器：
          </Text>
          <Text style={urlText}>
            <Link href={downloadUrl} style={link}>
              {downloadUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© solo.tw — AI × 一人事業</Text>
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
  color: "#7c3aed",
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
const buttonSection = { textAlign: "center" as const, margin: "28px 0" };
const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600" as const,
  padding: "14px 32px",
  textDecoration: "none",
  display: "inline-block",
};
const messageBox = {
  backgroundColor: "#faf5ff",
  borderLeft: "3px solid #7c3aed",
  padding: "12px 16px",
  margin: "16px 0",
  borderRadius: "0 6px 6px 0",
};
const messageText = {
  color: "#5b21b6",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const smallText = {
  color: "#8898aa",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 6px",
};
const urlText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 6px",
  wordBreak: "break-all" as const,
};
const link = {
  color: "#2563eb",
  textDecoration: "underline",
};
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
