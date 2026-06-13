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
  email: string;
  phone: string;
  sessionsLabel: string;
  amount: number;
  transferLast5: string;
  invoiceCompany?: string | null;
  invoiceTaxId?: string | null;
  lineId?: string | null;
  question?: string | null;
}

const ADMIN_URL =
  "https://www.solo.tw/admin/enrollments?course=ai-monetization-institute";

export function AiMonetizationRegisterInternalEmail({
  name,
  email,
  phone,
  sessionsLabel,
  amount,
  transferLast5,
  invoiceCompany,
  invoiceTaxId,
  lineId,
  question,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`🆕 AI 變現研究院新報名：${name}（NT$${amount.toLocaleString()}）`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>🆕 AI 變現研究院・匯款報名</Text>
          <Heading style={h1}>{`${name}（NT$${amount.toLocaleString()}）`}</Heading>
          <Text style={subtext}>
            有新的匯款報名。請用「轉帳後五碼」與主辦單位（種子娛樂）核對入帳。
          </Text>

          <Section style={infoBox}>
            <Text style={row}>
              <b>姓名：</b>
              {name}
            </Text>
            <Text style={row}>
              <b>Email：</b>
              {email}
            </Text>
            <Text style={row}>
              <b>手機：</b>
              {phone}
            </Text>
            <Hr style={hr} />
            <Text style={row}>
              <b>報名單元：</b>
              {sessionsLabel}
            </Text>
            <Text style={row}>
              <b>應繳金額：</b>
              {`NT$${amount.toLocaleString()}`}
            </Text>
            <Text style={rowHighlight}>
              <b>轉帳後五碼：</b>
              {transferLast5}
            </Text>
            {(invoiceCompany || invoiceTaxId) && (
              <Text style={row}>
                <b>發票：</b>
                {`${invoiceCompany ?? ""}${invoiceTaxId ? `（統編 ${invoiceTaxId}）` : ""}`}
              </Text>
            )}
            {lineId && (
              <Text style={row}>
                <b>LINE：</b>
                {lineId}
              </Text>
            )}
            {question && (
              <Text style={row}>
                <b>留言：</b>
                {question}
              </Text>
            )}
          </Section>

          <Text style={subtext}>
            完整名單與 CSV 匯出：<Link href={ADMIN_URL}>後臺報名管理</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f5f3ef", fontFamily: "-apple-system, sans-serif" };
const container = {
  margin: "0 auto",
  padding: "24px",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
};
const tag = { color: "#b45309", fontSize: "12px", fontWeight: 700, margin: "0 0 4px" };
const h1 = { color: "#111111", fontSize: "20px", margin: "0 0 8px" };
const subtext = { color: "#6b7280", fontSize: "13px", lineHeight: "1.6", margin: "0 0 16px" };
const infoBox = {
  backgroundColor: "#faf8f4",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 16px",
};
const row = { color: "#1f2937", fontSize: "14px", margin: "4px 0", lineHeight: "1.6" };
const rowHighlight = {
  ...row,
  backgroundColor: "#fef3c7",
  borderRadius: "6px",
  padding: "6px 10px",
  fontWeight: 700 as const,
};
const hr = { borderColor: "#e5e7eb", margin: "12px 0" };
