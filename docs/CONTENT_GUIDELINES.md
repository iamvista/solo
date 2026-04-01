# solo.tw 上稿規範

> 最後更新：2026-04-01
> 適用範圍：solo.tw 部落格所有文章

---

## 一、檔案規格

### 存放位置

```
src/content/blog/{slug}.md
```

- **slug 命名規則**：全小寫英文，以 `-` 連接，簡短描述主題
- 範例：`how-to-start-solo-business.md`、`ai-tools-for-solopreneurs.md`

### Hero 圖片

```
public/images/blog/{slug}-hero.webp
```

- **格式**：WebP（必須）
- **尺寸**：1200 × 675 px（16:9 比例）
- **品質**：82-85（壓縮後控制在 100KB 以內為佳）
- **如果原始檔是 PNG**，用以下指令轉換：

```bash
node -e "
const sharp = require('sharp');
sharp('原始檔.png')
  .resize(1200, 675, { fit: 'cover' })
  .webp({ quality: 85 })
  .toFile('public/images/blog/slug-hero.webp')
  .then(info => console.log('Done!', info.size, 'bytes'));
"
```

---

## 二、Frontmatter 欄位

每篇文章的開頭必須包含以下 YAML frontmatter：

```yaml
---
title: '文章標題——副標題用破折號連接'
description: '140 字以內的文章摘要，會顯示在 Google 搜尋結果和社群分享。'
pubDate: '2026-04-01'
heroImage: /images/blog/slug-hero.webp
tags:
  - 一人事業
  - AI應用
---
```

### 欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | ✅ | 文章標題。不超過 60 字。用書名號或破折號，不用「」包裹 |
| `description` | ✅ | SEO 描述。140 字以內。會出現在 Google、Facebook 分享 |
| `pubDate` | ✅ | 發布日期。格式 `YYYY-MM-DD`。注意時區為 GMT+8（臺北） |
| `heroImage` | 建議 | Hero 圖片路徑。以 `/images/blog/` 開頭 |
| `updatedDate` | 選填 | 更新日期。修改文章內容後加上 |
| `tags` | ✅ | 標籤陣列。至少 2 個，最多 5 個 |

### 常用 tags

- `一人事業`、`個人品牌`、`自由工作者`、`創業`
- `AI應用`、`AI Agent`、`工具推薦`、`生產力`
- `內容行銷`、`被動收入`、`知識變現`
- `定價策略`、`商業模式`
- `Podcast心得`、`書評`

### ⚠️ 注意事項

- **不要在內文重複 H1 標題**——標題由 frontmatter 的 `title` 自動產生
- `pubDate` 使用臺灣時間（GMT+8），日期需正確
- `description` 不要超過 160 字元（Google 會截斷）

---

## 三、文章結構

### 標準結構（建議遵循）

```
1. 場景開場（具體場景、人物對話、個人經歷）
2. 問題提煉（從場景中拉出一個核心問題）
3. 觀點破題（一句話給出立場）
4. 框架拆解（H2/H3 逐步展開，3-5 個子論點）
5. 行動指引（讀者可操作的下一步）
6. CTA 區塊（免費健檢 + 免費諮詢）
7. 作者簽名檔
```

### H2 標題風格

- ✅ 帶觀點或設問：「不請人，是一種產品策略」
- ✅ 用冒號做對比：「第一層：成本底線——你最少該收多少」
- ❌ 中性描述：「關於定價的說明」
- ❌ 空泛提問：「你有想過嗎？」

### H3 標題

- 用於 H2 底下的子項目
- 簡潔具體：「辦一場小型活動，看看有沒有人要」

---

## 四、寫作風格

### 語氣

- **正式度**：5.5/10（偏口語的專業感）
- **人稱**：第一人稱「我」貫穿全文
- **對讀者**：用「你」直接對話

### 常用口語詞

- 嗯、老實說、說穿了、畢竟、話說回來、換句話說、更具體一點說

### 節奏

- **長句鋪陳 → 短句收束**
- 每段 3-5 句，一段一重點
- 段落結尾用一句簡短有力的話收住

### 標點符號

- **破折號「——」**：極高頻，用於句中補充和轉折（不用括號）
- **逗號**：句子中有停頓處必須加逗號，避免一口氣太長
- **書名號「《》」**：用於書名、電子報名。書名號本身不加超連結，內文才加
  - ✅ `《[Vista 電子報](https://iamvista.substack.com/)》`
  - ❌ `[《Vista 電子報》](https://iamvista.substack.com/)`
- **「」引號**：僅用於標記他人的話、特定術語。概念詞不需要加引號
  - ✅ 用 AI 放大個人產出
  - ❌ 用 AI 放大「個人產出」

### 人名處理

- 首次出現：中文名（英文名），英文名帶超連結
  - ✅ `凱文·羅斯（[Kevin Rose](https://...)）`
  - ❌ `[凱文·羅斯（Kevin Rose）](https://...)`
- 後續出現：直接用中文名或英文名

### 數據引用

- 引用報告或學者時，先給完整出處，再用白話翻譯
- 來源加超連結
  - ✅ `根據 [Clockify 的研究](https://...)，將近一半的自由工作者每週花約 6 小時在行政庶務上`

### 避免

- ❌ AI 味套話：「讓我們一起探索」「不容忽視」「值得深思」「在這個快速變化的時代」
- ❌ 機械式連接詞：「首先」「其次」「最後」「綜上所述」
- ❌ 粗體後多餘空格：`**標題。** 正文` → `**標題。**正文`
- ❌ 連結前後多餘空格：`做 [事業健檢](...) 了` → `做[事業健檢](...)了`
- ❌ IG（用完整的 Instagram）

---

## 五、連結規範

### 內部連結（必須包含）

每篇文章**至少**要有以下連結：

| 連結 | 位置 | 用途 |
|------|------|------|
| [SOLO 事業健檢](https://www.solo.tw/diagnose) | 文中或文末 | 引流到免費工具 |
| [免費 30 分鐘諮詢](https://www.solo.tw/consulting) | 文末 | 轉換諮詢預約 |
| 至少 1 篇其他部落格文章 | 文中或文末 | 內部連結網路 |

### 建議連結的內部頁面

- `/courses` — 課程與工作坊
- `/growth` — SOLO 成長路徑
- `/about` — 關於 Vista
- `/blog/其他文章slug` — 相關文章互連
- `https://learn.solo.tw` — 線上學習平臺

### 外部連結

- 引用的工具、報告、人物加上超連結
- 所有外部連結會自動加上 `target="_blank" rel="noopener noreferrer"`
- 外部連結的網址必須是有效的（不要連到 404）

### 網域規範

- 內部連結一律使用 `https://www.solo.tw/`（含 www）
- Email 連結統一指向 `iamvista@gmail.com`

---

## 六、文末固定格式

### CTA 區塊

```markdown
**→ [SOLO 事業健檢](https://www.solo.tw/diagnose)：**三分鐘，看清楚你目前的狀態。

**→ [免費 30 分鐘諮詢](https://www.solo.tw/consulting)：**我們可以聊聊你的一人事業。但因為諮詢時段有限，先登記先贏！
```

### 作者簽名檔

```markdown
*Vista Cheng 是 [solo.tw](https://www.solo.tw) 的創辦人。每週在《[Vista 電子報](https://iamvista.substack.com/)》分享有關 AI 行銷和經營覆盤的最新情報。*
```

可在簽名檔後加推薦文章連結：

```markdown
*也推薦看看[文章標題](https://www.solo.tw/blog/slug)和[文章標題](https://www.solo.tw/blog/slug)。*
```

---

## 七、Markdown 注意事項

### 粗體段落

粗體開頭的段落，前後必須有空行，粗體結束符號後不加空格：

```markdown
✅ 正確：
**一、個人網站。**一頁式就好——你是誰、做什麼、怎麼聯繫。

❌ 錯誤：
**一、個人網站。** 一頁式就好——你是誰、做什麼、怎麼聯繫。
```

### 分隔線

用 `---` 分隔大段落，前後各空一行：

```markdown
上一段的最後一句。

---

## 新的段落標題
```

### 嵌入 YouTube 影片

```html
<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5em 0"><iframe src="https://www.youtube.com/embed/VIDEO_ID" title="影片標題" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div>
```

### 不要用 Markdown 表格

表格在手機上渲染效果差。改用粗體開頭的段落清單：

```markdown
✅ 用這種格式：
**一、個人網站。**一頁式就好——你是誰、做什麼、怎麼聯繫。

❌ 不要用表格：
| 項目 | 建議 |
|------|------|
| 個人網站 | 一頁式 |
```

---

## 八、SEO 檢查清單

上稿前確認以下項目：

- [ ] `title` 包含目標關鍵字，60 字以內
- [ ] `description` 140 字以內，包含關鍵字
- [ ] `pubDate` 日期正確（GMT+8）
- [ ] `heroImage` 已放入 `public/images/blog/`，格式為 WebP
- [ ] `tags` 至少 2 個
- [ ] 文章內文不重複 H1（由 frontmatter 自動產生）
- [ ] 至少包含 1 個內部連結到 `/diagnose`
- [ ] 至少包含 1 個內部連結到 `/consulting`
- [ ] 至少包含 1 個連結到其他部落格文章
- [ ] 文末有 CTA 區塊和作者簽名檔
- [ ] 所有外部連結指向有效網址
- [ ] 所有 email 連結指向 `iamvista@gmail.com`
- [ ] 無多餘空格（粗體後、連結前後）
- [ ] 無不必要的「」引號
- [ ] 逗號使用充足，句子不會一口氣太長

---

## 九、部署流程

```bash
# 1. 把 .md 檔案放到正確位置
cp 文章.md src/content/blog/slug.md

# 2. 把 hero 圖片放到正確位置
cp hero.webp public/images/blog/slug-hero.webp

# 3. Build 驗證
npx next build

# 4. Commit 並推上去（觸發 Vercel 自動部署）
git add src/content/blog/slug.md public/images/blog/slug-hero.webp
git commit -m "content: add blog post — 文章標題簡述"
git push origin main

# 5. 確認部署成功
npx vercel ls | head -5
```
