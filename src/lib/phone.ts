import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export interface NormalizedPhone {
  /** E.164 格式（e.g. "+886912345678"） */
  e164: string;
  /** 國碼縮寫（TW、US、JP……）；無法判斷則 undefined */
  country?: CountryCode;
  /** 國際格式（顯示用） */
  international: string;
}

/**
 * 把使用者輸入的電話正規化成 E.164。
 * 接受：
 *  - 純台灣本地：0912345678（會 default 加 +886）
 *  - 國際格式：+886912345678 / +1 415-555-2671
 *  - 不含 + 但有國碼：886912345678 → 視為國際
 */
export function normalizePhone(
  input: string,
  defaultCountry: CountryCode = "TW",
): NormalizedPhone | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 第一次嘗試帶 default country
  let parsed = parsePhoneNumberFromString(trimmed, defaultCountry);
  // 若 default country 解析失敗，再試一次不帶 default（給已含 + 號的國際格式）
  if (!parsed && !trimmed.startsWith("+")) {
    parsed = parsePhoneNumberFromString(`+${trimmed}`);
  }
  if (!parsed || !parsed.isValid()) return null;

  return {
    e164: parsed.number,
    country: parsed.country,
    international: parsed.formatInternational(),
  };
}
