"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (!email) {
      e.preventDefault();
      return;
    }
    setIsSubmitting(true);
    // Form will submit to Substack naturally
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 sm:h-20 sm:w-20">
            <svg
              className="h-8 w-8 text-slate-900 sm:h-10 sm:w-10"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            每週一封，Solo 成長指南
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300 sm:mt-6 sm:text-xl">
            自由工作者的實戰心法、接案技巧、個人品牌經營秘訣
            <br className="hidden sm:block" />
            <span className="text-amber-400">16,000+ 位讀者</span>都在看
          </p>

          {/* Substack Form */}
          <form
            action="https://iamvista.substack.com/api/v1/free?nojs=true"
            method="post"
            target="_blank"
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <Input
              type="email"
              name="email"
              placeholder="輸入你的 Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 flex-1 border-slate-600 bg-slate-800/50 text-base text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400 sm:h-14 sm:text-lg"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 bg-gradient-to-r from-amber-400 to-amber-500 px-6 text-base font-semibold text-slate-900 hover:from-amber-500 hover:to-amber-600 sm:h-14 sm:px-8 sm:text-lg"
            >
              {isSubmitting ? "訂閱中..." : "免費訂閱 →"}
            </Button>
          </form>

          {/* Trust Badge */}
          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            📧 隨時可以取消訂閱，我們尊重你的信箱
          </p>
        </div>
      </div>
    </section>
  );
}
