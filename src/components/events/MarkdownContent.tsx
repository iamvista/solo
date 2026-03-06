"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface Props {
  content: string;
}

export default function MarkdownContent({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-8 mb-4 text-2xl font-bold">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-6 mb-3 text-xl font-bold">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-5 mb-2 text-lg font-semibold">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-4 mb-2 text-base font-semibold">{children}</h4>
        ),
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        ul: ({ children }) => (
          <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code
                className={`${className} block overflow-x-auto rounded-lg bg-muted p-4 text-sm`}
              >
                {children}
              </code>
            );
          }
          return (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-4 overflow-x-auto rounded-lg bg-muted">
            {children}
          </pre>
        ),
        hr: () => <hr className="my-6 border-border" />,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="mb-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-border text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-3 py-2">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
