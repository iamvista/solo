"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventData {
  title: string;
  starts_at: string;
  ends_at: string | null;
  format: string;
  venue_name: string | null;
  venue_address: string | null;
  online_url: string | null;
  slug: string;
}

interface Props {
  eventId: string;
  event?: EventData;
}

const TZ = "Asia/Taipei";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: TZ,
  }).format(new Date(iso));
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

function getVenue(event: EventData) {
  const hasVenue = event.format === "offline" || event.format === "hybrid";
  return hasVenue ? event.venue_name || "待通知" : "線上活動";
}

function getVenueWithAddress(event: EventData) {
  const venue = getVenue(event);
  if (event.venue_address && event.format !== "online") {
    return `${venue}\n📮 地址：${event.venue_address}`;
  }
  return venue;
}

type TemplateKey = "confirm" | "reminder" | "change" | "custom";

const templateList: { key: TemplateKey; label: string; emoji: string }[] = [
  { key: "confirm", label: "報名確認", emoji: "✅" },
  { key: "reminder", label: "活動提醒", emoji: "🔔" },
  { key: "change", label: "活動變更", emoji: "📝" },
  { key: "custom", label: "自訂公告", emoji: "📢" },
];

function buildTemplate(
  key: TemplateKey,
  event: EventData,
): { title: string; content: string } {
  const dateStr = formatDate(event.starts_at);
  const startTime = formatTime(event.starts_at);
  const endTime = event.ends_at ? formatTime(event.ends_at) : null;
  const timeStr = endTime ? `${startTime}–${endTime}` : startTime;
  const venue = getVenue(event);
  const hasVenue = event.format === "offline" || event.format === "hybrid";
  const hasOnline = event.format === "online" || event.format === "hybrid";

  // Build location lines
  const locationLines = [
    `📍 地點：${venue}`,
    hasVenue && event.venue_address ? `📮 地址：${event.venue_address}` : "",
    hasOnline && event.online_url ? `🔗 線上連結：${event.online_url}` : "",
  ].filter(Boolean);

  // Build entrance instructions
  const entranceInstructions =
    event.format === "hybrid"
      ? "混合活動可選擇現場出席或線上參加。現場請攜帶此信件作為憑證，線上請於開始前 10 分鐘進入會議室。"
      : event.format === "online"
        ? event.online_url
          ? "請於活動開始前 10 分鐘點擊上方連結進入會議室。"
          : "線上活動連結將於活動前另行通知，請留意信箱。"
        : "請攜帶此信件作為報名憑證。建議提早 10 分鐘入場。";

  switch (key) {
    case "confirm":
      return {
        title: `報名確認：${event.title}`,
        content: [
          `感謝你報名《${event.title}》！以下是活動資訊：`,
          "",
          `📅 日期：${dateStr}`,
          `⏰ 時間：${timeStr}`,
          ...locationLines,
          "",
          entranceInstructions,
          "",
          "如有任何疑問，歡迎回覆此信。",
        ].join("\n"),
      };
    case "reminder":
      return {
        title: `活動提醒：明天就是《${event.title}》！`,
        content: [
          `嗨！提醒你明天的活動：`,
          "",
          `📅 日期：${dateStr}`,
          `⏰ 時間：${timeStr}`,
          ...locationLines,
          "",
          "建議提早 5-10 分鐘進入，期待在活動中見到你！",
        ].join("\n"),
      };
    case "change":
      return {
        title: `活動資訊變更：${event.title}`,
        content: [
          `關於你報名的《${event.title}》，有以下資訊變更：`,
          "",
          "【變更內容】",
          "（請在此填寫變更項目）",
          "",
          "更新後的活動資訊如下：",
          `📅 日期：${dateStr}`,
          `⏰ 時間：${timeStr}`,
          ...locationLines,
          "",
          "造成不便敬請見諒，如有疑問歡迎回覆此信。",
        ].join("\n"),
      };
    case "custom":
    default:
      return {
        title: "",
        content: "",
      };
  }
}

export default function EventUpdateForm({ eventId, event }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey | null>(
    null,
  );
  const [showPreview, setShowPreview] = useState(false);

  const applyTemplate = (key: TemplateKey) => {
    if (!event) return;
    const tpl = buildTemplate(key, event);
    setTitle(tpl.title);
    setContent(tpl.content);
    setActiveTemplate(key);
    setShowPreview(false);
  };

  const handleSend = async () => {
    if (!title) {
      setResult("請填寫標題");
      return;
    }
    setSending(true);
    setResult("");

    try {
      const res = await fetch(`/api/admin/events/${eventId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, target }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(`✅ 公告已送出，共寄出 ${data.emailsSent} 封信`);
        setTitle("");
        setContent("");
        setActiveTemplate(null);
        router.refresh();
      } else {
        setResult(`❌ 錯誤：${data.error}`);
      }
    } catch {
      setResult("❌ 網路錯誤");
    }
    setSending(false);
  };

  const previewLines = useMemo(() => {
    return content.split("\n").map((line, i) => ({
      key: i,
      text: line || "\u00A0",
    }));
  }, [content]);

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <Card>
      <CardHeader>
        <CardTitle>發送通知信</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Template buttons */}
        {event && (
          <div>
            <label className={labelClass}>選擇範本</label>
            <div className="flex flex-wrap gap-2">
              {templateList.map((tpl) => (
                <Button
                  key={tpl.key}
                  type="button"
                  size="sm"
                  variant={activeTemplate === tpl.key ? "default" : "outline"}
                  onClick={() => applyTemplate(tpl.key)}
                >
                  {tpl.emoji} {tpl.label}
                </Button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              點選範本會自動帶入活動資訊，你可以再自行修改內容
            </p>
          </div>
        )}

        {/* Target audience */}
        <div>
          <label className={labelClass}>發送對象</label>
          <select
            className={inputClass}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="all">全部報名者（已確認 + 候補）</option>
            <option value="confirmed">僅已確認</option>
            <option value="waitlisted">僅候補中</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className={labelClass}>信件主旨 *</label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：活動時間調整通知"
          />
        </div>

        {/* Content */}
        <div>
          <label className={labelClass}>信件內容</label>
          <textarea
            className={`${inputClass} min-h-[220px]`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="輸入通知內容..."
          />
        </div>

        {/* Preview toggle */}
        {(title || content) && (
          <div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "收起預覽" : "👁 預覽信件"}
            </Button>

            {showPreview && (
              <div className="mt-3 rounded-lg border bg-muted/30 p-5">
                <p className="mb-1 text-xs text-muted-foreground">
                  寄件者：自由人學院 &lt;events@solo.tw&gt;
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  主旨：{title || "（未填寫）"}
                </p>
                <hr className="mb-4" />
                <div className="space-y-0">
                  <p className="text-xs text-muted-foreground">📢 活動公告</p>
                  <h3 className="mb-3 text-lg font-bold">{title}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    哈囉，{"{{收件人姓名}}"}
                  </p>
                  <p className="mb-3 text-sm text-muted-foreground">
                    關於你報名的《{event?.title || "活動名稱"}
                    》，主辦人有新的公告：
                  </p>
                  <div className="rounded border-l-[3px] border-indigo-500 bg-muted/50 px-4 py-3">
                    {previewLines.map((line) => (
                      <p key={line.key} className="text-sm leading-relaxed">
                        {line.text}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="inline-block rounded-md bg-slate-900 px-5 py-2 text-sm text-white">
                      查看活動頁面
                    </span>
                  </div>
                  <hr className="my-4" />
                  <p className="text-center text-xs text-muted-foreground">
                    © 自由人學院 solo.tw
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status message */}
        {result && (
          <p
            className={`text-sm font-medium ${result.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
          >
            {result}
          </p>
        )}

        {/* Send button */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSend} disabled={sending || !title}>
            {sending ? "發送中..." : "發送通知信"}
          </Button>
          {target === "all" && (
            <span className="text-xs text-muted-foreground">
              將寄給所有未取消的報名者
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
