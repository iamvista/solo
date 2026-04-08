# AI 教練工坊 — 數位產品設計規格

## 概述

在 solo.tw 上架一個獨立數位產品「AI 教練工坊」，教零基礎使用者用 AI 建立自己的實踐教練系統。框架為主、工具包為輔。一次買斷 $1,499 NTD，付款後下載 ZIP。

## 產品定位

核心賣點：「教你用 AI 建一個每天陪你執行的實踐教練」

不是課程，是一套拿到就能用、學了就能改的系統。買家最大的興趣不是看 Vista 的資料，而是用自己的產業知識建立屬於自己的 AI 教練。

目標客群：完全零基礎，沒用過 Claude Code，但對 AI 應用有興趣、願意動手試。

## 產品內容（ZIP 包）

```
ai-coach-kit/
├── README.md                        — 歡迎頁 + 快速開始（3 步驟）
├── install.sh                       — macOS/Linux 一鍵安裝
├── install.bat                      — Windows 一鍵安裝
├── CLAUDE.md                        — 工作區設定
├── config-template.md               — 個人設定模板
│
├── skills/                          — 4 個教練 Skill
│   ├── solo-coach.md
│   ├── solo-coach-morning.md
│   ├── solo-coach-checkin.md
│   └── solo-coach-weekly.md
│
├── coach/                           — 教練模板 + Vista Coach 範例
│   ├── _template.md
│   ├── _progress-template.md
│   └── vista-coach.md               — Vista Coach 預建設定（含 notebook IDs）
│
├── guide/                           — 零基礎圖文教學（6 篇）
│   ├── 01-install-claude-code.md
│   ├── 02-install-coach.md
│   ├── 03-first-session.md
│   ├── 04-daily-loop.md
│   ├── 05-build-your-own.md
│   └── 06-notebooklm-guide.md
│
└── examples/                        — 填好的範例檔
    ├── example-config.md
    ├── example-coach-config.md
    └── example-progress-7days.md
```

核心檔案沿用 solopreneur-skills 專案中已完成的 Skill 和模板，不需要重新開發。新增的是 guide/ 教學和 examples/ 範例。

## solo.tw 銷售頁

### 路由

`/products/ai-coach-kit`

### 頁面區塊

1. Hero
   - 標題：「AI 教練工坊：打造你自己的 AI 實踐教練」
   - 副標題：「不是聊天機器人，是每天陪你執行、追蹤進度、設計實驗的教練系統」
   - CTA 按鈕：「立即購買 NT$1,499」

2. 痛點共鳴
   - 「你有沒有買過課程，前三天很興奮，一個月後完全忘記？」
   - 「問題不在你，是缺少三個東西：問責、個人化、實踐追蹤」

3. 解法對比
   - 左欄：市面 AI 教練（聊天機器人）— 你問它答、對話結束就結束、沒有追蹤
   - 右欄：AI 教練工坊（實踐迴圈）— 主動 check-in、設計實驗、進度追蹤、週報歸檔

4. 產品內容
   - 4 個教練 Skill（一鍵安裝）
   - 教練模板系統（用任何知識建教練）
   - Vista Coach 預建教練（150 篇知識庫，可直接使用）
   - 6 篇零基礎圖文教學（從安裝到自建教練）
   - 3 份填好的範例檔（看了就懂怎麼填）

5. 使用場景
   - 內容創作者：用自己的文章 + 喜歡的作者建教練，每天追蹤寫作實驗
   - 企業講師：用課程講義建教練，為學員提供課後實踐追蹤
   - 設計師 / 接案者：用產業方法論建教練，追蹤接案和品牌建立
   - 顧問 / 教練：用自己的方法論建教練，擴展服務能力

6. 教練系統 Demo
   - 展示真實 progress.md 的內容（使用一週後的樣子）
   - 展示晨間覆盤的輸出範例
   - 展示實驗設計的結構

7. FAQ（6-8 題）
   - 需要什麼技術基礎？→ 零基礎，附完整教學
   - 需要付其他費用嗎？→ Claude 訂閱 $20 USD/月 + API 約 $3-9 USD/月
   - Vista Coach 的知識庫包含什麼？→ 150 篇文章（一人創業 + 內容創作 + 電子報）
   - 可以用在什麼產業？→ 任何有文字知識庫的領域
   - 買了之後有更新嗎？→ 未來有重大更新會通知
   - 跟 Bootcamp 有什麼關係？→ 教練工坊是獨立產品，Bootcamp 涵蓋更完整的一人公司系統
   - 可以退費嗎？→ 數位商品售出後不退費
   - macOS 和 Windows 都能用嗎？→ 都能用，附雙平臺安裝腳本

8. 定價 + CTA
   - NT$1,499 一次買斷
   - 購買按鈕
   - 小字：「數位商品，付款後立即下載」

### 頁面技術實作

- 新增 Next.js 頁面：`src/app/products/ai-coach-kit/page.tsx`
- 純 React Server Component，不需要 client-side state
- 沿用 solo.tw 現有的設計系統（Tailwind + shadcn/ui）
- 購買按鈕連結到現有 PAYUNi 付款流程

## 付款與交付流程

```
銷售頁 CTA
  ↓
PAYUNi 付款（現有整合）
  ↓
付款成功回調 → 產生唯一下載 token
  ↓
成功頁顯示下載按鈕
  ↓
GET /api/download/ai-coach-kit?token=xxx
  ↓
驗證 token → 回傳 ZIP → 記錄下載次數
```

### 新增的 API Routes

1. `POST /api/payment/create` — 修改現有，新增產品 ID `product:ai-coach-kit`，價格 1499

2. `GET /api/download/ai-coach-kit` — 新增
   - 接收 token 參數
   - 驗證 token 有效性（存在、未過期、下載次數未超限）
   - 回傳 ZIP 檔案（存放在 /private 目錄或環境變數指定路徑）
   - 記錄下載次數 +1

### 下載保護

- 付款成功時產生唯一 token（UUID），存入 Supabase
- Token 有效期：72 小時
- 最大下載次數：3 次
- 超過限制顯示「請聯繫 support@solo.tw 重新取得下載連結」

### 資料庫新增

在 Supabase 新增 `download_tokens` 表：

```sql
CREATE TABLE download_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  email TEXT,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;
```

## 圖文教學（guide/ 目錄）

6 篇教學，專為零基礎設計。每篇用 markdown 撰寫，步驟配文字描述（不含截圖，但標示哪裡該截圖以便日後補上）。

### 01 安裝 Claude Code

- 什麼是 Claude Code？（一段話解釋，不用術語）
- 系統需求（macOS / Windows / Linux）
- 安裝步驟：
  1. 打開終端機（macOS: Terminal / Windows: PowerShell）——附「怎麼打開終端機」說明
  2. 安裝 Node.js（如果沒有的話）
  3. 執行 npm install -g @anthropic-ai/claude-code
  4. 執行 claude 確認安裝成功
  5. 登入你的 Claude 帳號
- Claude 訂閱方案說明（Pro $20 / Max $60）
- 常見問題：裝不上去怎麼辦

### 02 安裝教練系統

- 解壓縮 ZIP
- 打開終端機，進入解壓後的資料夾
- 執行 bash install.sh（或 install.bat）
- 確認安裝成功的畫面
- 進入工作目錄

### 03 第一次啟動教練

- 用文字編輯器打開 config.md
- 逐欄填寫（附填寫範例和常見錯誤）
- 在終端機執行 claude
- 輸入 /solo-coach
- 回答 3 個校準問題（附建議回答方式）
- 看教練產出的實驗，確認合理

### 04 每日使用迴圈

- 早上起來做什麼：/solo-coach-morning
- 下午收工做什麼：/solo-coach-checkin
- 好的 check-in 回報 vs 不好的（附對比範例）
- 每週日做什麼：/solo-coach-weekly
- 建議養成習慣的技巧

### 05 建立你自己的教練

- 為什麼要建自己的教練（Vista Coach 是範例，你的領域你最懂）
- 選擇知識來源（選一位對你影響最大的作者）
- 收集 20-30 篇文章
- 建立 NotebookLM 筆記本（見 06）
- 複製 _template.md，填寫設定
- 啟動並校準
- 進階：多教練並行

### 06 NotebookLM 知識庫建立教學

- 什麼是 NotebookLM？
- 到 notebooklm.google.com 登入
- 建立新筆記本
- 加入來源：4 種方式（URL、文字、檔案、Google Drive）
- 找到筆記本 ID（網址列中的位置）
- 填回教練設定檔
- 一本不夠？分多本的策略

## 範例檔（examples/ 目錄）

### example-config.md

用一個虛構的「品牌設計師 小美」填好的 config.md，讓買家看到實際填完的樣子。

### example-coach-config.md

用「James Clear 原子習慣教練」填好的教練設定檔，展示如何用一位作者的內容建教練。

### example-progress-7days.md

一個使用 7 天後的 progress.md 範例，包含：
- 填好的 Current Goal 和 Creator Profile
- 4 個心智模型
- 2 個進行中的實驗（有真實感的數據）
- 7 天的 Today's Log 累積
- 3 條 Key Learnings

## 開發範圍

### 需要新建的

1. 銷售頁：`src/app/products/ai-coach-kit/page.tsx`
2. 下載 API：`src/app/api/download/ai-coach-kit/route.ts`
3. 付款流程修改：新增產品 ID 到 PRODUCT_PRICES
4. 付款成功頁修改：偵測產品類型，顯示下載按鈕
5. 資料庫：download_tokens 表 + migration
6. ZIP 內容準備：
   - guide/ 目錄 6 篇教學（新寫）
   - examples/ 目錄 3 個範例檔（新寫）
   - README.md 歡迎頁（新寫）
   - 從 solopreneur-skills 複製 skills/、coach/、install.sh、CLAUDE.md、config-template.md
7. ZIP 打包與存放

### 可沿用的

- PAYUNi 付款整合（已有）
- 4 個教練 Skill 檔案（今天做好的）
- 教練模板（今天做好的）
- Vista Coach 設定 + 3 本 NotebookLM 筆記本（今天建好的）
- solo.tw 設計系統（Tailwind + shadcn/ui）

### 不需要做的

- 用戶帳號系統（付款即交付，不需要登入）
- 內容加密或 DRM
- 影片教學（Phase 2 再做）
- 課程模式頁面（Phase 2 再做）
