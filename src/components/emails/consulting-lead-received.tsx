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
  plan: string; // '1hr' | '3hr' | '5hr' | '10hr' | '20hr' | 'undecided'
  topics: string[]; // slug array
}

const PLAN_LABEL: Record<string, string> = {
  "1hr": "1 小時體驗",
  "3hr": "3 小時套票",
  "5hr": "5 小時套票",
  "10hr": "10 小時套票",
  "20hr": "20 小時套票",
  undecided: "尚未決定",
};

export function ConsultingLeadReceivedEmail({ name, plan, topics }: Props) {
  const planLabel = PLAN_LABEL[plan] ?? plan;

  return (
    <Html>
      <Head />
      <Preview>{`${name}，1-on-1 量身陪跑需求表單收到了`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>📩 需求表單已收到</Text>
          <Heading style={h1}>{`${name}，需求表單收到了`}</Heading>
          <Text style={text}>
            感謝您填寫 <strong>1-on-1 量身陪跑</strong> 需求表單。
          </Text>
          <Text style={text}>
            我會在
            <strong>24 小時內回信</strong>
            ，若評估彼此合適，會附上付款連結。若不合適，我也會誠實告訴您比較適合的人。
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>📋 您填寫的內容</Text>
            <Text style={infoText}>
              <strong>方案：</strong>
              {planLabel}
            </Text>
            <Text style={infoText}>
              <strong>主題：</strong>
              {topics.length > 0 ? topics.join("、") : "（未指定）"}
            </Text>
          </Section>

          <Text style={smallText}>
            這封信是自動寄出的收件回條，您不需要回覆。我會親自看過您的表單後再回信給您。
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

export default ConsultingLeadReceivedEmail;

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
