## Problem

`innovation-workshop`、`senior-asset-safety`、`ai-monetization-institute` 三支銷售頁各掛著一個 `CourseNotifyEntry`，但這三個 slug 不存在於 `workshops.ts`。元件查無課程時 `return null`，所以這三個入口從未渲染過任何東西：頁面看起來提供了候補功能，實際上訪客的候補意願全數落空，而且沒有任何跡象顯示這件事正在發生。

Vista 已確認這三門課收掉，不補進 `workshops.ts`。既然不打算讓它們活過來，程式碼就不該繼續假裝它們活著。

## Root Cause

`CourseNotifyEntry`（`src/components/course/CourseNotifyEntry.tsx:10`）在查無課程時靜默 `return null`。這個降級對正式站是對的（不破版），但它讓「頁面掛了一個永遠不會出現的入口」變成一個無聲的狀態：沒有錯誤、沒有日誌、沒有測試失敗，只有收不到的名單。

## Proposed Solution

從三支銷售頁移除 `CourseNotifyEntry` 的 import 與掛載，讓程式碼呈現事實：這三頁沒有候補入口。

同時界定規格範圍。現行 `course-waitlist-capture` 要求「每個呈現課程的介面都必須提供候補入口」，若不界定，這三頁移除後即違反該條。實際上「系統認得的課程」的單一來源就是 `workshops.ts`：不在其中的頁面，系統無從得知課程標題與狀態，也就無從提供一個能運作的入口。規格應明說，該要求涵蓋的是 workshops 資料源中的課程，其銷售頁與講師頁課程卡。

## Success Criteria

- 三支銷售頁不再 import 或掛載 `CourseNotifyEntry`，頁面其餘內容與版面完全不變。
- 六門在 `workshops.ts` 中的課程，其頁尾與報名按鈕下方的入口不受影響。
- 全套測試通過；三頁線上仍正常渲染（HTTP 200）。
- 規格明確界定候補入口要求的適用範圍，不再與現實矛盾。

## Impact

- 修改：`src/app/courses/innovation-workshop/page.tsx`、`src/app/courses/senior-asset-safety/page.tsx`、`src/app/courses/ai-monetization-institute/page.tsx`，各移除 2 行（import 與掛載）。
- 修改規格：`course-waitlist-capture` 的「Every course surface exposes an entry to the notification list」界定適用範圍。
- 不動：三頁的其餘內容（含 `ai-monetization-institute` 的 `RegistrationForm`）、`CourseNotifyEntry` 元件本身、`CourseNotifyFooter`、API、資料表。
- 不刪除任何頁面：三頁維持可用網址，舊連結與名片 QR 不會變成 404。
