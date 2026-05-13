"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Lead {
  id: string;
  name: string;
  email: string;
  contact_method: string;
  contact_id: string | null;
  plan: string;
  topics: string[];
  specific_problem: string;
  expected_outcome: string | null;
  level: string;
  desired_start: string | null;
  attribution: string | null;
  consent_terms: boolean;
  subscribe_newsletter: boolean;
  vista_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function LeadList({ leads }: { leads: Lead[] }) {
  const [working, setWorking] = useState<string | null>(null);
  const [approveModal, setApproveModal] = useState<Lead | null>(null);
  const [approveMessage, setApproveMessage] = useState("");
  const [detailModal, setDetailModal] = useState<Lead | null>(null);

  async function submitApprove() {
    if (!approveModal) return;
    setWorking(approveModal.id);
    const res = await fetch(`/api/admin/consulting/leads/${approveModal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "approved",
        vistaNotes: approveMessage,
      }),
    });
    setWorking(null);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(`更新失敗：${data?.error ?? res.statusText}`);
      return;
    }

    setApproveModal(null);
    setApproveMessage("");

    if (data.emailSkipped) {
      alert(
        `Lead 已 approve，但未寄付款連結。原因：${data.emailSkippedReason}`,
      );
    } else if (data.emailError) {
      alert(
        `Lead 已 approve，但 email 寄送失敗：\n\n${data.emailErrorDetail}\n\n付款連結（請手動複製寄出）：\n${data.checkoutUrl}`,
      );
    } else if (data.emailSent) {
      alert(
        `Lead 已 approve、付款連結信件已寄出。\n\n連結：${data.checkoutUrl}`,
      );
    }

    location.reload();
  }

  async function reject(id: string) {
    if (!confirm("確定要 reject 這筆 lead 嗎？")) return;
    setWorking(id);
    const res = await fetch(`/api/admin/consulting/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    setWorking(null);
    if (res.ok) {
      location.reload();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`更新失敗：${data?.error ?? res.statusText}`);
    }
  }

  async function remove(id: string, name: string) {
    if (
      !confirm(
        `確定永久刪除「${name}」的需求單？\n此動作無法復原，相關付款記錄不會被刪。`,
      )
    )
      return;
    setWorking(id);
    const res = await fetch(`/api/admin/consulting/leads/${id}`, {
      method: "DELETE",
    });
    setWorking(null);
    if (res.ok) {
      location.reload();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`刪除失敗：${data?.error ?? res.statusText}`);
    }
  }

  function exportCsv() {
    const headers = [
      "建立時間",
      "姓名",
      "E-mail",
      "偏好聯絡",
      "聯絡 ID",
      "方案",
      "主題",
      "具體問題",
      "期待產出",
      "程度",
      "開始時間",
      "怎麼知道",
      "訂閱電子報",
      "狀態",
      "Vista 筆記",
    ];
    const rows = leads.map((l) => [
      new Date(l.created_at).toLocaleString("zh-TW"),
      l.name,
      l.email,
      l.contact_method,
      l.contact_id ?? "",
      l.plan,
      l.topics.join(", "),
      l.specific_problem,
      l.expected_outcome ?? "",
      l.level,
      l.desired_start ?? "",
      l.attribution ?? "",
      l.subscribe_newsletter ? "是" : "否",
      l.status,
      l.vista_notes ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    // UTF-8 BOM 讓 Excel 直接開不亂碼
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consulting-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        目前沒有需求單。
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 border-b bg-muted/30 p-3">
        <Button size="sm" variant="outline" onClick={exportCsv}>
          📥 匯出 CSV（{leads.length} 筆）
        </Button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted">
            <th className="p-3 text-left">日期</th>
            <th className="p-3 text-left">姓名</th>
            <th className="p-3 text-left">方案</th>
            <th className="p-3 text-left">主題</th>
            <th className="p-3 text-left">問題</th>
            <th className="p-3 text-left">狀態</th>
            <th className="p-3 text-right">動作</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-b">
              <td className="p-3">
                {new Date(l.created_at).toLocaleDateString("zh-TW")}
              </td>
              <td className="p-3 font-medium">
                {l.name}
                <br />
                <span className="text-xs text-muted-foreground">{l.email}</span>
              </td>
              <td className="p-3">{l.plan}</td>
              <td className="p-3">{l.topics.join(", ")}</td>
              <td className="p-3 max-w-md truncate">{l.specific_problem}</td>
              <td className="p-3">
                <span className={badgeClass(l.status)}>{l.status}</span>
              </td>
              <td className="p-3 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDetailModal(l)}
                  >
                    📋 完整
                  </Button>
                  {l.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={working === l.id}
                        onClick={() => {
                          setApproveModal(l);
                          setApproveMessage("");
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={working === l.id}
                        onClick={() => reject(l.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={working === l.id}
                    onClick={() => remove(l.id, l.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    🗑
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Approve Modal */}
      {approveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setApproveModal(null);
              setApproveMessage("");
            }
          }}
        >
          <div className="w-full max-w-2xl rounded-lg bg-card p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">
                Approve：{approveModal.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                方案：{approveModal.plan} ｜ 主題：
                {approveModal.topics.join(", ")} ｜ E-mail：
                {approveModal.email}
              </p>
            </div>

            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <p className="font-medium">學員的具體問題</p>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                {approveModal.specific_problem}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="approve-message"
                className="text-sm font-medium"
              >
                給學員的個人訊息（會顯示在付款連結信件中，可多行）
              </label>
              <Textarea
                id="approve-message"
                rows={6}
                value={approveMessage}
                onChange={(e) => setApproveMessage(e.target.value)}
                placeholder="例如：您的需求很適合 5hr 套票，期待和您一起進入這個專案。如果方便，我們可以本週末約一次首場 Google Meet..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setApproveModal(null);
                  setApproveMessage("");
                }}
                disabled={working !== null}
              >
                取消
              </Button>
              <Button onClick={submitApprove} disabled={working !== null}>
                {working ? "處理中..." : "確認 approve + 寄付款連結"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailModal(null);
          }}
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">
                完整需求單：{detailModal.name}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDetailModal(null)}
              >
                ✕
              </Button>
            </div>

            <dl className="grid grid-cols-[120px_1fr] gap-3 text-sm">
              <dt className="text-muted-foreground">投件時間</dt>
              <dd>
                {new Date(detailModal.created_at).toLocaleString("zh-TW")}
              </dd>

              <dt className="text-muted-foreground">姓名</dt>
              <dd className="font-medium">{detailModal.name}</dd>

              <dt className="text-muted-foreground">E-mail</dt>
              <dd>{detailModal.email}</dd>

              <dt className="text-muted-foreground">偏好聯絡</dt>
              <dd>
                {detailModal.contact_method}
                {detailModal.contact_id ? ` / ${detailModal.contact_id}` : ""}
              </dd>

              <dt className="text-muted-foreground">方案</dt>
              <dd>{detailModal.plan}</dd>

              <dt className="text-muted-foreground">主題</dt>
              <dd>{detailModal.topics.join(", ")}</dd>

              <dt className="text-muted-foreground">具體問題</dt>
              <dd className="whitespace-pre-wrap">
                {detailModal.specific_problem}
              </dd>

              {detailModal.expected_outcome && (
                <>
                  <dt className="text-muted-foreground">期待產出</dt>
                  <dd className="whitespace-pre-wrap">
                    {detailModal.expected_outcome}
                  </dd>
                </>
              )}

              <dt className="text-muted-foreground">程度</dt>
              <dd>{detailModal.level}</dd>

              {detailModal.desired_start && (
                <>
                  <dt className="text-muted-foreground">開始時間</dt>
                  <dd>{detailModal.desired_start}</dd>
                </>
              )}

              {detailModal.attribution && (
                <>
                  <dt className="text-muted-foreground">怎麼知道</dt>
                  <dd>{detailModal.attribution}</dd>
                </>
              )}

              <dt className="text-muted-foreground">訂閱電子報</dt>
              <dd>{detailModal.subscribe_newsletter ? "是" : "否"}</dd>

              <dt className="text-muted-foreground">狀態</dt>
              <dd>
                <span className={badgeClass(detailModal.status)}>
                  {detailModal.status}
                </span>
              </dd>

              {detailModal.vista_notes && (
                <>
                  <dt className="text-muted-foreground">Vista 筆記</dt>
                  <dd className="whitespace-pre-wrap">
                    {detailModal.vista_notes}
                  </dd>
                </>
              )}
            </dl>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setDetailModal(null)}
              >
                關閉
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function badgeClass(s: string) {
  return (
    "px-2 py-1 rounded text-xs " +
    ({
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      enrolled: "bg-green-100 text-green-800",
      rejected: "bg-gray-100 text-gray-800",
      stale: "bg-red-100 text-red-800",
    }[s] ?? "bg-gray-100")
  );
}
