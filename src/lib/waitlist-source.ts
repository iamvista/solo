/**
 * 把 source_page 轉成後臺看得懂的入口標示。
 *
 * 一個課程銷售頁同時有兩個候補入口（報名按鈕下方的次要連結、頁尾的展開表單），
 * 兩者靠 source_page 的 #footer 後綴區分。這份對照讓「哪個入口比較有用」
 * 在後臺就答得出來，不必匯出 CSV 或查資料庫。
 */
export function sourceLabel(sourcePage: string | null): string {
  if (!sourcePage) return "—";
  if (sourcePage.endsWith("#footer")) return "頁尾";
  if (sourcePage.endsWith("/notify")) return "廣告落地頁";
  if (sourcePage.startsWith("/teachers/")) return "講師頁";
  if (sourcePage.startsWith("/courses/")) return "報名按鈕下方";
  // 認不得就原樣呈現：假裝認得會讓來源看起來比實際更確定
  return sourcePage;
}
