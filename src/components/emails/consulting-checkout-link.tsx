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
  plan: string; // human readable e.g. "5 小時套票"
  checkoutUrl: string; // Recur checkout URL
  vistaMessage: string; // Vista 的個人訊息（自由 text，可能多行）
}

export function ConsultingCheckoutLinkEmail({
  name,
  plan,
  checkoutUrl,
  vistaMessage,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`${name}，我們聊聊吧 — 您的 1-on-1 付款連結`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>✅ 評估完成</Text>
          <Heading style={h1}>{`${name}，我們聊聊吧 — 您的 1-on-1 付款連結`}</Heading>
          <Text style={text}>
            謝謝您的需求表單。看完您的描述，我想我可以幫上忙。
          </Text>

          <Section style={messageBox}>
            <Text style={messageText}>{vistaMessage}</Text>
          </Section>

          <Section style={buttonSection}>
            <Link href={checkoutUrl} style={button}>
              {`前往付款（${plan}）`}
            </Link>
          </Section>

          <Text style={subtext}>
            如果按鈕無法點擊，請複製以下連結到瀏覽器：
          </Text>
          <Text style={urlText}>
            <Link href={checkoutUrl} style={link}>
              {checkoutUrl}
            </Link>
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              付款後請回信告知您方便的時段，我們約首場 Google Meet。
            </Text>
          </Section>

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

export default ConsultingCheckoutLinkEmail;

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
const subtext = {
  color: "#8898aa",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 6px",
};
const messageBox = {
  backgroundColor: "#faf5ff",
  borderLeft: "3px solid #7c3aed",
  padding: "16px",
  margin: "16px 0",
  borderRadius: "0 6px 6px 0",
};
const messageText = {
  color: "#5b21b6",
  fontSize: "15px",
  lineHeight: "26px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
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
const urlText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 6px",
  wordBreak: "break-all" as const,
};
const highlightBox = {
  backgroundColor: "#fffbeb",
  borderLeft: "3px solid #f59e0b",
  padding: "12px 16px",
  margin: "20px 0",
  borderRadius: "0 6px 6px 0",
};
const highlightText = {
  color: "#92400e",
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
