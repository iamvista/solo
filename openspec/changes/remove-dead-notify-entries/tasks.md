## 1. 移除三頁的失效入口

- [x] 1.1 `innovation-workshop`、`senior-asset-safety`、`ai-monetization-institute` 三支銷售頁不再掛載也不再 import `CourseNotifyEntry`，程式碼呈現事實（這三頁沒有候補入口），而非掛著一個永遠 return null 的元件。滿足 "Every course surface exposes an entry to the notification list" 界定後的適用範圍。驗證：三頁 `grep CourseNotifyEntry` 皆零命中；`npx tsc --noEmit` 對三頁零新錯誤（確認沒留下未使用的 import）。

## 2. 確認未波及其他頁面與內容

- [x] 2.1 六門在 workshops.ts 中的課程，頁尾與報名按鈕下方的入口皆不受影響。驗證：`pnpm test` 全套通過；`git diff` 顯示三頁各只少 2 行，其餘內容零改動（含 `ai-monetization-institute` 的 `RegistrationForm` 仍在）。
- [ ] 2.2 三頁本身仍可正常開啟，未因移除而破版或 404。驗證：部署後對三個 URL 跑 `curl -H "Cache-Control: no-cache"`，皆回 HTTP 200 且頁面主要內容（各自標題）仍在。
