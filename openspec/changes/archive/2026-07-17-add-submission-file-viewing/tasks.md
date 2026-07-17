## 1. 附件存取路由

- [x] 1.1 建立授權 helper：給定附件識別碼與請求者身分，回溯 `submission_files` → `submissions` → `assignments`，判定請求者是否為該課程教師或該份繳交的學員本人，回傳授權結果與 `storage_path`。教師判定沿用 `requireCourseTeacher` 的既有來源，學員判定比對已驗證 session 的 email。驗證：對「教師本課／教師他課／學員本人／學員他人／無 session」五種身分各下一次呼叫，只有前三種回傳 ok，後兩種回傳拒絕且不含 `storage_path`（位置在 `src/lib/submission-files.ts`：原訂放 `assignments.ts`，但該模組被客戶端元件 import `SUBMISSIONS_BUCKET`，授權一放進去就把 `next/headers` 拖進瀏覽器 bundle 導致 build 失敗；改為比照 `rewards.ts` 的伺服器專用模組）。

- [x] 1.2 實作 `GET /api/submissions/files/[id]/access`，滿足需求 "Submitted files are readable only through short-lived signed URLs"：授權通過才用 service role 對私有 bucket `submissions` 核發 TTL 300 秒的簽名網址，回傳 `{ url }`；任何拒絕只回訊息，不含 url、storage_path、filename。形狀對照 `src/app/api/rewards/[id]/access/route.ts`。驗證：以教師 session 對真實附件 `6ac1038b-528e-428f-81a8-d6ce88b52e18` 呼叫應得可下載的 url；以他人身分呼叫應得 403 且 response body 不含任何附件細節（`curl` 實測並貼出輸出）。

## 2. 附件檢視元件

- [x] 2.1 建立客戶端附件檢視元件，滿足需求 "Attachments are viewable in place"：接收附件的 `id`、`filename`、`size_bytes`、`mime_type`（不接收 `storage_path`），MIME 為圖片時向 access route 取簽名網址並渲染內嵌縮圖，點擊以 overlay 放大；非圖片則渲染為可點連結，開新分頁。顯示標籤一律用資料庫的原始 `filename`。簽名網址過期時重新索取，不快取。驗證：分別餵入 `image/png` 與 `application/pdf` 兩種 props，確認前者出縮圖與 overlay、後者出開新分頁連結。

- [x] 2.2 overlay 可關閉且不困住鍵盤操作：Esc 與點擊背景皆可關閉，開啟時焦點進入 overlay、關閉後歸還觸發元素。驗證：純鍵盤操作走一輪開啟與關閉，確認焦點不逸散到背景頁面。

## 3. 兩端接上

- [x] 3.1 教師端繳交名單的附件從死文字改為可檢視，滿足需求 "Attachments are viewable in place" 的教師情境：批改時圖片直接看得到，且評語欄位仍在同頁可及，不需離開頁面。取代 `src/app/teach/[course]/assignments/[id]/page.tsx:153-161` 現行的純 `<li>` 文字。驗證：本機以教師身分開啟 `positioning-convergence` 該份作業的繳交名單，確認 `定位收斂器-定位卡-方形.png` 顯示為縮圖、點擊可放大、`ReviewForm` 仍可輸入送出。

- [x] 3.2 學員端繳交表單的既有附件同樣可檢視：先讓父頁面把 `mime_type` 與 `size_bytes` 併同 `id`、`filename` 傳入客戶端（`src/app/courses/[course]/assignments/[id]/page.tsx:115` 目前只挑兩個欄位），且不得把 `storage_path` 傳到客戶端；再將 `submit-form.tsx:152-160` 的「目前已附：檔名」灰字換成檢視元件。驗證：以該學員 session 開啟同一份作業，確認看得到自己交的圖；`ExistingFile` 型別不含 `storage_path`。

## 4. 驗收

- [x] 4.1 授權邊界端對端驗證，涵蓋需求 "Submitted files are readable only through short-lived signed URLs" 的全部拒絕情境：學員以另一人的附件 id 直接打 route、無 session 直接打 route、教師以他課附件 id 直接打 route，三者皆須被拒且回應不洩漏任何附件細節。驗證：逐條 `curl` 並貼出 status 與 body。

- [x] 4.2 既有繳交動線未被破壞：上傳、繳交、重繳、評語仍如常運作，且 `storage_path` 不出現在任何客戶端 bundle 或網路回應。驗證：跑一輪完整繳交與重繳，並於瀏覽器 Network 面板搜尋 `storage_path` 與實際路徑字串應為 0 筆命中。

- [x] 4.3 `npm run build` 與 lint 通過，型別無誤。驗證：貼出指令輸出。
