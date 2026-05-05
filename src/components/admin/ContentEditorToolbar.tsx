"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

// ─── Emoji groups ───
const emojiGroups = [
  {
    label: "活動",
    items: ["📅", "⏰", "📍", "📮", "🔗", "🎫", "🎤", "🏠"],
  },
  {
    label: "狀態",
    items: ["✅", "❌", "⚠️", "🔔", "📢", "🆕", "🔄", "⏳"],
  },
  {
    label: "情緒",
    items: ["🎉", "👋", "🙏", "💡", "❤️", "🔥", "⭐", "👏"],
  },
  {
    label: "符號",
    items: ["📌", "📎", "✨", "💬", "📝", "📞", "📧", "🌐"],
  },
];

// ─── Quick-insert snippets ───
const snippets = [
  { label: "分隔線", insert: "\n────────────────\n" },
  { label: "【】標題", insert: "【】" },
  { label: "條列", insert: "\n• \n• \n• " },
  { label: "問候語", insert: "如有任何疑問，歡迎回覆此信。" },
  {
    label: "聯絡資訊",
    insert: "\n📧 聯絡信箱：iamvista@gmail.com\n📞 聯絡電話：",
  },
];

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

export default function ContentEditorToolbar({
  textareaRef,
  value,
  onChange,
}: Props) {
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  // Insert text at cursor position
  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        onChange(value + text);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.slice(0, start) + text + value.slice(end);
      onChange(newValue);

      // Restore cursor position after the inserted text
      requestAnimationFrame(() => {
        textarea.focus();
        const newPos = start + text.length;
        textarea.setSelectionRange(newPos, newPos);
      });
    },
    [textareaRef, value, onChange],
  );

  // Insert text wrapping selected text
  const wrapSelection = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.slice(start, end);
      const newValue =
        value.slice(0, start) + before + selected + after + value.slice(end);
      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        if (selected) {
          textarea.setSelectionRange(
            start + before.length,
            start + before.length + selected.length,
          );
        } else {
          const newPos = start + before.length;
          textarea.setSelectionRange(newPos, newPos);
        }
      });
    },
    [textareaRef, value, onChange],
  );

  const btnClass =
    "h-8 px-2.5 text-xs font-normal hover:bg-accent rounded-md border border-input bg-background";

  return (
    <div className="space-y-2">
      {/* Main toolbar */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Formatting */}
        <button
          type="button"
          className={btnClass}
          onClick={() => wrapSelection("【", "】")}
          title="粗體標題"
        >
          【B】
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => insertAtCursor("\n────────────────\n")}
          title="分隔線"
        >
          ─ 分隔線
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => insertAtCursor("\n• ")}
          title="新增條列項目"
        >
          • 條列
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        {/* Quick snippets */}
        {snippets.slice(3).map((s) => (
          <button
            key={s.label}
            type="button"
            className={btnClass}
            onClick={() => insertAtCursor(s.insert)}
            title={s.label}
          >
            {s.label}
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-border" />

        {/* Emoji toggle */}
        <button
          type="button"
          className={`${btnClass} ${showEmoji ? "bg-accent" : ""}`}
          onClick={() => setShowEmoji(!showEmoji)}
        >
          😊 Emoji
        </button>
      </div>

      {/* Emoji picker panel */}
      {showEmoji && (
        <div
          ref={emojiRef}
          className="rounded-lg border bg-background p-3 shadow-sm"
        >
          {emojiGroups.map((group) => (
            <div key={group.label} className="mb-2 last:mb-0">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.items.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="rounded p-1 text-lg hover:bg-accent"
                    onClick={() => {
                      insertAtCursor(emoji);
                      // keep panel open for multiple inserts
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
