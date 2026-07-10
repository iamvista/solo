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
import type { WaitlistIntent } from "@/lib/waitlist";
import { TIMESLOT_CHOICES } from "@/lib/waitlist-timeslots";

interface Props {
  name: string;
  courseTitle: string;
  intent: WaitlistIntent;
  /** 已帶好 token 的 /waitlist/preference 連結，缺 slot 由本元件補上 */
  preferenceUrlBase: string;
  unsubscribeUrl: string;
}

export function WaitlistConfirmEmail({
  name,
  courseTitle,
  intent,
  preferenceUrlBase,
  unsubscribeUrl,
}: Props) {
  const isFullWaitlist = intent === "full_waitlist";
  const heading = isFullWaitlist
    ? `${name}，已將你排入候補名單`
    : `${name}，下次開課第一個通知你`;
  const lead = isFullWaitlist
    ? "這一梯的名額已滿。若有人取消釋出名額，我們會立刻寄信給你。"
    : "我們記下你了。這門課下次開課時，你會在公開報名前收到通知。";

  return (
    <Html>
      <Head />
      <Preview>
        {isFullWaitlist ? "候補確認" : "開課通知確認"}：《{courseTitle}》
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={tag}>{isFullWaitlist ? "⏳ 候補確認" : "🔔 開課通知"}</Text>
          <Heading style={h1}>{heading}</Heading>
          <Text style={text}>
            你登記的是《<strong>{courseTitle}</strong>》。{lead}
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>順手幫我們一個忙</Text>
            <Text style={infoText}>
              你哪個時段比較方便上課？點一下就好，這會直接影響我們把下一梯排在什麼時候。
            </Text>
            <Section style={buttonSection}>
              {TIMESLOT_CHOICES.map(({ slot, label }) => (
                <Link
                  key={slot}
                  href={`${preferenceUrlBase}&slot=${slot}`}
                  style={choiceButton}
                >
                  {label}
                </Link>
              ))}
            </Section>
            <Text style={smallText}>
              點錯了不要緊，再點另一個就會覆蓋掉先前的選擇。
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={smallText}>
            不想再收到這門課的開課通知？
            <Link href={unsubscribeUrl} style={link}>
              點此退出名單
            </Link>
            。
          </Text>
          <Hr style={hr} />
          <Text style={footer}>© solo.tw — AI × 一人事業</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles（比照 registration-confirm.tsx）───

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
const buttonSection = { textAlign: "center" as const, margin: "16px 0 8px" };
const choiceButton = {
  backgroundColor: "#0f172a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "10px 18px",
  textDecoration: "none",
  display: "inline-block",
  margin: "0 6px 8px 0",
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
