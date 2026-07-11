/**
 * 無人公司 AI 軍團啟動包（army-kit）單一事實來源。
 * webhook fulfilment、下載 route、銷售頁與 success 頁文案都從這裡 import，避免
 * 定價／時效／次數上限／Blob pathname 在多處各自維護而漂移。
 */

// 已建產品，跨 sandbox／production 共用同一組值（比照 ars 的寫死常數表設計）。
export const ARMY_PRODUCT_ID = "g7i9iptfxfqxjip5jdr6hj90";

export const ARMY_KIT_PRODUCT_NAME = "無人公司 AI 軍團啟動包";

const ARMY_KIT_VERSION = "v1";

/** 版本化 Blob pathname，改版遞增（v1 → v2），舊版不刪。 */
export const ARMY_BLOB_PATHNAME = `products/army/${ARMY_KIT_VERSION}/solo-army-full.zip`;

/** 下載檔名（Content-Disposition）。 */
export const ARMY_DOWNLOAD_FILENAME = "solo-army-kit.zip";

/** 下載連結有效期（小時）。webhook 下載信與 success 頁文案必須 import 這個常數，不得寫死第二份。 */
export const DOWNLOAD_TTL_HOURS = 72;

export const MAX_DOWNLOADS = 5;

/** 銷售頁與 Recur 產品建立的定價單一事實來源（NT$，一次性）。改價只改這裡。 */
export const ARMY_KIT_PRICE = 990;
