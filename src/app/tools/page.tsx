import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 工具分類
const toolCategories = [
  {
    id: "pricing",
    name: "定價與報價",
    emoji: "💰",
    description: "幫助你制定合理價格，提升報價信心",
    tools: [
      {
        id: "hourly-rate-calculator",
        name: "時薪計算器",
        description: "根據收入目標反推你的最低時薪",
        status: "coming_soon",
      },
      {
        id: "project-quote-template",
        name: "專案報價模板",
        description: "專業的報價單模板，提升成交率",
        status: "coming_soon",
      },
      {
        id: "value-pricing-guide",
        name: "價值定價指南",
        description: "從時間計費轉向價值定價的方法",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "client",
    name: "客戶管理",
    emoji: "🤝",
    description: "優化客戶關係，提高回購與轉介紹",
    tools: [
      {
        id: "client-intake-form",
        name: "客戶需求訪談表",
        description: "初次接洽時的標準問題清單",
        status: "coming_soon",
      },
      {
        id: "contract-template",
        name: "服務合約範本",
        description: "保護雙方權益的合約模板",
        status: "coming_soon",
      },
      {
        id: "testimonial-request",
        name: "客戶見證邀請模板",
        description: "有效收集客戶推薦的郵件範本",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "productivity",
    name: "效率工具",
    emoji: "⚡",
    description: "提升工作效率，做更少賺更多",
    tools: [
      {
        id: "time-blocking",
        name: "時間區塊規劃表",
        description: "用時間區塊法管理自由工作者的一天",
        status: "coming_soon",
      },
      {
        id: "project-tracker",
        name: "專案進度追蹤表",
        description: "簡單有效的專案管理模板",
        status: "coming_soon",
      },
      {
        id: "sop-template",
        name: "SOP 建立指南",
        description: "將重複工作標準化的模板",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "marketing",
    name: "行銷推廣",
    emoji: "📣",
    description: "建立個人品牌，吸引理想客戶",
    tools: [
      {
        id: "elevator-pitch",
        name: "30 秒自我介紹產生器",
        description: "建立清晰有力的價值陳述",
        status: "coming_soon",
      },
      {
        id: "portfolio-checklist",
        name: "作品集檢查清單",
        description: "確保作品集完整且吸引人",
        status: "coming_soon",
      },
      {
        id: "linkedin-profile",
        name: "LinkedIn 優化指南",
        description: "打造吸引客戶的專業檔案",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "finance",
    name: "財務規劃",
    emoji: "📊",
    description: "管理收支，建立財務安全感",
    tools: [
      {
        id: "income-tracker",
        name: "收入追蹤表",
        description: "追蹤多元收入來源的模板",
        status: "coming_soon",
      },
      {
        id: "tax-checklist",
        name: "自由工作者報稅清單",
        description: "臺灣自由工作者的稅務注意事項",
        status: "coming_soon",
      },
      {
        id: "emergency-fund",
        name: "緊急預備金計算器",
        description: "計算你需要多少安全儲備",
        status: "coming_soon",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          🛠️ 實用資源
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Solo 工具箱
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          為自由工作者精心準備的模板、計算器和指南，幫助你更有效率地經營事業
        </p>
      </div>

      {/* 診斷 CTA */}
      <Card className="mt-12 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold">還不確定該從哪裡開始？</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              先做個事業診斷，了解你最需要加強的面向
            </p>
          </div>
          <Button asChild>
            <Link href="/diagnose">免費診斷</Link>
          </Button>
        </CardContent>
      </Card>

      {/* 工具分類 */}
      <div className="mt-16 space-y-16">
        {toolCategories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.tools.map((tool) => (
                <Card
                  key={tool.id}
                  className={`transition-all ${
                    tool.status === "available"
                      ? "hover:border-primary/50 hover:shadow-md cursor-pointer"
                      : "opacity-75"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.status === "coming_soon" && (
                        <Badge variant="secondary" className="text-xs">
                          即將推出
                        </Badge>
                      )}
                      {tool.status === "available" && (
                        <Badge variant="default" className="text-xs">
                          可使用
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                    {tool.status === "available" && (
                      <Button size="sm" className="mt-4" asChild>
                        <Link href={`/tools/${tool.id}`}>使用工具</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 底部 CTA */}
      <Card className="mt-16 bg-muted">
        <CardContent className="py-8 text-center">
          <h3 className="text-xl font-bold">想要更多工具？</h3>
          <p className="mt-2 text-muted-foreground">
            我們正在持續開發更多實用工具，訂閱電子報第一時間收到通知
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="outline" asChild>
              <Link href="/#newsletter">訂閱電子報</Link>
            </Button>
            <Button variant="ghost" asChild>
              <a href="mailto:iamvista@gmail.com">
                建議新工具
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
