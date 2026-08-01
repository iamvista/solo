## Why

stories.tw 的五封培育序列已於 2026-07-27 切成 active，第 4、5 封會邀請讀者報名 2026-10-18 的敘事工作坊，但 solo.tw 沒有這門課的銷售頁。2026-08-01 已先把 CTA 導向 `/courses/story-canvas/notify` 開課通知頁止血，那只是候補入口：它刻意不放價格與報名按鈕，讀者看不到課綱、講師、退費規則，也無從決定要不要來。

早鳥價到 2026-09-18 截止，距今約六週。銷售頁不在那之前上線，等於整條漏斗只收得到候補，收不到報名。

## What Changes

- 新增 `/courses/story-canvas` 課程銷售頁，區塊與元件比照現有課頁（以 `/courses/ai-content` 為藍本）：Hero、痛點、課程內容、課綱、講師、學員對象、FAQ、報名區
- 頁面掛上 `courseSchema`、`breadcrumbSchema`、`faqSchema` 結構化資料，與其他課頁一致
- 新增課程 OG 圖路由 `/courses/story-canvas/og`，比照現有課頁做法
- `src/lib/workshops.ts` 的 `story-canvas` 由 `hidden: true` + `coming_soon` 改為公開的 `open`，`url` 由通知頁改回 `/courses/story-canvas`
- 報名按鈕本期先導向候補表單（沿用 `CourseNotifyEntry` 與 `CourseNotifyFooter`），不接金流
- stories.tw 序列第 4、5 封的 CTA 由通知頁換成銷售頁網址（跨 repo，須與本變更同批完成）

## Non-Goals

- **不開 Recur 商品、不接線上刷卡**。Vista 2026-08-01 裁定本期先做頁、金流晚點接。頁面結構要讓報名按鈕日後換成付款連結時只動一處，但這次不建商品、不改 `courses-config.ts`、不動 `/courses/[course]/register`
- **不重新設計視覺**。已裁定沿用現有課頁結構，不為這門課另做一套對齊 stories.tw 手稿風的樣式
- **不做課程回顧頁、學員作業、講義上傳**。那些是開課後的事
- **不改動 `/courses/[course]/notify` 的既有行為**。通知頁在銷售頁上線後仍然保留，作為額滿或下一梯的候補入口
- **候補收單規格不需要改**。一度以為銷售頁進件要新增來源情境，查證後不成立：既有規格的「The originating surface is recorded」與「The originating entry is recorded when a surface carries several」兩個情境已經涵蓋，`waitlist-source.ts` 的 `sourceLabel()` 也已對照銷售頁與通知頁兩種來源。本變更只是多一個符合既有規格的頁面

## Capabilities

### New Capabilities

- `story-canvas-course-page`: 故事骨架工作坊的銷售頁：頁面區塊、結構化資料、OG 圖，以及本期報名按鈕導向候補表單的規則與日後接金流的替換點

### Modified Capabilities

（無）

## Impact

- 新增：`src/app/courses/story-canvas/page.tsx`、`src/app/courses/story-canvas/og/route.tsx`
- 修改：`src/lib/workshops.ts`（`story-canvas` 取消隱藏、狀態與 url）
- 連帶生效：`/courses` 列表、`/teachers/vista` 講師頁、`sitemap.xml`、`llms.txt` 會自動收錄這門課（三處都已依 `hidden` 過濾，取消隱藏即露出）
- 跨 repo：`stories-tw` 的 `content/magnet/nurture-sequence.sql` 與一支新的 `update-cta` 腳本；D1 `vista-analytics` 的 `automation_steps` 第 4、5 封需以 `REPLACE()` 更新（主檔是 `INSERT OR IGNORE`，重跑不會生效）
- 無資料庫 schema 變更、無新依賴
