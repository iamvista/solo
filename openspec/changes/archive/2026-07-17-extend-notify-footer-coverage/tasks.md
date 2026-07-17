## 1. 頁尾文案依課程狀態三分

- [x] 1.1 `coming_soon` 的課程，頁尾區塊提示改為「還沒公告開課日期？」並說明日期一公告就通知；`full` 維持「這期已經額滿？」；其餘維持「這期時間對不上？」。送出的 intent 不變（full 得 `full_waitlist`、其餘得 `date_conflict`），資料庫 intent 約束零影響。滿足 "The footer entry derives its intent from course status"。驗證：元件測試依 spec 的對照表逐列斷言五種 status 的區塊提示與送出 intent，`pnpm test` 通過。

## 2. 套用至其餘 5 門課

- [x] 2.1 `ai-content`、`vibe-coding`、`positioning-convergence`、`concept-monetization-bootcamp` 四頁的頁尾出現已展開的通知表單，且各頁「立即報名」仍是唯一主要行動點。驗證：`pnpm dev` 逐頁開啟目視確認，並確認四頁 `source_page` 各自帶對應的 `/courses/<slug>#footer`。
- [x] 2.2 `vibe-coding-claude-code`（status `coming_soon`）頁尾顯示的是「還沒公告開課日期？」而非「這期時間對不上？」。驗證：`pnpm dev` 開頁目視確認文案正確。

## 3. 後臺顯示來源入口

- [x] 3.1 `/admin/waitlist` 表格每列顯示該筆來自哪個入口（頁尾／報名按鈕下方／廣告落地頁／講師頁），由 `source_page` 推導為可讀標示，操作者不必匯出 CSV 或查資料庫就能比較兩個入口的收單成效。滿足 "The admin waitlist view supports segmentation"。驗證：`sourceLabel` 單元測試 7 條全過（涵蓋 spec 對照表四種輸入、同頁兩入口必須可區分、無來源、未知值原樣降級）；空狀態 colSpan 已同步 8→9。本機目視未能執行（後臺需管理者 session，dev server 無），改於 production 驗（見 4.3）。

## 4. 驗證與上線

- [x] 4.1 全套測試與 lint 通過，未破壞既有候補流程與後臺。驗證：`pnpm test` 與 `npx eslint` 對改動檔案皆無 error，`npx tsc --noEmit` 對改動檔案零新錯誤。
- [x] 4.2 五門課的線上頁面皆渲染頁尾區塊。驗證：production 部署後對 6 個 URL（含既有的 ai-academic-writing）逐一跑 `curl -H "Cache-Control: no-cache"`，六頁皆命中各自的 `#footer` 歸因值與正確提示文案；vibe-coding-claude-code 顯示「還沒公告開課日期？」，其餘顯示「這期時間對不上？」。
- [x] 4.3 後臺來源欄在正式站可見。驗證：以管理者身分開 https://www.solo.tw/admin/waitlist 目視確認，既有 5 筆真實資料的來源欄正確呈現（3 筆「報名按鈕下方」、2 筆「講師頁」），未新增任何測試資料。頁尾入口目前 0 筆，為後續對照的基準線。
