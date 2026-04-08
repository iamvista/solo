# 用 Claude Desktop App 設定教練（不需要終端機）

這篇教你什麼：用 Claude 桌面版 App 設定 AI 教練，全程不需要打開終端機或輸入指令。

---

## 前置準備

1. 下載 Claude Desktop App
   - 到 https://claude.ai/download 下載桌面版
   - macOS 和 Windows 都有
   - 安裝後用你的 Claude 帳號登入
   - 需要 Claude Pro（$20 USD/月）或 Max 方案

2. 解壓縮 ai-coach-kit.zip
   - macOS：雙擊 ZIP 檔案就會自動解壓
   - Windows：右鍵 → 解壓縮全部
   - 解壓後你會看到一個資料夾，裡面有 skills/、coach/、guide/ 等

## 設定步驟

### Step 1：建立 Project

1. 打開 Claude Desktop App
2. 點左側欄的「Projects」（專案）
3. 點「Create Project」（建立專案）
4. 取名為「AI 教練」

### Step 2：加入教練設定檔

在 Project 設定頁面，找到「Project Knowledge」（專案知識）區塊：

1. 點「Add Content」
2. 把以下檔案拖進去（或點擊上傳）：
   - coach/vista-coach.md（Vista Coach 教練設定）
   - coach/_template.md（教練模板，之後建自己的教練用）
   - coach/_progress-template.md（進度追蹤模板）

### Step 3：加入 Coach Skills

繼續在「Project Knowledge」加入以下檔案：

1. skills/solo-coach.md
2. skills/solo-coach-morning.md
3. skills/solo-coach-checkin.md
4. skills/solo-coach-weekly.md

### Step 4：設定 Project Instructions

在 Project 設定頁面，找到「Custom Instructions」（自訂指示）：

把以下內容貼進去：

---

你是一位 AI 實踐教練。請先讀取 Project Knowledge 中的教練設定檔（vista-coach.md 或其他教練設定），然後按照設定中的 Workflow 步驟執行。

當使用者說「教練早安」或「晨間覆盤」，參考 solo-coach-morning.md 的流程。
當使用者說「check-in」或「回報進度」，參考 solo-coach-checkin.md 的流程。
當使用者說「週報」或「weekly」，參考 solo-coach-weekly.md 的流程。
當使用者說「啟動教練」，參考 solo-coach.md 的完整初始化流程。

所有輸出使用繁體中文。不使用粗體標記（不要用 **）。

---

### Step 5：開始使用

1. 在 Project 中開啟新對話
2. 輸入：「啟動教練」
3. 教練會問你 3 個問題來校準
4. 回答完畢後，你的 AI 教練就啟動了

## 每日使用

每天早上，開啟 Project 中的新對話，輸入：
「教練早安」或「晨間覆盤」

每天下午，輸入：
「check-in」或「回報進度」

每週日，輸入：
「週報」或「weekly」

## 進度追蹤

Claude Desktop 的 Project 會記住你上傳的檔案，但不會自動更新進度檔。

建議做法：
- 每次教練產出進度報告時，複製內容
- 貼到一個本地的文字檔（例如桌面上的 progress.txt）
- 下次對話時，把最新的進度貼進去讓教練讀取

這比 CLI 版本多一個手動步驟，但完全不需要技術能力。

## 常見問題

Q：跟 CLI 版本有什麼差別？
A：功能一樣，但 CLI 版本可以自動讀寫進度檔、支援排程。Desktop 版需要手動複製貼上進度。如果你之後想升級到 CLI，隨時可以。

Q：Project Knowledge 有上傳限制嗎？
A：每個 Project 可以上傳多個檔案。教練需要的 7 個檔案很小，完全沒問題。

下一步：guide/03-first-session.md（第一次啟動教練）
