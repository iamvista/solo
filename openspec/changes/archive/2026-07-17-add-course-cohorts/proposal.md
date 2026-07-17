## Why

同一門課會開很多期。AI 賦能學術研究與寫作實戰工作坊第一期 8/16、第二期 9/12，之後還有第三、第四期。定位收斂工作坊等課程日後也會如此。

現行模型認為「一個 `course_id` 就是一場課」，於是：

1. **期別資訊不是被記錄，是被覆蓋。** 開第二期時，`courses-config.ts` 裡的 `date` 從 `2026/8/16` 被就地改成 `2026/9/12`（commit `ef7188e`，2026-07-16 10:02）。第一期的日期就此從程式碼中消失。每開一期就毀掉前一期的紀錄。

2. **報名紀錄分不出期別。** `ai-academic-writing` 現有 23 筆報名（18 付費、5 待付）全部 `plan='early_bird'`，報名時間 7/01 至 7/16 連續分布，資料上完全無法區分。目前它們全是第一期，但下一筆進來的就是第二期，而系統看不出差別。

3. **作業會混在一起。** 第一期與第二期是兩場不同的課：不同日期、不同人、不同回放。但作業只掛在 `course_id` 上，兩期學員會看到同一批作業與回放。

## What Changes

- 新增 `course_cohorts`：一門課有多期，每期有名稱與日期，同一時間至多一期招生中。
- `course_enrollments` 新增 `cohort_id`：報名當下記下買的是哪一期。這是本變更唯一碰到結帳路徑的地方。
- 既有 23 筆報名回填為第一期，依據是 `ef7188e` 的時間戳（2026-07-16 02:02 UTC）。該時刻之前的報名皆為第一期，之後為第二期；實測全部 23 筆都在之前，最晚一筆與改動相差 38 分鐘。
- `assignments` 新增 `cohort_id`：作業屬於某一期，不再屬於整門課。
- 學員只看得到自己那一期的作業與回放，跨期完全隔離。
- 老師在 `/teach` 選期別；`/admin/course-cohorts` 管理期別。
- 為 AI 賦能學術研究與寫作實戰工作坊建立第一期（8/16）與第二期（9/12），並開通作業區。

## Non-Goals

（本變更會建立 design.md，範圍排除與已否決方案詳見該文件。）

## Capabilities

### New Capabilities

- `course-cohorts`: 期別本身：一門課有哪些期、哪一期在招生、報名如何綁定期別、既有資料如何回填。

### Modified Capabilities

- `student-access`: 資格判定由「這門課」收斂為「這門課的這一期」。
- `assignment-submission`: 作業歸屬於期別而非整門課。
- `course-roster`: 來賓加入時要指定期別。
- `assignment-notification`: 通知只寄給該期學員。

## Impact

**受影響的既有程式碼**

- `supabase/migrations/`：`course_cohorts` 新表、`course_enrollments` 與 `assignments` 各加 `cohort_id`、既有資料回填。
- `src/app/api/courses/register/route.ts`：報名時帶入招生中那一期的 `cohort_id`。**這是本變更唯一碰到結帳路徑的檔案**，改動限於新增一個欄位值，不動付款、金額、Recur 任何邏輯。
- `src/lib/assignment-access.ts`、`src/lib/assignments.ts`、`src/lib/teaching.ts`：查詢由 course 收斂為 cohort。
- `/teach` 與學員作業頁：加入期別維度。

**明確不碰**

- Recur webhook、付款、退款、金額計算。
- `courses-config.ts` 的結構與 `date` 欄位：它繼續是「現在在賣哪一期」的顯示來源，報名頁、課程列表、OG 圖的渲染一行不改（理由見 design.md 決策二）。
- magic link 與簽章 cookie 的機制。
- 既有 `/admin` 18 個頁面與 `isAdmin()`。

**新增依賴**

- 無。
