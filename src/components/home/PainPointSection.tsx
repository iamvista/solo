import { MessageCircleQuestion, Clock, TrendingDown, UserX } from "lucide-react";

const painPoints = [
  {
    icon: UserX,
    title: "有專業，但不知道怎麼賣",
    desc: "明明有十年功力，卻說不清楚自己能幫客戶什麼。",
  },
  {
    icon: Clock,
    title: "時間全被客戶吃掉",
    desc: "做完這個專案接下一個，永遠在用時間換錢。",
  },
  {
    icon: TrendingDown,
    title: "收入不穩定，看天吃飯",
    desc: "這個月案子多、下個月就空窗，沒有穩定的客戶來源。",
  },
  {
    icon: MessageCircleQuestion,
    title: "想做線上課程，不知從何開始",
    desc: "聽說要架網站、搞金流、做行銷，光想就頭大。",
  },
];

export function PainPointSection() {
  return (
    <section id="pain-points" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            聽起來熟悉嗎？
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            一個人做事業，這些問題你一定遇過
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex gap-4 rounded-2xl border border-stone-100 bg-stone-50/50 p-6 transition-colors hover:border-stone-200 hover:bg-stone-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-base text-stone-500 sm:mt-12">
          如果你點頭了，
          <span className="font-medium text-stone-800">
            那你來對地方了。
          </span>
        </p>
      </div>
    </section>
  );
}
