# Solopreneur Skills 工作區

## 工作目錄結構

所有內容產出都儲存在當前目錄下：

- `config.md` — 個人設定檔（必須先填寫）
- `seeds/` — 種子卡片（靈感捕捉）
- `research/` — 研究摘要（深度研究）
- `drafts/` — 文章草稿與精修版
- `published/` — 多平臺分發版本
- `clients/` — 客戶研究與提案
- `brand/` — 品牌素材（風格檔案、電梯簡報等）
- `journal/` — 晨間簡報與每日覆盤
- `coach/` — 教練設定與進度追蹤

## 重要規則

- 執行任何 Skill 前，先讀取 `config.md` 取得使用者設定
- 所有檔案輸出使用繁體中文
- 檔案命名格式：`{YYYY-MM-DD}-{簡短標題}.md`
- 每個 Skill 執行完畢後，提示下一步可用的 Skill

## 教練系統

工作目錄下的 `coach/` 資料夾包含教練設定檔和進度追蹤檔：
- `coach/vista-coach.md` — Vista Coach 預建教練設定
- `coach/_template.md` — 建立自己教練的模板
- `coach/_progress-template.md` — 進度檔模板
- `coach/*-progress.md` — 教練進度追蹤（Single Source of Truth）

教練相關 Skills：
- `/solo-coach` — 啟動教練、初始化實驗
- `/solo-coach-morning` — 晨間覆盤（建議每天早上使用）
- `/solo-coach-checkin` — 下午 check-in（回報進度）
- `/solo-coach-weekly` — 週報總結（建議每週日使用）
