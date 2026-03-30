/**
 * PAYUNi 統一金流 SDK (TypeScript / Node.js)
 *
 * 加密方式：AES-256-GCM
 * 文件參考：https://www.payuni.com.tw/docs/web/
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
    Buffer.from(HASH_KEY, "utf-8"),
    Buffer.from(HASH_IV, "utf-8")
  );

  let encrypted = cipher.update(queryString, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // PAYUNi 格式：密文 + authTag 拼接
  return encrypted + authTag;
}

/* ─── 解密：AES-256-GCM ─── */
export function decrypt(encryptedHex: string): Record<string, string> {
  // 最後 32 字元（16 bytes hex）是 authTag
  const authTagHex = encryptedHex.slice(-32);
  const cipherTextHex = encryptedHex.slice(0, -32);

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(HASH_KEY, "utf-8"),
    Buffer.from(HASH_IV, "utf-8")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(cipherTextHex, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  // 解析 URL query string
  const params = new URLSearchParams(decrypted);
  return Object.fromEntries(params.entries());
}

/* ─── 產生 SHA256 Hash ─── */
export function generateHash(encryptInfo: string): string {
  return crypto
    .createHash("sha256")
    .update(`HashKey=${HASH_KEY}&${encryptInfo}&HashIV=${HASH_IV}`)
    .digest("hex")
    .toUpperCase();
}

/* ─── 建立付款請求 ─── */
export interface CreatePaymentParams {
  /** 你的訂單編號 */
  orderNo: string;
  /** 金額（整數，新臺幣） */
  amount: number;
  /** 商品名稱 */
  productName: string;
  /** 付款人 Email */
  buyerEmail: string;
  /** 付款完成後跳轉網址 */
  returnUrl: string;
  /** 背景通知網址（Server-to-Server） */
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
    // 啟用信用卡 + ATM + 超商
    Card: "1",
    VACC: "1",
    CVS: "1",
  };

  const encryptInfo = encrypt(rawData);
  const hashInfo = generateHash(encryptInfo);

  return {
    /** POST 到這個網址 */
    actionUrl: `${API_URL}/api/credit`,
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
