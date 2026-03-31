"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-primary hover:text-white";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-stone-400">分享：</span>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        title="分享到 Facebook"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      </a>

      {/* Threads */}
      <a
        href={`https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        title="分享到 Threads"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948.591.621.928 1.509 1.005 2.644-1.119-.377-2.317-.602-3.489-.602-.617 0-1.218.086-1.79.256zm4.95 7.172c-.956.652-2.15.96-3.455.96-2.023 0-3.652-.689-4.848-2.05C1.764 10.736 1.16 8.792 1.16 6.38v-.028c.032-2.503.677-4.497 1.916-5.932C4.313-.012 5.986-.623 8.062-.623h.012c1.972.014 3.627.51 4.92 1.476 1.218.91 2.075 2.21 2.548 3.868l-1.464.408C13.405 2.523 11.4 1.073 8.1 1.05c-2.09.016-3.67.672-4.7 1.95C2.37 4.278 1.847 6.014 1.828 8.38c.018 2.215.515 3.951 1.477 5.147 1.028 1.282 2.608 1.94 4.698 1.953 1.886-.015 3.13-.453 4.165-1.47 1.183-1.159 1.162-2.581.783-3.449-.222-.51-.627-.937-1.174-1.26-.137.972-.447 1.759-.923 2.352-.637.792-1.537 1.225-2.68 1.287-.863.047-1.696-.157-2.342-.576-.764-.495-1.21-1.252-1.259-2.128-.047-.841.293-1.629.956-2.217.645-.574 1.556-.91 2.556-.998.814-.072 1.56-.023 2.232.107-.06-.366-.161-.684-.305-.945-.365-.669-1.005-1.01-1.903-1.015h-.029c-.678.006-1.24.216-1.669.562l-.97-1.112c.652-.527 1.501-.82 2.522-.89l.142-.003c1.389.023 2.43.521 3.095 1.485.372.538.62 1.2.748 1.974.37.181.704.403.996.664.77.687 1.318 1.632 1.534 2.637.282 1.321.053 2.886-1.05 3.988-.832.832-1.864 1.402-3.222 1.747zM8.92 10.258c-.712.063-1.285.278-1.662.607-.336.293-.482.64-.462.994.027.453.32.987 1.24.987.036 0 .072 0 .109-.003.705-.038 1.236-.312 1.629-.8.267-.333.456-.774.568-1.32-.453-.13-.93-.213-1.422-.213-.173 0-.344.012-.512.035z" transform="translate(2 2)" />
        </svg>
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        title="分享到 X"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        title="分享到 LinkedIn"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>

      {/* Email */}
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`}
        className={buttonClass}
        title="用 Email 分享"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </a>

      {/* 複製連結 */}
      <button
        onClick={handleCopy}
        className={`${buttonClass} relative`}
        title="複製連結"
      >
        {copied ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
        )}
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-stone-800 px-2 py-1 text-xs text-white">
            已複製
          </span>
        )}
      </button>
    </div>
  );
}
