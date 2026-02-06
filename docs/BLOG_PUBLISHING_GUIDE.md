# 部落格上稿機制指南

## 目前架構

Solo.tw 部落格採用 **Markdown 靜態檔案** 架構：

- **文章位置**：`/src/content/blog/*.md`
- **圖片位置**：`/public/images/blog/`
- **解析工具**：gray-matter + 自訂 Markdown 渲染

## 新增文章步驟

### 1. 建立 Markdown 檔案

在 `/src/content/blog/` 目錄下新增 `.md` 檔案，檔名將作為 URL slug：

```
檔名：my-new-article.md
網址：https://solo.tw/blog/my-new-article
```

### 2. 撰寫 Frontmatter（文章屬性）

每篇文章開頭需包含 YAML frontmatter：

```yaml
---
title: 文章標題
description: >-
  文章描述（建議 120-160 字），會顯示在列表頁和 SEO meta description
pubDate: '2026-02-06'
updatedDate: '2026-02-07'  # 選填：更新日期
heroImage: /images/blog/hero-image.webp  # 選填：封面圖
tags:
  - 個人品牌
  - AI應用
  - 自由工作者
---
```

### 3. 撰寫文章內容

使用標準 Markdown 語法：

```markdown
## 大標題

段落文字...

### 小標題

- 列表項目
- 列表項目

![圖片說明](/images/blog/image-name.webp)

**粗體** 和 *斜體* 文字

> 引用區塊

\`\`\`javascript
// 程式碼區塊
const example = "Hello";
\`\`\`
```

### 4. 上傳圖片

將圖片放置於 `/public/images/blog/` 目錄：

- **建議格式**：WebP（優先）、PNG、JPG
- **建議尺寸**：Hero 圖 1200x630px（配合 OG 圖）
- **命名規則**：`article-slug-description.webp`

### 5. 發布

```bash
# 本地預覽
pnpm dev

# 確認無誤後提交
git add .
git commit -m "新增文章：文章標題"
git push
```

## 標籤管理

### 現有標籤分類

目前文章使用的主要標籤：

| 類別 | 標籤 |
|------|------|
| 主題 | 個人品牌、知識付費、一人公司、一人企業 |
| 技術 | AI應用、AI寫作、AI工具、ChatGPT |
| 職涯 | 自由工作者、職涯發展、創業 |
| 技能 | 內容行銷、社群經營、寫作技巧 |

### 新增標籤

直接在文章 frontmatter 的 `tags` 陣列中加入新標籤即可，系統會自動產生對應的標籤頁面。

## 未來升級方案

### 方案一：CMS 整合（推薦）

整合 **Contentlayer** 或 **Sanity CMS**：

**優點**：
- 非技術人員可透過介面編輯
- 支援草稿、排程發布
- 圖片上傳更方便

**實作成本**：中等（1-2 天）

### 方案二：Notion 同步

使用 Notion 作為編輯後台：

```
Notion 頁面 → Notion API → 自動同步 → 部落格更新
```

**優點**：
- 熟悉的 Notion 編輯體驗
- 支援協作編輯
- 無需學習新工具

**實作成本**：中等（2-3 天）

### 方案三：GitHub 線上編輯

直接在 GitHub 網頁介面編輯 Markdown：

1. 進入 `/src/content/blog/` 目錄
2. 點擊「Add file」→「Create new file」
3. 撰寫文章並提交

**優點**：
- 零額外成本
- 版本控制完整
- 支援 PR 審核流程

**實作成本**：零

### 方案四：Admin 後台（完整方案）

建立專屬管理後台：

- `/admin/posts` - 文章管理
- `/admin/posts/new` - 新增文章
- `/admin/posts/[id]/edit` - 編輯文章
- `/admin/media` - 媒體庫管理

**優點**：
- 完整的管理功能
- 客製化工作流程
- 整合其他功能（課程、會員等）

**實作成本**：高（3-5 天）

## 建議的上稿流程

### 短期（目前）

1. 使用本地編輯器（VS Code、Cursor）撰寫 Markdown
2. 放置圖片到 `/public/images/blog/`
3. Git commit & push
4. Vercel 自動部署

### 中期（推薦）

整合 **Contentlayer**：

```bash
pnpm add contentlayer next-contentlayer
```

配置 `contentlayer.config.ts`，即可獲得：
- TypeScript 類型自動產生
- 更強大的 MDX 支援
- 更好的開發體驗

### 長期

根據團隊需求選擇：
- 一人運營 → Notion 同步方案
- 多人協作 → CMS 或 Admin 後台

## 常見問題

### Q: 如何設定文章排序？

文章預設按 `pubDate` 降序排列（最新優先）。

### Q: 如何隱藏草稿？

在 frontmatter 加入 `draft: true`，並修改 `/src/lib/blog.ts` 過濾草稿。

### Q: 如何加入作者資訊？

可在 frontmatter 加入 `author` 欄位，並在頁面元件中顯示。

### Q: 圖片如何優化？

建議使用 WebP 格式，可使用線上工具如 Squoosh 壓縮。

---

*文件更新日期：2026 年 2 月*
