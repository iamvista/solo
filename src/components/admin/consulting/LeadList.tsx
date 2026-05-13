"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  name: string;
  email: string;
  plan: string;
  topics: string[];
  specific_problem: string;
  status: string;
  created_at: string;
}

export function LeadList({ leads }: { leads: Lead[] }) {
  const [working, setWorking] = useState<string | null>(null);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setWorking(id);
    const vistaNotes =
      status === "approved"
        ? window.prompt("給學員的個人訊息（會顯示在付款連結信件中）：") ?? ""
        : undefined;
    const res = await fetch(`/api/admin/consulting/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, vistaNotes }),
    });
    setWorking(null);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(`更新失敗：${data?.error ?? res.statusText}`);
      return;
    }

    if (data.emailSkipped) {
      alert(`Lead 已 approve，但未寄付款連結。原因：${data.emailSkippedReason}`);
    } else if (data.emailError) {
      alert(
        `Lead 已 approve，但 email 寄送失敗：\n\n${data.emailErrorDetail}\n\n付款連結（請手動複製寄出）：\n${data.checkoutUrl}`,
      );
    } else if (data.emailSent) {
      alert(`Lead 已 approve、付款連結信件已寄出。\n\n連結：${data.checkoutUrl}`);
    }

    location.reload();
  }

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        目前沒有需求單。
      </div>
    );
  }

  return (
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
          <tr key={l.id} className="border-b align-top">
            <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
              {new Date(l.created_at).toLocaleDateString("zh-TW")}
            </td>
            <td className="p-3">
              <div className="font-medium">{l.name}</div>
              <div className="text-xs text-muted-foreground">{l.email}</div>
            </td>
            <td className="p-3 whitespace-nowrap">{l.plan}</td>
            <td className="p-3 text-xs">{(l.topics ?? []).join(", ")}</td>
            <td className="p-3 max-w-md truncate">{l.specific_problem}</td>
            <td className="p-3">
              <span className={badgeClass(l.status)}>{l.status}</span>
            </td>
            <td className="p-3 text-right">
              {l.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={working === l.id}
                    onClick={() => updateStatus(l.id, "approved")}
                  >
                    {working === l.id ? "處理中..." : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={working === l.id}
                    onClick={() => updateStatus(l.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function badgeClass(s: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    enrolled: "bg-green-100 text-green-800",
    rejected: "bg-gray-100 text-gray-800",
    stale: "bg-red-100 text-red-800",
  };
  return "inline-block px-2 py-1 rounded text-xs font-medium " + (map[s] ?? "bg-gray-100 text-gray-700");
}
