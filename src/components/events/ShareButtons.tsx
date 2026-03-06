"use client";

import { useState } from "react";

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">分享</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={copyLink} className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80">
          {copied ? "已複製" : "複製連結"}
        </button>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200">
          Facebook
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium hover:bg-gray-200">
          X
        </a>
        <a href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="rounded-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200">
          LINE
        </a>
        <a href={`https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium hover:bg-gray-200">
          Threads
        </a>
      </div>
    </div>
  );
}
