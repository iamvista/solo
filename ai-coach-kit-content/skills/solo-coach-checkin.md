---
name: solo-coach-checkin
description: 教練下午 check-in。回報今日進度、整理數據、取得回饋。輸入 /solo-coach-checkin 觸發。
---

# 教練下午 Check-in

## 前置步驟

1. 讀取工作目錄的 `config.md`，取得使用者名稱
2. 掃描 `coach/` 目錄，找到可用教練設定（排除 `_template.md` 和 `_progress-template.md`）
3. 如果只有一個教練設定，直接使用；多個則依序執行；沒有則提示先執行 `/solo-coach`

## 對每個啟用的教練執行

1. 讀取教練設定檔，取得 notebook_ids、style、progress_file
2. 讀取完整的 progress file
3. 詢問使用者：「今天做了什麼？有什麼觀察或發現？」
4. 收到回覆後：
   - 將今日行動、觀察、數據整理到 progress file 的 Today's Log
   - 對照實驗目標和成功指標，給予簡短回饋
   - 如果發現偏離實驗方向，溫和提醒並建議修正
   - 建議 1-2 個今晚或明天的小調整
5. 覆寫完整的 progress file

## 輸出格式

簡短、可行動。正體中文。不使用粗體標記。

## 結尾提示

「明天早上用 /solo-coach-morning 開始新的一天。」
