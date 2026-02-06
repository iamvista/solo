import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 學習主題
const learningTopics = [
  {
    id: "positioning",
    emoji: "🎯",
    name: "市場定位",
    description: "找到你的利基，建立獨特價值主張",
    articles: [
      {
        id: "find-your-niche",
        title: "如何找到你的利基市場？",
        description: "從興趣、專長、市場需求的交集找到定位",
        readTime: "8 分鐘",
        status: "coming_soon",
      },
      {
        id: "ideal-client-avatar",
        title: "打造理想客戶頭像",
        description: "清楚知道你要服務誰，才能吸引對的人",
        readTime: "6 分鐘",
        status: "coming_soon",
      },
      {
        id: "unique-value-proposition",
        title: "寫出有力的價值主張",
        description: "讓客戶一眼就知道為什麼選你",
        readTime: "5 分鐘",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "pricing",
    emoji: "💰",
    name: "定價策略",
    description: "從時間計費轉向價值定價",
    articles: [
      {
        id: "value-based-pricing",
        title: "價值定價入門指南",
        description: "不再用時間換錢的定價心法",
        readTime: "10 分鐘",
        status: "coming_soon",
      },
      {
        id: "raise-your-rates",
        title: "什麼時候該調漲價格？",
        description: "克服漲價恐懼的實戰建議",
        readTime: "7 分鐘",
        status: "coming_soon",
      },
      {
        id: "package-services",
        title: "如何包裝你的服務？",
        description: "設計讓客戶容易決定的方案",
        readTime: "8 分鐘",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "clients",
    emoji: "🤝",
    name: "客戶經營",
    description: "建立信任，創造口碑推薦",
    articles: [
      {
        id: "first-client",
        title: "如何獲得第一個客戶？",
        description: "新手自由工作者的起步策略",
        readTime: "9 分鐘",
        status: "coming_soon",
      },
      {
        id: "referral-system",
        title: "建立轉介紹系統",
        description: "讓滿意客戶主動幫你推薦",
        readTime: "6 分鐘",
        status: "coming_soon",
      },
      {
        id: "say-no",
        title: "學會說不的藝術",
        description: "拒絕不適合的客戶反而更成功",
        readTime: "5 分鐘",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "productivity",
    emoji: "⚡",
    name: "效率提升",
    description: "做更少，賺更多",
    articles: [
      {
        id: "time-management",
        title: "自由工作者的時間管理",
        description: "沒有老闆盯時如何自律？",
        readTime: "8 分鐘",
        status: "coming_soon",
      },
      {
        id: "automation",
        title: "自動化你的重複工作",
        description: "用工具省下寶貴時間",
        readTime: "7 分鐘",
        status: "coming_soon",
      },
      {
        id: "deep-work",
        title: "深度工作的力量",
        description: "專注是自由工作者的超能力",
        readTime: "6 分鐘",
        status: "coming_soon",
      },
    ],
  },
  {
    id: "business",
    emoji: "📈",
    name: "事業成長",
    description: "從接案到建立可擴展的事業",
    articles: [
      {
        id: "multiple-income",
        title: "打造多元收入來源",
        description: "降低風險，增加穩定性",
        readTime: "9 分鐘",
        status: "coming_soon",
      },
      {
        id: "productize",
        title: "將服務產品化",
        description: "不靠時間也能賺錢的模式",
        readTime: "10 分鐘",
        status: "coming_soon",
      },
      {
        id: "build-team",
        title: "從獨自一人到小團隊",
        description: "何時、如何開始找幫手？",
        readTime: "8 分鐘",
        status: "coming_soon",
      },
    ],
  },
];

// 精選資源
const featuredResources = [
  {
    type: "guide",
    title: "自由工作者起步指南",
    description: "從零開始成為自由工作者的完整路線圖",
    emoji: "📘",
    status: "coming_soon",
  },
  {
    type: "checklist",
    title: "Solo 事業體質檢查表",
    description: "20 個問題診斷你的事業健康度",
    emoji: "✅",
    status: "coming_soon",
  },
  {
    type: "template",
    title: "客戶溝通範本大全",
    description: "從報價到收款的郵件模板",
    emoji: "📝",
    status: "coming_soon",
  },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          📚 學習成長
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          學習資源
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          實戰導向的文章與指南，幫助你建立成功的自由事業
        </p>
      </div>

      {/* 精選資源 */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">精選資源</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {featuredResources.map((resource) => (
            <Card
              key={resource.title}
              className="relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-md"
            >
              {resource.status === "coming_soon" && (
                <div className="absolute right-4 top-4">
                  <Badge variant="secondary" className="text-xs">即將推出</Badge>
                </div>
              )}
              <CardHeader>
                <span className="text-4xl">{resource.emoji}</span>
                <CardTitle className="mt-2">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* 診斷 CTA */}
      <Card className="mt-12 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold">不知道該學什麼？</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              做個診斷，找出你最需要加強的面向
            </p>
          </div>
          <Button asChild>
            <Link href="/diagnose">免費診斷</Link>
          </Button>
        </CardContent>
      </Card>

      {/* 學習主題 */}
      <div className="mt-16 space-y-16">
        {learningTopics.map((topic) => (
          <div key={topic.id}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{topic.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold">{topic.name}</h2>
                <p className="text-muted-foreground">{topic.description}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.articles.map((article) => (
                <Card
                  key={article.id}
                  className={`transition-all ${
                    article.status === "published"
                      ? "hover:border-primary/50 hover:shadow-md cursor-pointer"
                      : "opacity-75"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-snug">
                        {article.title}
                      </CardTitle>
                      {article.status === "coming_soon" && (
                        <Badge variant="secondary" className="ml-2 shrink-0 text-xs">
                          即將推出
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{article.description}</CardDescription>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        📖 {article.readTime}
                      </span>
                      {article.status === "published" && (
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/learn/${topic.id}/${article.id}`}>
                            閱讀 →
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 電子報訂閱 */}
      <Card className="mt-16 bg-muted">
        <CardContent className="py-8 text-center">
          <h3 className="text-xl font-bold">每週收到最新內容</h3>
          <p className="mt-2 text-muted-foreground">
            訂閱電子報，第一時間收到新文章、工具和課程資訊
          </p>
          <Button className="mt-6" asChild>
            <Link href="/#newsletter">訂閱電子報</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
