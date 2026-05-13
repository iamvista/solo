/**
 * Recur 產品 → 確認信類型對應表。
 * 新增產品時在這裡登記，webhook handler 會自動依這份設定發信。
 */

export type ConsultingPlan = "1hr" | "3hr" | "5hr" | "10hr" | "20hr";

export type ProductEmailConfig =
  | {
      kind: "ai-coach-kit";
      productId: "xqvb9nqxtehhfesuhequm9jp";
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

const COURSE_PROPOSAL_NEXT_STEPS = [
  "開課前 2 天會寄出含教室地址、課前準備清單等資訊的提醒信",
  "開課當週若因故有任何臨時調整，會以 E-mail 與簡訊雙重通知",
  "建議準備一份「下週要交的真實提案」，課堂上直接優化最有感",
];

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

const PRODUCT_CONFIG_MAP: Record<string, ProductEmailConfig> = {
  // AI 教練工坊（既有下載流程）
  [AI_COACH_KIT_PRODUCT_ID]: {
    kind: "ai-coach-kit",
    productId: AI_COACH_KIT_PRODUCT_ID,
  },

  // AI 提案亮點實戰課（2026/6/13 臺北）
  k0kbiflm1tckzvqd39u4uw3w: {
    kind: "course",
    productId: "k0kbiflm1tckzvqd39u4uw3w",
    productName: "AI 提案亮點實戰課（2026/6/13 臺北）",
    whatsNext: COURSE_PROPOSAL_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/ai-proposal-spotlight",
  },
  ayaalujxfzgv6c4r0i8n8qkp: {
    kind: "course",
    productId: "ayaalujxfzgv6c4r0i8n8qkp",
    productName: "AI 提案亮點實戰課・早鳥（2026/6/13 臺北）",
    whatsNext: COURSE_PROPOSAL_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/ai-proposal-spotlight",
  },
  lzg8am8dx7bb5n26f74xeoop: {
    kind: "course",
    productId: "lzg8am8dx7bb5n26f74xeoop",
    productName: "AI 提案亮點實戰課・雙人同行（2026/6/13 臺北）",
    whatsNext: COURSE_PROPOSAL_NEXT_STEPS,
    detailUrl: "https://www.solo.tw/courses/ai-proposal-spotlight",
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

export function resolveProductConfig(
  productId: string | undefined,
  productNameFallback?: string,
): ProductEmailConfig {
  if (productId && PRODUCT_CONFIG_MAP[productId]) {
    return PRODUCT_CONFIG_MAP[productId];
  }
  // 未登記產品也要寄一封通用確認信，避免客戶孤兒
  return {
    kind: "default",
    productId: productId ?? "unknown",
    productName: productNameFallback ?? "你的訂單",
  };
}
