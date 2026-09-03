import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TrustPageContent } from "@/data/trust-content";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export function TrustPage({ content }: { content: TrustPageContent }) {
  const url = `https://www.solo.tw/${content.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: content.title,
    description: content.description,
    inLanguage: "zh-Hant-TW",
    isPartOf: {
      "@type": "WebSite",
      name: "solo.tw | 用 AI 放大你的一人事業",
      url: "https://www.solo.tw",
    },
    about: { "@type": "Thing", name: "solo.tw 內容可信度與編輯準則" },
  };

  return (
    <main>
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema([{ name: "首頁", href: "/" }, { name: content.title, href: `/${content.slug}` }])} />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Badge variant="secondary" className="mb-5 px-4 py-2 text-sm">{content.eyebrow}</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{content.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{content.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="space-y-12">
          {content.sections.map((section, index) => {
            const headingId = `${content.slug}-section-${index + 1}`;
            return (
            <section key={section.title} aria-labelledby={headingId}>
              <h2 id={headingId} className="text-2xl font-bold tracking-tight">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground sm:text-lg">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.items && (
                <ul className="mt-5 space-y-3 text-base leading-7 text-muted-foreground sm:text-lg">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-1 text-primary">●</span><span>{item}</span></li>
                  ))}
                </ul>
              )}
            </section>
            );
          })}
        </div>

        <Card className="mt-14 bg-muted/30">
          <CardContent className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-xl font-bold">進一步了解內容準則</h2>
              <p className="mt-2 leading-7 text-muted-foreground">方法與政策互相配合，共同說明內容如何產生、發布與維護。</p>
            </div>
            <Button asChild variant="outline"><Link href={content.related[0].href}>{content.related[0].label}</Link></Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
