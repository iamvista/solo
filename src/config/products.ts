/**
 * Recur 產品集中設定
 *
 * 為什麼集中：早期 productId 散落在各 page，要改 productId 或加新產品時容易漏。
 * 這個檔案是新規範，請新產品都從這裡走；舊產品可逐步遷入。
 */

export interface ProductConfig {
  /** Recur 後臺的 productId，建立 ONE_TIME / SUBSCRIPTION 產品後填入 */
  productId: string;
  /** 顯示名稱（用於後臺 log 與 webhook 分流） */
  name: string;
  /** 顯示金額（純文字，純 UI 用，實際金額以 Recur 後臺為準） */
  displayPrice: string;
  /** 是否已在 Recur 後臺建立。false 時 UI 應 disable 結帳按鈕 */
  ready: boolean;
}

/**
 * AI 個人脈絡庫 Done-For-You 服務（90 分鐘訪談 + 10 份文件 + 安裝到 Claude Project）
 *
 * TODO（上線前必做）：
 * 1. Vista 在 Recur 後臺建立 ONE_TIME 產品「個人 Context Architecture DFY」
 *    - 早鳥金額 NT$ 8,800（前 10 位）
 *    - 一般金額 NT$ 12,000
 *    - 建議建兩個獨立 productId，前端依名額判斷顯示哪一個
 *      （Recur SDK 的 redirectToCheckout 沒有 amount 覆寫，必須各自獨立產品）
 * 2. 把 productId 寫進下方 EARLY_BIRD_PRODUCT_ID / REGULAR_PRODUCT_ID
 * 3. 把 ready 改為 true
 * 4. 在 Vercel 環境變數加上：
 *    NEXT_PUBLIC_RECUR_CONTEXT_ARCH_DFY_EARLY_PRODUCT_ID
 *    NEXT_PUBLIC_RECUR_CONTEXT_ARCH_DFY_REGULAR_PRODUCT_ID
 * 5. 設定 Calendly / Cal.com 預約連結，更新 BOOKING_URL
 * 6. 在 src/app/api/webhooks/recur/route.ts 加入 product_id 分流，
 *    收到此產品的 order.paid 時寄送含預約連結的 email（先沿用 sendEmail，模板可
 *    複製 ai-coach-kit-purchase 改寫）
 */
export const CONTEXT_ARCH_DFY = {
  earlyBird: {
    productId:
      process.env.NEXT_PUBLIC_RECUR_CONTEXT_ARCH_DFY_EARLY_PRODUCT_ID ?? "",
    name: "個人 Context Architecture DFY（早鳥）",
    displayPrice: "NT$ 8,800",
    ready: false,
  } satisfies ProductConfig,
  regular: {
    productId:
      process.env.NEXT_PUBLIC_RECUR_CONTEXT_ARCH_DFY_REGULAR_PRODUCT_ID ?? "",
    name: "個人 Context Architecture DFY",
    displayPrice: "NT$ 12,000",
    ready: false,
  } satisfies ProductConfig,
} as const;

/**
 * 預約訪談連結（付款成功後 email 內容用）
 * TODO：Vista 設定 Calendly / Cal.com 後更新此值，並把 webhook 的通知 email 模板加上此連結
 */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_CONTEXT_ARCH_DFY_BOOKING_URL ??
  "https://cal.com/vista/ai-context-library-dfy"; // placeholder
