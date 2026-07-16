## 1. 資料層

- [x] 1.1 交付 design.md「資料模型」的 `rewards` 表變更：新增 `body_text` 欄位、`kind` check 放寬為四種、payload 與 kind 相符的 check 納入 `text`。兩個 drop／add 在同一交易內完成，不存在無約束的中間狀態。驗證：以真實資料庫實測 `kind='text'` 且 `body_text` 為 null 遭拒；四種 kind 各自的合法組合皆可插入；套用前後既有 video／file／link 資料筆數與內容不變。

## 2. 老師端講義上傳

- [x] 2.1 交付 `Teachers upload handouts from the browser` 的簽發端點 `POST /api/teach/rewards/upload-url`，實現決策「file 上傳沿用學員端的簽發機制，另開一支老師專用 route」：以 `requireCourseTeacher(assignment.course_id)` 授權，路徑前綴 `rewards/{course_id}/`，與學員作業分開。驗證：測試涵蓋 spec 中 upload authorization 表格四列，斷言非授課老師與未登入者皆拿不到 signed URL。
- [x] 2.2 交付 design.md「可觀察行為」中老師端的檔案選擇介面：`rewards-manager.tsx` 的 `file` 類型改為檔案選擇器，選檔後先上傳再建立資源，storage 路徑由系統產生。體現決策「上傳與建立資源是兩步，孤兒檔案可接受」：上傳成功而建立失敗時保留表單、不建資源、孤兒物件留在 bucket 不清理。驗證：介面上不存在任何路徑輸入框，且不顯示路徑；`grep` 確認 `storage_path` 不再出現於老師可輸入的欄位。

## 3. text 資源類型

- [x] 3.1 交付 `Rewards carry one of three kinds`（改為四種）的資料與 API 層：`RewardKind` 加入 `text`，`/api/teach/rewards` 接受 `kind=text` 並要求 `body_text`，`/api/rewards/[id]/access` 回傳 `{ kind: "text", body }`。驗證：測試斷言缺 `body_text` 或只有空白時遭拒且不建立資源。
- [x] 3.2 交付 design.md「可觀察行為」中老師端的文字輸入介面：`rewards-manager.tsx` 的 `text` 類型顯示 textarea，資源列表中 text 顯示內容前綴、file 顯示原始檔名。驗證：手動新增一筆 text 資源並確認列表可辨識。
- [x] 3.3 交付學員端 `text` 的渲染，實現決策「text 不經 access API，由 server 端直接渲染」與「text 類型只存純文字，不解析 markdown」：以 `whitespace-pre-wrap` 保留換行，不解析 markdown 或 HTML。驗證：測試斷言未繳交時頁面 HTML 不含 text 內容；含 `<b>bold</b>` 的內容以字面呈現而非渲染成粗體。

## 4. 收尾

- [x] 4.1 依 design.md「失敗模式」完成錯誤處理：上傳失敗保留表單且不建資源、空白 text 遭拒、非授課老師索取 upload URL 回 403。孤兒檔案刻意不清理。驗證：逐項比對 design.md「失敗模式」清單。
- [x] 4.2 依 design.md「驗收標準」完成全套驗證：`npm test` 全綠、`next build` 成功、新檔零 tsc 錯誤。驗證：三者皆通過且既有 tsc 錯誤數不增加。
- [x] 4.3 依 design.md「範圍邊界」核對未越界：`course_enrollments`、Recur 與結帳退款、`courses-config.ts`、`/admin` 與 `isAdmin()`、學員繳交流程與 magic link、`assignments`／`submissions`／`submission_files` 三表皆零改動。驗證：`git diff --stat` 逐檔比對範圍外清單。
- [x] 4.4 **老師從瀏覽器實際上傳一份講義，並由學員端下載成功**：此為本變更的核心目的，不接受以單元測試代替（既有的 `file` 缺陷正是因為只有腳本測過而未從瀏覽器走過才漏掉）。驗證：於線上或本機 production build 實際操作一次，並在事後清除測試資料。
