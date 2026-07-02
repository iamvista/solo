# Change: add-books-hub

## Why

solo.tw 是課程報名主入口，但站上沒有「書」的位置。Vista 七月出版《Vibe Coding》（碁峰）、《無人公司》已簽約撰寫中；書是漏斗頂端的信任資產，需要永久的 canonical landing 承接讀者、收名單、導流課程。上層規劃：`~/08_Solo/planning/2026-07-02-solo-tw-books-hub-redesign.md`（三階段改版的 Phase 1）。

## What Changes

1. 新增 `/books` 作品中樞頁：主打兩本新書卡片＋「完整著作」連 vistacheng.com/books＋電子報 CTA
2. 新增 `/books/vibe-coding` 書籍專頁：書介、章節亮點、目錄、啟動包預告（email CTA 過渡走 Substack）、配套課程導流（Vibe Coding 工作坊、1-on-1）
3. 新增 `/books/company-of-none`《無人公司》預告頁：鉤子敘事、三段式預覽、搶先讀 CTA（電子報）
4. `next.config.ts` 新增 `/book` → `/books` 301
5. Header 導覽新增「著作」項
6. `sitemap.ts` 新增三個 URL
7. 書籍資料集中在 `src/lib/books.ts`（書名、副標、購買連結做成常數，正式書名確定後改一處）

## Non-Goals（Phase 2/3 才做）

- 首頁改版與導覽收斂
- 啟動包 gated 頁與 email 收集（走 vista.tw D1，另一條工程線）
- 無人公司預購金流

## Constraints

- 用詞規範：臺不用台、禁「打造」「賦能」等套路詞（引述書籍實際目錄除外）、中文全形標點
- 《無人公司》頁不得出現未公開資訊（加速計畫定價、名單數細節）
- 視覺沿用現有 stone/amber 系統與 shadcn 元件；SEO 沿用 Metadata＋JsonLd 慣例

## Decision Record（2026-07-03 修訂）

上線次日重新評估 canonical 位置，決議遷移至 vista.tw/books：

1. 名單引擎在 vista.tw（啟動包 spec 定案走 D1 leads/sequences，第一方同站）
2. 搜書的搜尋意圖歸屬作者媒體站，內容互鏈與長尾 SEO 長在內容站
3. 「一臺流量機器」鐵律：書是流量資產，裝在流量機器（vista.tw）上
4. solo.tw 專注課程轉化：/book、/books、/books/:slug 全部 301 → vista.tw/books，
   Header「著作」改外連，本站書頁與 src/lib/books.ts 移除

vista.tw 端實作：src/pages/books/{index,vibe-coding,company-of-none}.astro，
lead form 複用 /api/lead＋vibe-coding-starter-guide magnet。
