import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

const SUBSTACK_URL = "https://iamvista.substack.com/";

export function NewsletterSection() {
  return (
    <section id="newsletter" className="bg-stone-900 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 sm:h-20 sm:w-20">
            <Mail className="h-8 w-8 text-stone-900 sm:h-10 sm:w-10" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            每週一封，Solo 成長指南
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-400 sm:mt-6 sm:text-xl">
            自由工作者的實戰心法、AI 應用技巧、個人品牌經營秘訣。
            <br className="hidden sm:block" />
            <span className="font-semibold text-amber-400">
              {SOCIAL_PROOF.newsletterSubscribers}
            </span>{" "}
            位讀者都在看。
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
            <Button
              size="lg"
              asChild
              className="h-14 w-full bg-gradient-to-r from-amber-400 to-amber-500 px-8 text-base font-semibold text-stone-900 hover:from-amber-500 hover:to-amber-600 sm:w-auto sm:text-lg"
            >
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                免費訂閱電子報
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="text-sm text-stone-600">
              由 Substack 寄送，隨時可取消訂閱
            </p>
          </div>

          {/* 內容預覽 */}
          <div className="mx-auto mt-10 grid max-w-lg gap-3 text-left sm:mt-12">
            {[
              "一人事業的 AI 工具箱（每週更新）",
              "工作坊與課程的第一手開課通知",
              "經營心得、踩過的坑、實戰覆盤",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-800/30 px-4 py-3"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-stone-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
