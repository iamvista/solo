---
name: solo-coach-weekly
description: 教練週報總結。每週日使用，回顧整週、設計下週實驗。輸入 /solo-coach-weekly 觸發。
---

# 教練週報總結

## 前置步驟

1. 讀取工作目錄的 `config.md`，取得使用者名稱
2. 掃描 `coach/` 目錄，找到可用教練設定（排除 `_template.md` 和 `_progress-template.md`）
3. 如果只有一個教練設定，直接使用；多個則依序執行；沒有則提示先執行 `/solo-coach`

## 對每個啟用的教練執行

1. 讀取教練設定檔，取得 notebook_ids、style、progress_file
2. 讀取完整的 progress file
3. 查詢所有 Gemini Notebook 筆記本，搜尋與本週工作相關的原則
4. 產出週報總結：
   - 過去 7 天總結：完成了什麼、學到什麼、關鍵數據
   - 實驗進度分析：每個實驗的完成度、距離成功指標的差距
   - 原則遵循度：是否有偏離知識庫中的核心原則
   - 設計下週 3 個最高槓桿實驗（或延續 / 調整現有實驗）
   - 更新 Next Focus Areas
5. 將已完成的實驗移到 Completed Experiments Archive，附上結果分析
6. 覆寫完整的 progress file

## 週報歸檔

將週報摘要儲存到 `journal/` 目錄：
- 檔名格式：`{YYYY-MM-DD}-coach-weekly-{教練名稱}.md`
- 內容：週報摘要（不是完整的 progress file）

## 輸出格式

以教練設定的 style 風格輸出。正體中文。不使用粗體標記。

## 結尾

問 2-3 個尖銳問題來釐清下週方向。
