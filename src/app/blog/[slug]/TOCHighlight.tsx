"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TOCHighlight({ toc }: { toc: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    // 觀察所有標題
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  return (
    <nav>
      <ul className="space-y-1 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            className={`relative ${item.level === 3 ? "ml-4" : ""}`}
          >
            {/* 左側紅色指示條 */}
            <span
              className={`absolute -left-3 top-0 h-full w-1 rounded-full transition-all duration-200 ${
                activeId === item.id ? "bg-[#d13a3a]" : "bg-transparent"
              }`}
            />
            <a
              href={`#${item.id}`}
              className={`block py-1.5 transition-colors duration-200 ${
                activeId === item.id
                  ? "font-semibold text-[#d13a3a]"
                  : "text-stone-600 hover:text-[#d13a3a]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
