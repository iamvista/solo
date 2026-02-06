// 文章推薦系統 - 根據診斷弱項推薦相關文章

export type DimensionKey = "positioning" | "delivery" | "trust" | "monetization" | "sustainability";

export interface ArticleRecommendation {
  slug: string;
  title: string;
  description: string;
  dimension: DimensionKey;
}

// 文章與維度的對應關係
export const articlesByDimension: Record<DimensionKey, ArticleRecommendation[]> = {
  // 定位力相關文章
  positioning: [
    {
      slug: "building-a-personal-brand-starts-with-2",
      title: "打造個人品牌，從盤點資源與精準定位開始",
      description: "學習如何建立清晰的品牌定位與獨特價值主張",
      dimension: "positioning",
    },
    {
      slug: "why-you-need-a-personal-brand",
      title: "為何你需要一位個人品牌教練",
      description: "透過專業教練協助，加速找到你的獨特定位",
      dimension: "positioning",
    },
    {
      slug: "littleboat-startup",
      title: "從痛苦中逃離到自由人生：小船的系統化創業方法論",
      description: "IDEA 藍圖系統：識別獨特價值、精準定位目標人群",
      dimension: "positioning",
    },
    {
      slug: "multipotentialite-value-creation-guide",
      title: "擁有多項興趣的你，如何把「什麼都想學」變成獨特優勢？",
      description: "將多重興趣轉化為一人企業的核心資產",
      dimension: "positioning",
    },
  ],

  // 交付力相關文章
  delivery: [
    {
      slug: "chatgpt-writing-coach",
      title: "讓 ChatGPT 當你的寫作教練！五步驟啟動創作靈感",
      description: "運用 AI 工具提升內容產出效率",
      dimension: "delivery",
    },
    {
      slug: "must-learn-writing-strategies-in-2025-how",
      title: "2025 年必學的寫作策略：如何讓你的內容脫穎而出？",
      description: "系統化的內容創作方法論",
      dimension: "delivery",
    },
    {
      slug: "how-to-become-a-successful-content",
      title: "如何成為一位成功的內容創作者",
      description: "建立可複製的內容創作流程",
      dimension: "delivery",
    },
    {
      slug: "ai-freelance-survival-guide",
      title: "AI 時代的自由工作者生存指南",
      description: "善用 AI 工具提升交付效率與品質",
      dimension: "delivery",
    },
  ],

  // 信任力相關文章
  trust: [
    {
      slug: "building-influence-through-community-cheng-junde",
      title: "在關係裡長出影響力：跟「閱讀人」鄭俊德學習打造鐵粉的祕密",
      description: "透過深耕社群，建立長期信任關係",
      dimension: "trust",
    },
    {
      slug: "brand-story-must-resonate",
      title: "品牌故事，要能引起共鳴",
      description: "用故事建立情感連結與信任",
      dimension: "trust",
    },
    {
      slug: "twitter-to-x-long-form-writing",
      title: "從 Twitter 到 X：長文寫作才是信任的存摺",
      description: "透過深度內容累積專業信任",
      dimension: "trust",
    },
    {
      slug: "build-a-personal-brand-make-good",
      title: "打造個人品牌：善用內容行銷思維，經營你的部落格",
      description: "用內容持續累積信任資產",
      dimension: "trust",
    },
  ],

  // 變現力相關文章
  monetization: [
    {
      slug: "profit-awakening-knowledge-worker",
      title: "知識工作者的獲利覺醒：從現金流思維到微型組織時代的生存法則",
      description: "建立正確的商業變現思維",
      dimension: "monetization",
    },
    {
      slug: "selling-yourself-2026",
      title: "2026 年最難賣的不是產品，而是「你」",
      description: "學習如何銷售你的專業服務",
      dimension: "monetization",
    },
    {
      slug: "self-home-entrepreneurship-bible-teaches-you-to",
      title: "《自宅創業聖經》教您開拓多元的收入來源",
      description: "建立多元被動收入管道",
      dimension: "monetization",
    },
    {
      slug: "the-key-to-success-of-subscription-based",
      title: "「訂閱制服務」的成功關鍵：有效維繫和用戶的長久關係",
      description: "打造可持續的訂閱收入模式",
      dimension: "monetization",
    },
  ],

  // 永續力相關文章
  sustainability: [
    {
      slug: "refuse-to-be-digital-sharecropper",
      title: "拒絕當數位佃農：為何你需要打造數位總部？",
      description: "建立不依賴平臺的永續事業基礎",
      dimension: "sustainability",
    },
    {
      slug: "honnold-career-ladder",
      title: "霍諾德攀登臺北 101 的啟示：職涯的階梯思維",
      description: "從極限運動家身上學習長期職涯規劃",
      dimension: "sustainability",
    },
    {
      slug: "vista-theory-of-evolution",
      title: "Vista 的進化論",
      description: "在 AI 浪潮中持續進化的個人品牌策略",
      dimension: "sustainability",
    },
    {
      slug: "seize-the-moment-and-embark-on",
      title: "把握當下，踏上美好的征程",
      description: "平衡當下行動與長期規劃",
      dimension: "sustainability",
    },
  ],
};

// 根據弱項維度取得推薦文章
export function getRecommendedArticles(
  dimensionScores: Record<DimensionKey, number>,
  limit: number = 3
): ArticleRecommendation[] {
  // 依分數排序，找出最弱的維度
  const sortedDimensions = (Object.entries(dimensionScores) as [DimensionKey, number][])
    .sort((a, b) => a[1] - b[1]);

  const recommendations: ArticleRecommendation[] = [];
  const usedSlugs = new Set<string>();

  // 從最弱的維度開始推薦
  for (const [dimension] of sortedDimensions) {
    const articles = articlesByDimension[dimension];
    for (const article of articles) {
      if (!usedSlugs.has(article.slug) && recommendations.length < limit) {
        recommendations.push(article);
        usedSlugs.add(article.slug);
      }
    }
    if (recommendations.length >= limit) break;
  }

  return recommendations;
}

// 維度名稱對應
export const dimensionNames: Record<DimensionKey, string> = {
  positioning: "定位力",
  delivery: "交付力",
  trust: "信任力",
  monetization: "變現力",
  sustainability: "永續力",
};
