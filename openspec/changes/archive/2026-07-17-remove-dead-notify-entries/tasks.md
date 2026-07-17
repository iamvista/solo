## 1. 移除三頁的失效入口

- [x] 1.1 `innovation-workshop`、`senior-asset-safety`、`ai-monetization-institute` 三支銷售頁不再掛載也不再 import `CourseNotifyEntry`，程式碼呈現事實（這三頁沒有候補入口），而非掛著一個永遠 return null 的元件。滿足 "Every course surface exposes an entry to the notification list" 界定後的適用範圍。驗證：三頁 `grep CourseNotifyEntry` 皆零命中；`npx tsc --noEmit` 對三頁零新錯誤（確認沒留下未使用的 import）。

## 2. 確認未波及其他頁面與內容

- [x] 2.1 六門在 workshops.ts 中的課程，頁尾與報名按鈕下方的入口皆不受影響。驗證：`pnpm test` 全套通過；`git diff` 顯示三頁各只少 2 行，其餘內容零改動（含 `ai-monetization-institute` 的 `RegistrationForm` 仍在）。
- [x] 2.2 三頁維持既有的下架重導行為，未因移除入口而改變。驗證：production 實測三頁皆回 308（innovation-workshop 與 senior-asset-safety → /courses、ai-monetization-institute → /teachers/vista），跟隨重導後最終 HTTP 200。更正先前假設：這三頁並非「可開啟的孤兒頁」，而是 2026-07-12 commit 5fc6c51（A-010）已於 next.config.ts 設下架重導的死頁，sitemap.ts:43 亦有註記。被移除的 CourseNotifyEntry 因此是雙重死碼：頁面訪客進不去，入口本身也查無課程而 return null。
