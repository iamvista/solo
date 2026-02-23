import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workshops, categories } from "@/lib/workshops";
import type { Workshop, WorkshopCategory } from "@/lib/workshops";

export const metadata: Metadata = {
  title: "課程與工作坊 | solo.tw",
  description:
    "精選實戰課程與工作坊，涵蓋 AI 應用、樂齡理財、創新思維。小班制、重產出、即學即用。",
  openGraph: {
    title: "課程與工作坊 | solo.tw",
    description:
      "精選實戰課程與工作坊，涵蓋 AI 應用、樂齡理財、創新思維。小班制、重產出、即學即用。",
  },
};

function formatPrice(price: number): string {
  return `NT$${price.toLocaleString()}`;
}

const statusLabels: Record<
  Workshop["status"],
  { text: string; variant: "default" | "secondary" | "outline" }
> = {
  open: { text: "熱烈報名中", variant: "default" },
  filling: { text: "即將額滿", variant: "default" },
  full: { text: "已額滿", variant: "secondary" },
  coming_soon: { text: "即將開放", variant: "outline" },
};

/* ─── Featured Course Card ─── */
function FeaturedCourseCard({ workshop }: { workshop: Workshop }) {
  const status = statusLabels[workshop.status];

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-[#1E3A5F]/5 to-[#C8953D]/5 transition-all hover:shadow-xl">
      <CardContent className="p-0">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Left: Content */}
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Badge variant={status.variant} className="text-xs">
                {status.text}
              </Badge>
              <Badge variant="outline" className="border-[#C8953D]/40 text-[#C8953D] text-xs">
                新課程
              </Badge>
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {workshop.title}
            </h3>
            <p className="mt-2 text-lg text-muted-foreground">
              {workshop.subtitle}
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              {workshop.description}
            </p>

            {/* Instructor */}
            <div className="mt-4 flex items-center gap-3">
              {workshop.instructor.avatar && (
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={workshop.instructor.avatar}
                    alt={workshop.instructor.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{workshop.instructor.name}</p>
                <p className="text-xs text-muted-foreground">
                  {workshop.instructor.title}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">📅 {workshop.date}</span>
              <span className="flex items-center gap-1.5">🕘 {workshop.time}</span>
              <span className="flex items-center gap-1.5">👥 限 {workshop.capacity} 名</span>
            </div>

            {/* Price + CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div>
                {workshop.price.earlyBird ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatPrice(workshop.price.earlyBird)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(workshop.price.original)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">
                    {formatPrice(workshop.price.original)}
                  </span>
                )}
              </div>
              <Button size="lg" className="h-11 px-6 text-base sm:ml-auto" asChild>
                <Link href={workshop.url}>了解更多</Link>
              </Button>
            </div>
          </div>

          {/* Right: Highlights */}
          <div className="flex flex-col justify-center border-t bg-muted/30 p-6 sm:p-8 md:border-t-0 md:border-l">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              課程亮點
            </p>
            <ul className="mt-4 space-y-3">
              {workshop.highlights.map((highlight, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-base"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C8953D]/10 text-xs font-bold text-[#C8953D]">
                    {i + 1}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {workshop.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Regular Workshop Card ─── */
function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const status = statusLabels[workshop.status];
  const LinkWrapper = workshop.isExternal ? "a" : Link;
  const linkProps = workshop.isExternal
    ? {
        href: workshop.url,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : { href: workshop.url };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg">
      {/* 卡片頂部色塊 */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between">
          <span className="text-4xl sm:text-5xl">{workshop.emoji}</span>
          <Badge variant={status.variant} className="text-xs shrink-0">
            {status.text}
          </Badge>
        </div>
        <CardTitle className="mt-3 text-lg leading-tight sm:text-xl">
          {workshop.title}
        </CardTitle>
        <CardDescription className="mt-1.5 text-sm text-muted-foreground">
          {workshop.subtitle}
        </CardDescription>
      </div>

      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        {/* 講師 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {workshop.instructor.avatar && (
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
              <Image
                src={workshop.instructor.avatar}
                alt={workshop.instructor.name}
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <span className="font-medium text-foreground">
            {workshop.instructor.name}
          </span>
          <span className="text-muted-foreground/60">|</span>
          <span>{workshop.instructor.title}</span>
        </div>

        {/* 標籤 */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {workshop.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Meta 資訊 */}
        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{workshop.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🕘</span>
            <span>
              {workshop.time}（{workshop.duration}）
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{workshop.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>限 {workshop.capacity} 名</span>
          </div>
        </div>

        {/* 亮點 */}
        <ul className="mt-4 space-y-1.5">
          {workshop.highlights.map((highlight, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-0.5 text-primary">✓</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* 價格 + CTA */}
        <div className="mt-auto pt-5">
          <div className="mb-3">
            {workshop.price.earlyBird ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(workshop.price.earlyBird)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(workshop.price.original)}
                </span>
                {workshop.price.earlyBirdDeadline && (
                  <Badge variant="outline" className="text-xs">
                    早鳥 {workshop.price.earlyBirdDeadline}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-xl font-bold text-foreground">
                {formatPrice(workshop.price.original)}
              </span>
            )}
          </div>

          {workshop.status === "full" ? (
            <Button className="h-11 w-full text-base" disabled>
              已額滿
            </Button>
          ) : (
            <Button className="h-11 w-full text-base" asChild>
              <LinkWrapper {...linkProps}>
                {workshop.isExternal ? (
                  <span className="flex items-center gap-1.5">
                    前往報名
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </span>
                ) : (
                  "了解更多"
                )}
              </LinkWrapper>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Category Section ─── */
function CategorySection({
  categoryKey,
  items,
}: {
  categoryKey: WorkshopCategory;
  items: Workshop[];
}) {
  const cat = categories[categoryKey];
  return (
    <section>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{cat.emoji}</span>
        <h2 className="text-xl font-bold sm:text-2xl">{cat.label}</h2>
        <Badge variant="secondary" className="text-xs">
          {items.length} 門課程
        </Badge>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} />
        ))}
      </div>
    </section>
  );
}

/* ─── Page ─── */
export default function CoursesPage() {
  const featuredWorkshop = workshops.find((w) => w.featured);
  const nonFeatured = workshops.filter((w) => !w.featured);

  // Group by category (preserving order)
  const grouped = nonFeatured.reduce(
    (acc, workshop) => {
      if (!acc[workshop.category]) {
        acc[workshop.category] = [];
      }
      acc[workshop.category].push(workshop);
      return acc;
    },
    {} as Record<WorkshopCategory, Workshop[]>,
  );

  const categoryOrder: WorkshopCategory[] = ["ai", "innovation", "finance"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Hero */}
      <div className="text-center">
        <Badge
          variant="secondary"
          className="mb-4 px-4 py-2 text-sm sm:text-base"
        >
          🎓 課程與工作坊
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          與頂尖講師一起
          <br className="sm:hidden" />
          <span className="gradient-text">升級你的專業能力</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
          精選實戰課程，涵蓋 AI 應用、樂齡理財、創新思維
          <br className="hidden sm:block" />
          小班制、重產出、即學即用
        </p>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8 sm:gap-12">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground sm:text-3xl">
              {workshops.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">門精選課程</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground sm:text-3xl">10</p>
            <p className="mt-1 text-sm text-muted-foreground">人小班制</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground sm:text-3xl">
              100%
            </p>
            <p className="mt-1 text-sm text-muted-foreground">實戰導向</p>
          </div>
        </div>
      </div>

      {/* Featured Course */}
      {featuredWorkshop && (
        <div className="mt-14 sm:mt-16">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 w-8 rounded-full bg-[#C8953D]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-[#C8953D]">
              精選課程
            </span>
          </div>
          <FeaturedCourseCard workshop={featuredWorkshop} />
        </div>
      )}

      {/* Category Sections */}
      <div className="mt-16 space-y-14 sm:mt-20 sm:space-y-16">
        {categoryOrder.map((catKey) => {
          const items = grouped[catKey];
          if (!items || items.length === 0) return null;
          return (
            <CategorySection
              key={catKey}
              categoryKey={catKey}
              items={items}
            />
          );
        })}
      </div>

      {/* 特色區 */}
      <div className="mt-16 sm:mt-20">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
              👥
            </div>
            <h3 className="mt-4 text-lg font-semibold">小班制教學</h3>
            <p className="mt-2 text-base text-muted-foreground">
              每班限額 10 人，確保每位學員都能獲得充分的指導與互動
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
              🛠️
            </div>
            <h3 className="mt-4 text-lg font-semibold">實戰導向</h3>
            <p className="mt-2 text-base text-muted-foreground">
              不只教理論，現場動手做。帶著你的問題來，帶著成果走
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
              🌟
            </div>
            <h3 className="mt-4 text-lg font-semibold">多元講師陣容</h3>
            <p className="mt-2 text-base text-muted-foreground">
              匯聚各領域專家，從 AI 應用到創新思維，提供全方位學習體驗
            </p>
          </div>
        </div>
      </div>

      {/* 企業內訓 */}
      <Card className="mt-16 bg-muted sm:mt-20">
        <CardContent className="p-6 sm:p-8">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold sm:text-2xl">
                企業內訓 / 客製工作坊
              </h3>
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                為團隊量身打造的培訓方案，涵蓋 AI
                應用、創新思維、內容經營等主題
              </p>
              <ul className="mt-4 space-y-3 text-base text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  根據團隊需求客製內容
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
                <a href="mailto:iamvista@gmail.com">聯繫洽談</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 電子報 */}
      <div className="mt-14 text-center sm:mt-16">
        <p className="text-base text-muted-foreground sm:text-lg">
          想在新工作坊上線時第一時間收到通知？
        </p>
        <Button
          variant="outline"
          className="mt-4 h-11 px-6 text-base"
          asChild
        >
          <Link href="/#newsletter">訂閱電子報</Link>
        </Button>
      </div>
    </div>
  );
}
