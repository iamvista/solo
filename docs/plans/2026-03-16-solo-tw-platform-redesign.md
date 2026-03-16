# Solo.tw 平台重新設計：一人事業作業系統

> 日期：2026-03-16
> 狀態：設計定案
> 核心定位：**不只教你怎麼做，直接給你工具去做**

---

## 目錄

1. [核心定位與價值主張](#1-核心定位與價值主張)
2. [SOLO 品牌方法論框架](#2-solo-品牌方法論框架)
3. [會員分層與定價結構](#3-會員分層與定價結構)
4. [SaaS 工具產品設計](#4-saas-工具產品設計)
5. [Dashboard 與遊戲化系統](#5-dashboard-與遊戲化系統)
6. [社群系統設計](#6-社群系統設計)
7. [URL 結構與 SEO 策略](#7-url-結構與-seo-策略)
8. [技術架構變更](#8-技術架構變更)
9. [執行路線圖](#9-執行路線圖)
10. [營收預估](#10-營收預估)
11. [FlowCEO 競品深度對照](#11-flowceo-競品深度對照)

---

## 1. 核心定位與價值主張

### 重新定位

Solo.tw 從「一人公司內容平台」升級為「一人事業作業系統」。

三層商業模式：

| 層級 | 類型 | 說明 |
|------|------|------|
| **內容層** | 吸引流量 | 部落格、診斷測驗、免費資源 |
| **教育層** | 建立信任 + 變現 | 工作坊、課程、社群 |
| **工具層** | 長期黏著 + SaaS 變現 | 名單磁鐵、活動報名、問卷等「幫會員賺錢」的工具 |

### 核心價值主張

會員不只是來「學習」的，他們可以直接用 solo.tw 提供的工具來經營自己的事業。

例如：一個教瑜珈的自由工作者，用 solo.tw 的活動報名系統辦自己的工作坊、用名單磁鐵收集學員名單、用問卷系統做課後調查。

---

## 2. SOLO 品牌方法論框架

把品牌名拆成方法論首字母縮寫，對應一人事業的四個成長階段：

```
S → Set up     建立根基    「你是誰？你要服務誰？」
O → Operate    系統營運    「建立你的獲客與交付系統」
L → Leverage   槓桿放大    「用工具和自動化放大產出」
O → Outgrow    超越成長    「從一人忙碌到一人事業體」
```

### 各階段對應功能

| 階段 | 現有功能 | 新增功能 |
|------|---------|---------|
| **S** Set up | 診斷測驗（定位你是哪種 Solo） | 定位工作坊、個人品牌模板 |
| **O** Operate | 部落格、活動系統 | 名單磁鐵工具、Landing Page |
| **L** Leverage | 工作坊（AI 指揮中心等） | 活動報名系統（對外開放）、問卷系統、自動化教學 |
| **O** Outgrow | — | 進階課程、社群、1-on-1 顧問 |

### 會員看到的成長路徑

1. 先做診斷，知道自己在哪個階段（S）
2. 用工具建立基本系統（O）
3. 學進階技能 + 用更強的工具放大（L）
4. 進入社群、取得顧問支持，突破天花板（O）

每個階段都有「免費嚐鮮 → 付費解鎖」的轉換點。

---

## 3. 會員分層與定價結構

### 三層會員制

#### 🆓 Explorer 探索者（免費）

目標：降低門檻，大量獲客

| 類別 | 可用內容 |
|------|---------|
| S 診斷 | 快速診斷（7 題）、完整診斷（18 題）、基礎結果報告 |
| O 內容 | 部落格全部文章、電子報 |
| L 工具 | 工具試用（有浮水印/次數限制） |
| O 社群 | ❌ |
| 活動 | 免費活動報名 |
| Dashboard | 基礎儀表板（診斷紀錄、活動紀錄） |

轉換誘因：診斷完畢後顯示「解鎖你的完整行動計畫 → 升級 Pro」

#### ⚡ Pro 實踐者（月費制）

目標：核心營收基盤，提供「工具＋內容」雙重價值

| 類別 | 可用內容 |
|------|---------|
| S 診斷 | 進階診斷報告（含具體行動建議）、每季重測追蹤成長 |
| O 內容 | Pro 專屬文章/教學、課程錄影回放 |
| L 工具 | 名單磁鐵系統（限 3 頁、500 名單上限）、活動報名系統（限 3 場/月）、問卷系統（限 3 份/月） |
| O 社群 | 社群動態牆 + LINE 官方帳號、月度線上聚會 |
| 活動 | 付費工作坊享會員價（8 折） |
| Dashboard | 完整儀表板 + 進度追蹤 + SOLO 階段指引 |

轉換誘因：工具用量碰到上限 → 「升級 Premium 解鎖無限量」

#### 🚀 Premium 事業家（月費制）

目標：高價值用戶，深度服務

| 類別 | 可用內容 |
|------|---------|
| S 診斷 | 1-on-1 定位諮詢（每季 1 次，30 分鐘） |
| O 內容 | 全部課程無限看、優先參加新工作坊 |
| L 工具 | 名單磁鐵系統（無限頁面、無限名單）、活動報名系統（無限場次）、問卷系統（無限）、Landing Page 產生器、自訂品牌（移除 solo.tw 浮水印）、付費票種（透過統一金流收款） |
| O 社群 | 社群動態牆（完整功能）+ LINE 官方帳號 Premium 群、每月 Mastermind 小組、優先提問權 |
| 活動 | 付費工作坊享 VIP 價（7 折）、優先報名 |
| Dashboard | 全功能 + 營收數據追蹤（名單成長、活動報名數據） |

### 定價策略

```
                    月繳           年繳（85 折）       心理錨點
──────────────────────────────────────────────────────────────
Explorer 探索者     免費            免費               「先來玩玩看」
Pro 實踐者         NT$399/月      NT$4,068/年        「一天 NT$13，一杯超商咖啡」
                                   (NT$339/月)
Premium 事業家     NT$999/月      NT$10,188/年       「兩場工作坊，但工具吃到飽」
                                   (NT$849/月)
```

### 創始會員 Launch 策略

```
Phase 1 — 創始會員（限 100 人）
  Pro:     NT$199/月（鎖定終身價）
  Premium: NT$599/月（鎖定終身價）
  → 目的：快速累積第一批用戶 + 口碑

Phase 2 — 早鳥價
  Pro:     NT$299/月
  Premium: NT$799/月

Phase 3 — 正式定價
  Pro:     NT$399/月
  Premium: NT$999/月
```

---

## 4. SaaS 工具產品設計

### 工具一：活動報名系統（Event Builder）

會員使用情境：自由講師想辦線上工作坊，需要活動頁 + 報名表 + 確認信 + 出席管理

#### 現有 vs 新增

| 已有（自用） | 新增（多租戶化） |
|-------------|----------------|
| 活動 CRUD | 會員可建立自己的活動 |
| 報名 + 候補 | 報名資料歸屬該會員 |
| 確認信自動寄送 | 信件內容可由會員自訂 |
| 票種管理 | 金流串接（會員收款） |
| 出席打卡 | 會員後台管理報名者 |
| 活動更新通知 | 會員自訂品牌 |

#### 分層權益

| 功能 | Explorer | Pro | Premium |
|------|:---:|:---:|:---:|
| 活動數量 | 可報名他人活動 | 3 場/月 | 無限 |
| 每場報名上限 | — | 50 人 | 無限 |
| 票種數量 | — | 2 種 | 無限 |
| 付費票（金流串接） | — | ❌ | ✅（統一金流） |
| 自訂表單欄位 | — | ❌ | ✅ |
| 品牌浮水印 | — | 「Powered by Solo.tw」 | 移除 |
| 嵌入碼 iframe | — | ❌ | ✅ |
| 自動提醒信 | — | 基礎（確認信） | 完整（提醒 + 感謝） |
| 數據分析 | — | 基礎 | 進階（來源追蹤） |

### 工具二：名單磁鐵系統（Lead Magnet Builder）

會員使用情境：健身教練想收集潛在學員名單，需要 Landing Page + 表單 + 自動寄送 PDF

#### 功能設計

1. **選擇模板**（3-5 種版型）：電子書下載型、免費諮詢預約型、迷你課程型、折扣碼型、測驗型
2. **編輯內容**：標題、副標、說明文字、CTA 按鈕文字、上傳封面圖/贈品檔案（PDF）、品牌色彩設定
3. **設定表單欄位**：姓名（必填）、Email（必填）、自訂欄位（Premium）
4. **自動回覆設定**：感謝頁文字、自動寄送確認信 + 附件
5. **發布 → 取得專屬連結**

#### 分層權益

| 功能 | Explorer | Pro | Premium |
|------|:---:|:---:|:---:|
| 磁鐵頁面數 | — | 3 頁 | 無限 |
| 名單上限 | — | 500 人 | 無限 |
| 模板選擇 | — | 3 種 | 全部 |
| 自訂欄位 | — | ❌ | ✅ |
| 品牌浮水印 | — | 「Powered by Solo.tw」 | 移除/自訂 |
| 自訂網域 CNAME | — | ❌ | ✅ |
| 匯出名單 CSV | — | ✅ | ✅ |
| 自動化串接 Webhook | — | ❌ | ✅ |
| 數據分析 | — | 基礎（瀏覽/轉換數） | 進階（來源追蹤、漏斗） |

### 工具三：問卷系統（Survey Builder）

會員使用情境：課後問卷、客戶需求調查、活動滿意度調查

#### 題型支援

- 單選題
- 多選題
- 評分題（1-5 星）
- 簡答題
- NPS（淨推薦值）

#### 分層權益

| 功能 | Explorer | Pro | Premium |
|------|:---:|:---:|:---:|
| 問卷數量 | — | 3 份/月 | 無限 |
| 每份題目數 | — | 10 題 | 無限 |
| 回收上限 | — | 100 份 | 無限 |
| 結果分析圖表 | — | 基礎 | 進階 |
| 匯出 CSV | — | ✅ | ✅ |
| 自訂品牌 | — | ❌ | ✅ |
| 嵌入碼 | — | ❌ | ✅ |

#### 串接機制

- 活動結束自動發送滿意度問卷
- 問卷填完後導向名單磁鐵（漏斗串接）

### 工具四：診斷測驗產生器（Quiz Builder）— Phase 4

開放會員建立自己的診斷/分類測驗，承繼 solo.tw 現有的診斷引擎。

| 功能 | Pro | Premium |
|------|:---:|:---:|
| 測驗數量 | 1 個 | 無限 |
| 題目數量 | 10 題以內 | 無限 |
| 結果類型 | 4 種 | 無限 |
| 結果頁收集 Email | ✅ | ✅ |
| 自訂品牌 | ❌ | ✅ |
| 嵌入碼 | ❌ | ✅ |

---

## 5. Dashboard 與遊戲化系統

### Dashboard 架構

```
┌──────────────────────────────────────────────────────────────────┐
│  Header: Hi Vista 👋  |  Lv.3 實踐者  |  ████░░ 65/100 EXP     │
│          SOLO 階段：Leverage                                      │
├────────────────────────────┬─────────────────────────────────────┤
│                            │                                     │
│   📊 我的事業數據            │   🎯 本週任務                        │
│                            │                                     │
│   名單總數     128 人       │   [✓] 發布一篇部落格文章    +15 EXP  │
│   本月新增      +23 ↑      │   [✓] 完成 AI 指揮中心 U3  +30 EXP  │
│   活動報名       47 人      │   [ ] 建立第一個名單磁鐵    +50 EXP  │
│   本月活動        2 場      │   [ ] 邀請 1 位朋友加入     +20 EXP  │
│                            │                                     │
├────────────────────────────┼─────────────────────────────────────┤
│                            │                                     │
│   🏆 SOLO 成長地圖           │   📦 我的工具箱                     │
│                            │                                     │
│   S ████████████ 100%      │   名單磁鐵  2/3 頁（Pro）            │
│   O ██████░░░░░░  50%      │   活動系統  1/3 場本月               │
│   L ███░░░░░░░░░  25%      │   問卷系統  🔒 升級 Premium          │
│   O ░░░░░░░░░░░░   0%      │                                     │
│                            │   [+ 建立新工具]                     │
├────────────────────────────┴─────────────────────────────────────┤
│                                                                  │
│   📚 繼續學習                                                     │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│   │ AI 指揮中心   │ │ Vibe Coding  │ │ 🔒 內容變現   │            │
│   │ Unit 3/8     │ │ 即將開課      │ │ Premium      │            │
│   │ [繼續 →]     │ │ [預約]       │ │ [解鎖]       │            │
│   └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│   🔔 最新動態                                                     │
│   • 你的名單磁鐵「免費 AI 指南」昨天新增 5 位訂閱者                   │
│   • 新文章上線：〈一人公司如何用 AI 自動化客服〉                      │
│   • 下週二 20:00 月度聚會，主題：Q2 覆盤                            │
└──────────────────────────────────────────────────────────────────┘
```

### 等級系統

| 等級 | 名稱 | SOLO 階段 | 升級條件 |
|------|------|-----------|---------|
| Lv.1 | 探索者 | S - Set up | 完成註冊 + 診斷 |
| Lv.2 | 定位者 | S - Set up | 完成進階診斷 + 個人資料 |
| Lv.3 | 實踐者 | O - Operate | 建立第一個工具（磁鐵或活動） |
| Lv.4 | 建造者 | O - Operate | 收集到第一批名單（50 人） |
| Lv.5 | 槓桿者 | L - Leverage | 辦過第一場活動 + 名單 > 200 |
| Lv.6 | 系統者 | L - Leverage | 工具使用穩定 + 完成 3 門課 |
| Lv.7 | 事業家 | O - Outgrow | 營收數據持續成長 |
| Lv.8 | 自由人 | O - Outgrow | 🏆 畢業（真正的一人事業體） |

等級綁定真實的事業里程碑，而非純 EXP 灌水。

### 任務系統

#### 新手引導任務（一次性）

| 任務 | EXP |
|------|-----|
| 完成你的 Solo 診斷 | +10 |
| 填寫個人檔案（頭像 + 簡介 + 專長） | +10 |
| 閱讀第一篇推薦文章 | +5 |
| 建立你的 @username 公開主頁 | +20 |
| 建立第一個名單磁鐵（或活動） | +50 |
| 分享你的診斷結果到社群媒體 | +10 |

#### 週期任務（每週重置）

| 任務 | EXP |
|------|-----|
| 本週發布/更新一個工具頁面 | +15 |
| 本週閱讀一篇 Pro 文章 | +10 |
| 本週名單新增 ≥ 5 人 | +20 |
| 參加本週社群活動 | +10 |

#### 里程碑成就（永久）

| 成就 | 條件 |
|------|------|
| 🏅 第一滴血 | 名單收到第 1 位訂閱者 |
| 🏅 起步百人 | 名單突破 100 人 |
| 🏅 活動達人 | 成功舉辦 5 場活動 |
| 🏅 內容機器 | 連續 4 週完成週期任務 |
| 🏅 千人名單 | 名單突破 1,000 人 |
| 🏅 事業起飛 | 透過 solo.tw 工具產生第一筆收入 |

### SOLO 成長地圖

```
    S                O                L                O
Set up ──────► Operate ──────► Leverage ──────► Outgrow
   │               │               │               │
   診斷             建立             放大             突破
   定位             系統             槓桿             成長
   品牌             工具             自動化            社群
   │               │               │               │
Lv.1-2          Lv.3-4          Lv.5-6          Lv.7-8
免費可完成       需要 Pro        需要 Pro/Premium  需要 Premium
```

每個階段自動推薦對應的課程、工具和行動。

---

## 6. 社群系統設計

### 策略決策：為什麼不用 Skool / Discord？

| 平台 | 問題 |
|------|------|
| **Skool**（目前使用中，$9/月） | 用戶多為英文市場「make money online」族群，跟 solo.tw 目標客群不匹配，活躍率低 |
| **Discord** | 台灣用戶普遍不使用，學習成本高，年齡層偏年輕 |
| **LINE 群組** | 台灣人都用，但訊息混亂、無法結構化、搜尋困難、內容沈沒快 |
| **Facebook 社團** | 觸及率被演算法控制、無法跟 solo.tw 會員系統串接 |

**結論：退租 Skool → 在 solo.tw 自建輕量社群動態牆 + LINE 官方帳號推播通知**

### 設計原則

1. **不建傳統論壇**（發文門檻高、需要臨界質量、冷啟動困難）
2. **建「動態牆」**（類 Twitter/LinkedIn feed，門檻低，系統自動產生內容）
3. **即時通知用 LINE 官方帳號**（台灣人最熟悉的管道）
4. **社群功能跟工具/遊戲化深度綁定**（不是獨立的社群，是平台的一部分）

### 社群動態牆（Community Feed）

路由：`solo.tw/community`

```
┌──────────────────────────────────────────────────┐
│  📢 社群動態                     [發布動態] [篩選] │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ 🏅 @yogalisa 達成成就「起步百人」              │ │
│  │    Lisa 的名單突破 100 人了！                   │ │
│  │    ❤️ 12   💬 3   — 2 小時前                   │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ 📝 @designkev                                 │ │
│  │    分享我用 solo.tw 名單磁鐵的成果：            │ │
│  │    上線 3 天收到 47 個名單，轉換率 12%！        │ │
│  │    ❤️ 28   💬 7   📌 精選   — 5 小時前         │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ ❓ @freelance_jen                              │ │
│  │    [問答] 名單磁鐵的 CTA 文案怎麼寫比較好？    │ │
│  │    ❤️ 8   💬 11   — 1 天前                     │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### 動態類型

#### 使用者主動發布

- **一般動態**：分享心得、進展、想法（短文，類推文）
- **問答**：標記為問題，回覆可被標為「最佳解答」
- **成果分享**：附帶截圖/數據的工具使用心得

#### 系統自動產生（解決冷啟動）

這是核心設計——即使只有 20 個會員，動態牆也不會冷清：

| 觸發事件 | 自動動態 |
|---------|---------|
| 達成成就 | 「🏅 @yogalisa 達成成就『起步百人』」 |
| 名單里程碑 | 「📈 @designkev 的名單突破 500 人了」 |
| 發布新活動 | 「📅 @coach_ming 剛發布新活動：溝通力工作坊」 |
| 完成課程單元 | 「📚 @freelance_jen 完成了 AI 指揮中心 Unit 5」 |
| 新會員加入 | 「🆕 歡迎 @newbie_solo 加入！她是平面設計師」 |
| 官方內容 | 「📢 新文章上線：〈一人公司如何用 AI 自動化客服〉」 |

### 問答區（Q&A）

動態牆裡的特殊類型，有獨立的 SEO 價值：

- 路由：`solo.tw/community/q/[id]/[slug]`
- 回覆可被標記為「最佳解答」
- 每個問答有獨立頁面，可被 Google 索引
- SEO 標題範例：「名單磁鐵轉換率怎麼提升？ — Solo.tw 社群」
- 高品質問答可被精選為「知識庫」文章

### 社群 × 遊戲化串接

| 行為 | 獎勵 |
|------|------|
| 發布動態 | +5 EXP |
| 回覆他人問題 | +3 EXP |
| 回覆被標記為最佳解答 | +15 EXP |
| 動態被按讚 10 次 | +5 EXP |
| 動態被精選 | +20 EXP |

新成就：
- 🏅 社群新星 — 發布 10 則動態
- 🏅 解題達人 — 5 則回覆被標記為最佳解答
- 🏅 意見領袖 — 動態累計被按讚 100 次

### 社群分層權益

| 功能 | Explorer | Pro | Premium |
|------|:---:|:---:|:---:|
| 瀏覽動態 | ✅ | ✅ | ✅ |
| 按讚 | ✅ | ✅ | ✅ |
| 發布動態 | ❌ | ✅ | ✅ |
| 發布問答 | ❌ | ✅ | ✅ |
| 精選動態標記 | ❌ | ❌ | ✅ |
| LINE 官方帳號推播 | 基礎（週報） | 完整（即時通知） | 完整 + Premium 專屬群 |

### LINE 官方帳號整合（取代 Discord）

台灣用戶最熟悉的通知管道，用於「推播」而非「討論」：

```
LINE 官方帳號功能：
├── 📬 週報推播（所有追蹤者）
│   └── 本週精選文章、近期活動、社群熱門問答
├── 🔔 即時通知（Pro/Premium）
│   ├── 你的名單有新訂閱者
│   ├── 你的活動有新報名
│   ├── 有人回覆你的問答
│   └── 新課程/工作坊上線
├── 💎 Premium 專屬群
│   └── LINE 群組，僅限 Premium 會員
│   └── Vista 親自回覆、Mastermind 討論
└── 🤖 自動回覆
    └── 輸入「我的等級」→ 回傳你的 SOLO 進度
    └── 輸入「近期活動」→ 回傳活動列表
```

技術串接：
- LINE Messaging API
- solo.tw 會員綁定 LINE UID
- Webhook 接收 LINE 訊息 → 觸發 solo.tw API
- 用戶在 solo.tw 設定頁綁定 LINE 帳號

### 社群技術架構

```sql
-- 社群動態
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'general', -- general, question, achievement, system
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 動態回覆
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  is_best_answer BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 按讚
CREATE TABLE community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  target_type TEXT NOT NULL, -- 'post' or 'comment'
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

-- LINE 綁定
ALTER TABLE profiles ADD COLUMN line_uid TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN line_notify_enabled BOOLEAN DEFAULT false;
```

---

## 7. URL 結構與 SEO 策略

> 注意：社群頁面的 URL 也加入此結構

### URL 規劃

```
solo.tw/                            ← 主站
solo.tw/blog/                       ← 部落格
solo.tw/events/                     ← 官方活動
solo.tw/courses/                    ← 課程
solo.tw/pricing/                    ← 定價頁
solo.tw/explore/                    ← 探索會員/活動
solo.tw/growth/                     ← SOLO 方法論頁面
solo.tw/community/                  ← 社群動態牆
solo.tw/community/q/[id]/[slug]     ← 問答獨立頁（SEO）
solo.tw/roadmap/                    ← 公開開發藍圖

solo.tw/@[username]                 ← 會員公開主頁
solo.tw/@[username]/events          ← 會員的活動列表
solo.tw/@[username]/events/[slug]   ← 會員的單一活動頁
solo.tw/@[username]/m/[slug]        ← 會員的名單磁鐵頁
solo.tw/@[username]/survey/[slug]   ← 會員的問卷頁
solo.tw/@[username]/quiz/[slug]     ← 會員的測驗頁（Phase 4）
```

### 為什麼選 `/@username`

1. **品牌記憶點**：「我在 solo.tw 的 @yogalisa」——跟社群平台一樣的語言
2. **SEO 安全**：Next.js middleware rewrite 對爬蟲完全透明
3. **零路由衝突**：`@` 開頭天然跟 `/blog`、`/events` 隔離
4. **OG 預覽**：metadata 設定 canonical URL，社群分享正常

### SEO 自動化

每個會員頁面自動產生：

```tsx
// /@yogalisa 的 metadata
{
  title: "Lisa Chen — 瑜珈老師 | Solo.tw",
  description: "用呼吸找到你的節奏。Lisa 的近期活動與免費資源。",
  openGraph: { images: [自動生成的 OG Image] },
  alternates: { canonical: "https://solo.tw/@yogalisa" },
}
```

- **結構化資料 JSON-LD**：Person、Event、Article schema
- **自動 sitemap**：含所有會員公開頁面
- **OG Image 自動生成**：使用 Vercel OG

### SEO 飛輪效應

- 每個 `/@username` 頁面 = 一個 SEO 著陸頁
- 每場會員活動 = 一個可被搜尋的活動頁
- 每個名單磁鐵 = 一個長尾關鍵字頁面
- 會員越多 → 頁面越多 → 流量越大 → 吸引更多會員

---

## 8. 技術架構變更

### 資料庫變更

#### 現有表修改

```sql
-- profiles 表新增欄位
ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN brand_color TEXT DEFAULT '#0D9488';
ALTER TABLE profiles ADD COLUMN logo_url TEXT;
ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN exp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN solo_stage TEXT DEFAULT 'setup';

-- events 表新增欄位
ALTER TABLE events ADD COLUMN owner_id UUID REFERENCES auth.users(id);
ALTER TABLE events ADD COLUMN is_platform_event BOOLEAN DEFAULT true;
```

#### 新增表

```sql
-- 名單磁鐵
CREATE TABLE lead_magnets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  slug TEXT NOT NULL,
  template TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT DEFAULT '免費下載',
  cover_image TEXT,
  attachment_url TEXT,
  brand_color TEXT,
  custom_fields JSONB DEFAULT '[]',
  thank_you_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(owner_id, slug)
);

-- 收集到的名單
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_magnet_id UUID REFERENCES lead_magnets(id),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  custom_data JSONB DEFAULT '{}',
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 問卷
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  brand_color TEXT,
  redirect_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(owner_id, slug)
);

CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- single_choice, multi_choice, rating, text, nps
  options JSONB, -- 選項（單選/多選用）
  is_required BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES surveys(id),
  respondent_name TEXT,
  respondent_email TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE survey_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id),
  answer_value TEXT,
  answer_data JSONB
);

-- 用量追蹤
CREATE TABLE usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  resource_type TEXT NOT NULL, -- 'events', 'lead_magnets', 'surveys', 'leads'
  period TEXT NOT NULL, -- 'monthly', 'total'
  current_usage INTEGER DEFAULT 0,
  max_usage INTEGER NOT NULL,
  period_start TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, resource_type, period)
);

-- 任務與成就
CREATE TABLE user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_type TEXT NOT NULL, -- 'onboarding', 'weekly', 'milestone'
  task_key TEXT NOT NULL,
  title TEXT NOT NULL,
  exp_reward INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- 週期任務的到期時間
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  achievement_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);
```

### 金流串接：統一金流（PayUni）

用途：
1. solo.tw 自身的訂閱收費（Pro/Premium 月繳/年繳）
2. Premium 會員的付費票種（活動報名收費）

技術整合：
- 統一金流提供信用卡、ATM 轉帳、超商代碼等多元支付
- 訂閱制使用信用卡定期扣款
- 會員付費票種：報名者付費 → solo.tw 代收 → 扣除平台費（5-8%）→ 撥款給會員
- 需要申請統一金流商店代號 + API 串接

### 會員公開主頁技術實作

```
URL:        solo.tw/@yogalisa
Next.js:    /app/[username]/page.tsx
Middleware:  檢測 path 以 @ 開頭 → rewrite 到 /[username]
```

---

## 9. 執行路線圖

### Phase 0：基礎建設（Week 1-3）

目標：讓會員系統真正有用

```
Week 1-2
  [1] Username 系統
      • profiles 加入 username (unique) 欄位
      • 註冊/設定頁加入 username 選擇
      • 保留字清單（admin, blog, events, api 等）

  [2] /@username 公開主頁
      • 基本個人資料展示（頭像、名稱、簡介、連結）
      • SEO metadata + OG Image 自動生成
      • JSON-LD 結構化資料
      • 顯示該會員的公開活動 + 名單磁鐵（Phase 1 後填入）

  [3] Dashboard 改版
      • 從「只有診斷紀錄」改為完整儀表板
      • SOLO 成長地圖（四階段進度條）
      • 新手引導任務列表
      • 最新動態 feed

Week 2-3
  [4] 會員等級系統
      • EXP 計算邏輯 + 等級表
      • 任務完成 → 發 EXP 的 event system
      • Header 顯示等級 + 進度條

  [5] SOLO 方法論頁面
      • /growth 公開頁面
      • 四階段視覺化呈現
      • 每階段連結到對應的工具/課程/內容

完成標準：
  ✅ 會員註冊後有清晰的「下一步該做什麼」
  ✅ /@username 頁面可被 Google 索引
  ✅ Dashboard 有成長地圖 + 任務系統
```

### Phase 1：活動報名系統開放（Week 4-7）

目標：把已有的活動系統多租戶化，最快上線

```
Week 4-5
  [6] 活動系統多租戶化
      • events 表加入 owner_id, is_platform_event
      • 會員後台：建立/編輯/管理自己的活動
      • 活動頁面 URL：/@username/events/[slug]
      • 活動頁 SEO + JSON-LD Event schema

  [7] 會員活動管理面板
      • 報名者清單（姓名、Email、狀態）
      • 匯出 CSV
      • 發送活動更新通知
      • 基礎數據（瀏覽量、報名轉換率）

Week 6-7
  [8] Pro 限制機制
      • usage_limits 表（追蹤月用量）
      • 免費不能建活動，Pro 限 3 場/月，Premium 無限
      • 碰到上限時顯示升級提示

  [9] 確認信自訂
      • 會員可編輯確認信模板
      • 自動帶入活動資訊、報名者姓名
      • Premium：自訂寄件者名稱

完成標準：
  ✅ 會員可以建立自己的活動並收到報名
  ✅ Pro 用量限制生效
  ✅ 至少 10 個會員嘗試建立活動
```

### Phase 1.5：社群動態牆 + LINE 整合（Week 7-9，與 Phase 2 並行）

目標：建立社群基礎，讓平台有「人氣」

```
Week 7-8
  [9.1] 社群動態牆 MVP
       • community_posts, community_comments, community_likes 表
       • /community 動態牆頁面（無限滾動 feed）
       • 發布動態（一般 / 問答）
       • 回覆、按讚功能
       • 篩選器（全部 / 問答 / 精選 / 成就）

  [9.2] 系統自動動態
       • 成就達成 → 自動發布動態
       • 新活動建立 → 自動發布
       • 新會員加入 → 歡迎動態
       • 官方內容更新 → 自動通知
       • 確保即使會員不發文，動態牆也有內容

Week 8-9
  [9.3] 問答 SEO 頁面
       • /community/q/[id]/[slug] 獨立頁面
       • 最佳解答標記
       • SEO metadata + JSON-LD QAPage schema
       • 結構化資料讓 Google 可能直接顯示答案

  [9.4] LINE 官方帳號串接
       • 申請 LINE Messaging API
       • profiles 加入 line_uid 欄位
       • 設定頁新增「綁定 LINE」按鈕
       • 週報推播（精選文章 + 近期活動）
       • Pro/Premium 即時通知（名單新增、活動報名）

完成標準：
  ✅ 社群動態牆有內容（系統自動 + 會員發布）
  ✅ 問答頁面可被 Google 索引
  ✅ LINE 推播可觸達會員
  ✅ 退租 Skool
```

### Phase 2：名單磁鐵系統（Week 8-11）

目標：核心差異化工具上線

```
Week 8-9
  [10] 名單磁鐵 MVP
       • lead_magnets + leads 表
       • 3 個模板：電子書下載、免費諮詢、迷你課程
       • 簡易編輯器（標題、說明、CTA、品牌色）
       • 表單收集 姓名 + Email
       • 自動感謝頁 + 確認信（附件 PDF）

  [11] 名單管理面板
       • leads 列表（姓名、Email、來源、日期）
       • 匯出 CSV
       • 基礎數據（瀏覽 → 填表轉換率）

Week 10-11
  [12] 名單磁鐵進階功能
       • /@username/m/[slug] 公開頁面 + SEO
       • Pro 限制（3 頁、500 名單）
       • 「Powered by Solo.tw」浮水印
       • Premium 移除浮水印 + 自訂欄位

  [13] 名單磁鐵 × 活動串接
       • 名單訂閱者自動收到活動通知
       • 活動報名者自動加入名單
       • 「你的名單 → 你的活動」閉環

完成標準：
  ✅ 會員可建立磁鐵頁、收集名單、下載 CSV
  ✅ 名單與活動系統互通
  ✅ Pro/Premium 差異化明確
```

### Phase 3：問卷系統 + 金流（Week 12-16）

目標：工具三件套完成 + 正式收費

```
Week 12-13
  [14] 問卷系統
       • surveys, survey_questions, survey_responses, survey_answers 表
       • 題型：單選、多選、評分（1-5）、簡答、NPS
       • 問卷頁面：/@username/survey/[slug]
       • 結果分析面板（回收率、各題統計圖表）
       • 匯出 CSV

  [15] 問卷 × 活動串接
       • 活動結束自動發送滿意度問卷
       • 問卷填完後導向名單磁鐵（漏斗串接）

Week 14-16
  [16] 統一金流串接
       • 申請統一金流（PayUni）商店代號
       • solo.tw 訂閱收費：信用卡定期扣款
       • Premium 會員付費票種：代收 → 扣平台費（5-8%）→ 撥款
       • 支援信用卡、ATM 轉帳、超商代碼

  [17] 訂閱管理
       • /pricing 定價頁
       • 升級/降級/取消流程
       • 發票/收據自動寄送
       • 創始會員限量機制（倒數 + 人數顯示）

完成標準：
  ✅ 問卷系統可用
  ✅ solo.tw 可以收訂閱費
  ✅ Premium 會員可用付費票種辦活動
  ✅ 第一筆訂閱營收入帳
```

### Phase 4：SEO 飛輪 + 成長機制（Week 17+）

目標：讓會員的內容幫 solo.tw 帶流量

```
  [18] /explore 探索頁
       • 瀏覽所有會員的公開主頁
       • 依 Solo 類型（獅/狐/象/鷹/龜/雞）分類
       • 「相似的 Solo」推薦
       • 活動聯合曝光：首頁顯示全平台近期活動

  [19] 推薦機制
       • 邀請連結 solo.tw/invite/[username]
       • 被邀請者註冊 → 邀請者得 EXP
       • 被邀請者升級 Pro → 邀請者得一個月免費

  [20] 診斷測驗產生器（Quiz Builder）
       • 開放會員建立自己的診斷/分類測驗
       • 承繼 solo.tw 現有的診斷引擎

  [21] 自訂網域 CNAME（Premium）
  [22] Webhook / Zapier 串接（Premium）
  [23] 嵌入碼 iframe（Premium）
```

---

## 10. 營收預估

### 保守估計

```
                    Month 3        Month 6        Month 12
                    (Phase 1完成)  (Phase 3完成)   (穩定營運)
──────────────────────────────────────────────────────────────
創始會員 Pro         30 人          80 人          200 人
                    ×NT$199       ×NT$299        ×NT$399
                    = NT$5,970    = NT$23,920    = NT$79,800

Premium             —             10 人           30 人
                                  ×NT$599        ×NT$999
                                  = NT$5,990     = NT$29,970

工作坊（每月 1-2 場） NT$20,000     NT$40,000      NT$60,000

平台抽成（5-8%）      —             —             NT$5,000+
──────────────────────────────────────────────────────────────
月營收合計           ~NT$26,000    ~NT$70,000     ~NT$175,000
年化營收             ~NT$312,000   ~NT$840,000    ~NT$2,100,000
```

### 關鍵指標追蹤

| 指標 | Month 3 目標 | Month 6 目標 | Month 12 目標 |
|------|:---:|:---:|:---:|
| 註冊會員數 | 300 | 1,000 | 3,000 |
| Pro 訂閱 | 30 | 80 | 200 |
| Premium 訂閱 | 0 | 10 | 30 |
| 付費轉換率 | 10% | 9% | 8% |
| 月活躍率 | 60% | 50% | 45% |
| 會員建立活動數/月 | 10 | 50 | 200 |
| 平台總名單數 | — | 5,000 | 30,000 |

---

## 11. FlowCEO 競品深度對照

### FlowCEO 概覽（2026-03-16 觀測）

- **網址**：flow.ceo
- **創辦人**：Cassie（Player 001, LV.15）
- **技術棧**：Next.js + Clerk 認證
- **定位**：用 AI 遊戲化經營人生與事業
- **核心產品**：FlowGPS（AI IDE 人生導航系統，以 Claude Code 為主）

### 定價對照

| | FlowCEO | Solo.tw（計畫） |
|---|---|---|
| 免費方案 | FlowGPS 免費課程 + Discord 免費交流區 | 診斷 + 部落格 + 基礎 Dashboard |
| 中間方案 | Community $55 USD/月（~NT$1,760）| Pro NT$399/月 |
| 高級方案 | Annual VIP $555 USD/年（~NT$17,760/年）| Premium NT$999/月（NT$10,188/年） |
| 創始策略 | 創始玩家 50 人 | 創始會員 100 人 |

**洞察**：FlowCEO 定價偏高（面向全球英文市場），solo.tw 面向台灣市場需要更親民的價格。但 solo.tw 有「SaaS 工具」這個 FlowCEO 沒有的差異化——FlowCEO 純教學 + 社群，solo.tw 教學 + 社群 + 工具。

### 遊戲化功能對照

| 功能 | FlowCEO | Solo.tw（計畫） | 差異化策略 |
|------|:---:|:---:|------|
| 等級系統（LV / EXP） | ✅ | ✅ | solo.tw 綁定真實事業里程碑 |
| HP 血量系統 | ✅（根據訂閱+學習持續度） | ❌ 不採用 | 太遊戲化，不符合 solo.tw 「事業工具」定位 |
| 貨幣系統（順流幣） | ✅（Stripe 付款加值） | ❌ 暫不採用 | 增加系統複雜度，Phase 4+ 再評估 |
| 每日任務 / 挑戰 | ✅（今日挑戰 +XP +幣） | ✅（週期任務） | solo.tw 用週期而非每日，降低壓力 |
| 成就徽章 | ✅（19 個，5 大分類） | ✅（6+ 個，綁定事業里程碑） | solo.tw 少而精，每個成就有實際意義 |
| 每日神秘寶箱 | ✅（4 種稀有度） | ❌ 不採用 | 過度遊戲化 |
| 玩家商店 | ✅（用幣兌換資源） | ❌ 暫不採用 | Phase 4+ 再評估 |
| 連續心流日 | ✅（每日登入里程碑） | ⚠️ 簡化版（連續週達成） | 改為「連續 N 週完成週期任務」|
| AI 技能雷達圖 | ✅ | ✅（SOLO 四維度進度條） | solo.tw 用 S.O.L.O 四階段取代雷達圖 |
| Bug 回報（遊戲化） | ✅ | ⚠️ 可借鏡 | 低優先，但 UX 好 |
| 公開開發藍圖 | ✅（/roadmap） | ✅（/roadmap） | 借鏡 FlowCEO 的三階段呈現 |

### FlowCEO 值得借鏡但 Solo.tw 不採用的功能

| 功能 | 不採用原因 |
|------|---------|
| HP 血量系統 | solo.tw 定位是「事業工具平台」，不是遊戲；HP 扣血會讓人焦慮而非激勵 |
| 貨幣系統 + 商店 | 增加系統複雜度，且台灣用戶對虛擬貨幣的接受度不如歐美。Phase 4+ 再評估 |
| 每日神秘寶箱 | 隨機獎勵適合遊戲，但對「認真經營事業的人」可能感覺幼稚 |
| Discord 社群 | 台灣用戶不熟悉 Discord，改用 LINE 官方帳號 + 站內社群動態牆 |

### FlowCEO 值得借鏡且 Solo.tw 要採用的功能

| 功能 | 借鏡方式 |
|------|---------|
| **品牌方法論框架（F.L.O.W）** | 已設計 S.O.L.O 四階段框架 |
| **漸進式課程解鎖** | 課程按 SOLO 階段解鎖 |
| **創始玩家限額** | 創始會員 100 人，鎖定終身價 |
| **每日/週期任務** | 改為週期任務，降低壓力，綁定真實行動 |
| **成就系統** | 綁定事業里程碑而非純遊戲行為 |
| **公開開發藍圖** | 新增 /roadmap 頁面，展示建設進度 |
| **會員 Dashboard** | RPG 風格儀表板，但語言改為「事業風」 |
| **社群整合** | FlowCEO 用 Discord，solo.tw 用站內動態牆 + LINE |

### Solo.tw 的獨家差異化（FlowCEO 沒有的）

| 功能 | 說明 |
|------|------|
| **SaaS 工具平台** | 會員可以用活動系統、名單磁鐵、問卷來經營自己的事業 |
| **@username 公開主頁** | 每個會員有自己的 landing page，類似 Linktree |
| **SEO 飛輪** | 會員頁面 + 活動 + 問答都能被 Google 索引 |
| **問卷系統** | 客戶調查、課後問卷等工具 |
| **診斷測驗引擎** | 已有成熟的 6 種人格診斷，未來可開放給會員使用 |
| **工具間交叉串接** | 名單 → 活動 → 問卷的完整漏斗閉環 |

---

## 附錄：靈感來源

- **FlowCEO (flow.ceo)**：遊戲化系統（等級、EXP、任務、成就）、品牌方法論框架（F.L.O.W）、創始玩家限額策略、漸進解鎖機制、公開開發藍圖
- **ConvertKit**：名單磁鐵 + Email 工具的 SaaS 模式
- **Luma**：活動報名系統的 UX
- **Linktree**：@username 公開主頁概念
- **Typeform**：問卷系統的互動體驗
- **Skool**：社群 + 課程整合概念（但 UX 和市場匹配有改進空間）

## 附錄：FlowCEO 完整功能清單（2026-03-16 快照）

供未來參考，FlowCEO 已上線的所有功能：

```
已上線 (LIVE)：
├── FlowGPS 免費課程（逐週解鎖）
├── Discord 社群（免費交流區 + 學員專屬 + VIP 專屬）
├── Community 月訂方案（$55/月）
├── Annual VIP 方案（$555/年，含每季 1:1 諮詢 90 分鐘）
├── FlowBot AI 幕僚長（Heartbeat Skill 設定包）
├── 玩家等級 & EXP 系統
├── HP 動態血量（根據訂閱狀態與學習持續度）
├── 順流幣系統（Stripe 付款加值、消費、交易紀錄）
├── 每日神秘寶箱（4 種稀有度隨機獎勵）
├── 玩家商店（用順流幣兌換獨家資源）
├── Bug 回報系統（遊戲化介面）
├── 站內通知系統
├── 我的收藏頁（寶箱紀錄與購買歷史）
├── Discord 打卡解鎖（學習與社群雙重驗證）
├── AI 技能進步追蹤（雷達圖）
├── 連續心流日（每日登入里程碑）
├── 成就徽章系統（19 個成就，5 大分類）
└── 公開開發藍圖（/roadmap）

課程結構（免費關卡）：
├── 新手村 — 遊戲化人生，從 0 建立 AI 人生 GPS
├── Funnel — 行動聚焦漏斗
├── Leverage — 資源放大槓桿
├── Optimize — 系統持續優化
├── Wealth — 八大財富積累
└── 晉級關卡 — 專業順流玩家到遊戲創造者
```
