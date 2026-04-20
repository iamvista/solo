"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Workshop, WorkshopCategory } from "@/lib/workshops";
import { categories } from "@/lib/workshops";

/* ─── Types ─── */
type FilterCategory = "all" | WorkshopCategory;

const filterTabs: { key: FilterCategory; label: string; emoji: string }[] = [
  { key: "all", label: "全部課程", emoji: "📚" },
  { key: "ai", label: categories.ai.label, emoji: categories.ai.emoji },
  { key: "innovation", label: categories.innovation.label, emoji: categories.innovation.emoji },
  { key: "finance", label: categories.finance.label, emoji: categories.finance.emoji },
];

const statusConfig: Record<
  Workshop["status"],
  { text: string; className: string }
> = {
  open: { text: "熱烈報名中", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  filling: { text: "即將額滿", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  full: { text: "已額滿", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  coming_soon: { text: "即將開放", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

function formatPrice(price: number): string {
  return `NT$${price.toLocaleString()}`;
}

/* ─── Cover Image (convention: /images/workshops/cover-{id}.webp) ─── */
function getCoverImage(id: string): string {
  return `/images/workshops/cover-${id}.webp`;
}

/* ─── Workshop Card ─── */
function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const status = statusConfig[workshop.status];
  const coverSrc = getCoverImage(workshop.id);
  const LinkWrapper = workshop.isExternal ? "a" : Link;
  const linkProps = workshop.isExternal
    ? { href: workshop.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : { href: workshop.url };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* Cover Image — clickable */}
      <LinkWrapper {...linkProps} className="relative block aspect-[16/9] overflow-hidden bg-stone-100">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={workshop.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-800 to-stone-700">
            <span className="text-5xl">{workshop.emoji}</span>
          </div>
        )}
        {/* Status Badge - floating */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${status.className}`}>
            {status.text}
          </span>
        </div>
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {categories[workshop.category].emoji} {categories[workshop.category].label}
          </span>
        </div>
      </LinkWrapper>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Title */}
        <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
          {workshop.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {workshop.subtitle}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2.5">
          {workshop.instructor.avatar ? (
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
              <Image
                src={workshop.instructor.avatar}
                alt={workshop.instructor.name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-800/10 text-sm font-medium text-stone-800">
              {workshop.instructor.name[0]}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {workshop.instructor.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {workshop.instructor.title}
            </p>
          </div>
        </div>

        {/* Key Highlights (max 2) */}
        <div className="mt-4 space-y-1.5">
          {workshop.highlights.slice(0, 2).map((highlight, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        {/* Meta: Date + Location */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {workshop.date}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {workshop.duration}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            限 {workshop.capacity} 名
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {(() => {
              const display = workshop.price.earlyBird ?? workshop.price.regular ?? workshop.price.original;
              const strike = display !== workshop.price.original;
              return (
                <div>
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(display)}
                  </span>
                  {strike && (
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      {formatPrice(workshop.price.original)}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
          {workshop.status === "full" ? (
            <Button variant="outline" size="sm" disabled className="shrink-0">
              已額滿
            </Button>
          ) : (
            <Button size="sm" className="shrink-0 bg-stone-800 hover:bg-stone-800/90" asChild>
              <LinkWrapper {...linkProps}>
                {workshop.isExternal ? (
                  <span className="flex items-center gap-1.5">
                    前往報名
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </span>
                ) : (
                  "了解更多"
                )}
              </LinkWrapper>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Course Card ─── */
function FeaturedCard({ workshop }: { workshop: Workshop }) {
  const status = statusConfig[workshop.status];
  const coverSrc = getCoverImage(workshop.id);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-stone-900 to-stone-800/90 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="grid gap-0 lg:grid-cols-2">
        {/* Left: Cover Image — clickable */}
        <Link href={workshop.url} className="relative block aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={workshop.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-8xl">{workshop.emoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-800/60 lg:block hidden" />
        </Link>

        {/* Right: Content */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
              {status.text}
            </span>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              精選課程
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {workshop.title}
          </h3>
          <p className="mt-2 text-base text-white/70 sm:text-lg">
            {workshop.subtitle}
          </p>

          {/* Instructor */}
          <div className="mt-5 flex items-center gap-3">
            {workshop.instructor.avatar && (
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
                <Image
                  src={workshop.instructor.avatar}
                  alt={workshop.instructor.name}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">{workshop.instructor.name}</p>
              <p className="text-xs text-white/60">{workshop.instructor.title}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {workshop.highlights.map((highlight, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">
                  {i + 1}
                </span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {workshop.date}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {workshop.time}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              限 {workshop.capacity} 名
            </span>
          </div>

          {/* Price + CTA */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div>
              {(() => {
                const display = workshop.price.earlyBird ?? workshop.price.regular ?? workshop.price.original;
                const strike = display !== workshop.price.original;
                return strike ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary sm:text-3xl">
                      {formatPrice(display)}
                    </span>
                    <span className="text-sm text-white/40 line-through">
                      {formatPrice(workshop.price.original)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-primary sm:text-3xl">
                    {formatPrice(display)}
                  </span>
                );
              })()}
            </div>
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 sm:ml-auto"
              asChild
            >
              {workshop.isExternal ? (
                <a href={workshop.url} target="_blank" rel="noopener noreferrer">前往報名</a>
              ) : (
                <Link href={workshop.url}>了解更多 &amp; 報名</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function CourseFilters({ workshops }: { workshops: Workshop[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const featuredWorkshop = workshops.find((w) => w.featured);
  const filteredWorkshops = workshops
    .filter((w) => !w.featured)
    .filter((w) => activeFilter === "all" || w.category === activeFilter)
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate));

  return (
    <>
      {/* Featured Course */}
      {featuredWorkshop && (
        <section className="mt-10 sm:mt-12">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Featured Course
            </span>
          </div>
          <FeaturedCard workshop={featuredWorkshop} />
        </section>
      )}

      {/* Filter Tabs + Course Grid */}
      <section className="mt-12 sm:mt-14">
        {/* Filter Tabs */}
        <div role="tablist" aria-label="課程分類篩選" className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.filter((tab) => {
            if (tab.key === "all") return true;
            return workshops.some((w) => !w.featured && w.category === tab.key);
          }).map((tab) => {
            const isActive = activeFilter === tab.key;
            const count =
              tab.key === "all"
                ? workshops.filter((w) => !w.featured).length
                : workshops.filter((w) => !w.featured && w.category === tab.key).length;

            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border-stone-800 bg-stone-800 text-white shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-stone-800/30 hover:text-foreground"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Course Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-lg">這個分類暫時沒有課程</p>
            <p className="mt-1 text-sm">請查看其他分類，或訂閱電子報獲得最新課程通知</p>
          </div>
        )}
      </section>
    </>
  );
}
