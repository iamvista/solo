import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 課程列表
const courses = [
  {
    id: "solo-starter",
    emoji: "🚀",
    title: "Solo 新手起步班",
    subtitle: "從零開始的自由工作者入門",
    description: "為想成為自由工作者的你設計。學習如何找到定位、設定價格、獲得第一個客戶。",
    duration: "4 週",
    lessons: 12,
    level: "入門",
    price: "即將公佈",
    status: "coming_soon",
    features: [
      "找到你的利基市場",
      "設計你的服務方案",
      "定價策略與報價技巧",
      "獲得第一個付費客戶",
    ],
  },
  {
    id: "solo-growth",
    emoji: "📈",
    title: "Solo 事業成長班",
    subtitle: "穩定收入到規模化",
    description: "適合已有穩定接案但想突破的你。學習如何提升單價、建立被動收入、打造可擴展的事業模式。",
    duration: "6 週",
    lessons: 18,
    level: "進階",
    price: "即將公佈",
    status: "coming_soon",
    features: [
      "從時間計費到價值定價",
      "建立多元收入來源",
      "打造可規模化的服務",
      "建立個人品牌影響力",
    ],
  },
  {
    id: "solo-mastery",
    emoji: "🏆",
    title: "Solo 大師班",
    subtitle: "成為業界意見領袖",
    description: "為資深自由工作者設計。學習如何建立團隊、授權經營、成為領域專家。",
    duration: "8 週",
    lessons: 24,
    level: "專家",
    price: "即將公佈",
    status: "coming_soon",
    features: [
      "從獨自一人到小團隊",
      "建立授權與聯盟模式",
      "出版與媒體曝光策略",
      "打造長青的個人事業",
    ],
  },
];

// 免費迷你課程
const freeCourses = [
  {
    id: "pricing-101",
    emoji: "💰",
    title: "定價入門：停止賤賣自己",
    description: "3 堂課學會如何制定讓客戶願意付、自己也滿意的價格",
    lessons: 3,
    status: "coming_soon",
  },
  {
    id: "first-client",
    emoji: "🤝",
    title: "第一個客戶：從 0 到 1",
    description: "5 堂課帶你獲得第一個付費客戶",
    lessons: 5,
    status: "coming_soon",
  },
  {
    id: "personal-brand",
    emoji: "✨",
    title: "個人品牌基礎班",
    description: "4 堂課建立你的專業形象",
    lessons: 4,
    status: "coming_soon",
  },
];

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
          🎓 系統化學習
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          課程
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
          從新手到大師，為自由工作者設計的完整學習路徑
        </p>
      </div>

      {/* 診斷 CTA */}
      <Card className="mt-10 border-primary/20 bg-primary/5 sm:mt-12">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-5 sm:flex-row sm:p-6">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold">不知道該上哪堂課？</h3>
            <p className="mt-1 text-base text-muted-foreground">
              先做個診斷，根據結果推薦最適合你的課程
            </p>
          </div>
          <Button asChild className="h-11 px-6 text-base">
            <Link href="/diagnose">免費診斷</Link>
          </Button>
        </CardContent>
      </Card>

      {/* 免費迷你課程 */}
      <div className="mt-14 sm:mt-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">免費迷你課程</h2>
            <p className="mt-1 text-base text-muted-foreground sm:text-lg">先從這裡開始，零成本體驗</p>
          </div>
          <Badge variant="outline" className="hidden text-sm sm:block">免費</Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {freeCourses.map((course) => (
            <Card
              key={course.id}
              className={`transition-all ${
                course.status === "available"
                  ? "hover:border-primary/50 hover:shadow-md cursor-pointer"
                  : "opacity-80"
              }`}
            >
              <CardHeader className="p-5 pb-2 sm:p-6 sm:pb-2">
                <div className="flex items-start justify-between">
                  <span className="text-4xl sm:text-5xl">{course.emoji}</span>
                  {course.status === "coming_soon" && (
                    <Badge variant="secondary" className="text-xs">即將推出</Badge>
                  )}
                </div>
                <CardTitle className="mt-3 text-lg sm:text-xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <CardDescription className="text-base">{course.description}</CardDescription>
                <p className="mt-3 text-base text-muted-foreground">
                  📚 {course.lessons} 堂課
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 完整課程 */}
      <div className="mt-16 sm:mt-20">
        <div className="text-center">
          <h2 className="text-xl font-bold sm:text-2xl">完整課程</h2>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">系統化的學習路徑，帶你一步步成長</p>
        </div>

        <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
          {courses.map((course, index) => (
            <Card
              key={course.id}
              className={`overflow-hidden ${
                course.status === "available"
                  ? "hover:border-primary/50 hover:shadow-lg"
                  : ""
              }`}
            >
              <div className="grid md:grid-cols-3">
                <div className={`p-6 sm:p-8 ${
                  index === 0 ? "bg-green-50" :
                  index === 1 ? "bg-blue-50" :
                  "bg-purple-50"
                }`}>
                  <div className="text-center">
                    <span className="text-6xl sm:text-7xl">{course.emoji}</span>
                    <div className="mt-4">
                      <Badge className="text-sm" variant={
                        course.level === "入門" ? "secondary" :
                        course.level === "進階" ? "default" :
                        "outline"
                      }>
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold sm:text-2xl">{course.title}</h3>
                      <p className="text-base text-muted-foreground sm:text-lg">{course.subtitle}</p>
                    </div>
                    {course.status === "coming_soon" && (
                      <Badge variant="secondary" className="ml-2 shrink-0">即將推出</Badge>
                    )}
                  </div>
                  <p className="mt-4 text-base text-muted-foreground">{course.description}</p>

                  <div className="mt-6 flex flex-wrap gap-4 text-base text-muted-foreground">
                    <span>⏱️ {course.duration}</span>
                    <span>📚 {course.lessons} 堂課</span>
                    <span>💰 {course.price}</span>
                  </div>

                  <div className="mt-6">
                    <p className="text-base font-medium mb-3">你將學到：</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {course.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-base text-muted-foreground">
                          <span className="text-primary">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {course.status === "available" ? (
                    <Button className="mt-6 h-11 px-6 text-base" asChild>
                      <Link href={`/courses/${course.id}`}>了解更多</Link>
                    </Button>
                  ) : (
                    <Button className="mt-6 h-11 px-6 text-base" variant="outline" disabled>
                      敬請期待
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 企業培訓 */}
      <Card className="mt-16 bg-muted sm:mt-20">
        <CardContent className="p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-xl font-bold sm:text-2xl">企業內訓 / 客製課程</h3>
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                為企業量身打造的培訓方案，幫助員工發展斜槓能力或培養內部講師
              </p>
              <ul className="mt-4 space-y-3 text-base text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  根據企業需求客製內容
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  可選擇線上或實體課程
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  提供課後追蹤與輔導
                </li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <Button asChild className="h-11 px-6 text-base">
                <a href="mailto:iamvista@gmail.com">
                  聯繫洽談
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 電子報訂閱 */}
      <div className="mt-14 text-center sm:mt-16">
        <p className="text-base text-muted-foreground sm:text-lg">
          想在新課程上線時第一時間收到通知？
        </p>
        <Button variant="outline" className="mt-4 h-11 px-6 text-base" asChild>
          <Link href="/#newsletter">訂閱電子報</Link>
        </Button>
      </div>
    </div>
  );
}
