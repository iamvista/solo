# 副腦計畫｜Brain+1 Lab — Skills 教學安裝手冊

> 版本：1.0｜更新日期：2026-04-30
>
> 本手冊引導你完成副腦計畫 6 個 Skills 的安裝與使用，35 天內把你累積多年的素材變成可問答的個人 AI 副腦。

---

## 目錄

1. [系統概覽](#1-系統概覽)
2. [環境準備](#2-環境準備)
   - [2.1 Mac 環境安裝](#21-mac-環境安裝)
   - [2.2 Windows 環境安裝](#22-windows-環境安裝)
   - [2.3 NotebookLM 設定](#23-notebooklm-設定)
   - [2.4 Obsidian Vault 建置](#24-obsidian-vault-建置)
   - [2.5 Claude Code CLI 安裝](#25-claude-code-cli-安裝)
   - [2.6（選）notebooklm-mcp 自動化](#26-選notebooklm-mcp-自動化)
3. [Skills 安裝](#3-skills-安裝)
   - [3.1 取得 Skills 安裝包](#31-取得-skills-安裝包)
   - [3.2 Mac 安裝方式](#32-mac-安裝方式)
   - [3.3 Windows 安裝方式](#33-windows-安裝方式)
   - [3.4 手動安裝（通用）](#34-手動安裝通用)
   - [3.5 驗證安裝](#35-驗證安裝)
4. [Skills 功能介紹](#4-skills-功能介紹)
5. [使用教學](#5-使用教學)
   - [5.1 W1：建立第一個 Notebook](#51-w1建立第一個-notebook)
   - [5.2 W2：處理 podcast / 影音](#52-w2處理-podcast--影音)
   - [5.3 W3：抽象化工作經驗](#53-w3抽象化工作經驗)
   - [5.4 W4：跨庫整合 + 個人 GPT](#54-w4跨庫整合--個人-gpt)
6. [檔案結構說明](#6-檔案結構說明)
7. [常見問題](#7-常見問題)
8. [附錄](#8-附錄)

---

## 1. 系統概覽

副腦計畫是一套「個人 AI 副腦工程系統」，把你 5 年累積的素材（書、podcast、信件、會議筆記）變成可問答的對話對象。

### 核心架構

```
[Raw 素材]
   ↓
[Obsidian Inbox]   ← inbox-router skill 分流
   ↓
[Notebook 資料夾]   ← notebook-builder skill 上傳
   ↓
[NotebookLM Notebook]   ← notebooklm-brief-verifier 驗 brief
   ↓
[跨庫整合]   ← cross-notebook-query 串多 Notebook
   ↓
[個人 GPT]   ← personal-gpt-init 接到 ChatGPT/Claude/Gemini
```

每一層都有對應的 skill，讓 Claude Code 自動化大半流程。

### 包含的 6 個 Skills

| # | Skill | 指令 | 對應週次 | 主要功能 |
|---|---|---|---|---|
| 1 | 收件夾分流 | `/inbox-router` | W1 | 把 `00_inbox/` 的素材按 hashtag 自動搬到對應 Notebook 資料夾 |
| 2 | Notebook 建置 | `/notebook-builder` | W1–W4 | 從 Obsidian 資料夾批次上傳 sources 到 NotebookLM |
| 3 | brief 驗證 | `/notebooklm-brief-verifier` | W2 | 檢查 NotebookLM brief 的覆蓋度、斷章取義、漏連結 |
| 4 | 音訊抽 highlight | `/audio-highlight-extractor` | W3 | 把 podcast / 訪談逐字稿抽出 5–10 段 highlight |
| 5 | 跨庫查詢 | `/cross-notebook-query` | W4 | 對多個 NotebookLM Notebook 同時提問並整合答案 |
| 6 | 個人 GPT 初始化 | `/personal-gpt-init` | W4 結業 | 把所有 Notebook 接成 ChatGPT GPT / Claude Project / Gemini Gem |

### 工具堆疊

| 工具 | 角色 | 必需 / 建議 |
|---|---|---|
| **NotebookLM** | 副腦的核心、問答引擎 | ✅ 必需 |
| **Obsidian** | raw 素材入口 + 長期倉庫 | ✅ 必需 |
| **Claude（網頁）** | 跟副腦對話的入口、抽象化助手 | ✅ 必需 |
| **Claude Code（CLI）** | 跑 6 個 skill 的執行環境 | ✅ 必需（W2 起）|
| **notebooklm-mcp** | Claude Code 跟 NotebookLM 的橋接器 | 🟡 建議（讓 skill 可自動化） |

---

## 2. 環境準備

### 前置需求

- 一台 Mac 或 Windows 電腦
- 穩定網路
- Google 帳號（NotebookLM 用）
- Claude 帳號（Anthropic 官網註冊，免費版起步可，付費版進階更順）

---

### 2.1 Mac 環境安裝

#### 步驟一：安裝 Homebrew

打開 Terminal（在「應用程式」→「工具程式」→ Terminal.app）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安裝完成後跑這個確認：

```bash
brew --version
```

看到版號即 OK。

#### 步驟二：安裝 Node.js

```bash
brew install node
node --version
npm --version
```

#### 步驟三：安裝 Git

```bash
brew install git
git --version
```

如果 `git --version` 已有版號，表示 Mac 內建 git 已可用，這步可以跳過。

---

### 2.2 Windows 環境安裝

#### 步驟一：安裝 Node.js

1. 開瀏覽器到 https://nodejs.org
2. 下載 **LTS 版本**（左邊那個按鈕）
3. 雙擊安裝程式，全部按預設「下一步」
4. 安裝完成後開啟 PowerShell（按 `Win + X`，選「Windows PowerShell」）：

```powershell
node --version
npm --version
```

#### 步驟二：安裝 Git

1. 開瀏覽器到 https://git-scm.com
2. 下載 **Windows** 版本
3. 雙擊安裝程式，全部按預設「下一步」（特別是「Choosing the default editor」這步保留 VSCode 或 Notepad++ 都可）
4. 確認：

```powershell
git --version
```

---

### 2.3 NotebookLM 設定

NotebookLM 是副腦計畫的核心。先確認你能用。

1. 開瀏覽器到 https://notebooklm.google.com
2. 用 Google 帳號登入（建議用你日常工作那組）
3. 第一次進入會看到歡迎頁，點 `Get started` 或 `Try NotebookLM`

#### 建第一個測試 Notebook

1. 點右上 `+ Create new`
2. 命名「測試」
3. 上傳一份 PDF 或貼一段文字當 source
4. 等 NotebookLM 處理完（30 秒–2 分鐘）
5. 在下方對話框問：「這份文件的核心論點是什麼？」

#### ✅ 確認你看到

- 答案出來，且**右下角有引用標記**（小數字 1, 2, 3）
- 點引用標記可跳回原文段落
- 你可以連續追問

如果看不到引用標記，可能是 source 太短。再上傳一份內容多一點的 PDF。

#### 區域 / 帳號限制

NotebookLM 在某些國家或某類 Google 帳號上不開放。如果你開不到 NotebookLM，試：
- 換另一個 Google 帳號
- 用 VPN 切到美國或日本

---

### 2.4 Obsidian Vault 建置

副腦計畫用 Obsidian 當 raw 素材入口。

#### 下載與安裝

1. 開 https://obsidian.md
2. 點 `Get Obsidian for [你的作業系統]` 下載
3. 安裝完成後雙擊 Obsidian 啟動

#### 建第一個 Vault

第一次打開 Obsidian 會問你要做什麼：

1. 選 `Create new vault`
2. **Vault 名稱**：`brain-plus-one`
3. **位置**：選一個你常用的雲端同步資料夾
   - macOS：`iCloud Drive/brain-plus-one`
   - Windows：`OneDrive/brain-plus-one`
   - 兩邊都不用：`Documents/brain-plus-one`
4. 點 `Create`

> ⚠️ **不要把 vault 放在桌面**，換電腦會很痛。
>
> ⚠️ Vault 路徑**不要含中文或特殊符號**，某些情境會壞掉。

#### 建立副腦計畫的資料夾結構

進入 vault 後，在左側檔案樹用 `+` 新建以下資料夾（順序與名稱必須一致）：

```
brain-plus-one/
├── 00_inbox/
├── 01_notebook-01/
├── 02_notebook-02/
├── 03_notebook-03/
├── 99_archive/
└── _meta/
```

> 之後幾週會逐步用到。先全部建好。

#### 在 `_meta/` 建立 frontmatter 範本

新建一份 `_meta/frontmatter-template.md`：

```yaml
---
title: 
type:                   # book / paper / podcast / article / note
tags: [#notebook-01]
source: 
date_added: 2026-06-02
author: 
url: 
---

# 主體內容

## 核心論點

## 我的疑問

## 跟其他 sources 的連結
```

之後每份倒進 `00_inbox/` 的素材都從這份複製。

---

### 2.5 Claude Code CLI 安裝

副腦計畫的 6 個 skill 需要 Claude Code 跑。

#### Mac 安裝

打開 Terminal：

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

#### Windows 安裝

打開 PowerShell（系統管理員模式）：

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

#### 第一次登入

切到你的 Obsidian vault：

```bash
cd ~/Documents/brain-plus-one    # macOS
# 或
cd C:\Users\你的名字\Documents\brain-plus-one   # Windows
```

啟動：

```bash
claude
```

第一次會跳出瀏覽器要 Anthropic 登入（用你的 Claude 帳號）。完成驗證後 terminal 可以用 `claude` 跟 AI 對話。

#### ✅ 確認你看到

- terminal 內出現 Claude Code 對話介面
- 你可以打字問 Claude 任何問題並收到回答

---

### 2.6（選）notebooklm-mcp 自動化

NotebookLM 沒有公開 REST API。要讓 skills 自動上傳 sources / 跨庫查詢，需要裝 notebooklm-mcp。

#### 為什麼裝它

| 沒裝 | 有裝 |
|---|---|
| skill 給你**步驟清單**，你手動操作 | skill **自動跑完** |
| 上傳 8 份 source 約 5 分鐘 | 上傳 8 份 source 約 30 秒 |
| 跨庫查詢要開 3 分頁手動問 | 一條指令 30 秒拿到整合報告 |

如果你只想練手動流程，可跳過。但訓練營後段（W3、W4）強烈建議裝。

#### 安裝

```bash
npm install -g notebooklm-mcp
nlm login
```

`nlm login` 會跳出瀏覽器要你登入 Google 帳號（要跟 NotebookLM 同一個）。

完成後在 `~/.claude/settings.json` 加上 mcp server 設定（W2 直播會詳細帶）。

---

## 3. Skills 安裝

### 3.1 取得 Skills 安裝包

訓練營學員報名後會收到 GitHub repo 邀請（private repo）。

```bash
git clone https://github.com/iamvista/brain-plus-one-skills.git
cd brain-plus-one-skills
```

如果還沒收到邀請，LINE #help 私訊 Vista。

---

### 3.2 Mac 安裝方式

最快路徑：

```bash
cd brain-plus-one-skills
chmod +x install.sh
./install.sh
```

腳本會：
1. 偵測 `~/.claude/skills/` 是否存在（不存在會建）
2. 把 6 個 skill 各自複製到 `~/.claude/skills/[skill-name]/`
3. 確認 SKILL.md frontmatter 沒壞
4. 列出已安裝的 skill 清單

---

### 3.3 Windows 安裝方式

打開 PowerShell：

```powershell
cd brain-plus-one-skills
.\install.bat
```

腳本流程跟 Mac 版一樣，目標路徑改成 `%USERPROFILE%\.claude\skills\`。

---

### 3.4 手動安裝（通用）

如果腳本失敗，可以手動一個一個複製：

#### Mac / Linux

```bash
mkdir -p ~/.claude/skills
cp -r brain-plus-one-skills/inbox-router ~/.claude/skills/
cp -r brain-plus-one-skills/notebook-builder ~/.claude/skills/
cp -r brain-plus-one-skills/notebooklm-brief-verifier ~/.claude/skills/
cp -r brain-plus-one-skills/audio-highlight-extractor ~/.claude/skills/
cp -r brain-plus-one-skills/cross-notebook-query ~/.claude/skills/
cp -r brain-plus-one-skills/personal-gpt-init ~/.claude/skills/
```

#### Windows

```powershell
mkdir $env:USERPROFILE\.claude\skills -Force
Copy-Item -Recurse brain-plus-one-skills\inbox-router $env:USERPROFILE\.claude\skills\
Copy-Item -Recurse brain-plus-one-skills\notebook-builder $env:USERPROFILE\.claude\skills\
Copy-Item -Recurse brain-plus-one-skills\notebooklm-brief-verifier $env:USERPROFILE\.claude\skills\
Copy-Item -Recurse brain-plus-one-skills\audio-highlight-extractor $env:USERPROFILE\.claude\skills\
Copy-Item -Recurse brain-plus-one-skills\cross-notebook-query $env:USERPROFILE\.claude\skills\
Copy-Item -Recurse brain-plus-one-skills\personal-gpt-init $env:USERPROFILE\.claude\skills\
```

---

### 3.5 驗證安裝

```bash
ls ~/.claude/skills/   # macOS / Linux
# 或
dir %USERPROFILE%\.claude\skills\   # Windows
```

應該看到 6 個資料夾：

```
inbox-router/
notebook-builder/
notebooklm-brief-verifier/
audio-highlight-extractor/
cross-notebook-query/
personal-gpt-init/
```

開啟 Claude Code：

```bash
cd ~/Documents/brain-plus-one
claude
```

在對話框輸入 `/inbox-router`，Claude 應該會說「我可以幫你分流 inbox，請告訴我你的 Obsidian vault 路徑」之類的回應，代表 skill 已被讀取。

---

## 4. Skills 功能介紹

### `/inbox-router` — 收件夾分流

**用途**：自動把 Obsidian `00_inbox/` 內的 markdown 檔，依 frontmatter `tags:` 中的 `#notebook-NN` 搬到對應的 `NN_notebook-NN/` 資料夾。

**何時用**：每次倒入 1–N 份新素材到 inbox 後，跑一次清空。

**輸入**：你的 vault 路徑（在 vault 根目錄跑就會自動偵測）。

**輸出**：
- 檔案搬到對應資料夾
- `_meta/routing-log.md` 寫一筆 log
- 沒 tag 的檔案留在 inbox + 警示

**進階**：scripts/route.py（純 Python 批次版，跑 50+ 檔案最快）。

---

### `/notebook-builder` — Notebook 建置

**用途**：從 Obsidian 資料夾批次上傳所有 sources 到 NotebookLM。

**何時用**：你決定建一個新的 NotebookLM Notebook 時。

**輸入**：資料夾路徑（如 `01_notebook-01`）。

**輸出**：
- NotebookLM Notebook 建立完成（給 URL）
- `<folder>/source-list.md` 紀錄上傳清單

**雙路徑**：
- 有 notebooklm-mcp → 自動批次上傳
- 沒 mcp → 產出步驟清單，你手動拖

---

### `/notebooklm-brief-verifier` — brief 驗證

**用途**：檢查 NotebookLM 的 brief 是否：
1. 覆蓋全部 sources（沒漏引用）
2. 沒斷章取義（brief 跟原文觀點一致）
3. 沒漏跨 source 連結（兩份 source 處理同概念但 brief 沒整合）

**何時用**：每次 brief 寫好（或 AI 自動產生）後，跑一次 audit。

**輸出**：`brief-audit-[date].md` 報告，含覆蓋度表格、可疑 claim 清單、修正建議。

---

### `/audio-highlight-extractor` — 音訊抽 highlight

**用途**：把 podcast / 訪談 / 影片字幕的逐字稿，按主題抽出 5–10 段 highlight，產出可上傳的 markdown source。

**何時用**：你要把音訊內容變成 NotebookLM source 時。

**輸入**：
- 逐字稿檔案（.txt / .srt / .vtt）
- 主題 keyword（你想抓哪一類段落）

**輸出**：`[節目名]-[集數]-highlights.md`，含 frontmatter + 5–10 段 highlight（時間碼 + 摘要 + 原文節錄）。

---

### `/cross-notebook-query` — 跨庫查詢

**用途**：對多個 NotebookLM Notebook 同時提問，整合回答 + 比對交集 / 差異 / 衝突。

**何時用**：你想問跨類型的問題（例如「客戶最在意什麼？」需要書 + podcast + 你的工作經驗一起看）。

**輸入**：問題 + Notebook URL 列表。

**輸出**：整合報告 markdown，含共同點、差異點、衝突點、整合答案。

---

### `/personal-gpt-init` — 個人 GPT 初始化

**用途**：把所有 Notebook 接成一個 ChatGPT GPT / Claude Project / Custom Gemini Gem 的初始化模板。

**何時用**：W4 結業時，把訓練營成果變成日常可用的個人 AI 助理。

**輸入**：個人定位、Notebook 清單、目標平臺。

**輸出**：
- `personal-gpt-prompt.md`（system prompt 直接複製貼上到平臺）
- `notebook-routing.md`（routing 對照表）
- 平臺操作步驟

---

## 5. 使用教學

### 5.1 W1：建立第一個 Notebook

W1 目標：把你硬碟裡 5–15 份素材，變成第一個會回話的 Notebook。

#### Day 1：選主題

打開你的 inventory（5/25 onboarding email 那份），圈選 5–15 份素材，寫一句話：「這個 Notebook 要回答什麼核心問題？」

範例：
- 主題：行銷理論交叉閱讀
- 素材：5 本書 + 3 篇論文 + 2 集 podcast 摘要
- 核心問題：「Drucker 跟 Christensen 對 customer 的看法有什麼共通？」

LINE #w1-checkin 貼出來。

#### Day 2：設定 Inbox

確認 Obsidian vault 結構齊全，建立 `_meta/frontmatter-template.md`。

#### Day 3–5：每天倒 1–2 份素材

每份倒進 `00_inbox/`，加 frontmatter：

```yaml
---
title: How to Take Smart Notes 讀書筆記
type: book
tags: [#notebook-01, #knowledge-mgmt]
source: kindle
date_added: 2026-06-03
---

# 主體內容
[摘錄、心得、關鍵段落]
```

#### Day 6：跑 inbox-router

```bash
cd ~/Documents/brain-plus-one
claude
```

對話框：

```
/inbox-router
```

Claude 會列出 inbox 內容，顯示移動計畫。確認 yes 後執行。

#### Day 7：建 Notebook

```
/notebook-builder 01_notebook-01
```

Claude 會：
1. 列出 8 份 sources
2. 問 Notebook 主題（你回：「行銷理論交叉閱讀｜書 + 論文｜2026-06」）
3. 批次上傳到 NotebookLM
4. 給你 Notebook URL

開瀏覽器到 URL，對 Notebook 提 5 個問題（事實 / 比較 / 連結 / 反駁 / 創造）。

LINE #w1-checkin 貼出 Notebook 截圖 + 1 個你最滿意的問題＋回答。

---

### 5.2 W2：處理 podcast / 影音

W2 目標：把 podcast / 訪談變成可問答的 source，並驗 brief 結構。

#### Step 1：取得逐字稿

四種來源：

| 來源 | 怎麼拿 |
|---|---|
| Apple Podcasts (iOS 17+) | 播放畫面點 transcript |
| Spotify | 部分節目有 transcript 按鈕 |
| YouTube 影片版 | 點影片下方「顯示逐字稿」複製 |
| 自己用 Whisper | `pip install openai-whisper` 跑 |

#### Step 2：抽 highlight

把逐字稿存 `~/Downloads/cal-newport-ep42.txt`，跑：

```
/audio-highlight-extractor ~/Downloads/cal-newport-ep42.txt 主題：deep work and ADHD
```

Claude 抽 8 段 highlight，存到 `00_inbox/cal-newport-ep42-highlights.md`。

#### Step 3：分流到 W2 notebook 資料夾

確認 frontmatter 有 `#notebook-02`，跑：

```
/inbox-router
```

#### Step 4：建第二個 Notebook + 寫 brief

```
/notebook-builder 02_notebook-02
```

Notebook 建好後，回 NotebookLM 介面手寫 brief，照 5 元素：

1. 主題定義
2. sources 角色
3. 核心問題
4. 觀點分布
5. 使用情境

#### Step 5：跑 brief-verifier

```
/notebooklm-brief-verifier 02_notebook-02
```

Claude 產出 audit 報告。照報告修 brief，重新提問驗證品質。

---

### 5.3 W3：抽象化工作經驗

W3 目標：把私人工作素材（信件、會議、LINE）變成可問答副腦，同時保護隱私。

#### 隱私三層防護

1. **Layer A：vault 加密**（Obsidian Sync 或本地 disk encryption）
2. **Layer B：抽象化**（人名 → 角色、公司 → 行業、金額 → 量級）
3. **Layer C：分區**（敏感的另開 vault，不放副腦）

#### 用 Claude 自動抽象化

打開 Claude（網頁版或 CLI），貼以下 prompt：

```
請把這段工作筆記抽象化：
- 人名 → 角色（C-level / 主管 / 工程師）
- 公司 → 行業 + 規模（大型 SaaS / 中型零售）
- 金額 → 量級（小 < 100 萬 / 中 100-500 萬 / 大 > 500 萬）
- 保留：時間、議題、結論、學到的教訓

[你的原文]
```

Claude 給你抽象化後的版本，貼進 Obsidian inbox，加 frontmatter。

#### 個人筆記 frontmatter 進階範本

```yaml
---
title: 2025 Q3 客戶會議覆盤
type: meeting-notes
tags: [#notebook-03, #customer-success, #c-level]
date: 2025-09-15
participants_role: [C-level, 我]
client_industry: SaaS
deal_size: 大型
takeaway: "C-level 對核心功能 X 不滿意"
---
```

#### 建第三個 Notebook

跟 W1 一樣流程：`/inbox-router` → `/notebook-builder 03_notebook-03`。

對 Notebook 提「只有你能問的問題」：

- 「我這 2 年的客戶會議，最常抱怨什麼類別？」
- 「我做對的決策有什麼共同特徵？」
- 「客戶 C-level 跟工程師關注點差別？」

---

### 5.4 W4：跨庫整合 + 個人 GPT

W4 目標：把 3 個獨立 Notebook 接成一個會合作的副腦系統。

#### Step 1：跨庫查詢

```
/cross-notebook-query 問題：客戶最在意什麼？ notebooks：01,02,03
```

Claude 對 3 個 Notebook 並行查、整合報告（共同點 / 差異點 / 衝突點）。

#### Step 2：選平臺

| 平臺 | 強項 | 弱項 | 收費 |
|---|---|---|---|
| ChatGPT GPTs | 生態最大、可分享 | Knowledge 20 檔上限 | ChatGPT Plus 必需 |
| Claude Project | 整合品質最高 | 不能公開分享 | Claude Pro / Max |
| Custom Gemini Gem | 免費 | 客製化較少 | 免費 |

建議：**ChatGPT GPTs**（普及）或 **Claude Project**（私密）。

#### Step 3：跑 personal-gpt-init

```
/personal-gpt-init
```

Claude 引導你：
1. GPT 名字（例：「客戶洞察助手」）
2. 個人定位（「B2B SaaS CSM」）
3. 目標平臺（「ChatGPT GPTs」）
4. Notebook 清單

產出：
- `personal-gpt-prompt.md`
- `notebook-routing.md`
- 平臺操作步驟

#### Step 4：建立 GPT

以 ChatGPT GPTs 為例：

1. 開 https://chatgpt.com/gpts/editor
2. 點 `Create a new GPT`
3. 名稱：照 personal-gpt-prompt.md 給的
4. Instructions：貼整份 system prompt
5. Knowledge：上傳 6 份檔案（3 個 Notebook 的 source-list + brief）
6. Capabilities：勾選 Browser、Code Interpreter
7. Save → 拿到 GPT URL

#### Step 5：測試你的副腦

對 GPT 問 5 個跨類型問題：

1. 純理論題（驗 Notebook 01）
2. 純案例題（驗 Notebook 02）
3. 純個人經驗題（驗 Notebook 03）
4. 跨類型整合題（驗 routing）
5. 深度題（驗引用是否正確）

如果答得不好，回去調 system prompt（Vista 在 W4 直播會教細節）。

---

## 6. 檔案結構說明

### Obsidian Vault 結構

```
brain-plus-one/                    ← 你的 Obsidian vault 根目錄
├── 00_inbox/                      ← 待分流素材
│   ├── smart-notes-summary.md
│   └── ...
├── 01_notebook-01/                ← W1 主題
│   ├── source-list.md             ← notebook-builder 自動產
│   ├── brief.md                   ← 你手寫的 brief
│   └── [素材檔]
├── 02_notebook-02/                ← W2 主題
├── 03_notebook-03/                ← W3 主題
├── 99_archive/                    ← 已棄用 / 過期素材
└── _meta/
    ├── frontmatter-template.md
    ├── hashtag-system.md
    ├── routing-log.md             ← inbox-router 自動寫
    └── audits/                    ← brief-verifier audit 報告
        └── ...
```

### Skills 安裝結構

```
~/.claude/skills/
├── inbox-router/
│   ├── SKILL.md                   ← Claude Code 偵測用
│   ├── README.md
│   ├── scripts/
│   │   └── route.py               ← 純 Python 批次版
│   └── examples/
├── notebook-builder/
├── notebooklm-brief-verifier/
├── audio-highlight-extractor/
├── cross-notebook-query/
└── personal-gpt-init/
```

### Skill 互動方式

每個 skill 在 Claude Code 用「斜線指令」觸發：

```
/inbox-router
/notebook-builder <資料夾>
/notebooklm-brief-verifier <資料夾>
/audio-highlight-extractor <檔案> 主題：<keyword>
/cross-notebook-query 問題：<問題> notebooks：<列表>
/personal-gpt-init
```

Claude 會讀對應 SKILL.md 的指令，引導你完成步驟。

---

## 7. 常見問題

### 7.1 安裝相關

**Q：`./install.sh` 跑出 Permission denied**

```bash
chmod +x install.sh
./install.sh
```

**Q：Windows 跑 `install.bat` 顯示「無法載入」**

PowerShell 的執行原則可能阻擋。用系統管理員模式打開 PowerShell：

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

選 `Y` 確認，然後重跑 install.bat。

**Q：`claude` 指令找不到**

確認 Node.js 全域 bin 路徑在 `$PATH`：

```bash
npm config get prefix
# 把輸出的 bin 路徑加到 ~/.zshrc 或 ~/.bashrc：
# export PATH="$PATH:/usr/local/bin"
```

---

### 7.2 NotebookLM 相關

**Q：NotebookLM 我打不開**

地區或帳號限制。試：
- 換另一個 Google 帳號（公開 gmail.com 通常 OK）
- VPN 切美國
- 用瀏覽器 incognito 模式排除 cookie 問題

**Q：上傳 PDF 一直顯示 processing**

10 分鐘以上沒反應就：
- 重新整理頁面
- 換瀏覽器（Chrome / Edge / Safari 都試）
- 改用 .docx 或 .txt 格式

**Q：我的 Notebook 答得不準**

90% 是 brief 問題。跑 `/notebooklm-brief-verifier`。

---

### 7.3 Skill 使用相關

**Q：跑 `/inbox-router` 顯示「沒有檔案要分流」但 inbox 明明有檔**

通常是 frontmatter 格式錯：
- `---` 沒包夾
- `tags:` 不是 list 格式（應為 `[#tag1, #tag2]`）
- 缺 `tags:` 欄位

打開該檔對照 `_meta/frontmatter-template.md` 修。

**Q：notebook-builder 跑很慢**

如果你裝了 notebooklm-mcp 上傳是並行的，30 秒內完成 8 份 source。如果沒裝 mcp，skill 是「半自動模式」，產出步驟清單你手動操作。

**Q：cross-notebook-query 整合報告太長**

直接告訴 Claude：「這份 audit 最該優先看的 3 件事是什麼？」Claude 會把長報告濃縮成行動建議。

---

### 7.4 隱私相關

**Q：我能不能把工作筆記入庫，公司有 NDA**

依公司 NDA 程度：
- **嚴格**：用最高抽象化（行業層級都打通用），重點放「我學到的教訓」
- **中等**：人名 / 金額抽象化，保留決策邏輯
- **寬鬆**：抽象化敏感資訊即可

不確定就用嚴格層級。Notebook 仍能答「我做對的決策有什麼共同特徵？」這類問題。

**Q：個人 GPT 上傳 Knowledge 的內容會被 OpenAI / Anthropic 訓練嗎？**

- ChatGPT Plus / Team：預設不訓練（可在設定確認）
- Claude Project：預設不訓練
- Gemini Free：可能訓練（謹慎）

如果你的 Notebook 內容涉及機密，**只用付費版 + 確認 opt-out 訓練**。

---

### 7.5 進階 / 其他

**Q：副腦會跟 Tiago Forte 的「Building a Second Brain」衝突嗎？**

副腦計畫的「副腦」（Brain+1）跟 BASB 是不同概念：

| BASB（Tiago Forte） | 副腦計畫（Vista） |
|---|---|
| 個人筆記系統論 | 工程化的可問答副腦 |
| PARA 分類法 | hashtag + Notebook 邊界 |
| 任何工具都行 | 鎖定 NotebookLM + Obsidian + Claude |
| 中度 manual | 大量 AI 自動化 |

兩者可互補（用 BASB 思考分類，用副腦計畫的 skill 落實到 NotebookLM）。

**Q：35 天結束後我還能繼續用嗎？**

可以而且建議。副腦會跟著你 5 年、10 年，越用越聰明。LINE 群組永久存在，每月會有更新。

**Q：第二屆什麼時候會有？**

待定。首梯結束後 Vista 會根據學員回饋決定。

---

## 8. 附錄

### 附錄 A：frontmatter 速查表

| 用途 | 必填 | 範例 |
|---|---|---|
| 主題分流 | `tags:` | `[#notebook-01]` |
| 類型 | `type:` | `book / paper / podcast / article / meeting-notes` |
| 排序 | `date_added:` | `2026-06-03` |
| 參考 | `source:` | `kindle / spotify / readwise` |
| 引用 | `author:`、`url:` | optional |
| 隱私（W3 用）| `client_industry:`、`participants_role:` | `SaaS / [C-level, 我]` |

### 附錄 B：install.sh 速覽

```bash
#!/bin/bash
SKILLS=(inbox-router notebook-builder notebooklm-brief-verifier \
        audio-highlight-extractor cross-notebook-query personal-gpt-init)

mkdir -p ~/.claude/skills

for skill in "${SKILLS[@]}"; do
  if [ -d "$skill" ]; then
    cp -r "$skill" ~/.claude/skills/
    echo "✅ Installed: $skill"
  else
    echo "❌ Missing: $skill"
  fi
done

echo ""
echo "🎉 Done. 6 skills should be at ~/.claude/skills/"
ls ~/.claude/skills/
```

### 附錄 C：NotebookLM 跟其他 AI 工具差別

| 項目 | NotebookLM | ChatGPT | Notion AI |
|---|---|---|---|
| 來源綁定 | ✅ 只用你給的 source | ❌ 通用知識 | 🟡 部分 |
| 答案有引用 | ✅ 點擊跳回原段落 | ❌ 沒有 | ❌ 沒有 |
| 跨來源 query | ✅ 自動連結 | ❌ 單對話 | 🟡 同 page 內 |
| 不亂掰 | ✅ source-grounded | ❌ 會幻覺 | 🟡 偶爾 |
| 聲音檔處理 | ✅ 部分（需轉文字） | ❌ 沒原生 | ❌ 沒 |

副腦計畫選 NotebookLM 的核心理由：source-grounded + 答案附引用 + 跨 source 連結。

### 附錄 D：6 個 Skill 對應週次速查

| 週次 | 直播日期 | 主要 skill | 輔助 skill |
|---|---|---|---|
| W1 | 6/1 | inbox-router、notebook-builder | — |
| W2 | 6/8 | audio-highlight-extractor、notebooklm-brief-verifier | inbox-router、notebook-builder |
| W3 | 6/15 | inbox-router、notebook-builder（情境：個人筆記） | brief-verifier |
| W4 | 6/22 | cross-notebook-query、personal-gpt-init | 全部 |
| Demo Day | 7/4 | （展示，不用 skill） | — |

### 附錄 E：學員社群與支援

- **LINE 群組**：學員報名後加入，永久存在
- **Vista 1-on-1 諮詢**：每週限 5 名（先到先諮詢，30 分鐘）
- **Discord**（已停用）：副腦計畫只用 LINE
- **緊急聯繫**：Email vista@solo.tw（48 小時內回覆）

---

## 結語

你已經有完整的副腦工程系統：6 個 skill、雙軌入庫流程、跨庫整合、個人 GPT。

副腦會跟著你 5 年、10 年，越用越聰明。35 天只是開始。

—— Vista Cheng｜brain.solo.tw
