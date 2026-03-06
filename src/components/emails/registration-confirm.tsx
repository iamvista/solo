import {
  Body, Container, Head, Heading, Hr, Html, Link,
  Preview, Section, Text,
} from "@react-email/components";

interface Props {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketType: string;
  eventUrl: string;
  calendarUrl: string;
  cancelUrl: string;
  isOnline: boolean;
}

export function RegistrationConfirmEmail({
  name, eventTitle, eventDate, eventTime, venue,
  ticketType, eventUrl, calendarUrl, cancelUrl, isOnline,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>你已成功報名《{eventTitle}》</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>報名確認</Heading>
          <Text style={text}>哈囉，{name}</Text>
          <Text style={text}>你已成功報名以下活動：</Text>
          <Section style={infoBox}>
            <Text style={eventTitleStyle}>《{eventTitle}》</Text>
            <Text style={infoText}>📅 {eventDate} {eventTime}</Text>
            <Text style={infoText}>📍 {venue}</Text>
            <Text style={infoText}>🎫 票種：{ticketType}</Text>
          </Section>
          <Section style={buttonSection}>
            <Link href={eventUrl} style={button}>查看活動詳情</Link>
          </Section>
          <Text style={text}>📎 <Link href={calendarUrl}>加入 Google 日曆</Link></Text>
          <Hr style={hr} />
          <Text style={smallText}>
            {isOnline
              ? "【入場說明】線上活動請於開始前 10 分鐘進入會議室。"
              : "【入場說明】實體活動請攜帶此信件作為報名憑證。"}
          </Text>
          <Text style={smallText}>
            如需取消報名，請<Link href={cancelUrl}>點此連結</Link>。
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "'Noto Sans TC', sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "40px 20px", maxWidth: "560px" };
const h1 = { color: "#1a1a1a", fontSize: "24px", fontWeight: "bold" as const, margin: "0 0 20px" };
const text = { color: "#333", fontSize: "16px", lineHeight: "26px", margin: "0 0 10px" };
const infoBox = { backgroundColor: "#f0f4f8", borderRadius: "8px", padding: "20px", margin: "20px 0" };
const eventTitleStyle = { color: "#1a1a1a", fontSize: "18px", fontWeight: "bold" as const, margin: "0 0 12px" };
const infoText = { color: "#555", fontSize: "15px", lineHeight: "24px", margin: "0 0 4px" };
const buttonSection = { textAlign: "center" as const, margin: "24px 0" };
const button = { backgroundColor: "#0f172a", borderRadius: "6px", color: "#fff", fontSize: "16px", padding: "12px 24px", textDecoration: "none" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const smallText = { color: "#8898aa", fontSize: "13px", lineHeight: "20px", margin: "0 0 6px" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
