"use client";

import { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Emoji data                                                        */
/* ------------------------------------------------------------------ */
const EMOJI_DATA: Record<string, { label: string; emojis: string[] }> = {
  common: {
    label: "常用",
    emojis: [
      "😀","😊","🎉","👍","❤️","🔥","✅","⭐",
      "💡","🎯","🚀","💪","👏","🙌","✨","📌",
    ],
  },
  objects: {
    label: "物品",
    emojis: [
      "📅","📍","🎤","💻","📱","🎨","📝","📊",
      "🔗","📧","🎵","📸","🏠","🎁","🔔","💰",
    ],
  },
  people: {
    label: "人物",
    emojis: [
      "👤","👥","🙋","🤝","💁","🧑‍💻","👨‍🏫","👩‍🎨",
    ],
  },
  nature: {
    label: "自然",
    emojis: [
      "🌟","🌈","☀️","🌙","🍀","🌸","🌊","⚡",
    ],
  },
  symbols: {
    label: "符號",
    emojis: [
      "✅","❌","⚠️","ℹ️","❓","💯","🔴","🟢",
      "🔵","⬆️","➡️","⬇️",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Text manipulation helpers                                         */
/* ------------------------------------------------------------------ */
type FormatAction =
  | { type: "wrap"; before: string; after: string }
  | { type: "line-prefix"; prefix: string }
  | { type: "insert"; text: string }
  | { type: "link" };

function applyFormatting(
  textarea: HTMLTextAreaElement,
  action: FormatAction,
  value: string,
  onChange: (v: string) => void,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.slice(start, end);
  let newValue: string;
  let cursorStart: number;
  let cursorEnd: number;

  switch (action.type) {
    case "wrap": {
      const text = selected || "文字";
      newValue =
        value.slice(0, start) +
        action.before +
        text +
        action.after +
        value.slice(end);
      if (selected) {
        cursorStart = start + action.before.length + text.length + action.after.length;
        cursorEnd = cursorStart;
      } else {
        cursorStart = start + action.before.length;
        cursorEnd = cursorStart + text.length;
      }
      break;
    }
    case "line-prefix": {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      if (value.slice(lineStart).startsWith(action.prefix)) {
        newValue =
          value.slice(0, lineStart) + value.slice(lineStart + action.prefix.length);
        cursorStart = Math.max(lineStart, start - action.prefix.length);
        cursorEnd = cursorStart;
      } else {
        newValue =
          value.slice(0, lineStart) + action.prefix + value.slice(lineStart);
        cursorStart = start + action.prefix.length;
        cursorEnd = cursorStart;
      }
      break;
    }
    case "insert": {
      newValue = value.slice(0, start) + action.text + value.slice(end);
      cursorStart = start + action.text.length;
      cursorEnd = cursorStart;
      break;
    }
    case "link": {
      const linkText = selected || "連結文字";
      const template = `[${linkText}](url)`;
      newValue = value.slice(0, start) + template + value.slice(end);
      cursorStart = start + linkText.length + 3;
      cursorEnd = cursorStart + 3; // select "url"
      break;
    }
  }

  onChange(newValue);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorStart, cursorEnd);
  });
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */
function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      className={cn(active && "bg-accent text-accent-foreground")}
      title={label}
    >
      <Icon className="size-4" />
    </Button>
  );
}

function ToolbarSeparator() {
  return <div className="mx-0.5 h-5 w-px bg-border" />;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "詳細的活動說明...",
  minHeight = "300px",
  className,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("common");

  const format = useCallback(
    (actionKey: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const actions: Record<string, FormatAction> = {
        bold: { type: "wrap", before: "**", after: "**" },
        italic: { type: "wrap", before: "*", after: "*" },
        h2: { type: "line-prefix", prefix: "## " },
        h3: { type: "line-prefix", prefix: "### " },
        ul: { type: "line-prefix", prefix: "- " },
        ol: { type: "line-prefix", prefix: "1. " },
        link: { type: "link" },
        hr: { type: "insert", text: "\n---\n" },
      };

      const action = actions[actionKey];
      if (action) applyFormatting(ta, action, value, onChange);
    },
    [value, onChange],
  );

  const insertEmoji = useCallback(
    (emoji: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      applyFormatting(ta, { type: "insert", text: emoji }, value, onChange);
    },
    [value, onChange],
  );

  return (
    <div className={cn("rounded-md", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-input bg-muted/50 px-1 py-1">
        <ToolbarButton icon={Bold} label="粗體" onClick={() => format("bold")} />
        <ToolbarButton icon={Italic} label="斜體" onClick={() => format("italic")} />
        <ToolbarSeparator />
        <ToolbarButton icon={Heading2} label="標題 2" onClick={() => format("h2")} />
        <ToolbarButton icon={Heading3} label="標題 3" onClick={() => format("h3")} />
        <ToolbarSeparator />
        <ToolbarButton icon={List} label="項目清單" onClick={() => format("ul")} />
        <ToolbarButton icon={ListOrdered} label="編號清單" onClick={() => format("ol")} />
        <ToolbarSeparator />
        <ToolbarButton icon={LinkIcon} label="連結" onClick={() => format("link")} />
        <ToolbarButton icon={Minus} label="分隔線" onClick={() => format("hr")} />
        <ToolbarSeparator />
        <ToolbarButton
          icon={Smile}
          label="表情符號"
          onClick={() => setShowEmojiPanel((v) => !v)}
          active={showEmojiPanel}
        />
      </div>

      {/* Emoji panel */}
      {showEmojiPanel && (
        <div className="border-x border-input bg-background p-2">
          <div className="mb-2 flex gap-1">
            {Object.entries(EMOJI_DATA).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setEmojiCategory(key)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                  emojiCategory === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_DATA[emojiCategory].emojis.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="flex size-8 items-center justify-center rounded text-lg transition-colors hover:bg-muted"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        className={cn(
          "w-full rounded-b-md border border-t-0 border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "resize-y",
        )}
        style={{ minHeight }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
