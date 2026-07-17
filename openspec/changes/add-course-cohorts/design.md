## Context

作業系統於 2026-07-16 上線。上線隔天 Vista 要為 AI 賦能學術研究與寫作實戰工作坊開作業區，才發現該課程有第一期（8/16）與第二期（9/12），而系統沒有期別的概念。

現況勘查（2026-07-17）：

- `courses-config.ts` 的 `CourseConfig` 只有單一個 `date`、`time`、`location`、`capacity`、`earlyBirdDeadline`。一個 `course_id` 就代表一場課。
- Git 顯示 `a998fb0`（2026-06-30 11:49）以 `date: "2026/8/16（日）"` 建立此課程，`ef7188e`（2026-07-16 10:02）改為 `date: "2026/9/12（六）"`，commit 訊息為「第二期改期 9/12、早鳥至 8/12」。**第一期的日期被覆蓋，不在任何地方留存。**
- `course_enrollments` 現有 23 筆 `ai-academic-writing` 報名，全部 `plan='early_bird'`，時間 7/01 至 7/16 連續。以 `ef7188e` 的時刻（2026-07-16 02:02 UTC）切分，**全部 23 筆都在之前**，最晚一筆 7/16 09:24（臺灣時間）與改動相差 38 分鐘。第二期目前 0 人，與 Vista 的說法一致。
- `course.date` 被五處讀取：課程列表 `CourseFilters.tsx`、`ai-monetization-institute/page.tsx`、OG 圖 `courses/og/route.tsx`、報名頁 `[course]/register/page.tsx`、`brain/page.tsx`。

利害關係人：Vista 與 Susie（授課）、各期學員。

## Goals / Non-Goals

**Goals:**

- 一門課能開無限多期，每期有自己的日期、學員、作業與回放。
- 報名當下記下買的是哪一期，日後不需要推論。
- 既有 23 筆報名正確歸入第一期。
- 各期完全隔離：第一期學員看不到第二期的作業與回放。

**Non-Goals:**

- **不改 `courses-config.ts` 的結構。** `date` 繼續是顯示來源，報名頁與 OG 圖的渲染一行不改（決策二）。
- **不碰付款邏輯。** register route 只多帶一個 `cohort_id`，金額、Recur、webhook 全部不動。
- **不做跨期可見。** 一期一世界（Vista 已確認）。
- **不做同時招生多期。** 一門課同時至多一期招生中（決策三）。
- **不做期別的自動開關。** 開新期是人的決定，不是排程。
- **不搬移既有作業。** 定位收斂工作坊現有的「課前作業：定位收斂器」歸入其唯一一期。

## Decisions

### 期別進資料庫，報名時記下事實而非日後推論

新增 `course_cohorts`，`course_enrollments` 加 `cohort_id`。報名時寫入當下招生中的那一期。

**替代方案：** 不動金流表，靠 `created_at` 落在哪一段招生期間來推導期別。零結帳改動，但把「事實」換成「推論」：改期、補報名、人工調整都會算錯，而且錯了不會有人發現。本次回填之所以可信，正是因為有 git 時間戳這個外部證據；日常運作沒有這種證據。**否決。**

**替代方案：** `course_id` 直接帶期別（`ai-academic-writing-2`）。模型最單純，但報名網址會變，行銷連結、SEO、已發出的連結全數受影響，且既有 23 筆的 `course_id` 要在金流表上改寫。**否決。**

「這個人買的是哪一期」本來就是報名資料的一部分，不是外掛的元資料。這與來賓不同：來賓沒付錢，所以不該進金流表；期別則是一筆付款的固有屬性。

### 設定檔繼續當顯示來源，期別表當歷史紀錄

`courses-config.ts` 的 `date` 維持原狀，繼續代表「現在在賣的那一期」。`course_cohorts.session_date` 記錄每一期各自的日期。

**替代方案：** 把 `date` 從設定檔移除，改由報名頁讀招生中那一期。單一事實來源，模型更乾淨。但 `course.date` 有五處讀取，包含報名頁與 OG 圖，等於讓收錢頁面的渲染依賴一次資料庫查詢：期別資料設錯或表是空的，報名頁就掛。**否決**：這個乾淨換來的風險落在營收頁上，不划算。

**代價（明確承認）：** 開新期時要做兩件事，改設定檔的 `date` 並建立新期別。兩者可能不一致。緩解是 `/admin/course-cohorts` 會把設定檔目前的 `date` 顯示在招生中那一期旁邊，不一致時直接看得出來。這是可見性的緩解，不是根除。

### 一門課同時至多一期招生中

以 partial unique index 強制：`(course_id) where is_open` 唯一。

報名時取該課程招生中的那一期。若沒有任何一期招生中，報名照舊完成但 `cohort_id` 為 null，而非讓報名失敗。**收錢的路不能因為期別沒設好就斷掉**，那是本末倒置；孤兒報名可由 `/admin/course-cohorts` 事後補指。

### 回填以 recur_product_id 為據，不用時間戳推論

2026-07-17 已將 Recur 商品拆分為每期一組（PR #15）：第一期 `b3dc06` / `u0rnbc`（名稱改回 8/16、已關閉），第二期 `tpl4a90` / `dckcqar`（新建）。

因此期別是**付款紀錄裡的事實**：買了哪個商品，就是哪一期。回填直接依 `recur_product_id` 對應，不需要 git 時間戳。

**替代方案：** 以 `ef7188e` 的時間戳（2026-07-16 02:02 UTC）切分。原本唯一可行的辦法，但那是外部推論而非付款紀錄本身。商品拆分後已無必要。**否決。**

其他課程（`positioning-convergence`、`ai-content`、`vibe-coding`、`vibe-coding-claude-code`）各建立唯一一期，既有報名全數歸入。

### 作業屬於期別，不屬於課程

`assignments.cohort_key` 決定歸屬。學員資格由「這門課的 paid 報名」收斂為「他所屬那幾期的 paid 報名」。

`assignments.course_id` 保留但不再單獨用於授權，僅供查詢方便與人類閱讀。

### 期別不進網址，由報名紀錄決定

學員的作業區網址維持 `/courses/<課程>/assignments`，不加期別區段。系統查出該 email 屬於哪些期，只顯示那幾期的作業。

**替代方案：** 網址改為 `/courses/<課程>/<期別>/assignments`。期別顯而易見，但代價成串：已貼出的舊網址全部失效需要導向、學員同時在兩期時要多一個選期畫面、簽章 cookie 要從 course 改為 cohort 維度。**否決**：期別是學員的屬性，不是他要選的東西；把它放進網址等於要求學員知道一件系統已經知道的事。

**回訓生（同時在兩期）** 因此自然可解：他兩期都付了錢，就兩期的作業都看得到，以期別名稱分組顯示。這不是特例處理，是規則的自然結果。

老師端同理：`/teach/<課程>` 以期別分組顯示作業，新增作業時選期別。不新增路由。

## Implementation Contract

### 資料模型

**`courses-config.ts`** 新增 `cohorts` 陣列，取代單一的 `date` 與 `earlyBirdDeadline`：

```ts
interface Cohort {
  key: string;                  // "1"、"2"，穩定不變，寫進資料庫
  name: string;                 // "第一期"
  date: string;                 // "2026/8/16（日）"
  open?: boolean;               // 招生中；一門課至多一個
  earlyBirdDeadline?: string;   // 該期的早鳥截止
  recurProductIdEarlyBird?: string;
  recurProductIdRegular?: string;
}
```

商品 ID 移入期別：每期一組獨立商品（PR #15 已確立）。

**`course_enrollments`** 新增 `cohort_key text`。僅新增欄位，不改動任何既有欄位。

**`assignments`** 與 **`course_guests`** 各新增 `cohort_key text`。既有資料回填至其課程的唯一一期。

### 回填

```sql
-- 第一期：ef7188e（2026-07-16 02:02 UTC）之前的報名
update course_enrollments set cohort_id = <第一期 id>
where course_id = 'ai-academic-writing' and created_at < '2026-07-16 02:02:00+00';
```

其餘課程各建唯一一期，既有報名全數歸入。

### 資格判定

`findEligibleStudent(cohortId, email)`：查該期的 `paid` 報名，未命中查該期的來賓。`course_guests` 亦加 `cohort_id`。

`listEligibleStudents(cohortId)` 同步收斂。

### 可觀察行為

**學員：** 網址維持 `/courses/<課程>/assignments`。只看得到自己所屬期別的作業；同時在兩期者兩期都看得到，以期別名稱分組。回應不含其他期別的任何作業內容。

**老師：** `/teach/<課程>` 以期別分組顯示作業與各期繳交數。新增作業時從下拉選單指定期別。通知只寄給該作業所屬期別的學員。來賓加入時指定期別。

**平臺管理者：** 期別定義在 `courses-config.ts`，與課程本身同處。無需管理介面：開新一期就是在陣列裡加一筆並移動 `open`，與新增課程同一個動作。

### 失敗模式

- 報名時該課程無招生中期別：報名照常完成，`cohort_id` 為 null，記錄警告。**不讓收錢的路斷掉。**
- 學員以第一期身分存取第二期網址：視同未登入，導向該期的 email 表單。
- 老師存取自己課程但不存在的期別：404。
- 設定為招生中時已有另一期招生中：資料庫的 partial unique index 拒絕，介面提示先關閉前一期。

### 驗收標準

- 回填以真實資料庫驗證：`ai-academic-writing` 的 23 筆全部歸入第一期、第二期 0 人；其餘課程的報名數在回填前後不變。
- `course_enrollments` 除新增 `cohort_id` 外，所有既有欄位值逐筆不變。
- 跨期隔離測試：第一期 cookie 存取第二期資格判定回 null；通知第二期不會寄給第一期學員。
- 報名 route 測試：有招生中期別時帶入其 id；無招生中期別時 `cohort_id` 為 null 且報名仍成功。
- 一門課設兩期招生中遭資料庫拒絕。
- `npm test` 全綠、`next build` 成功、新檔零 tsc 錯誤。
- **實刷一筆測試報名**，確認 `cohort_id` 正確寫入且付款流程未受影響。這是唯一碰到結帳路徑的改動，不接受以單元測試代替。

### 範圍邊界

**在範圍內：** `course_cohorts`、三張表的 `cohort_id`、回填、`register/route.ts` 帶入 cohort_id、資格與作業查詢的收斂、`/teach` 與學員頁的期別維度、`/admin/course-cohorts`。

**在範圍外：** Recur webhook 與付款邏輯、`courses-config.ts` 的結構與 `date`、報名頁與 OG 圖的渲染、magic link 機制、既有 `/admin` 18 頁與 `isAdmin()`、`submissions` / `submission_files` / `rewards` 的結構。

## Risks / Trade-offs

- **改動落在收錢的 register route 上** → 改動限於新增一個欄位值，不觸及金額、Recur、webhook。驗收標準要求實刷一筆驗證，不接受只靠單元測試。
- **設定檔 `date` 與招生中期別可能不一致** → 明確承認的代價（決策二）。緩解是 admin 頁並列顯示，不一致時看得出來。
- **回填切錯期別** → 以 git 時間戳為據並已用查詢證實全部 23 筆落在同側，最近的一筆仍有 38 分鐘餘裕。回填前後比對報名總數與既有欄位值。
- **學員網址改變** → 舊網址 `/courses/<課程>/assignments` 需導向該學員所屬期別，否則既有連結全部失效。實作時保留舊路徑並依 cookie 或招生中期別導向。
- **無招生中期別時報名的孤兒紀錄** → 刻意允許，優先保住收錢的路。admin 頁需顯示孤兒報名以便補指。

## Migration Plan

1. Migration A：`course_cohorts` 新表。可回滾（drop）。
2. Migration B：三張表加 `cohort_id`（皆可為 null）。可回滾（drop column）。
3. Migration C：建立各課程的期別並回填。可回滾（`set cohort_id = null` + 刪期別列）。
4. 部署應用程式碼。
5. 實刷一筆測試報名驗證。

前端在 Migration C 之前不依賴 `cohort_id`，故 1 至 3 步可先行且不影響線上。`course_enrollments` 僅新增欄位，既有資料零風險。

## Open Questions

無。已於 2026-07-17 經 Vista 確認：期別記在報名紀錄上（碰結帳）、各期完全隔離。
