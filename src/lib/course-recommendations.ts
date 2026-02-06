// 課程推薦系統 - 根據診斷結果推薦適合的課程

export type DimensionKey = "positioning" | "delivery" | "trust" | "monetization" | "sustainability";
export type SoloTypeKey = "lion" | "fox" | "elephant" | "eagle" | "turtle" | "chick";

// 課程定義
export interface Course {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  targetDimensions: DimensionKey[]; // 這門課能強化的維度
  targetSoloTypes: SoloTypeKey[]; // 這門課適合的 Solo 類型
  level: "入門" | "進階" | "專家";
  isFree: boolean;
  url: string;
}

// 完整課程列表
export const courses: Course[] = [
  // 免費迷你課程
  {
    id: "pricing-101",
    emoji: "💰",
    title: "定價入門：停止賤賣自己",
    subtitle: "3 堂課學會合理定價",
    description: "學會如何制定讓客戶願意付、自己也滿意的價格",
    targetDimensions: ["monetization"],
    targetSoloTypes: ["chick", "turtle", "elephant"],
    level: "入門",
    isFree: true,
    url: "/courses#pricing-101",
  },
  {
    id: "first-client",
    emoji: "🤝",
    title: "第一個客戶：從 0 到 1",
    subtitle: "5 堂課獲得第一個客戶",
    description: "帶你獲得第一個付費客戶的實戰策略",
    targetDimensions: ["trust", "positioning"],
    targetSoloTypes: ["chick", "turtle"],
    level: "入門",
    isFree: true,
    url: "/courses#first-client",
  },
  {
    id: "personal-brand",
    emoji: "✨",
    title: "個人品牌基礎班",
    subtitle: "4 堂課建立專業形象",
    description: "建立你的專業形象與獨特定位",
    targetDimensions: ["positioning", "trust"],
    targetSoloTypes: ["chick", "turtle", "eagle"],
    level: "入門",
    isFree: true,
    url: "/courses#personal-brand",
  },
  // 完整課程
  {
    id: "solo-starter",
    emoji: "🚀",
    title: "Solo 新手起步班",
    subtitle: "從零開始的自由工作者入門",
    description: "學習如何找到定位、設定價格、獲得第一個客戶",
    targetDimensions: ["positioning", "monetization", "trust"],
    targetSoloTypes: ["chick", "turtle"],
    level: "入門",
    isFree: false,
    url: "/courses#solo-starter",
  },
  {
    id: "solo-growth",
    emoji: "📈",
    title: "Solo 事業成長班",
    subtitle: "穩定收入到規模化",
    description: "學習如何提升單價、建立被動收入、打造可擴展的事業模式",
    targetDimensions: ["monetization", "sustainability", "delivery"],
    targetSoloTypes: ["elephant", "eagle", "fox"],
    level: "進階",
    isFree: false,
    url: "/courses#solo-growth",
  },
  {
    id: "solo-mastery",
    emoji: "🏆",
    title: "Solo 大師班",
    subtitle: "成為業界意見領袖",
    description: "學習如何建立團隊、授權經營、成為領域專家",
    targetDimensions: ["sustainability", "delivery", "trust"],
    targetSoloTypes: ["fox", "lion"],
    level: "專家",
    isFree: false,
    url: "/courses#solo-mastery",
  },
];

// 維度對應的學習主題
export const dimensionToLearningTopics: Record<DimensionKey, string[]> = {
  positioning: ["市場定位", "找到利基市場", "建立獨特價值主張"],
  delivery: ["效率提升", "服務流程", "產品化"],
  trust: ["客戶經營", "建立口碑", "推薦系統"],
  monetization: ["定價策略", "價值定價", "多元收入"],
  sustainability: ["事業成長", "被動收入", "團隊擴展"],
};

// 根據診斷結果推薦課程
export function getRecommendedCourses(
  scores: Record<DimensionKey, number>,
  soloType: SoloTypeKey,
  limit: number = 3
): Course[] {
  // 找出需要加強的維度（分數低於 60）
  const weakDimensions = (Object.entries(scores) as [DimensionKey, number][])
    .filter(([, score]) => score < 60)
    .sort((a, b) => a[1] - b[1]) // 從最弱的開始
    .map(([dim]) => dim);

  // 計算每門課程的推薦分數
  const courseScores = courses.map((course) => {
    let score = 0;

    // 加分：課程能補強弱項維度
    for (const dim of weakDimensions) {
      if (course.targetDimensions.includes(dim)) {
        // 越弱的維度權重越高
        const weaknessIndex = weakDimensions.indexOf(dim);
        score += (weakDimensions.length - weaknessIndex) * 10;
      }
    }

    // 加分：課程適合該 Solo 類型
    if (course.targetSoloTypes.includes(soloType)) {
      score += 20;
    }

    // 加分：免費課程優先（降低入門門檻）
    if (course.isFree) {
      score += 5;
    }

    // 加分：根據總分推薦適合的課程難度
    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
    if (avgScore < 40 && course.level === "入門") {
      score += 15;
    } else if (avgScore >= 40 && avgScore < 70 && course.level === "進階") {
      score += 15;
    } else if (avgScore >= 70 && course.level === "專家") {
      score += 15;
    }

    return { course, score };
  });

  // 排序並返回前 N 個
  return courseScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.course);
}

// 獲取針對特定維度的建議
export function getDimensionAdvice(dimension: DimensionKey, score: number): {
  status: "excellent" | "good" | "needsWork" | "critical";
  advice: string;
  actionItems: string[];
} {
  if (score >= 80) {
    return {
      status: "excellent",
      advice: "這是你的強項！可以考慮如何將這個優勢轉化為競爭力。",
      actionItems: [
        "思考如何將這個優勢變成獨特賣點",
        "分享經驗幫助他人，建立專家形象",
        "探索進階應用或創新做法",
      ],
    };
  } else if (score >= 60) {
    return {
      status: "good",
      advice: "表現不錯，但還有成長空間。",
      actionItems: [
        "找出可以再優化的細節",
        "學習業界最佳實踐",
        "定期檢視並調整策略",
      ],
    };
  } else if (score >= 40) {
    return {
      status: "needsWork",
      advice: "這是需要加強的領域，建議優先投入時間學習。",
      actionItems: [
        "參加相關課程或工作坊",
        "閱讀專業書籍和文章",
        "找尋導師或同儕交流",
      ],
    };
  } else {
    return {
      status: "critical",
      advice: "這是你目前最大的成長機會，強烈建議立即開始改善。",
      actionItems: [
        "從基礎開始系統學習",
        "設定具體的短期改善目標",
        "考慮尋求專業指導",
      ],
    };
  }
}

// 根據 Solo 類型獲取學習路徑建議
export function getLearningPathByType(soloType: SoloTypeKey): {
  immediate: Course[];
  next: Course[];
  future: Course[];
} {
  switch (soloType) {
    case "chick":
      return {
        immediate: courses.filter((c) => c.isFree && c.level === "入門"),
        next: courses.filter((c) => c.id === "solo-starter"),
        future: courses.filter((c) => c.id === "solo-growth"),
      };
    case "turtle":
      return {
        immediate: courses.filter((c) => c.isFree),
        next: courses.filter((c) => c.id === "solo-starter"),
        future: courses.filter((c) => c.id === "solo-growth"),
      };
    case "elephant":
      return {
        immediate: courses.filter((c) => c.id === "pricing-101" || c.id === "personal-brand"),
        next: courses.filter((c) => c.id === "solo-growth"),
        future: courses.filter((c) => c.id === "solo-mastery"),
      };
    case "eagle":
      return {
        immediate: courses.filter((c) => c.id === "first-client" || c.id === "personal-brand"),
        next: courses.filter((c) => c.id === "solo-growth"),
        future: courses.filter((c) => c.id === "solo-mastery"),
      };
    case "fox":
      return {
        immediate: courses.filter((c) => c.id === "solo-growth"),
        next: courses.filter((c) => c.id === "solo-mastery"),
        future: [],
      };
    case "lion":
      return {
        immediate: courses.filter((c) => c.id === "solo-mastery"),
        next: [],
        future: [],
      };
    default:
      return {
        immediate: courses.filter((c) => c.isFree),
        next: [],
        future: [],
      };
  }
}
