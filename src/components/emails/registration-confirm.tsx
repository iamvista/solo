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
  eventDate: string;
  eventTime: string;
  venue: string;
  venueAddress?: string;
  ticketType: string;
  eventUrl: string;
  calendarUrl: string;
  cancelUrl: string;
  format: "online" | "offline" | "hybrid";
  onlineUrl?: string;
  status: "confirmed" | "waitlisted";
}

export function RegistrationConfirmEmail({
  name,
  eventTitle,
  eventDate,
  eventTime,
  venue,
  venueAddress,
  ticketType,
  eventUrl,
  calendarUrl,
  cancelUrl,
  format,
  onlineUrl,
  status,
}: Props) {
  const hasOnline = format === "online" || format === "hybrid";
  const hasVenue = format === "offline" || format === "hybrid";
  const isConfirmed = status === "confirmed";

  if (!isConfirmed) {
    // ─── Waitlisted Email ───
    return (
      <Html>
        <Head />
        <Preview>候補通知：《{eventTitle}》</Preview>
        <Body style={main}>
          <Container style={container}>
            <Text style={tagWaitlisted}>⏳ 候補通知</Text>
            <Heading style={h1}>{name}，感謝你的報名！</Heading>
            <Text style={text}>
              你報名的《<strong>{eventTitle}</strong>
              》目前名額已滿，已為你排入候補名單。
            </Text>
            <Section style={highlightBox}>
              <Text style={highlightText}>
                若有名額釋出，我們會第一時間寄送確認信通知你，請留意信箱。
              </Text>
            </Section>
            <Section style={infoBox}>
              <Text style={infoTitle}>📋 活動資訊</Text>
              <Text style={infoText}>
                📅 {eventDate} {eventTime}
              </Text>
              <Text style={infoText}>📍 {hasVenue ? venue : "線上活動"}</Text>
              {hasVenue && venueAddress && (
                <Text style={infoText}>📮 {venueAddress}</Text>
              )}
              <Text style={infoText}>🎫 {ticketType}</Text>
            </Section>
            <Section style={buttonSection}>
              <Link href={eventUrl} style={button}>
                查看活動詳情
              </Link>
            </Section>
            <Text style={subtext}>
              📎{" "}
              <Link href={calendarUrl} style={link}>
                先加入 Google 日曆
              </Link>
              （佔位提醒，確認後即可參加）
            </Text>
            <Hr style={hr} />
            <Text style={smallText}>
              如果確定無法參加，歡迎
              <Link href={cancelUrl} style={link}>
                取消候補
              </Link>
              ，將機會留給其他人。
            </Text>
            <Hr style={hr} />
            <Text style={footer}>© 自由人學院 solo.tw</Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // ─── Confirmed Email ───
  return (
    <Html>
      <Head />
      <Preview>報名確認：你已成功報名《{eventTitle}》</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tagConfirmed}>✅ 報名確認</Text>
          <Heading style={h1}>{name}，報名成功！</Heading>
          <Text style={text}>
            你已成功報名《<strong>{eventTitle}</strong>》，以下是活動資訊：
          </Text>
          <Section style={infoBox}>
            <Text style={infoTitle}>📋 活動資訊</Text>
            <Text style={infoText}>
              📅 {eventDate} {eventTime}
            </Text>
            <Text style={infoText}>📍 {venue}</Text>
            {hasVenue && venueAddress && (
              <Text style={infoText}>📮 {venueAddress}</Text>
            )}
            {hasOnline && onlineUrl && (
              <Text style={infoText}>
                🔗 線上連結：
                <Link href={onlineUrl} style={link}>
                  {onlineUrl}
                </Link>
              </Text>
            )}
            <Text style={infoText}>🎫 {ticketType}</Text>
          </Section>
          <Section style={buttonSection}>
            {hasOnline && onlineUrl ? (
              <Link href={onlineUrl} style={button}>
                進入線上會議室
              </Link>
            ) : (
              <Link href={eventUrl} style={button}>
                查看活動詳情
              </Link>
            )}
          </Section>
          {hasOnline && !onlineUrl && (
            <Section style={highlightBox}>
              <Text style={highlightText}>
                ⚠️ 線上會議連結將於活動前另行通知，請留意信箱。
              </Text>
            </Section>
          )}
          <Text style={subtext}>
            📎{" "}
            <Link href={calendarUrl} style={link}>
              加入 Google 日曆
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={smallText}>
            {format === "online"
              ? "💡 線上活動建議提早 5-10 分鐘進入會議室。"
              : format === "hybrid"
                ? "💡 混合活動可選擇現場出席或線上參加，現場請出示此信件。"
                : "💡 實體活動請出示此信件作為報名憑證。"}
          </Text>
          <Text style={smallText}>
            如需取消報名，請
            <Link href={cancelUrl} style={link}>
              點此取消
            </Link>
            。
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Shared Styles ───

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
const tagConfirmed = {
  color: "#16a34a",
  fontSize: "13px",
  fontWeight: "600" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px",
};
const tagWaitlisted = {
  color: "#d97706",
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
  margin: "0 0 8px",
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
const highlightBox = {
  backgroundColor: "#fffbeb",
  borderLeft: "3px solid #f59e0b",
  padding: "12px 16px",
  margin: "16px 0",
  borderRadius: "0 6px 6px 0",
};
const highlightText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
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
