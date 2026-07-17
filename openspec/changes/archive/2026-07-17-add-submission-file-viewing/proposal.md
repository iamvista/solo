## Why

作業系統把檔案存進去了，卻沒有任何人讀得回來。`assignment-submission` 規範了上傳（〈File uploads bypass the application server〉），但從未規範讀回：目前既沒有下載路由，教師端與學員端的附件也都只是死文字，顯示檔名與大小卻無法點擊。

實務後果是教師無法批改。教師打開繳交名單，看得到「📎 定位收斂器-定位卡-方形.png（174 KB）」，卻只能繞到 Supabase Dashboard 用儲存路徑翻找檔案才看得到學員交了什麼。學員端同樣點不開自己交的檔案，無從確認交對了沒。

這個缺口讓整條繳交動線在最後一哩斷掉：檔案上傳成功、metadata 齊全、`storage_path` 也讀得到，就是沒有出口。

## What Changes

- 新增附件存取路由，對單一附件核發短效簽名網址。教師與該份繳交的學員本人皆可取用，其他人一律拒絕。
- 教師端繳交名單的附件從死文字改為可檢視：圖片直接內嵌縮圖，點擊放大為 lightbox；非圖片檔退回可點的下載連結。教師批改時不必離開頁面。
- 學員端繳交表單的既有附件同樣可檢視，形式與教師端一致。
- 存取路由以附件識別碼為輸入，`storage_path` 不再進入客戶端，維持既有「儲存位置絕不外流」原則。

## Non-Goals

- 不做附件的刪除、重新命名、版本history。既有〈Resubmission overwrites the previous submission〉已明定不留版本，本次不動。
- 不做 PDF 的頁面內渲染。PDF 走「開新分頁」，因為內嵌 PDF 檢視器要嘛依賴瀏覽器行為不一致的 `<embed>`，要嘛引入 pdf.js 這種與缺口不成比例的相依。
- 不改上傳路徑格式，也不修正 `safeFilename()` 把中文檔名壓成 ASCII 的行為。原始檔名保留在資料庫 `filename` 欄，UI 顯示的一直是它，這不影響檢視。
- 不做批次下載或打包匯出。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `assignment-submission`：新增一項需求，規範已繳交的附件如何被讀回：經伺服器授權後核發短效簽名網址，並明定教師與學員本人的存取邊界。既有〈Students read only their own submissions〉已宣告學員不得讀取他人附件，本次新增的是實現該宣告的讀取路徑。

## Impact

- 受影響的 specs：`assignment-submission`（新增讀取需求）
- 受影響的程式碼：
  - 新增 `src/app/api/submissions/files/[id]/access/route.ts`
  - 新增附件檢視的客戶端元件（內嵌預覽＋lightbox）
  - `src/app/teach/[course]/assignments/[id]/page.tsx:153-161`（教師端附件渲染）
  - `src/app/courses/[course]/assignments/[id]/submit-form.tsx:152-160`（學員端既有附件渲染）
  - `src/app/courses/[course]/assignments/[id]/page.tsx:115`（傳給客戶端的附件欄位需補 `mime_type`、`size_bytes`）
  - `src/lib/assignments.ts`（若授權查詢需要新的 helper）
- 相依與外部系統：沿用既有 Supabase Storage 私有 bucket `submissions` 與 service role，不新增相依，無資料庫 schema 異動。
