## Why

後臺的開課廣播會寄出張冠李戴的信，而且預設就會。

信件標題與內文的課程名稱由每位收件人自己的 `course_slug` 決定（`broadcast/route.ts:73-81`），但梯次日期與報名連結是操作者填的單一值。收件名單則來自 `body.filters ?? {}`：沒有課程條件時，它就是所有課程的所有候補者。

於是等 A 課的人會收到「《A 課》新梯次開課：<B 課的日期>」，連結指向 B 課的報名頁。每個人都收到掛著自己課名、卻寫著別堂課日期與連結的信。

這個地雷預設是踩下去的狀態：後臺沒有課程篩選介面，只有 intent 的三個選項；要限定課程，操作者得自己去改網址列的 `?course=` 參數。目前候補名單橫跨 3 門課共 5 人，現在按下廣播，其中 4 人會收到錯誤資訊。

寄出去的信收不回來。

## What Changes

- 後臺新增課程下拉選單，操作者可依課程篩選名單；CSV 匯出沿用同一組篩選（後端本已支援 `?course=`，先前只缺介面）。
- **廣播強制限定單一課程**：未指定課程的廣播請求一律拒絕，前端在未選課程時停用廣播並說明原因。光有下拉選單不夠，因為操作者仍可能在「全部」狀態下按下廣播；地雷要拆掉，而不是只提供一條繞過它的路。

## Non-Goals

- **不支援跨課程一次廣播**：要正確做到，信件內容須依課程分組、每組各帶自己的日期與連結，那是另一個功能。在它存在之前，跨課程廣播只會寄出錯誤資訊。
- **不改信件模板與寄送機制**：`CohortAnnouncementEmail`、Resend 批次、退訂連結、通知時間回寫一律不動。
- **不改既有的二次確認**：預覽收件人數與 confirm 流程維持原狀，本次是在它之前多一道「課程必須指定」的閘門。
- **不動 intent／campaign 篩選**。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `waitlist-admin-broadcast`: 「The admin waitlist view supports segmentation」需加上課程篩選介面；「Cohort announcements are broadcast manually」需加上「廣播必須限定單一課程」的前提，使一則以單一日期與連結寫成的公告，不可能寄給另一門課的候補者。

## Impact

- 修改：`src/app/admin/waitlist/page.tsx`（課程下拉選單）、`src/app/admin/waitlist/BroadcastPanel.tsx`（未選課程時停用廣播）、`src/app/api/admin/waitlist/broadcast/route.ts`（強制課程參數）。
- 不動：`fetchWaitlist`、`parseFilters`（`course` 早已支援）、CSV 匯出路由（已 respect filters）、信件模板、`course_waitlist` 資料表。
