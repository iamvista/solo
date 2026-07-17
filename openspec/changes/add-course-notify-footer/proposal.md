## Why

課程銷售頁目前唯一的候補入口，是報名按鈕下方一行低調的次要文字連結。這個低調是刻意的設計決策，用意是不與「立即報名」搶主要行動點，但它低調到連站主本人都不知道這個功能存在，訪客的發現率可以合理推定趨近於零。候補名單因此收不到它本該收到的人。

直接把上方入口改醒目會付出真實代價：`ai-academic-writing` 正在招生（2026/09/12 開課），醒目的候補入口會給猶豫中的訪客一個比報名更輕鬆的出口，等於拿當期營收換名單。所以真正的問題不是「該不該更明顯」，而是「在哪裡更明顯」。

頁尾是答案。一個訪客把整頁銷售頁滑到底、看完 FAQ 仍未點報名，他多半已決定這期不報。此時給他候補入口，攔截的是即將流失的訪客，不是猶豫中的買家。

## What Changes

- 新增 `CourseNotifyFooter` 元件：課程銷售頁尾的完整候補區塊，表單直接展開，介面為 `<CourseNotifyFooter slug="..." />`，課程標題與狀態一律從 `workshops.ts` 查，銷售頁不硬編碼課程資料。
- 兩個入口以 `source_page` 區分成效：上方維持 `/courses/<slug>`，頁尾送出 `/courses/<slug>#footer`。沒有這項區分，本次改動就無法驗證是否有效。
- **BREAKING（規格層）**：放寬 `course-waitlist-capture` 現行「有名額時表單只在連結被點擊後才出現」與「入口由單一共用元件提供」兩項規定。頁尾入口位於頁面底部、與報名行動點相距整頁內容，不構成競爭，因此得以直接展開表單。
- 抽出共用的 `workshops.find(slug)` 查詢 util，供上方入口與頁尾入口共用，確保課程資料來源不發散。
- 查無課程 slug 時，開發環境明確報錯、正式環境靜默降級，不複製 `CourseNotifyEntry` 靜默 `return null` 的既有缺陷。
- 本次僅套用至 `/courses/ai-academic-writing` 一頁。

## Non-Goals

- **不修既有的三頁靜默失效**：`ai-monetization-institute`、`innovation-workshop`、`senior-asset-safety` 三支銷售頁呼叫 `CourseNotifyEntry`，但其 slug 不存在於 `workshops.ts`，入口靜默失效。這是既有缺陷，已知但不在本次範圍。
- **不收斂 `workshops.ts` 與 `courses-config.ts` 兩份會漂移的課程資料源**。屬重構，範圍遠大於本次。
- **不動後端**：`/api/courses/waitlist`、`course_waitlist` 表、RPC `upsert_course_waitlist`、Resend 確認信、`/admin/waitlist` 廣播一律沿用，本次是純展示層變更。
- **不改上方入口的呈現**：報名按鈕下方那行次要文字連結維持原狀，以便對照兩個入口的收單成效。
- **不套用到其餘 8 門課**：待 `ai-academic-writing` 累積實際數據、確認頁尾入口未侵蝕當期報名後再決定。
- **已否決：依課程時程自動調整入口強度**（招生初期低調、接近開課日轉醒目）。以目前 9 門課的規模屬過度工程。

## Capabilities

### New Capabilities

- `course-notify-footer`: 課程銷售頁尾的候補入口區塊，涵蓋呈現規則、intent 推導、`source_page` 歸因值、查無課程時的降級行為。

### Modified Capabilities

- `course-waitlist-capture`: 放寬「Every course surface exposes an entry to the notification list」這條 requirement。現行條文規定入口由單一共用元件提供，且有名額時表單只在連結被點擊後才出現；需改為允許銷售頁同時存在上方漸進式入口與頁尾直接展開入口，並要求兩者的 `source_page` 可資區分。

## Impact

- 新增：`src/components/course/CourseNotifyFooter.tsx`、對應測試、共用的 workshops 查詢 util。
- 修改：`src/app/courses/ai-academic-writing/page.tsx`（加一行掛載頁尾元件）。
- 沿用不動：`src/components/instructor/WaitlistForm.tsx`、`src/components/course/NextCohortNotify.tsx`、`src/components/course/CourseNotifyEntry.tsx`、`src/app/api/courses/waitlist/route.ts`、`course_waitlist` 資料表。
- 後臺影響：`/admin/waitlist` 的名單將出現 `source_page` 為 `/courses/<slug>#footer` 的新資料，既有匯出與廣播流程不受影響。
