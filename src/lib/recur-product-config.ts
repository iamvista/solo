/**
 * Recur 產品 → 確認信類型對應表。
 * 新增產品時在這裡登記，webhook handler 會自動依這份設定發信。
 */

import type { ArsBundle } from "@/lib/ars-bundles";
import { ARMY_PRODUCT_ID } from "@/lib/army-kit";
import { LECTURER_PRODUCT_ID } from "@/lib/lecturer-kit";

export type ConsultingPlan = "1hr" | "3hr" | "5hr" | "10hr" | "20hr";

export type ProductEmailConfig =
  | {
      kind: "ai-coach-kit";
      productId: "xqvb9nqxtehhfesuhequm9jp";
    }
  | {
      kind: "army-kit";
      productId: typeof ARMY_PRODUCT_ID;
    }
  | {
      kind: "lecturer-kit";
      productId: typeof LECTURER_PRODUCT_ID;
    }
  | {
      kind: "ars-bundle";
      productId: string;
      productName: string;
      bundle: ArsBundle;
    }
  | {
      kind: "course";
      productId: string;
      productName: string;
      whatsNext: string[];
      detailUrl?: string;
    }
  | {
      kind: "consulting";
      productId: string;
      productName: string;
      plan: ConsultingPlan;
      hours: number;
      amount: number;
      emailTemplate: "consulting-enrollment-welcome";
    }
  | {
      kind: "donation";
      productId: string;
      productName: string;
    }
  | {
      kind: "default";
      productId: string;
      productName: string;
    };

export const AI_COACH_KIT_PRODUCT_ID = "xqvb9nqxtehhfesuhequm9jp";

const COURSE_BRAIN_LAB_NEXT_STEPS = [
  "6/1 正式開營，開營前 3 天會寄出 LINE / Slack 群組邀請連結",
  "課前會發送「副腦原料盤點清單」，請依清單匯整你 3-5 年內的素材",
  "陪跑營為期 35 天，每週固定 1 次直播 + 每日小任務",
];

const COURSE_VIBE_CODING_CC_NEXT_STEPS = [
  "請先自行訂閱 Claude Pro（US$20／月）或 Claude Max（US$100 起／月），課程不代付",
  "課前一週會寄出 Node.js + Claude Code CLI 的安裝指南，請務必先裝好並登入",
  "開課前 2 天會寄出含教室地址、Wi-Fi、課堂節奏的提醒信",
  "若你是 Antigravity 版舊生，課前會抽查比對名單；如有疑問請來信 iamvista@gmail.com",
];

const COURSE_AI_CONTENT_NEXT_STEPS = [
  "請先自行訂閱 Claude Pro（US$20／月），課程實作會用到，課程不代付",
  "請準備 2-3 篇你過去寫的文章，課堂會用來建立你的個人風格檔案",
  "開課前 2 天會寄出含教室地址、Wi-Fi、課前準備清單的提醒信",
  "課後會邀請加入專屬學員 LINE 群組，可持續交流與提問",
];

const COURSE_VIBE_CODING_NEXT_STEPS = [
  "課前準備好一個 AI 工具帳號（Gemini／Claude／ChatGPT 擇一即可）",
  "帶上你想製作的網站內容素材（文字、圖片、Logo 等）",
  "開課前 2 天會寄出含教室地址、Wi-Fi、課前準備清單的提醒信",
  "課後會邀請加入專屬學員 LINE 群組，可持續交流與提問",
];

const COURSE_POSITIONING_NEXT_STEPS = [
  "課前請把你過去到現在的經歷、技能、興趣、學過的東西先想一輪；課堂會帶你一起攤開、盤點、再收斂",
  "本場為線上舉辦，開課前 2-3 天會寄出會議網址連結與課前提醒信",
  "課後會邀請加入專屬學員 LINE 群組，可持續交流與提問",
];

const COURSE_CONCEPT_BOOTCAMP_NEXT_STEPS = [
  "8/6（週四）晚上 8 點開營，開營前 3 天會寄出 Google Meet 連結與 LINE 群組邀請",
  "課前會寄出「課前概念問卷」與「專業資產盤點表」，請先填寫，幫助講師對應你的主題",
  "每週四晚上直播 90 分鐘 + QA，課後寄出回放與當週實作作業，每週固定繳交與互評",
  "VIP 診斷席學員會另外約課前診斷與課後一對一的時間；如有疑問請來信 iamvista@gmail.com",
];

const COURSE_AI_ACADEMIC_NEXT_STEPS = [
  "請自備筆電；課前建議訂閱一個月 Claude Pro（US$20／月），並安裝、登入 Claude Code（用 Codex 者需 ChatGPT 付費帳號；課程不代付）",
  "可先想好一個你正在進行的研究主題或一篇要改的草稿，課堂實作會直接拿你的題目練",
  "開課前 2 天會寄出含教室地址、Wi-Fi、課前準備清單的提醒信",
  "課後會邀請加入專屬學員 LINE 群組，可持續交流與提問",
];

const PRODUCT_CONFIG_MAP: Record<string, ProductEmailConfig> = {
  // AI 教練工坊（既有下載流程）
  [AI_COACH_KIT_PRODUCT_ID]: {
    kind: "ai-coach-kit",
    productId: AI_COACH_KIT_PRODUCT_ID,
  },

  // 無人公司 AI 軍團啟動包
  [ARMY_PRODUCT_ID]: {
    kind: "army-kit",
    productId: ARMY_PRODUCT_ID,
  },

  // 講師 AI 幕僚
  [LECTURER_PRODUCT_ID]: {
    kind: "lecturer-kit",
    productId: LECTURER_PRODUCT_ID,
  },

  // Vibe Coding for Claude Code 實戰工作坊（2026/6/27 臺北）
  xi7s0fxgw8zxetstmv2xv7lc: {
    kind: "course",
    productId: "xi7s0fxgw8zxetstmv2xv7lc",
    productName: "Vibe Coding for Claude Code 實戰工作坊（2026/6/27 臺北）",
    whatsNext: COURSE_VIBE_CODING_CC_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/vibe-coding-claude-code",
  },
  qs4uz4gbiarnwflfok8u4szw: {
    kind: "course",
    productId: "qs4uz4gbiarnwflfok8u4szw",
    productName: "Vibe Coding for Claude Code 實戰工作坊・舊生優惠（2026/6/27 臺北）",
    whatsNext: COURSE_VIBE_CODING_CC_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/vibe-coding-claude-code",
  },

  // AI 內容產製系統工作坊（2026/8/29 臺北）
  gngyqhltfyujbl0wjd78304x: {
    kind: "course",
    productId: "gngyqhltfyujbl0wjd78304x",
    productName: "AI 內容產製系統工作坊（2026/8/29 臺北）",
    whatsNext: COURSE_AI_CONTENT_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/ai-content",
  },

  // Vibe Coding 實戰工作坊（第 8 班・2026/7/26 臺北）
  y7q482kwsc16h7iw3akwufzq: {
    kind: "course",
    productId: "y7q482kwsc16h7iw3akwufzq",
    productName: "Vibe Coding 實戰工作坊（第 8 班・2026/7/26 臺北）",
    whatsNext: COURSE_VIBE_CODING_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/vibe-coding",
  },

  // 副腦計畫 Brain+1 Lab（35 天陪跑營）
  n9l5pxhjrvy0o94igqw2vpcp: {
    kind: "course",
    productId: "n9l5pxhjrvy0o94igqw2vpcp",
    productName: "副腦計畫 Brain+1 Lab（35 天 AI 副腦陪跑營）",
    whatsNext: COURSE_BRAIN_LAB_NEXT_STEPS,
  },
  gb1rmyp2vpgwvy9qnjfaca0c: {
    kind: "course",
    productId: "gb1rmyp2vpgwvy9qnjfaca0c",
    productName: "副腦計畫 Brain+1 Lab・早鳥（35 天 AI 副腦陪跑營）",
    whatsNext: COURSE_BRAIN_LAB_NEXT_STEPS,
  },

  // 定位收斂工作坊（2026/7/19 線上）
  pf2eoon7kaofq8m8ufybmauu: {
    kind: "course",
    productId: "pf2eoon7kaofq8m8ufybmauu",
    productName: "定位收斂工作坊（2026/7/19 線上）",
    whatsNext: COURSE_POSITIONING_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/positioning-convergence",
  },

  // AI 賦能學術研究與寫作實戰工作坊（2026/8/16 臺北）
  b3dc06svryzlii74r2bpn6qo: {
    kind: "course",
    productId: "b3dc06svryzlii74r2bpn6qo",
    productName: "AI 賦能學術研究與寫作實戰工作坊・早鳥（2026/8/16 臺北）",
    whatsNext: COURSE_AI_ACADEMIC_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/ai-academic-writing",
  },
  u0rnbc9kgub6azuw44ub72ml: {
    kind: "course",
    productId: "u0rnbc9kgub6azuw44ub72ml",
    productName: "AI 賦能學術研究與寫作實戰工作坊（2026/8/16 臺北）",
    whatsNext: COURSE_AI_ACADEMIC_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/ai-academic-writing",
  },

  // 概念變現陪跑營（6 週線上・2026/8/6 起）
  df2j3u3vfh8u2wwh14048yym: {
    kind: "course",
    productId: "df2j3u3vfh8u2wwh14048yym",
    productName: "概念變現陪跑營（6 週線上・標準票）",
    whatsNext: COURSE_CONCEPT_BOOTCAMP_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/concept-monetization-bootcamp",
  },
  jz9tbaygcitkkdpr3y5ah97z: {
    kind: "course",
    productId: "jz9tbaygcitkkdpr3y5ah97z",
    productName: "概念變現陪跑營・VIP 診斷席（6 週線上）",
    whatsNext: COURSE_CONCEPT_BOOTCAMP_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/concept-monetization-bootcamp",
  },
  bq16q93lbuddoarykucd311m: {
    kind: "course",
    productId: "bq16q93lbuddoarykucd311m",
    productName: "概念變現陪跑營・雙人同行（6 週線上）",
    whatsNext: COURSE_CONCEPT_BOOTCAMP_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/concept-monetization-bootcamp",
  },

  // 1-on-1 諮詢套票（顧問服務）
  zimy2xm5pv24dfxx194axeev: {
    kind: "consulting",
    productId: "zimy2xm5pv24dfxx194axeev",
    productName: "1 小時諮詢",
    plan: "1hr",
    hours: 1,
    amount: 3000,
    emailTemplate: "consulting-enrollment-welcome",
  },
  efmn8pw5tielzrgwffb76swd: {
    kind: "consulting",
    productId: "efmn8pw5tielzrgwffb76swd",
    productName: "3 小時套票",
    plan: "3hr",
    hours: 3,
    amount: 8400,
    emailTemplate: "consulting-enrollment-welcome",
  },
  dwdt6ikhule9j0hs1px77rke: {
    kind: "consulting",
    productId: "dwdt6ikhule9j0hs1px77rke",
    productName: "5 小時套票",
    plan: "5hr",
    hours: 5,
    amount: 13500,
    emailTemplate: "consulting-enrollment-welcome",
  },
  mndmvwsgvevq7ogdklt7i3h6: {
    kind: "consulting",
    productId: "mndmvwsgvevq7ogdklt7i3h6",
    productName: "10 小時套票",
    plan: "10hr",
    hours: 10,
    amount: 26000,
    emailTemplate: "consulting-enrollment-welcome",
  },
  q2z9d2dd6vymycdq1b35iz2w: {
    kind: "consulting",
    productId: "q2z9d2dd6vymycdq1b35iz2w",
    productName: "20 小時套票",
    plan: "20hr",
    hours: 20,
    amount: 48000,
    emailTemplate: "consulting-enrollment-welcome",
  },

  // 支持寫作（小額斗內）
  zuh0uke6ts1e7656juk97ob9: {
    kind: "donation",
    productId: "zuh0uke6ts1e7656juk97ob9",
    productName: "支持寫作 - 一個月的鼓勵",
  },
  v4dpcyliegt2d3s9uh6wfqoc: {
    kind: "donation",
    productId: "v4dpcyliegt2d3s9uh6wfqoc",
    productName: "支持寫作 - 一週能量",
  },
  jtv3eigwnw4jjyqpev1pqojq: {
    kind: "donation",
    productId: "jtv3eigwnw4jjyqpev1pqojq",
    productName: "支持寫作 - 一頓午餐",
  },
  msxyvif5senhaxv53u11tklm: {
    kind: "donation",
    productId: "msxyvif5senhaxv53u11tklm",
    productName: "支持寫作 - 一杯咖啡",
  },
};

// AI 學術研究工作臺（ARS）5 個 bundle：webhook 側（伺服器端，不受 NEXT_PUBLIC_ 前綴限制）
// 改為寫死常數表，不再依賴 env 讀值。原因：env typo 或漏設會讓付費訂單靜默落到
// generic 分支（客戶付錢卻拿不到下載連結，且 Recur 對 order.paid 不會重試），是最壞情境。
// 這組 productId 已實測確認在 sandbox／production 共用同一組值，寫死是刻意設計。
// CheckoutButton（client 側，需要 NEXT_PUBLIC_ 前綴才能在瀏覽器讀到）維持 env-only，不受此表影響。
const ARS_PRODUCT_ID_TO_BUNDLE: Record<string, ArsBundle> = {
  uywm5vudlfzhlkc96omzcdio: "grad",
  h8kqd7tlxvq571iqof11gqc2: "faculty",
  tyutghxnw5hyg5zqlzci92r8: "clinician",
  vz1lsesabm0gfi26kxgrgc7l: "allaccess",
  uwsuy945sqcynnhbdul0bu72: "addon-vertical",
};

const ARS_BUNDLE_PRODUCT_NAMES: Record<ArsBundle, string> = {
  grad: "AI 學術研究工作臺・研究生包",
  faculty: "AI 學術研究工作臺・教授包",
  clinician: "AI 學術研究工作臺・醫師包",
  allaccess: "AI 學術研究工作臺・All-Access 全學科包",
  "addon-vertical": "AI 學術研究工作臺・單科垂直包",
};

function resolveArsBundleConfig(
  productId: string,
): Extract<ProductEmailConfig, { kind: "ars-bundle" }> | undefined {
  const bundle = ARS_PRODUCT_ID_TO_BUNDLE[productId];
  if (!bundle) return undefined;
  return {
    kind: "ars-bundle",
    productId,
    productName: ARS_BUNDLE_PRODUCT_NAMES[bundle],
    bundle,
  };
}

export function resolveProductConfig(
  productId: string | undefined,
  productNameFallback?: string,
): ProductEmailConfig {
  if (productId && PRODUCT_CONFIG_MAP[productId]) {
    return PRODUCT_CONFIG_MAP[productId];
  }
  if (productId) {
    const arsConfig = resolveArsBundleConfig(productId);
    if (arsConfig) return arsConfig;
  }
  // 未登記產品也要寄一封通用確認信，避免客戶孤兒
  return {
    kind: "default",
    productId: productId ?? "unknown",
    productName: productNameFallback ?? "你的訂單",
  };
}
