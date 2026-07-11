/**
 * 講師 AI 幕僚（lecturer-kit）單一事實來源。
 * webhook fulfilment、下載 route、銷售頁與 success 頁文案都從這裡 import，避免
 * 定價／時效／次數上限／Blob pathname 在多處各自維護而漂移。
 */

// 已建產品，跨 sandbox／production 共用同一組值（比照 army-kit 的寫死常數表設計）。
export const LECTURER_PRODUCT_ID = "lgzuc8wf1ulcw5qu8e78uxjs";

export const LECTURER_KIT_PRODUCT_NAME = "講師 AI 幕僚";

const LECTURER_KIT_VERSION = "v1";

/** 版本化 Blob pathname，改版遞增（v1 → v2），舊版不刪。 */
export const LECTURER_BLOB_PATHNAME = `products/lecturer/${LECTURER_KIT_VERSION}/lecturer-ai-staff-full.zip`;

/** 下載檔名（Content-Disposition）。 */
export const LECTURER_DOWNLOAD_FILENAME = "lecturer-ai-staff-kit.zip";

/** 下載連結有效期（小時）。webhook 下載信與 success 頁文案必須 import 這個常數，不得寫死第二份。 */
export const LECTURER_DOWNLOAD_TTL_HOURS = 72;

export const LECTURER_MAX_DOWNLOADS = 5;

/** 銷售頁與 Recur 產品建立的定價單一事實來源（NT$，一次性）。改價只改這裡。 */
export const LECTURER_KIT_PRICE = 1490;
