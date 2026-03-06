"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const formatFilters = [
  { value: "", label: "全部" },
  { value: "online", label: "線上" },
  { value: "offline", label: "實體" },
];

const categoryFilters = [
  { value: "", label: "全部" },
  { value: "workshop", label: "工作坊" },
  { value: "lecture", label: "講座" },
  { value: "meetup", label: "聚會" },
  { value: "conference", label: "研討會" },
];

interface Props {
  currentFormat: string;
  currentCategory: string;
  currentSearch: string;
}

export default function EventFilters({ currentFormat, currentCategory, currentSearch }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/events?${params.toString()}`);
  }, [router, searchParams]);

  const chipClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
      active ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
    }`;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        {formatFilters.map((f) => (
          <button key={f.value} className={chipClass(currentFormat === f.value)} onClick={() => updateFilter("format", f.value)}>
            {f.label}
          </button>
        ))}
        <span className="mx-2 self-center text-muted-foreground">|</span>
        {categoryFilters.map((c) => (
          <button key={c.value} className={chipClass(currentCategory === c.value)} onClick={() => updateFilter("category", c.value)}>
            {c.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="搜尋活動名稱或標籤..."
        defaultValue={currentSearch}
        onChange={(e) => {
          const timer = setTimeout(() => updateFilter("q", e.target.value), 300);
          return () => clearTimeout(timer);
        }}
        className="w-full rounded-lg border px-4 py-2.5 text-sm sm:max-w-sm"
      />
    </div>
  );
}
