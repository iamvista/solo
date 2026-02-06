import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin, getUserList } from "@/lib/supabase/admin";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 驗證管理員權限
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect("/");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { users, total, totalPages } = await getUserList(page, 20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">🔐 管理員專區</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">用戶管理</h1>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">
            共 {total} 位用戶
          </p>
        </div>
        <Button variant="outline" asChild className="h-11 px-4 text-base">
          <Link href="/admin">← 返回後台</Link>
        </Button>
      </div>

      {/* 用戶列表 */}
      <Card>
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">👥 用戶名單</CardTitle>
          <CardDescription className="text-base">
            包含電子報訂閱狀態和診斷次數
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          {/* 表格標題 */}
          <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-muted rounded-lg mb-4 font-medium text-sm">
            <div className="col-span-2">用戶</div>
            <div>電子報</div>
            <div>會員等級</div>
            <div>診斷次數</div>
            <div>註冊日期</div>
          </div>

          {/* 用戶列表 */}
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                {/* 用戶資訊 */}
                <div className="col-span-2 flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                      {(user.display_name || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user.display_name || "未設定"}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {user.email || "無 Email"}
                    </p>
                  </div>
                </div>

                {/* 電子報訂閱 */}
                <div className="flex items-center">
                  <Badge
                    variant={user.subscribe_newsletter ? "default" : "secondary"}
                    className={user.subscribe_newsletter ? "bg-green-100 text-green-700" : ""}
                  >
                    {user.subscribe_newsletter ? "✓ 已訂閱" : "未訂閱"}
                  </Badge>
                </div>

                {/* 會員等級 */}
                <div className="flex items-center">
                  <Badge variant="outline">
                    {user.membership_tier === "pro" ? "Pro" : user.membership_tier === "premium" ? "Premium" : "Free"}
                  </Badge>
                </div>

                {/* 診斷次數 */}
                <div className="flex items-center">
                  <span className="text-muted-foreground">{user.diagnosisCount} 次</span>
                </div>

                {/* 註冊日期 */}
                <div className="flex items-center text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("zh-TW")}
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              尚無用戶資料
            </div>
          )}

          {/* 分頁 */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link href={`/admin/users?page=${page - 1}`}>上一頁</Link>
                ) : (
                  "上一頁"
                )}
              </Button>
              <span className="px-4 text-sm text-muted-foreground">
                第 {page} / {totalPages} 頁
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <Link href={`/admin/users?page=${page + 1}`}>下一頁</Link>
                ) : (
                  "下一頁"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
