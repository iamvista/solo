## Context

`add-assignments-system`（2026-07-16 上線）交付了三種資源類型：`video`、`file`、`link`。三者共用同一條解鎖規則，差別只在渲染與取得方式。

上線後隨即發現 `file` 類型有一個實作缺陷：`RewardsManager` 要老師手動輸入 `storage_path`，但那條路徑必須物件已存在於 bucket 才有意義，而系統從未提供老師上傳的入口。開發期間 E2E 測試用的講義是以腳本上傳的，因而未暴露此缺陷。**`file` 類型目前從瀏覽器完全無法使用。**

同時，Vista 指出老師常常只是想在學員交完後給幾段文字，而非指向外部資源。

既有可複用的機制：學員端的 `POST /api/assignments/[id]/upload-url` 已經是「server 驗權後簽 signed upload URL、瀏覽器直傳 Supabase」的完成品；`safeFilename()` 已處理 ASCII 化與路徑穿越；私有 bucket `submissions` 已存在且零 policy。

## Goals / Non-Goals

**Goals:**

- 老師能從瀏覽器選檔上傳講義，全程不需要知道 storage 路徑的存在。
- 老師能新增一段純文字資源，學員繳交後在作業頁上讀到。
- 四種類型共用同一條解鎖規則，維持既有語意。

**Non-Goals:**

- **不支援 markdown。** 純文字加換行（理由見決策一）。
- **不引入課程級資源。** 「獎勵一律掛在單一作業底下」的既有決策維持不變。
- **不做既有講義的取代／重新上傳。** 要換檔就移除該筆資源再新增一筆。
- **不做上傳進度條。** 講義通常不大，忙碌狀態足夠。
- 不碰學員繳交流程、magic link 工作階段、結帳、`/admin`。

## Decisions

### text 類型只存純文字，不解析 markdown

`text` 資源的內容以純文字儲存，渲染時以 `whitespace-pre-wrap` 保留換行，與既有的作業說明欄位一致。

**替代方案：** 支援 markdown，讓老師能用粗體、清單、連結。表達力較好，但要引入渲染套件並做 HTML sanitize。老師輸入的內容會直接出現在學員頁面上，若渲染未淨化的 HTML，等於在學員頁面開一個注入點。**否決**：本變更的目的是「讓老師能寫幾段話」，為此引入一個安全面得不償失。日後若真的需要，升級路徑是清楚的（欄位不變，只改渲染層）。

### text 不經 access API，由 server 端直接渲染

`video` / `file` / `link` 的內容都在別處，需要一個 URL 才能取得；`text` 的內容就在資料庫裡。既然頁面本身已經在 server 端驗過「該學員有繳交」，就沒有理由再讓瀏覽器繞一趟 API 去拿一段已經可以直接印出來的文字。

`listUnlockedRewards()` 未繳交時回傳空陣列，故未解鎖的 `text` 內容不會進入頁面 HTML。

`GET /api/rewards/[id]/access` 仍然處理 `text` 並回傳內容，讓四種類型的授權路徑一致，但學員端不會用到它。

### file 上傳沿用學員端的簽發機制，另開一支老師專用 route

新增 `POST /api/teach/rewards/upload-url`，行為與學員端的 `upload-url` 相同（驗權 → 簽 signed upload URL → 瀏覽器直傳），差別只在授權對象與路徑前綴：

- 授權：`requireCourseTeacher(assignment.course_id)`，而非學員工作階段。
- 前綴：`rewards/{course_id}/`，與學員作業的 `{course_id}/{assignment_id}/` 分開。

**替代方案：** 讓老師端共用學員端那支 route。授權模型完全不同（一個看 `course_teachers`，一個看簽章 cookie），硬要共用會在同一支 route 裡塞兩套判斷，正是最容易寫出破口的形狀。**否決。**

**替代方案：** 檔案經 route handler 轉傳。會撞上 Vercel 4.5MB body 上限，且與學員端既有做法不一致。**否決。**

### 上傳與建立資源是兩步，孤兒檔案可接受

老師選檔後先上傳到 storage，成功才送出建立 `rewards` 列的請求。若上傳成功但建立失敗，物件會留在 bucket 成為孤兒。

此行為與學員端一致（見 add-assignments-system 的 design.md 失敗模式），**刻意不做清理排程**。講義數量以個位數計，不值得為此建機制。

## Implementation Contract

### 資料模型

`rewards` 表變更（僅新增欄位與放寬約束，不改動既有欄位與資料）：

```sql
alter table public.rewards add column body_text text;

-- kind 由三種擴充為四種
alter table public.rewards drop constraint rewards_kind_check;
alter table public.rewards add constraint rewards_kind_check
  check (kind in ('video', 'file', 'link', 'text'));

-- 每種 kind 仍必須帶著自己那一欄的內容
alter table public.rewards drop constraint rewards_payload_matches_kind;
alter table public.rewards add constraint rewards_payload_matches_kind check (
  (kind = 'video' and video_url is not null)
  or (kind = 'file' and storage_path is not null)
  or (kind = 'link' and external_url is not null)
  or (kind = 'text' and body_text is not null)
);
```

既有的 `video` / `file` / `link` 資料不受影響：新約束在舊資料上與舊約束等價。

### 介面

- `POST /api/teach/rewards/upload-url`
  - body：`{ assignment_id, filename }`
  - 授權：該作業所屬課程的授課老師；非授課老師 403，未登入 403，未知作業 404。
  - 回應：`{ signedUrl, token, path }`，`path` 形如 `rewards/{course_id}/{random_id}-{safe_filename}`。
- `POST /api/teach/rewards`（既有）
  - 新增接受 `kind: "text"`，此時必填 `body_text`，其餘 payload 欄位為 null。
  - `kind: "file"` 的 `storage_path` 改由前一步上傳取得，而非老師手填。
- `GET /api/rewards/[id]/access`（既有）
  - `kind: "text"` 回傳 `{ kind: "text", body }`。

### 可觀察行為

**老師：** 在資源管理區選擇類型。選「講義檔案」時看到檔案選擇器（不再是路徑輸入框），選檔後按新增即完成上傳與掛載，全程不會看到任何 storage 路徑。選「文字說明」時看到 textarea。已建立的資源列表中，`text` 顯示內容前綴，`file` 顯示原始檔名。

**學員：** 繳交後，`text` 資源與其他三種並列在「給你的資源」區塊，內容直接顯示，換行保留。未繳交時，`text` 的內容不出現在頁面 HTML 中。

### 失敗模式

- 老師上傳失敗：顯示錯誤並保留表單內容，不建立 `rewards` 列。
- 上傳成功但建立資源失敗：孤兒物件留在 bucket，刻意不清理。
- `text` 內容為空白：拒絕並提示，不建立空資源。
- 非授課老師索取 upload URL：403，不簽發。

### 驗收標準

- route handler 授權測試：非授課老師與未登入者皆拿不到 upload URL；`kind=text` 缺 `body_text` 遭拒；空白 `body_text` 遭拒。
- 資料庫約束以真實資料庫實測：`kind='text'` 且 `body_text` 為 null 遭拒；四種 kind 各自的合法組合皆可插入；既有三種類型的資料在 migration 後仍完好。
- 未繳交的學員取 `text` 資源回 403，且回應與頁面 HTML 皆不含內容。
- **老師從瀏覽器實際上傳一份講義並由學員端下載成功**（本變更的核心目的，不接受以單元測試代替）。
- `npm test` 全綠，`next build` 成功。

### 範圍邊界

**在範圍內：** `rewards` 表的欄位與約束、`src/lib/rewards.ts`、`/api/teach/rewards` 與其新的 `upload-url`、`/api/rewards/[id]/access`、`rewards-manager.tsx`、`rewards-section.tsx`。

**在範圍外：** `course_enrollments`、Recur 與結帳退款、`courses-config.ts`、`/admin` 與 `isAdmin()`、學員繳交流程與 magic link 工作階段、`assignments` / `submissions` / `submission_files` 三表。

## Risks / Trade-offs

- **drop 既有 check 約束期間資料無保護** → 兩個 `drop`／`add` 在同一個 migration 交易內完成，不存在中間狀態。新約束在舊資料上與舊約束等價，套用前先以查詢確認無違規列。
- **老師貼入含 HTML 的文字** → 以純文字渲染（React 預設跳脫），不解析 HTML，故不構成注入點。這正是不做 markdown 的理由之一。
- **孤兒講義檔累積** → 接受，數量以個位數計。
- **老師端與學員端各有一支 upload-url，邏輯相近** → 刻意分開：授權對象不同，合併會在同一支 route 內塞兩套授權判斷。相似不等於應該共用。

## Migration Plan

1. 套用 migration（加欄位、換兩個約束）。可回滾：drop column，約束改回三種。
2. 部署應用程式碼。

前端在 migration 之前不引用 `body_text`，故第 1 步可先行且不影響線上。既有資源不受影響。

## Open Questions

無。已於 2026-07-16 經 Vista 確認：純文字不做 markdown；講義只掛作業底下，不做課程級資源區。
