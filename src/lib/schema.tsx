/**
 * JSON-LD 結構化資料元件
 * 用於在頁面中注入 schema.org 結構化資料
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Course Schema ─── */
export interface CourseSchemaProps {
  name: string;
  description: string;
  url: string;
  instructor: string;
  price: number;
  priceCurrency?: string;
  duration: string;
  startDate?: string;
  location?: string;
  image?: string;
}

export function courseSchema(props: CourseSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: props.name,
    description: props.description,
    url: props.url,
    provider: {
      "@type": "Organization",
      name: "solo.tw",
      url: "https://www.solo.tw",
    },
    instructor: {
      "@type": "Person",
      name: props.instructor,
    },
    offers: {
      "@type": "Offer",
      price: props.price,
      priceCurrency: props.priceCurrency || "TWD",
      availability: "https://schema.org/InStock",
      url: props.url,
    },
    ...(props.duration && { timeRequired: props.duration }),
    ...(props.startDate && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Blended",
        startDate: props.startDate,
        ...(props.location && {
          location: {
            "@type": "Place",
            name: props.location,
            address: { "@type": "PostalAddress", addressLocality: "臺北市" },
          },
        }),
      },
    }),
    ...(props.image && { image: props.image }),
  };
}

/* ─── Service Schema ─── */
export interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  price: number;
  priceCurrency?: string;
}

export function serviceSchema(props: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: props.name,
    description: props.description,
    url: props.url,
    provider: {
      "@type": "Person",
      name: "Vista Cheng",
      url: "https://www.solo.tw/about",
    },
    offers: {
      "@type": "Offer",
      price: props.price,
      priceCurrency: props.priceCurrency || "TWD",
    },
  };
}

/* ─── BreadcrumbList Schema ─── */
export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://www.solo.tw${item.href}`,
    })),
  };
}
