# solo.tw Information Architecture（IA）規範

本文件定義 solo.tw 的網址命名規則。新增頁面、產品、工具時先讀過再決定 namespace，避免又出現 `/products` 著陸頁那種僵屍頁面。

---

## 核心判準：交付形式，不是價格

| | `/products/{slug}` | `/tools/{slug}` |
|---|---|---|
| 本質 | 打包好的數位資產（SKU） | 互動工具 / 服務 / 入口 |
| 客戶體驗 | 結帳 → 一次交付 → 帶走 | 站上互動 / 預約 / 即時取得 |
| 是否要 Vista 投入時間 | 不要（已封裝完） | 可能要（顧問、客製、互動） |
| 典型 CTA | 「立即購買」「下載」 | 「開始使用」「預約」「下載模板」 |

**不要用「免費 vs 付費」分類**——`/tools/ai-context-library` 是免費模板，`/tools/ai-context-library-dfy` 是付費顧問服務，但兩個都是 /tools，因為交付形式（即時取得 / 預約 Vista 親自交付）一致。

---

## 三題決策樹（從上往下，答 yes 就停）

### Q1：這是「結帳後一次交付的數位資產包」嗎？
（Notion 模板包、Prompt 工具包、PDF 課程包、影片包、字典型素材包）

→ **是 → `/products/{slug}`**

例：
- `/products/writing-os`（Vista 中文寫作 AI 工作流包）
- `/products/ai-coach-kit`（AI 教練工坊）
- 未來：「AI 簡報工作流包」「Vista Prompt 字典」「課程素材包」

### Q2：這是「在站上互動 / 預約 / Vista 親自交付」的工具或服務嗎？

→ **是 → `/tools/{slug}`**

例：
- `/tools/ai-context-library`（免費 markdown 模板）
- `/tools/ai-context-library-dfy`（付費顧問服務，Vista 親自訪談 60 分鐘）
- 未來：「時薪計算器」「報價產生器」「名單磁鐵 builder」

### Q3：都不是？看既有 namespace

| 類型 | namespace |
|---|---|
| 工作坊／實體課／線上課 | `/courses/{slug}` |
| 1-on-1 諮詢 | `/consulting` |
| Lead magnet（免費下載換 email） | `/m/{slug}` |
| 部落格文章 | `/blog/{slug}` |
| 活動 | `/events/{slug}` |
| 互動診斷 | `/diagnose` |

---

## 邊界案例

### 「免費 Notion 模板，要留 email 才能下載」
→ Lead magnet → `/m/{slug}`。**不要**進 /tools 也不要進 /products。

### 「免費的線上計算器、產生器」
→ `/tools/{slug}`。互動工具不收費也算 /tools。

### 「同一產品線有 DIY 免費版 + DFY 付費版」
→ 兩個都放 `/tools`，slug 對齊：`/tools/{slug}` + `/tools/{slug}-dfy`。

**不要把 DFY 拆到 /products**——它是服務不是包貨，且使用者會在頁面間比較。`ai-context-library` + `ai-context-library-dfy` 是範例。

### 「DFY 累積夠多，把交付物做成現成的模板包下架賣」
→ 包貨進 `/products/{slug}`，但 DFY 服務頁繼續留 `/tools/{slug}-dfy`。兩者並存：包貨給 DIY 客，DFY 給要 Vista 親自做的客。

### 「課程的部分內容開放免費試讀」
→ 試讀頁掛在 `/courses/{slug}/preview`，不要為了免費就丟到 /tools。namespace 跟主課程綁。

---

## 紀律

1. **永遠不要再做 `/products` 著陸頁**
   `/tools` 的「數位產品」區塊（`#digital-products`）就是統一 hub。新付費產品上線：
   - 在 `src/app/products/{new-slug}/page.tsx` 建詳情頁
   - 在 `src/app/tools/page.tsx` 的 `digitalProducts` 陣列加一張卡
   - 在 `src/app/sitemap.ts` 的 `staticPages` 補上 `/products/{new-slug}`

2. **新 /tools 頁也要更新 hub**
   在 `src/app/tools/page.tsx` 的 `liveServices` 陣列加卡。

3. **同產品線 DIY/DFY 命名對齊**
   `{slug}` + `{slug}-dfy`，方便交叉導流和 SEO 主題集中。

4. **既有公開 URL 不要改**
   `/products/writing-os`、`/products/ai-coach-kit`、`/products/ai-coach-kit/guide/{slug}` 已有 SEO 流量和外部引用，搬遷會付 301 + sitemap + 引用更新成本，CP 值低。

5. **要改路徑必加 301**
   `next.config.ts` 的 `redirects()` 區塊，標註遷移日期和理由（範例：「IA 整併（2026-05-01）：/products 著陸頁退役」）。

---

## Hub 頁面職責定義

`/tools` 是站上**唯一**的入口 hub，職責：
- 立即可用的服務（`liveServices`）
- 數位產品（`digitalProducts`，對應 `/products/{slug}`）
- 免費資源（`freeResources`，外部連結 + 內部頁）
- 規劃中（`upcomingTools`）

`/products` 著陸頁已退役（2026-05-01），301 → `/tools`。子路由 `/products/{slug}` 保留作為產品詳情頁的 namespace。

Nav bar 只放 `/tools`。`/products` 永遠不該回到 nav。

---

## 變更歷史

- **2026-05-01**：`/ai-context-library-dfy` → `/tools/ai-context-library-dfy`（與 `/tools/ai-context-library` 路徑對齊）
- **2026-05-01**：`/products` 著陸頁退役，301 → `/tools`，子路由 `/products/{slug}` 保留
- **2026-04-28**：`/tools/context-architecture` → `/tools/ai-context-library`、`/context-architecture-dfy` → `/tools/ai-context-library-dfy`（產品命名遷移）
