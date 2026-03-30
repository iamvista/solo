import { SOCIAL_PROOF } from "@/lib/constants";

const testimonials = [
  {
    quote: "工作坊隔天就把學到的 AI 工具用在工作上了，效率直接翻倍。",
    name: "小方",
    role: "自由接案設計師",
    emoji: "🎨",
  },
  {
    quote: "事業健檢讓我第一次看清自己的弱項在哪，終於知道該優先處理什麼。",
    name: "Kevin",
    role: "獨立顧問",
    emoji: "📊",
  },
  {
    quote: "一對一諮詢比我自己摸索半年還有用，方向清楚了很多。",
    name: "Mia",
    role: "線上課程講師",
    emoji: "🎯",
  },
];

const stats = [
  { number: SOCIAL_PROOF.diagnoseCount, label: "事業健檢完成" },
  { number: SOCIAL_PROOF.workshopCount, label: "場工作坊舉辦" },
  { number: SOCIAL_PROOF.newsletterSubscribers, label: "電子報讀者" },
  { number: SOCIAL_PROOF.consultingHours, label: "小時諮詢累計" },
];

export function SocialProofSection() {
  return (
    <section id="social-proof" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 數字區 */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-stone-900 sm:text-4xl">
                {stat.number}
              </p>
              <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 分隔 */}
        <div className="mx-auto my-12 max-w-xs border-t border-stone-200 sm:my-16" />

        {/* 學員回饋 */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            學員怎麼說
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            真實的改變，來自真實的行動
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-stone-100 bg-stone-50/50 p-6 transition-colors hover:border-stone-200"
            >
              {/* 引號裝飾 */}
              <svg
                className="h-8 w-8 text-primary/20"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <p className="mt-3 flex-1 text-base leading-relaxed text-stone-700">
                {t.quote}
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-lg">
                  {t.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
