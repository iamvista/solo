"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Step {
  number: string;
  title: string;
  image: string;
}

export default function StepGallery({ steps }: { steps: Step[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : steps.length - 1));
  }, [steps.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null && i < steps.length - 1 ? i + 1 : 0));
  }, [steps.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIndex, close, prev, next]);

  return (
    <>
      {/* Grid of step cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <button
            key={step.number}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group cursor-pointer overflow-hidden rounded-xl border bg-card text-left transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={step.image}
                alt={`步驟 ${step.number}：${step.title}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover overlay hint */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
                <span className="rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-foreground opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
                  🔍 點擊放大
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <span className="text-2xl font-bold text-primary/30">
                {step.number}
              </span>
              <span className="text-base font-medium">{step.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`步驟 ${steps[activeIndex].number}：${steps[activeIndex].title}`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="關閉"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            aria-label="上一步"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            aria-label="下一步"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Image container */}
          <div
            className="relative mx-16 max-h-[85vh] max-w-5xl sm:mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={steps[activeIndex].image}
              alt={`步驟 ${steps[activeIndex].number}：${steps[activeIndex].title}`}
              width={1920}
              height={1280}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
              sizes="90vw"
              priority
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                  {steps[activeIndex].number}
                </span>
                <span className="text-lg font-medium text-white sm:text-xl">
                  {steps[activeIndex].title}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/60">
                {activeIndex + 1} / {steps.length} ・按 ← → 切換，ESC 關閉
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
