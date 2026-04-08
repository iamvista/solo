---
name: solo-coach-morning
description: 教練晨間覆盤。每天早上使用，回顧昨日、設計今日調整。輸入 /solo-coach-morning 觸發。
---

# 教練晨間覆盤

## 前置步驟

1. 讀取工作目錄的 `config.md`，取得使用者名稱
2. 掃描 `coach/` 目錄，找到可用教練設定（排除 `_template.md` 和 `_progress-template.md`）
3. 如果只有一個教練設定，直接使用；多個則依序執行；沒有則提示先執行 `/solo-coach`

## 對每個啟用的教練執行

1. 讀取教練設定檔，取得 notebook_ids、style、progress_file
2. 讀取完整的 progress file
3. 查詢所有 NotebookLM 筆記本，搜尋與當前實驗相關的原則
4. 產出晨間覆盤：
   - 回顧昨日的觀察和數據
   - 檢查本週實驗進度（完成百分比、距離成功指標的差距）
   - 設計今日 3 個最高槓桿調整
   - 每個調整引用知識庫中的具體原則
5. 覆寫完整的 progress file（更新 Today's Log 的日期和計畫）

## 輸出格式

以教練設定的 style 風格輸出。正體中文。不使用粗體標記。

## 結尾提示

「下午記得用 /solo-coach-checkin 回報今天的進度。」
