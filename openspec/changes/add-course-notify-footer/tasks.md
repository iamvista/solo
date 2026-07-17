## 1. 共用課程查詢 util

- [x] 1.1 抽出 `findWorkshop(slug)`（實作命名為 `getWorkshopBySlug`，對齊 `workshops.ts` 既有的 `getInstructorBySlug` 慣例）：傳入 slug 回傳對應 workshop 或 undefined，讓上方入口與頁尾入口從同一個查詢解析課程資料，滿足 "Every course surface exposes an entry to the notification list" 對 shared course lookup 的要求。驗證：新增 util 單元測試，涵蓋命中與查無兩種情形，`pnpm test` 通過。
- [x] 1.2 `CourseNotifyEntry` 改由 `findWorkshop` 解析課程，對外行為完全不變（查無課程仍靜默 return null，該缺陷不在本次範圍）。驗證：既有 `pnpm test` 全綠，且 `pnpm dev` 開 `/courses/ai-academic-writing` 時報名按鈕下方的次要文字連結仍照舊渲染。

## 2. CourseNotifyFooter 元件

- [x] 2.1 頁尾區塊只收 slug 即可掛載，渲染一份無需點擊即已展開的候補表單，標題取自 workshops 查出的課程標題而非頁面傳入值，滿足 "Course sales pages expose a footer notification block"。驗證：元件測試斷言表單在未經任何點擊時即出現，且標題含課程標題。
- [x] 2.2 送出的 intent 依課程 status 推導，`full` 得 `full_waitlist`、其餘 status 得 `date_conflict`，表單標題與送出按鈕文案隨之改變，滿足 "The footer entry derives its intent from course status"。驗證：元件測試依 spec 的 intent 對照表逐列斷言 heading 與 submit label。
- [x] 2.3 頁尾送出帶 `source_page` 為 `/courses/<slug>#footer`，與上方入口的 `/courses/<slug>` 可資區分，滿足 "The footer entry is attributable separately from the entry above it"。驗證：元件測試攔截 fetch，斷言 request payload 的 `source_page` 值正確。
- [x] 2.4 slug 查無課程時，開發環境 throw 並指出該 slug、正式環境 return null 且不影響周圍頁面，滿足 "An unresolvable course slug fails loudly in development and degrades silently in production"。驗證：元件測試分別在兩種 `NODE_ENV` 下斷言 throw 與靜默降級。

## 3. 套用至 ai-academic-writing

- [x] 3.1 `ai-academic-writing` 銷售頁尾出現已展開的下期開課通知表單，且頁面上方「立即報名」仍是唯一主要行動點、次要文字連結維持原狀。驗證：`pnpm dev` 開頁目視確認兩個入口並存且視覺層級正確。

## 4. 驗證與上線

- [x] 4.1 全套測試與 lint 通過，未破壞既有候補流程。驗證：`pnpm test` 與 `pnpm lint` 全綠。
- [x] 4.2 線上頁面實際渲染頁尾區塊。驗證：改走 preview 分支部署（未推 main），以 Vercel share token 繞過 preview 保護後 curl 取得 HTTP 200，grep 命中頁尾標題、`#footer` 歸因值、上方入口與主 CTA 四者並存。production 驗證待 merge 後補跑。
- [x] 4.3 端到端送出一筆真實候補，`course_waitlist` 出現 `source_page` 為 `/courses/ai-academic-writing#footer` 的列。驗證：已於 preview 以真實表單送出，DB 確認 source_page=`/courses/ai-academic-writing#footer`、intent=`date_conflict`、instructor_slug=`vista`，測試資料已從 course_waitlist 與 newsletter_subscribers 刪除（各 0 列殘留）。確認信未能驗證：preview 環境缺 `WAITLIST_TOKEN_SECRET`（僅綁在 feat/course-waitlist-notify 分支），寄信於 after() 中失敗且只記 log；Production 已設該變數，故 merge 後需補驗一次確認信。
