"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventUpdateItem {
  id: string;
  title: string;
  content: string | null;
  sent_at: string | null;
  created_at: string;
}

interface Props {
  eventId: string;
  updates: EventUpdateItem[];
}

export default function EventUpdateHistory({ eventId, updates }: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState("");

  const toggleExpand = (id: string) => {
    if (editingId === id) return;
    setExpandedId(expandedId === id ? null : id);
    setEditingId(null);
    setSaveResult("");
  };

  const startEdit = (update: EventUpdateItem) => {
    setEditingId(update.id);
    setEditTitle(update.title);
    setEditContent(update.content || "");
    setSaveResult("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSaveResult("");
  };

  const handleSave = async (updateId: string) => {
    if (!editTitle.trim()) {
      setSaveResult("❌ 標題不能為空");
      return;
    }
    setSaving(true);
    setSaveResult("");

    try {
      const res = await fetch(`/api/admin/events/${eventId}/updates`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updateId,
          title: editTitle,
          content: editContent,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveResult("✅ 已更新");
        setEditingId(null);
        router.refresh();
      } else {
        setSaveResult(`❌ ${data.error}`);
      }
    } catch {
      setSaveResult("❌ 網路錯誤");
    }
    setSaving(false);
  };

  const handleDelete = async (update: EventUpdateItem) => {
    const confirm = window.confirm(
      `確定要刪除公告「${update.title}」嗎？\n\n此操作無法復原。`,
    );
    if (!confirm) return;

    setDeleting(update.id);
    try {
      const res = await fetch(
        `/api/admin/events/${eventId}/updates?updateId=${update.id}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        setExpandedId(null);
        setEditingId(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(`刪除失敗：${data.error}`);
      }
    } catch {
      alert("刪除失敗：網路錯誤");
    }
    setDeleting(null);
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-bold">歷史公告</h2>
      <div className="space-y-3">
        {updates.map((update) => {
          const isExpanded =
            expandedId === update.id || editingId === update.id;
          const isEditing = editingId === update.id;
          const isDeleting = deleting === update.id;

          return (
            <Card
              key={update.id}
              className={`transition-shadow hover:shadow-md ${isDeleting ? "opacity-50" : ""}`}
            >
              <CardContent className="p-4">
                {/* Header row — always visible, clickable */}
                <div
                  className="flex cursor-pointer items-start justify-between"
                  onClick={() => toggleExpand(update.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground transition-transform">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <h3 className="font-medium">{update.title}</h3>
                    </div>
                    {!isExpanded && update.content && (
                      <p className="ml-5 mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {update.content}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 shrink-0 text-right text-xs text-muted-foreground">
                    <p>
                      {new Intl.DateTimeFormat("zh-TW", {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone: "Asia/Taipei",
                      }).format(new Date(update.created_at))}
                    </p>
                    {update.sent_at && (
                      <Badge variant="outline" className="mt-1">
                        已寄出
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && !isEditing && (
                  <div className="mt-4 border-t pt-4">
                    {update.content ? (
                      <div className="rounded-md bg-muted/30 p-4">
                        {update.content.split("\n").map((line, i) => (
                          <p key={i} className="text-sm leading-relaxed">
                            {line || "\u00A0"}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        （無內容）
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(update);
                        }}
                      >
                        ✏️ 編輯
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(update);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "刪除中..." : "🗑️ 刪除"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Edit mode */}
                {isEditing && (
                  <div
                    className="mt-4 space-y-3 border-t pt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        標題
                      </label>
                      <input
                        className={inputClass}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        內容
                      </label>
                      <textarea
                        className={`${inputClass} min-h-[180px]`}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                    </div>
                    {saveResult && (
                      <p
                        className={`text-sm font-medium ${saveResult.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
                      >
                        {saveResult}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(update.id)}
                        disabled={saving}
                      >
                        {saving ? "儲存中..." : "儲存"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
