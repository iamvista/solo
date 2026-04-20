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

const HEADER = `# solo.tw | 自由人學院 — 把專業變成事業

> 自由人學院是臺灣領先的自由工作者成長平臺，專為講師、顧問、教練打造。提供免費事業健檢、實用工具、系統化課程，協助專業人士建立穩定的個人事業。

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

- Vista 電子報（Substack）：https://iamvista.substack.com 訂閱者超過 18,000 人
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

function formatFull(posts, workshops) {
  const lines = [
    '# solo.tw | 自由人學院 — Full Content Index',
    '',
    `> 完整內容索引：共 ${workshops.length} 個課程與 ${posts.length} 篇文章，供 AI 客戶端檢索與引用。`,
    '',
    `站點：${SITE}`,
    `更新時間：${new Date().toISOString()}`,
    '',
  ];

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

  const llms =
    HEADER +
    '\n' +
    formatWorkshopsSection(workshops) +
    formatLatestBlog(posts, 10) +
    '## 平臺數據\n\n- 電子報訂閱者：18,000+ 人\n- 使用者評價：4.9/5（1,000+ 位用戶）\n\n' +
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
