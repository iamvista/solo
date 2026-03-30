/**
 * PAYUNi 統一金流 SDK (TypeScript / Node.js)
 *
 * 加密方式：AES-256-GCM
 * 格式：hex(ciphertext) + ":::" + base64(authTag)
 * Hash：SHA256(HashKey + EncryptInfo + HashIV).toUpperCase()
 *
 * 文件參考：https://www.payuni.com.tw/docs/web/
 * PHP SDK 參考：https://github.com/payuni/PHP_SDK
 *
 * 環境變數：
 *   PAYUNI_MER_ID   — 商店代號
 *   PAYUNI_HASH_KEY — 32 字元 AES Key
 *   PAYUNI_HASH_IV  — 16 字元 GCM IV
 *   PAYUNI_API_URL  — API 網址（測試: https://sandbox-api.payuni.com.tw
 *                                正式: https://api.payuni.com.tw）
 */

import crypto from "crypto";

/* ─── 環境變數 ─── */
const MER_ID = process.env.PAYUNI_MER_ID ?? "";
const HASH_KEY = process.env.PAYUNI_HASH_KEY ?? "";
const HASH_IV = process.env.PAYUNI_HASH_IV ?? "";
const API_URL =
  process.env.PAYUNI_API_URL ?? "https://sandbox-api.payuni.com.tw";

/* ─── 加密：AES-256-GCM ─── */
export function encrypt(data: Record<string, string | number>): string {
  const queryString = new URLSearchParams(
    Object.entries(data).map(([k, v]) => [k, String(v)])
  ).toString();

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    HASH_KEY.trim(),
    HASH_IV.trim()
  );

  let encrypted = cipher.update(queryString, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // PAYUNi 格式：hex密文 + ":::" + base64(authTag)
  return (encrypted + ":::" + authTag.toString("base64")).trim();
}

/* ─── 解密：AES-256-GCM ─── */
export function decrypt(encryptedStr: string): Record<string, string> {
  const [encData, tagBase64] = encryptedStr.split(":::");
  const tag = Buffer.from(tagBase64, "base64");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    HASH_KEY.trim(),
    HASH_IV.trim()
  );
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return Object.fromEntries(new URLSearchParams(decrypted));
}

/* ─── 產生 SHA256 Hash ─── */
export function generateHash(encryptInfo: string): string {
  return crypto
    .createHash("sha256")
    .update(HASH_KEY + encryptInfo + HASH_IV)
    .digest("hex")
    .toUpperCase();
}

/* ─── 建立付款請求（UPP 整合付款頁） ─── */
export interface CreatePaymentParams {
  orderNo: string;
  amount: number;
  productName: string;
  buyerEmail: string;
  returnUrl: string;
  notifyUrl: string;
}

export function createPaymentForm(params: CreatePaymentParams) {
  const timestamp = Math.floor(Date.now() / 1000);

  const rawData: Record<string, string | number> = {
    MerID: MER_ID,
    MerTradeNo: params.orderNo,
    Timestamp: timestamp,
    TradeAmt: params.amount,
    ProdDesc: params.productName,
    ReturnURL: params.returnUrl,
    NotifyURL: params.notifyUrl,
    UsrMail: params.buyerEmail,
  };

  const encryptInfo = encrypt(rawData);
  const hashInfo = generateHash(encryptInfo);

  return {
    /** 用 form POST 提交到這個網址（瀏覽器會跳轉到 PAYUNi 付款頁） */
    actionUrl: `${API_URL}/api/upp`,
    /** 表單欄位 */
    fields: {
      MerID: MER_ID,
      Version: "1.0",
      EncryptInfo: encryptInfo,
      HashInfo: hashInfo,
    },
  };
}

/* ─── 驗證回調 ─── */
export function verifyCallback(encryptInfo: string, hashInfo: string): {
  valid: boolean;
  data: Record<string, string> | null;
} {
  const expectedHash = generateHash(encryptInfo);
  if (expectedHash !== hashInfo) {
    return { valid: false, data: null };
  }

  try {
    const data = decrypt(encryptInfo);
    return { valid: true, data };
  } catch {
    return { valid: false, data: null };
  }
}

/* ─── 檢查環境變數是否已設定 ─── */
export function isConfigured(): boolean {
  return Boolean(MER_ID && HASH_KEY && HASH_IV);
}
