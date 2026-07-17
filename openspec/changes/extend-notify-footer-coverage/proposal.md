## Why

`CourseNotifyFooter` 上線後只套用於 `ai-academic-writing` 一頁，其餘課程的訪客仍只看得到報名按鈕下方那行沒人發現的文字連結。既然頁尾入口已在正式站驗證可用（含確認信），沒有理由讓其他課程繼續漏掉候補名單。

推廣過程中浮現兩個必須一併處理的問題：

第一，`vibe-coding-claude-code` 的狀態是 `coming_soon`、日期寫「尚未公告」，但頁尾文案會說「這期時間對不上？」。日期都還沒公告，談不上對不上，訪客會看得莫名其妙。

第二，`source_page` 的 `#footer` 歸因目前只存在於 CSV 匯出與資料庫，後臺 `/admin/waitlist` 的表格沒有這一欄。這讓「頁尾入口到底有沒有用」這個問題，必須下載 CSV 才答得出來，而那正是這個歸因設計存在的唯一理由。

## What Changes

- 頁尾入口套用至 `workshops.ts` 中有銷售頁的其餘 5 門課：`ai-content`、`vibe-coding`、`vibe-coding-claude-code`、`positioning-convergence`、`concept-monetization-bootcamp`。
- 頁尾區塊文案依課程狀態三分（`full` 已額滿／`coming_soon` 尚未公告／其餘 時間對不上）。送出的 `intent` 維持二分不變（`full` 得 `full_waitlist`，其餘得 `date_conflict`），資料庫的 intent 約束因此不受影響。
- `/admin/waitlist` 表格新增「來源」欄，將 `source_page` 轉為人看得懂的標示（頁尾／報名按鈕下方／廣告落地頁）。

## Non-Goals

- **不處理 `innovation-workshop`、`senior-asset-safety`、`ai-monetization-institute` 三頁**：其 slug 不存在於 `workshops.ts`，補齊需要課程標題、日期、價格、講師等真實資料，須由 Vista 提供。這三頁現有的 `CourseNotifyEntry` 因查無課程而靜默失效，屬既有缺陷，本次不修也不套。
- **不處理 `ai-social-content`**：它在 `workshops.ts` 中（狀態 `ended`）但沒有銷售頁，無處可掛。
- **不新增 `intent` 值**：`coming_soon` 只改變呈現文案，不引入第四種 intent。新增 intent 會動到 `course_waitlist` 的 check 約束與既有的 RPC、後臺篩選、廣播分眾，代價遠大於一句文案。
- **不改上方入口**：`CourseNotifyEntry` 與 `NextCohortNotify` 維持原狀，以便持續對照兩個入口的收單成效。
- **不修「寄信失敗仍顯示已寄出」**：`after()` best-effort 的既有行為，屬另一個問題。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `course-notify-footer`: 「The footer entry derives its intent from course status」需區分「intent 推導」與「文案呈現」兩件事：intent 仍依 `full` 二分，文案改為依 `full` / `coming_soon` / 其餘 三分。
- `waitlist-admin-broadcast`: 「The admin waitlist view supports segmentation」需加上「表格 SHALL 顯示每筆的來源入口」，使 `source_page` 的歸因在後臺可見，而非僅存在於 CSV。

## Impact

- 修改：5 支課程銷售頁各加一行掛載與一行 import（`ai-content`、`vibe-coding`、`vibe-coding-claude-code`、`positioning-convergence`、`concept-monetization-bootcamp`）。
- 修改：`src/components/course/CourseNotifyFooter.tsx`（文案三分）與其測試。
- 修改：`src/app/admin/waitlist/page.tsx`（新增來源欄）。
- 不動：`/api/courses/waitlist`、`course_waitlist` 資料表、RPC、確認信、CSV 匯出（已含來源頁欄）、`WaitlistForm`、`CourseNotifyEntry`、`NextCohortNotify`。
