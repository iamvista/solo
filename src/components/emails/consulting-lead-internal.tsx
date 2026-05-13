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

interface Lead {
  id: string;
  name: string;
  email: string;
  contact_method: string;
  contact_id?: string | null;
  topics: string[];
  specific_problem: string;
  expected_outcome?: string | null;
  level: string;
  desired_start?: string | null;
  plan: string;
  attribution?: string | null;
  created_at: string;
}

interface Props {
  lead: Lead;
}

const PLAN_LABEL: Record<string, string> = {
  "1hr": "1 小時體驗",
  "3hr": "3 小時套票",
  "5hr": "5 小時套票",
  "10hr": "10 小時套票",
  "20hr": "20 小時套票",
  undecided: "尚未決定",
};

const ADMIN_URL = "https://www.solo.tw/admin/consulting/leads";

export function ConsultingLeadInternalEmail({ lead }: Props) {
  const planLabel = PLAN_LABEL[lead.plan] ?? lead.plan;

  return (
    <Html>
      <Head />
      <Preview>{`🆕 新諮詢 lead：${lead.name}（${planLabel}）`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>🆕 新諮詢 lead 通知</Text>
          <Heading style={h1}>{`🆕 新諮詢 lead：${lead.name}（${planLabel}）`}</Heading>
          <Text style={subtext}>
            有新的 1-on-1 量身陪跑需求表單，以下為完整內容。請於 24 小時內 review。
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>👤 基本資訊</Text>
            <Text style={infoText}>
              <strong>姓名：</strong>
              {lead.name}
            </Text>
            <Text style={infoText}>
              <strong>E-mail：</strong>
              <Link href={`mailto:${lead.email}`} style={link}>
                {lead.email}
              </Link>
            </Text>
            <Text style={infoText}>
              <strong>聯絡方式：</strong>
              {lead.contact_method}
              {lead.contact_id ? `（${lead.contact_id}）` : ""}
            </Text>
            <Text style={infoText}>
              <strong>Lead ID：</strong>
              {lead.id}
            </Text>
            <Text style={infoText}>
              <strong>建立時間：</strong>
              {lead.created_at}
            </Text>
          </Section>

          <Section style={infoBox}>
            <Text style={infoTitle}>🎯 主題與方案</Text>
            <Text style={infoText}>
              <strong>主題：</strong>
              {lead.topics.length > 0 ? lead.topics.join("、") : "（未指定）"}
            </Text>
            <Text style={infoText}>
              <strong>程度：</strong>
              {lead.level}
            </Text>
            <Text style={infoText}>
              <strong>方案：</strong>
              {planLabel}
            </Text>
            {lead.desired_start && (
              <Text style={infoText}>
                <strong>希望開始時間：</strong>
                {lead.desired_start}
              </Text>
            )}
            {lead.attribution && (
              <Text style={infoText}>
                <strong>來源：</strong>
                {lead.attribution}
              </Text>
            )}
          </Section>

          <Section style={problemBox}>
            <Text style={infoTitle}>📝 具體卡關問題</Text>
            <Text style={problemText}>{lead.specific_problem}</Text>
          </Section>

          {lead.expected_outcome && (
            <Section style={outcomeBox}>
              <Text style={infoTitle}>🎁 期望成果</Text>
              <Text style={outcomeText}>{lead.expected_outcome}</Text>
            </Section>
          )}

          <Section style={buttonSection}>
            <Link href={ADMIN_URL} style={button}>
              前往後臺 review
            </Link>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>Vista｜solo.tw 後臺</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ConsultingLeadInternalEmail;

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
  color: "#dc2626",
  fontSize: "13px",
  fontWeight: "600" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px",
};
const h1 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
  lineHeight: "28px",
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
  margin: "0 0 16px",
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
const problemBox = {
  backgroundColor: "#fef2f2",
  borderLeft: "3px solid #dc2626",
  padding: "16px",
  margin: "0 0 16px",
  borderRadius: "0 6px 6px 0",
};
const problemText = {
  color: "#7f1d1d",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};
const outcomeBox = {
  backgroundColor: "#f0fdf4",
  borderLeft: "3px solid #16a34a",
  padding: "16px",
  margin: "0 0 16px",
  borderRadius: "0 6px 6px 0",
};
const outcomeText = {
  color: "#14532d",
  fontSize: "14px",
  lineHeight: "24px",
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
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
