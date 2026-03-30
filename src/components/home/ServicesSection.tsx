import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Video, BookOpen, FileDown, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Users,
    tag: "實體 / 線上",
    title: "AI 工作坊",
    desc: "小班制、手把手帶你用 AI 打造個人事業的武器庫。從社群內容到指揮中心，即學即用。",
    price: "NT$2,500 起",
    cta: "查看近期場次",
    href: "/courses",
    highlight: true,
  },
  {
    icon: Video,
    tag: "1 對 1",
    title: "諮詢 & 陪跑",
    desc: "不確定下一步？先聊 30 分鐘免費初談，覺得適合再深入合作。",
    price: "免費初談",
    cta: "預約免費初談",
    href: "/consulting",
    highlight: false,
  },
  {
    icon: BookOpen,
    tag: "線上課程",
    title: "系統化學習",
    desc: "Vibe Coding、AI 內容產製……把工作坊精華濃縮成隨時都能看的線上課程。",
    price: "NT$2,980 起",
    cta: "瀏覽課程",
    href: "https://learn.solo.tw",
    highlight: false,
  },
  {
    icon: FileDown,
    tag: "即買即用",
    title: "模板 & 工具包",
    desc: "不用從零開始。下載 Notion 模板、Prompt 工具包，直接套用到你的事業。",
    price: "NT$300 起",
    cta: "查看產品",
    href: "/products",
    highlight: false,
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="bg-gradient-to-b from-white to-stone-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            我能幫你的
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            從卡住到起飛，選擇你需要的支援
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            不管你是剛開始、正在成長、還是想突破瓶頸，都有適合的方式。
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:mt-16 sm:grid-cols-2 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            const isExternal = service.href.startsWith("http");
            return (
              <div
                key={service.title}
                className={`group relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-8 ${
                  service.highlight
                    ? "border-primary/30 shadow-primary/5 ring-1 ring-primary/10"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                {service.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    最多人選擇
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      service.highlight
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                    {service.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-stone-900">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                  {service.desc}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
                  <span className="text-lg font-bold text-stone-900">
                    {service.price}
                  </span>
                  <Button
                    variant={service.highlight ? "default" : "outline"}
                    size="sm"
                    asChild
                    className={
                      service.highlight
                        ? "shadow-sm shadow-primary/15"
                        : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }
                  >
                    <Link
                      href={service.href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {service.cta}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
