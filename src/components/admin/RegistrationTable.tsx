"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  confirmed: { label: "已確認", variant: "default" },
  waitlisted: { label: "候補中", variant: "secondary" },
  cancelled: { label: "已取消", variant: "destructive" },
};

interface Props {
  registrations: any[];
  eventId: string;
}

export default function RegistrationTable({ registrations, eventId }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((r) => r.id),
    );
  };

  const bulkUpdate = async (status: string) => {
    if (selected.length === 0) return;
    setUpdating(true);

    await fetch(`/api/admin/events/${eventId}/registrations`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_ids: selected, status }),
    });

    setSelected([]);
    setUpdating(false);
    router.refresh();
  };

  const bulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`確定要刪除 ${selected.length} 筆報名資料？此操作無法復原。`))
      return;
    setUpdating(true);

    await fetch(`/api/admin/events/${eventId}/registrations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_ids: selected }),
    });

    setSelected([]);
    setUpdating(false);
    router.refresh();
  };

  const exportCSV = () => {
    const headers = ["姓名", "Email", "電話", "票種", "狀態", "報名時間"];
    const rows = registrations.map((r) => [
      r.name,
      r.email,
      r.phone || "",
      r.ticket_types?.name || "",
      statusConfig[r.status]?.label || r.status,
      new Intl.DateTimeFormat("zh-TW", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Taipei",
      }).format(new Date(r.created_at)),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="w-full rounded-md border px-3 py-2 text-sm sm:max-w-xs"
            placeholder="搜尋姓名或 Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            {selected.length > 0 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkUpdate("confirmed")}
                  disabled={updating}
                >
                  確認
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkUpdate("waitlisted")}
                  disabled={updating}
                >
                  候補
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bulkUpdate("cancelled")}
                  disabled={updating}
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={bulkDelete}
                  disabled={updating}
                >
                  刪除
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={exportCSV}>
              匯出 CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === filtered.length && filtered.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="p-2">姓名</th>
                <th className="p-2">Email</th>
                <th className="p-2">電話</th>
                <th className="p-2">票種</th>
                <th className="p-2">狀態</th>
                <th className="p-2">報名時間</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => {
                const status =
                  statusConfig[reg.status] || statusConfig.confirmed;
                return (
                  <tr key={reg.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(reg.id)}
                        onChange={() => toggleSelect(reg.id)}
                      />
                    </td>
                    <td className="p-2 font-medium">{reg.name}</td>
                    <td className="p-2">{reg.email}</td>
                    <td className="p-2">{reg.phone || "—"}</td>
                    <td className="p-2">{reg.ticket_types?.name || "—"}</td>
                    <td className="p-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {new Intl.DateTimeFormat("zh-TW", {
                        dateStyle: "short",
                        timeStyle: "short",
                        timeZone: "Asia/Taipei",
                      }).format(new Date(reg.created_at))}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-muted-foreground"
                  >
                    沒有找到報名紀錄
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
