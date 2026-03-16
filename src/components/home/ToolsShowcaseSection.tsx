import Link from "next/link";

const tools = [
  {
    name: "活動報名系統",
    description: "辦工作坊、講座、線上課程。報名頁面、名額管理、確認信、候補清單，一鍵搞定。",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    status: "live",
    href: "/events",
  },
  {
    name: "名單磁鐵系統",
    description: "用電子書、免費諮詢、迷你課程吸引潛在客戶。自動收集名單、寄送感謝信、匯出資料。",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
      </svg>
    ),
    status: "coming",
    href: "#",
  },
  {
    name: "問卷調查系統",
    description: "課後問卷、市場調查、NPS 評分。多種題型、即時統計、結果分析面板。",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    status: "coming",
    href: "#",
  },
];

export function ToolsShowcaseSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary sm:text-base">
            SaaS 工具
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            你的事業工具箱
          </h2>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            別花時間自己架系統。這些工具幫你的客戶做生意，你專心做你擅長的事。
          </p>
        </div>

        {/* Tools grid */}
        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-3 lg:mt-20">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg sm:p-8"
            >
              {/* Status badge */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {tool.icon}
                </div>
                {tool.status === "live" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    已上線
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    即將推出
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold sm:text-2xl">{tool.name}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                {tool.description}
              </p>

              {tool.status === "live" ? (
                <Link
                  href={tool.href}
                  className="mt-6 inline-flex items-center text-base font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  開始使用
                  <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  🔔 加入等候名單，搶先體驗
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom highlight */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center sm:mt-16 sm:p-8">
          <p className="text-lg font-semibold sm:text-xl">
            🔗 工具之間自動串接
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            辦完活動 → 自動發問卷 → 問卷填完導向名單磁鐵。
            <br className="hidden sm:block" />
            一個人也能建立完整的客戶漏斗。
          </p>
        </div>
      </div>
    </section>
  );
}
