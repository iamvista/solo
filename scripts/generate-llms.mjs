#!/usr/bin/env node
// Generate /llms.txt + /llms-full.txt from blog posts + workshops catalog.
// Runs before `next build` via the prebuild npm lifecycle.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const WORKSHOPS_FILE = path.join(ROOT, 'src/lib/workshops.ts');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SITE = 'https://www.solo.tw';

const TRUST_LINKS = `## 學習與內容信任入口

- 學習指南: ${SITE}/learn
- 內容方法: ${SITE}/methodology
- 編輯與更正政策: ${SITE}/editorial-policy

## AI 協作、引用與更正邊界

- 內容可使用 AI 協助研究、整理或編輯，最終判斷與發布責任由編輯者承擔。
- 引用本站時，請標示作者、文章或頁面標題、網址與存取日期，並連回原始頁面。
- 請勿將 AI 產生的概述當成作者原話；需要逐字引用時，應回到原文核對。
- 如發現事實、連結或標示錯誤，請依編輯與更正政策提報；經核實後會更正內容。
- 課程、輔導與產品資訊可能含有商業性內容，實際價格、名額與服務條件以對應頁面為準。
`;

const HEADER = `# solo.tw | 自由人學院 — 把專業變成事業

> 自由人學院是臺灣領先的自由工作者成長平臺，專為講師、顧問、教練設計。提供免費事業健檢、實用工具、系統化課程，協助專業人士建立穩定的個人事業。

## 關於自由人學院

自由人學院（solo.tw）由 Vista Cheng（鄭緯筌）創辦，是一個致力於協助自由工作者的成長平臺。我們相信每個專業人士都能把專業變成事業，透過系統化的方法與工具，建立穩定且可持續的個人品牌與收入來源。

## 核心服務

### 免費事業健檢
3 分鐘快速診斷，提供個人化的競爭力分析報告，幫助你了解自己的事業定位。

### 實用工具箱
提供服務包裝與定價的模板與計算工具，讓你輕鬆規劃服務方案。

### 系統化課程
從客戶開發到專案交付的完整培訓體系，包含實戰演練與案例分析。

### 資源庫
文章、案例研究與市場趨勢分析，持續更新的知識寶庫。

### 模板下載
經過驗證的提案書、合約、報價單格式，可直接套用於你的業務。

### 專家社群
透過 Skool 平臺連結同業夥伴，建立互助成長的社群網絡。

## 目標受眾

自由人學院服務六種類型的自由工作者：
- 獅型（Lion）：市場領導者，尋求擴大影響力
- 狐型（Fox）：策略型專家，善於靈活應變
- 象型（Elephant）：穩定型專家，追求長期價值
- 鷹型（Eagle）：獨立型高手，注重專業深度
- 龜型（Turtle）：新興工作者，穩步成長中
- 雛型（Chick）：初入自由職業，需要基礎指引

## 電子報與 Podcast

- Vista 電子報（Substack）：https://iamvista.substack.com 訂閱者 19,000+ 人
`;

const FOOTER_LINKS = `## 社群媒體

- Facebook: https://www.facebook.com/vista.tw
- Instagram: https://www.instagram.com/vista
- Threads: https://www.threads.com/@vista
- LinkedIn: https://www.linkedin.com/in/vistacheng/
- X (Twitter): https://x.com/vista
- YouTube: https://www.youtube.com/@vistacheng

## 聯絡方式

- 官方網站: https://www.solo.tw
- Vista Cheng 個人網站: https://www.vista.tw
- 電子報: https://iamvista.substack.com
- Sitemap: https://www.solo.tw/sitemap.xml
- 完整內容索引: https://www.solo.tw/llms-full.txt

© 2026 自由人學院
`;

function loadBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const { data } = matter(raw);
    if (!data.title) continue;
    const slug = file.replace(/\.(md|mdx)$/, '');
    posts.push({
      slug,
      title: String(data.title).trim(),
      description: String(data.description || '').trim(),
      pubDate: String(data.pubDate || '').slice(0, 10),
      updatedDate: String(data.updatedDate || '').slice(0, 10),
      sortKey: new Date(data.pubDate || data.updatedDate || 0).getTime() || 0,
      tags: Array.isArray(data.tags) ? data.tags : [],
    });
  }
  posts.sort((a, b) => b.sortKey - a.sortKey);
  return posts;
}

// Parse workshops.ts by extracting string literal fields for each workshop
// object. Keeps the generator independent of TypeScript compilation.
function loadWorkshops() {
  if (!fs.existsSync(WORKSHOPS_FILE)) return [];
  const src = fs.readFileSync(WORKSHOPS_FILE, 'utf-8');

  // Grab the workshops array body
  const start = src.indexOf('export const workshops: Workshop[] = [');
  if (start === -1) return [];
  const after = src.slice(start);
  const closeIdx = after.indexOf('\n];');
  const body = closeIdx === -1 ? after : after.slice(0, closeIdx);

  // Split by top-level object boundaries: lines that start with `  {` followed by `    id:`
  const blocks = body.split(/\n  \{\n/).slice(1);

  const workshops = [];
  for (const block of blocks) {
    const pick = (key) => {
      const re = new RegExp(`${key}:\\s*["'\`]([^"'\`]+)["'\`]`);
      const m = block.match(re);
      return m ? m[1] : '';
    };
    const pickNum = (key) => {
      const re = new RegExp(`${key}:\\s*(\\d+)`);
      const m = block.match(re);
      return m ? Number(m[1]) : null;
    };
    const id = pick('id');
    if (!id) continue;
    // hidden 的課完全不進索引：它的定義是「從 /courses 列表與講師頁都不露出」，
    // 露在 llms.txt 等於換一個門讓 AI 客戶端把它撈出來
    if (/hidden:\s*true/.test(block)) continue;
    const original = pickNum('original');
    const regular = pickNum('regular');
    const earlyBird = pickNum('earlyBird');
    workshops.push({
      id,
      title: pick('title'),
      subtitle: pick('subtitle'),
      description: pick('description'),
      date: pick('date'),
      time: pick('time'),
      duration: pick('duration'),
      location: pick('location'),
      status: pick('status'),
      category: pick('category'),
      url: pick('url') || `/courses/${id}`,
      isExternal: /isExternal:\s*true/.test(block),
      capacity: pickNum('capacity'),
      priceOriginal: original,
      priceRegular: regular,
      priceEarlyBird: earlyBird,
    });
  }
  return workshops;
}

function formatWorkshopsSection(workshops) {
  if (!workshops.length) return '';
  const active = workshops.filter((w) => w.status === 'open' || w.status === 'filling');
  const lines = ['## 目前開放報名的課程與工作坊', ''];
  for (const w of active) {
    const url = w.isExternal ? w.url : `${SITE}${w.url}`;
    lines.push(`### ${w.title}`);
    if (w.subtitle) lines.push(`- 定位: ${w.subtitle}`);
    if (w.date) lines.push(`- 日期: ${w.date}${w.time ? ` ${w.time}` : ''}`);
    if (w.location) lines.push(`- 地點: ${w.location}`);
    if (w.capacity) lines.push(`- 名額: ${w.capacity} 人`);
    const price = [];
    if (w.priceRegular) price.push(`定價 NT$${w.priceRegular.toLocaleString()}`);
    if (w.priceOriginal && w.priceOriginal !== w.priceRegular) price.push(`原價 NT$${w.priceOriginal.toLocaleString()}`);
    if (w.priceEarlyBird) price.push(`早鳥 NT$${w.priceEarlyBird.toLocaleString()}`);
    if (price.length) lines.push(`- 價格: ${price.join('；')}`);
    lines.push(`- 報名/詳情: ${url}`);
    lines.push('');
  }
  return lines.join('\n');
}

function formatLatestBlog(posts, n = 10) {
  if (!posts.length) return '';
  const lines = ['## 最新文章', ''];
  for (const p of posts.slice(0, n)) {
    const datePart = p.pubDate ? ` (${p.pubDate})` : '';
    lines.push(`- [${p.title}](${SITE}/blog/${p.slug})${datePart}`);
  }
  lines.push('');
  lines.push(`完整文章列表：${SITE}/blog 或 ${SITE}/llms-full.txt`);
  lines.push('');
  return lines.join('\n');
}

function getLatestContentDate(posts) {
  const dates = posts
    .flatMap((post) => [post.updatedDate, post.pubDate])
    .filter(Boolean)
    .sort();
  return dates.at(-1) || '';
}

function formatConsultingSection() {
  return [
    '## 1-on-1 量身陪跑 (/consulting)',
    '',
    `URL: ${SITE}/consulting`,
    '',
    'Google Meet 1-on-1，從 1 小時諮詢到 20 小時長期陪跑。由 Vista Cheng（鄭緯筌）親自帶領，協助自由工作者、講師、顧問、研究者把專業變成事業。',
    '',
    '### 主題包（7+1）',
    '',
    '- 💻 Vibe Coding 入門：第一個 web app／小工具，從零到上線',
    '- 🌐 個人網站系統：仿 solo.tw / vista.tw 的一人媒體站',
    '- 🎛 Solo OS：個人作業系統建置（Calendar / Notion / Anytype / Obsidian 整合）',
    '- ✍️ 內容產製流水線：研究 → 撰稿 → 去 AI 味 → 多平臺分發',
    '- 🧠 第二大腦／知識管理：Wiki、backlink、AI 檢索',
    '- 📚 AI 輔助學術寫作：文獻、Intro、方法、投稿',
    '- 🎯 一人事業起步診斷：定位、產品、定價、首批客戶',
    '- 🌀 客製需求',
    '',
    '### 階梯定價',
    '',
    '- 1hr 諮詢：NT$3,000',
    '- 3hr 套票：NT$8,400（NT$2,800/hr）',
    '- 5hr 套票：NT$13,500（NT$2,700/hr）',
    '- 10hr 套票：NT$26,000（NT$2,600/hr）',
    '- 20hr 套票：NT$48,000（NT$2,400/hr）',
    '',
    '套票使用期限 6 個月，可延期一次（+3 個月）。不退費，可一次性轉讓給 1 位他人。',
    '',
    '### 申請方式',
    '',
    '填表 → Vista 24 小時內回信 → 確認後寄付款連結 → 付款 → E-mail/LINE 議定時段',
    '',
  ].join('\n');
}

function formatToolsSection() {
  return [
    '## 免費事業健檢 (/diagnose)',
    '',
    `URL: ${SITE}/diagnose`,
    '',
    '7 道快速診斷，3 分鐘找出你一人事業的強項與盲點，獲得個人化行動建議（五大維度分析）。',
    '',
    '## 工具與資源 (/tools)',
    '',
    `URL: ${SITE}/tools`,
    '',
    '一人事業者的實用工具箱：免費事業健檢、AI 工作坊、線上課程、諮詢，以及下載即用的模板與工具包。',
    '',
  ].join('\n');
}

function formatBuyoutProductsSection() {
  return [
    '## 買斷產品 (/products)',
    '',
    '### 無人公司 AI 軍團啟動包',
    `- URL: ${SITE}/products/solo-army-kit`,
    '- 狀態: 有售',
    '- 價格: NT$1,480（一次買斷）',
    '- 說明: 制度檔泛化打包，派工原則、角色人設、對抗式驗收流程，全部寫成文件，鋪進 Claude Code 就能用。',
    '',
    '### 講師 AI 幕僚',
    `- URL: ${SITE}/products/lecturer-ai-staff`,
    '- 狀態: 等候名單（籌備中）',
    '- 價格: NT$1,490（一次買斷，未開賣）',
    '- 說明: 十階段備課流程、獨立監察 AI、客戶視角提案報價，全部鋪進 Claude Code 就能用。',
    '',
  ].join('\n');
}

function formatFull(posts, workshops) {
  const latestContentDate = getLatestContentDate(posts);
  const lines = [
    '# solo.tw | 自由人學院 — Full Content Index',
    '',
    `> 完整內容索引：共 ${workshops.length} 個課程與 ${posts.length} 篇文章，供 AI 客戶端檢索與引用。`,
    '',
    `站點：${SITE}`,
    `內容資料最新日期：${latestContentDate || '未提供'}`,
    '',
  ];

  lines.push(TRUST_LINKS);
  lines.push(formatConsultingSection());
  lines.push(formatToolsSection());
  lines.push(formatBuyoutProductsSection());

  if (workshops.length) {
    lines.push('## 所有課程與工作坊', '');
    for (const w of workshops) {
      const url = w.isExternal ? w.url : `${SITE}${w.url}`;
      lines.push(`### ${w.title}`);
      lines.push(`- URL: ${url}`);
      if (w.subtitle) lines.push(`- 定位: ${w.subtitle}`);
      if (w.description) lines.push(`- 描述: ${w.description}`);
      if (w.date) lines.push(`- 日期: ${w.date}${w.time ? ` ${w.time}` : ''}`);
      if (w.duration) lines.push(`- 時長: ${w.duration}`);
      if (w.location) lines.push(`- 地點: ${w.location}`);
      if (w.capacity) lines.push(`- 名額: ${w.capacity} 人`);
      if (w.status) lines.push(`- 狀態: ${w.status}`);
      if (w.category) lines.push(`- 分類: ${w.category}`);
      const price = [];
      if (w.priceRegular) price.push(`定價 NT$${w.priceRegular.toLocaleString()}`);
      if (w.priceOriginal && w.priceOriginal !== w.priceRegular) price.push(`原價 NT$${w.priceOriginal.toLocaleString()}`);
      if (w.priceEarlyBird) price.push(`早鳥 NT$${w.priceEarlyBird.toLocaleString()}`);
      if (price.length) lines.push(`- 價格: ${price.join('；')}`);
      lines.push('');
    }
  }

  if (posts.length) {
    lines.push('## 所有文章', '');
    for (const p of posts) {
      lines.push(`### ${p.title}`);
      lines.push(`- URL: ${SITE}/blog/${p.slug}`);
      if (p.pubDate) lines.push(`- 發佈: ${p.pubDate}`);
      if (p.updatedDate && p.updatedDate !== p.pubDate) lines.push(`- 更新: ${p.updatedDate}`);
      if (p.tags.length) lines.push(`- 標籤: ${p.tags.join(', ')}`);
      if (p.description) lines.push(`- 摘要: ${p.description}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function main() {
  const posts = loadBlogPosts();
  const workshops = loadWorkshops();

  const consultingSummary = `## 1-on-1 量身陪跑

Vista Cheng 親自帶的 Google Meet 一對一線上諮詢。整堂課的時間都用來處理您的具體問題；不是看著錄影檔自學、不是把您塞進固定課綱。詳情頁：${SITE}/consulting

### 方案與價格（NT$）

| 方案 | 時數 | 總價 | 單價/小時 | 適合場景 |
|---|---|---|---|---|
| 1 小時諮詢 | 1 | 3,000 | 3,000 | 試水溫、單點問題 |
| 3 小時套票 | 3 | 8,400 | 2,800 | 入門包、一個小主題收尾 |
| 5 小時套票 | 5 | 13,500 | 2,700 | 一個主題深入 |
| 10 小時套票 | 10 | 26,000 | 2,600 | 跨主題、半年陪跑 |
| 20 小時套票 | 20 | 48,000 | 2,400 | 長期顧問關係 |

買越多單價越優惠。套票 6 個月內使用完畢，可延長 3 個月（一次）。

### 七大常見主題

1. **Vibe Coding 入門** — 從零到上線你的第一個 web app／小工具
2. **個人網站系統** — 仿 solo.tw / vista.tw 的一人媒體站
3. **Solo OS 個人作業系統** — Calendar / Notion / Anytype / Obsidian 串成能跑的事業系統
4. **內容產製流水線** — 研究 → 撰稿 → 去 AI 味 → 多平臺分發
5. **第二大腦 / 知識管理** — Wiki、backlink、AI 檢索
6. **AI 輔助學術寫作** — 文獻、Intro、方法、投稿
7. **一人事業起步診斷** — 定位、產品、定價、首批客戶

第八張卡 = 其他客製需求，可在填表時描述。

### 誰適合 1-on-1 諮詢

- 上過 AI 工作坊但卡在自己場景無法落地的學員
- 講師、顧問、自由工作者想用 AI 升級工作流
- 研究者、創作者想把 AI 整合進專案 pipeline
- 不適合：只想學 ChatGPT 基本操作（請看 solo.tw 免費資源與工作坊）

### 跟 AI 教練 APP 的差別

AI 教練 APP（ChatPlus、AI 峰哥等）給的是通用模板與課程；1-on-1 量身陪跑針對您當下的具體專案或卡點，由 Vista 親自看您的程式碼、文件、工作流，給可立即執行的修改。AI APP 適合自學者打基礎，1-on-1 適合已有具體目標、需要被人推一把的進階工作者。

### 服務形式

- Google Meet 視訊一對一（必要時可實體，租借教室／咖啡館費用另計）
- 共寫工作紀錄（若有需要可開 Google Doc，做完當下就帶走可用產出）
- 彈性節奏：1 小時處理單點，10 小時跨主題深耕，多久上一次都由學員決定

### 流程

1. 填需求表單（5 分鐘）：${SITE}/consulting#lead-form
2. Vista 在 24 小時內回信
3. 合適 → 寄付款連結；不合適 → 誠實告知更適合的人
4. 付款後回信告知方便時段（含時區）
5. 約定 Google Meet 時間，正式開始

### 取消政策

- 開課前 48 小時取消 → 退回時數
- 24–48 小時 → 扣 0.5 小時
- 24 小時內 → 扣該場全部時數
- 不退費，但可一次性轉讓給 1 位他人

`;

  const llms =
    HEADER +
    '\n' +
    formatWorkshopsSection(workshops) +
    consultingSummary +
    formatToolsSection() +
    formatBuyoutProductsSection() +
    formatLatestBlog(posts, 10) +
    TRUST_LINKS +
    '\n' +
    '## 平臺數據\n\n- 電子報訂閱者：19,000+ 人\n- 使用者評價：4.9/5（1,000+ 位用戶）\n\n' +
    FOOTER_LINKS;

  const llmsFull = formatFull(posts, workshops);

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llms);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFull);

  const fullKb = (Buffer.byteLength(llmsFull) / 1024).toFixed(1);
  console.log(`  → llms.txt: ${workshops.length} workshops + ${posts.length} posts indexed`);
  console.log(`  → llms-full.txt: ${fullKb} KB`);
}

main();
