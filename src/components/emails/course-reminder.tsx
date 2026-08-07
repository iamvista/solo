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

/**
 * 課程倒數提醒（D-7／D-5／D-3／D-1）。
 *
 * 沒有沿用 event-reminder：那支把「明天見」寫死在標題、內文與資訊列三處，
 * 改成可變語氣等於重寫，而它正服務著 events 表的 D-1 提醒，不值得為此冒險。
 * 課程要講的東西也不同：課前準備、要帶什麼、教室地址是報名後才給的。
 */
interface Props {
  name: string;
  courseTitle: string;
  /** 由 reminderCopy 產生，例「明天見！」「還有 7 天開課」 */
  headline: string;
  /** 由 reminderCopy 產生，例「明天」「7 天後」 */
  whenLabel: string;
  /** 顯示用日期，例 "2026/8/30（日）" */
  courseDate: string;
  /** 上課時段，例 "9:00–12:00（3 小時，含休息）" */
  courseTime: string;
  location: string;
  courseUrl: string;
  /** 課前準備事項，取自 COURSE_CONFIGS.preRegistrationNotice */
  preparationNotice?: string;
}

export function CourseReminderEmail({
  name,
  courseTitle,
  headline,
  whenLabel,
  courseDate,
  courseTime,
  location,
  courseUrl,
  preparationNotice,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        {name}，{headline}提醒你參加《{courseTitle}》
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>⏰ 開課提醒</Text>
          <Heading style={h1}>
            {name}，{headline}
          </Heading>
          <Text style={text}>
            提醒你{whenLabel}參加《<strong>{courseTitle}</strong>》：
          </Text>
          <Section style={infoBox}>
            <Text style={infoTitle}>📋 上課資訊</Text>
            <Text style={infoText}>📅 {courseDate}</Text>
            <Text style={infoText}>🕘 {courseTime}</Text>
            <Text style={infoText}>📍 {location}</Text>
          </Section>
          {preparationNotice && (
            <Section style={highlightBox}>
              <Text style={highlightText}>📝 課前準備：{preparationNotice}</Text>
            </Section>
          )}
          <Section style={buttonSection}>
            <Link href={courseUrl} style={button}>
              查看課程頁面
            </Link>
          </Section>
          <Text style={subtext}>💡 實體課建議提早 10 分鐘到，方便安頓裝置</Text>
          <Text style={text}>
            如果你的狀況有變、無法出席，直接回覆這封信告訴我就可以。
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© 自由人學院 solo.tw</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles（與 event-reminder 一致，維持兩封提醒信外觀統一）───

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
  color: "#6366f1",
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
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
