import Link from "next/link";

interface Enrollment {
  id: string;
  name: string;
  email: string;
  plan: string;
  total_hours: number;
  hours_used: number;
  hours_remaining: number;
  expires_at: string;
  last_session_date: string | null;
  status: string;
}

export function EnrollmentList({ enrollments }: { enrollments: Enrollment[] }) {
  if (enrollments.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        目前沒有學員。
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-muted">
          <th className="p-3 text-left">姓名</th>
          <th className="p-3 text-left">方案</th>
          <th className="p-3 text-right">已用 / 總時數</th>
          <th className="p-3 text-right">剩餘</th>
          <th className="p-3 text-left">到期日</th>
          <th className="p-3 text-left">上次上課</th>
          <th className="p-3 text-left">狀態</th>
        </tr>
      </thead>
      <tbody>
        {enrollments.map((e) => {
          const stale =
            e.last_session_date &&
            Date.now() - new Date(e.last_session_date).getTime() >
              14 * 86_400_000;
          return (
            <tr key={e.id} className="border-b hover:bg-muted/50">
              <td className="p-3">
                <Link
                  href={`/admin/consulting/enrollments/${e.id}`}
                  className="font-medium underline"
                >
                  {e.name}
                </Link>
                <div className="text-xs text-muted-foreground">{e.email}</div>
              </td>
              <td className="p-3 whitespace-nowrap">{e.plan}</td>
              <td className="p-3 text-right whitespace-nowrap">
                {e.hours_used} / {e.total_hours}
              </td>
              <td
                className={
                  "p-3 text-right font-medium whitespace-nowrap " +
                  (e.hours_remaining <= 1 ? "text-orange-600" : "")
                }
              >
                {e.hours_remaining}
              </td>
              <td className="p-3 whitespace-nowrap">
                {new Date(e.expires_at).toLocaleDateString("zh-TW")}
              </td>
              <td
                className={
                  "p-3 whitespace-nowrap " +
                  (stale ? "text-red-600 font-medium" : "")
                }
              >
                {e.last_session_date
                  ? new Date(e.last_session_date).toLocaleDateString("zh-TW")
                  : "—"}
              </td>
              <td className="p-3 whitespace-nowrap">{e.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
