## Why

作業系統上線後，`/teach` 的資源管理有兩個問題：

1. **老師無法上傳講義。** `file` 類型的資源要老師手動填一段 storage 路徑，但那條路徑必須檔案已經在 bucket 裡才存在，而系統沒有提供任何讓老師把檔案放進去的方法。等於 `file` 這個類型從瀏覽器完全無法使用。`video` 與 `link` 貼網址是自然的，`file` 貼路徑不是。

2. **老師無法直接寫一段話。** 現有三種資源都是「指向別處的東西」。老師常常只是想在學員交完之後給幾段文字說明或一篇短文，目前只能勉強塞進 `description` 欄位，而那個欄位的用途是資源的附註，不是資源本身。

## What Changes

- 新增第四種資源類型 `text`：老師直接在後臺輸入一段文字，學員繳交後於作業頁上顯示。純文字，換行保留，不解析 markdown。
- `file` 類型改為老師直接從瀏覽器選檔上傳，storage 路徑由系統產生，老師不需要知道也看不到。上傳沿用學員端既有的機制（server 簽發 signed upload URL、瀏覽器直傳 Supabase、不經 route handler）。

## Non-Goals

（本變更會建立 design.md，範圍排除與已否決方案詳見該文件。）

## Capabilities

### New Capabilities

（無。本變更擴充既有能力，不引入新能力。）

### Modified Capabilities

- `submission-rewards`: 資源類型由三種擴充為四種，新增 `text`；並要求 `file` 類型的講義必須能由老師從瀏覽器上傳。

## Impact

**受影響的既有程式碼**

- `supabase/migrations/`：新增 migration（`rewards` 加 `body_text` 欄位、放寬 `kind` check、更新 payload 與 kind 相符的 check）。
- `src/lib/rewards.ts`：`RewardKind` 加入 `text`，欄位清單加入 `body_text`。
- `src/app/api/teach/rewards/route.ts`：接受 `kind=text`。
- `src/app/api/rewards/[id]/access/route.ts`：處理 `text`。
- `src/app/teach/[course]/assignments/[id]/rewards-manager.tsx`：`file` 改為檔案選擇器，`text` 給 textarea。
- `src/app/courses/[course]/assignments/[id]/rewards-section.tsx`：渲染 `text`。
- 新增 `src/app/api/teach/rewards/upload-url/route.ts`。

**明確不碰**

- `course_enrollments`、Recur webhook、結帳與退款路徑、`courses-config.ts`、既有 `/admin` 與 `isAdmin()`。
- 「獎勵一律掛在單一作業底下」的決策維持不變，不引入課程級資源。
- 學員端的繳交流程與 magic link 工作階段。

**新增依賴**

- 無。不引入 markdown 渲染套件（見 design.md 決策一）。
