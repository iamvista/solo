import {
  Body, Container, Head, Heading, Hr, Html, Link,
  Preview, Section, Text,
} from "@react-email/components";

interface Props {
  name: string;
  eventTitle: string;
  eventTime: string;
  venue: string;
  eventUrl: string;
  isOnline: boolean;
  onlineUrl?: string;
}

export function EventReminderEmail({
  name, eventTitle, eventTime, venue, eventUrl, isOnline, onlineUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{name}，明天見！提醒你參加《{eventTitle}》</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{name}，明天見！</Heading>
          <Text style={text}>提醒你明天參加的活動：</Text>
          <Section style={infoBox}>
            <Text style={eventTitleStyle}>《{eventTitle}》</Text>
            <Text style={infoText}>📅 明天 {eventTime}</Text>
            <Text style={infoText}>📍 {venue}</Text>
          </Section>
          <Section style={buttonSection}>
            <Link href={isOnline && onlineUrl ? onlineUrl : eventUrl} style={button}>
              {isOnline ? "進入活動" : "查看活動詳情"}
            </Link>
          </Section>
          <Text style={text}>建議提早 5-10 分鐘入場</Text>
          <Text style={text}>期待在活動中見到你！</Text>
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
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
