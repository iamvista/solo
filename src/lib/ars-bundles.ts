/**
 * AI 學術研究工作臺（ARS）bundle 單一事實來源。
 * success 頁、webhook fulfilment、下載 route 都從這裡 import，避免同一組常數（時效、
 * 次數上限、權限矩陣、Blob pathname）在多處各自維護而漂移。
 */

export type ArsBundle =
  | "grad"
  | "faculty"
  | "clinician"
  | "allaccess"
  | "addon-vertical";

export type ArsVertical = "medical" | "social" | "business" | "stem";

export type ArsPart = "core" | "vertical" | "teaching" | "all";

export const ARS_VERTICALS: ArsVertical[] = [
  "medical",
  "social",
  "business",
  "stem",
];

export const ARS_PARTS: ArsPart[] = ["core", "vertical", "teaching", "all"];

/** 下載連結有效期（小時）。success 頁文案與 webhook 下載信必須 import 這個常數，不得寫死第二份。 */
export const DOWNLOAD_TTL_HOURS = 72;

/** 各 bundle 的下載次數上限（2026-07-11 CEO review 拍板：faculty 12、其餘 8、addon 4）。 */
export const ARS_BUNDLE_MAX_DOWNLOADS: Record<ArsBundle, number> = {
  faculty: 12,
  grad: 8,
  clinician: 8,
  allaccess: 8,
  "addon-vertical": 4,
};

export const ARS_BUNDLE_LABELS: Record<ArsBundle, string> = {
  grad: "研究生包",
  faculty: "教授包",
  clinician: "醫師包",
  allaccess: "All-Access 全學科包",
  "addon-vertical": "單科垂直包",
};

/** 銷售頁與 Recur 產品建立的定價單一事實來源（NT$，一次性）。改價只改這裡。 */
export const ARS_BUNDLE_PRICES: Record<ArsBundle, number> = {
  grad: 1980,
  faculty: 2980,
  clinician: 3980,
  allaccess: 5980,
  "addon-vertical": 980,
};

export const ARS_VERTICAL_LABELS: Record<ArsVertical, string> = {
  medical: "醫學",
  social: "社會科學",
  business: "商管",
  stem: "理工",
};

/** bundle → 允許下載的 part 權限矩陣。下載 route 的 entitlement 驗證以此為唯一依據。 */
export const ARS_BUNDLE_ALLOWED_PARTS: Record<ArsBundle, ArsPart[]> = {
  grad: ["core", "vertical"],
  faculty: ["core", "teaching", "vertical"],
  clinician: ["core", "vertical"],
  allaccess: ["all"],
  "addon-vertical": ["vertical"],
};

const ARS_BUNDLE_VERSION = "v1";

export function isArsBundle(value: string | null | undefined): value is ArsBundle {
  return !!value && value in ARS_BUNDLE_ALLOWED_PARTS;
}

export function isArsPart(value: string | null | undefined): value is ArsPart {
  return !!value && (ARS_PARTS as string[]).includes(value);
}

export function isArsVertical(
  value: string | null | undefined,
): value is ArsVertical {
  return !!value && (ARS_VERTICALS as string[]).includes(value);
}

export function bundleAllowsPart(bundle: ArsBundle, part: ArsPart): boolean {
  return ARS_BUNDLE_ALLOWED_PARTS[bundle].includes(part);
}

/** part（＋vertical，僅 part="vertical" 時需要）→ 版本化 Blob pathname。 */
export function arsPartBlobPathname(part: ArsPart, vertical?: ArsVertical): string {
  const base = `products/ars/${ARS_BUNDLE_VERSION}`;
  switch (part) {
    case "core":
      return `${base}/ars-core.zip`;
    case "teaching":
      return `${base}/ars-teaching-prep.zip`;
    case "all":
      return `${base}/ars-allaccess.zip`;
    case "vertical":
      if (!vertical) throw new Error("arsPartBlobPathname: vertical required for part=vertical");
      return `${base}/ars-vertical-${vertical}.zip`;
    default:
      throw new Error(`arsPartBlobPathname: unknown part ${part as string}`);
  }
}
