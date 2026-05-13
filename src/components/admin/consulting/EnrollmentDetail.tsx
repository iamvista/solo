"use client";

import { useRouter } from "next/navigation";
import { AddSessionModal } from "./AddSessionModal";

interface EnrollmentBalance {
  id: string;
  name: string;
  email: string;
  plan: string;
  total_hours: number;
  hours_used: number;
  hours_remaining: number;
  expires_at: string;
  status: string;
}

interface SessionRow {
  id: string;
  session_date: string;
  time_start: string | null;
  time_end: string | null;
  hours_used: number;
  topic: string;
  shared_doc_url: string | null;
}

interface Props {
  enrollment: EnrollmentBalance;
  sessions: SessionRow[];
}

export function EnrollmentDetail({ enrollment, sessions }: Props) {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-2xl font-bold">{enrollment.name}</h2>
        <p className="text-muted-foreground">{enrollment.email}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">方案</dt>
            <dd className="font-medium">{enrollment.plan}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">總時數</dt>
            <dd className="font-medium">{enrollment.total_hours} 小時</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">已使用</dt>
            <dd className="font-medium">{enrollment.hours_used} 小時</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">剩餘</dt>
            <dd
              className={
                "font-medium " +
                (enrollment.hours_remaining <= 1 ? "text-orange-600" : "")
              }
            >
              {enrollment.hours_remaining} 小時
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">到期日</dt>
            <dd className="font-medium">
              {new Date(enrollment.expires_at).toLocaleDateString("zh-TW")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">狀態</dt>
            <dd className="font-medium">{enrollment.status}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <AddSessionModal
            enrollmentId={enrollment.id}
            onSaved={() => router.refresh()}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-xl font-semibold">
          Session 歷史（{sessions.length}）
        </h3>
        {sessions.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            尚未記錄任何 session。
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="p-2 text-left">日期</th>
                  <th className="p-2 text-left">時段</th>
                  <th className="p-2 text-right">時數</th>
                  <th className="p-2 text-left">主題</th>
                  <th className="p-2 text-left">共寫文件</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-2 whitespace-nowrap">{s.session_date}</td>
                    <td className="p-2 whitespace-nowrap">
                      {s.time_start || "—"}
                      {s.time_start || s.time_end ? " ~ " : ""}
                      {s.time_end || ""}
                    </td>
                    <td className="p-2 text-right">{s.hours_used}</td>
                    <td className="p-2">{s.topic}</td>
                    <td className="p-2">
                      {s.shared_doc_url ? (
                        <a
                          href={s.shared_doc_url}
                          target="_blank"
                          rel="noopener"
                          className="text-blue-600 underline"
                        >
                          連結
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
