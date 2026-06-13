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
  sessionsLabel: string;
  amount: number;
  transferLast5: string;
}

const LINE_OA = "https://line.me/R/ti/p/@016mxqyl";

export function AiMonetizationRegisterConfirmEmail({
  name,
  sessionsLabel,
  amount,
  transferLast5,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>AI 變現研究院・報名資料已收到</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>報名資料已收到 🎉</Heading>
          <Text style={p}>
            {name} 你好，謝謝你報名「AI 變現研究院」。我們已收到你的報名與匯款資訊，
            主辦單位會用你提供的轉帳後五碼核對入帳，確認後再以 Email 通知你報名完成。
          </Text>

          <Section style={infoBox}>
            <Text style={row}>
              <b>報名單元：</b>
              {sessionsLabel}
            </Text>
            <Text style={row}>
              <b>應繳金額：</b>
              {`NT$${amount.toLocaleString()}`}
            </Text>
            <Text style={row}>
              <b>你提供的轉帳後五碼：</b>
              {transferLast5}
            </Text>
          </Section>

          <Text style={p}>
            若你<b>尚未完成匯款</b>，請儘速轉帳至以下帳戶（金額如上）：
          </Text>
          <Section style={bankBox}>
            <Text style={bankRow}>🏦 第一銀行（中崙分行）</Text>
            <Text style={bankRow}>🔢 帳號：142-10-090535</Text>
            <Text style={bankRow}>👤 戶名：種子娛樂製作股份有限公司</Text>
          </Section>

          <Hr style={hr} />
          <Text style={p}>
            上課提醒、教室地址與課前準備，將透過 LINE 通知。請加入官方帳號：{" "}
            <Link href={LINE_OA}>@016mxqyl</Link>
          </Text>
          <Text style={small}>
            報名或繳費有任何問題，歡迎回信，或來信 iamvista@gmail.com。
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
const h1 = { color: "#111111", fontSize: "22px", margin: "0 0 12px" };
const p = { color: "#1f2937", fontSize: "14px", lineHeight: "1.7", margin: "0 0 14px" };
const small = { color: "#6b7280", fontSize: "12px", lineHeight: "1.6", margin: "8px 0 0" };
const infoBox = {
  backgroundColor: "#faf8f4",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 16px",
};
const bankBox = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "14px 20px",
  margin: "0 0 8px",
};
const row = { color: "#1f2937", fontSize: "14px", margin: "4px 0", lineHeight: "1.6" };
const bankRow = { color: "#1e3a8a", fontSize: "15px", fontWeight: 700 as const, margin: "4px 0" };
const hr = { borderColor: "#e5e7eb", margin: "16px 0" };
