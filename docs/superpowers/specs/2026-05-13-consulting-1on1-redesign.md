---
title: solo.tw 1-on-1 量身陪跑服務 — Design Spec
date: 2026-05-13
status: ready-for-review
owner: Vista
co-author: Sebastian (Claude Opus 4.7)
supersedes: 既有 /consulting 四方案
---

# solo.tw 1-on-1 量身陪跑服務 Design Spec

## 1. 背景與動機

solo.tw 既有工作坊（NT$4,500–9,800、3–6 小時、12–20 人小班制）已驗證 7 個主題的需求穩定。

過去一年多反覆收到學員的詢問模式：「我的狀況跟其他人不一樣，能不能單獨討論？」——這是工作坊規格無法滿足的需求，也是這個 1-on-1 服務的核心價值主張。

### 取代範圍

- ✅ **取代**：`src/app/consulting/page.tsx`（既有四方案：免費初談 / 事業方向諮詢 / AI 工具導入 / 陪跑教練）
- ✅ **備份**：舊頁 snapshot 至 `docs/archive/consulting-legacy-2026-05-13.md`
- ✅ **保留**：`src/app/consulting/ai-research-system/`（未來作為主題 #6 學術寫作長預備 landing）
- ✅ **不動**：9 篇 blog 內文與首頁 CTASection 對 `/consulting` 的引用（新內容語意上 supersede 舊四方案）
- ✅ **廢棄評估**：`src/components/consulting/CalEmbed.tsx`（先確認 ai-research-system 是否仍引用再決定刪不刪）

### 新方案 supersede 舊方案的對應

| 舊方案 | 新對應 |
|--------|--------|
| 免費初談（30 min, 免費） | 新流程的「填表 → Vista review」階段（無 Zoom，改非同步 E-mail 評估） |
| 事業方向諮詢（60 min, NT$2,490） | 主題 #7 一人事業起步診斷（1hr / 3hr 套票皆可） |
| AI 工具導入（90 min, NT$3,990） | 主題 #3 Solo OS、#4 內容生產 Pipeline、#5 第二大腦 |
| 陪跑教練（60min × 4, NT$9,900） | 10hr / 20hr 套票（NT$26,000 / NT$48,000） |

---

## 2. 目標與非目標

### In Scope（v1）

- 新招生頁 `/consulting`（版型 B：故事先行）
- 需求表單（12 欄位，必填 7）
- API endpoint `/api/consulting/leads`
- Supabase 3 張新表
- 5 個 Recur productId（1/3/5/10/20 hr）
- 5 個 Resend Email 模板
- 後臺 3 頁 UI + 手動紀錄 session modal
- 舊頁完整備份
- `generate-llms.mjs` 擴充

### Out of Scope（v1，留 v2 再說）

- Cal.com 自動排程（明確由 Vista 決定不採用，喬時間走 E-mail / LINE）
- 自動扣款續訂（每次套票結束後 Vista 手動寄續購）
- 學員自助 dashboard（學員看不到剩餘時數的 UI，靠 E-mail 通知）
- 課程錄影檔保存（學員自錄自留）
- 多語版本
- 自動轉介（lead 不適合時 Vista 手動介紹）

---

## 3. 產品決策

### 3.1 服務原型

**彈性 1hr 底盤 + 7 主題包 + 5 階梯時數套票 + 客製通道**

- 最小單位：1 小時
- 訪客動線三條：直接點主題 → 選時數 → 填表；或填表時描述自訂需求 → 走客製
- 不綁固定主題：一張套票可在 6 個月內跨多個主題使用

### 3.2 主題清單（7 + 1）

| 組 | # | Emoji | 標題 | 一句話 | 帶走 |
|---|---|------|------|--------|------|
| 🅰 技術實作 | 1 | 💻 | Vibe Coding 入門 | 第一個 web app／小工具，從零到上線 | 一個部署在 Vercel / GitHub Pages 的可用作品 |
| 🅰 技術實作 | 2 | 🌐 | 個人網站系統 | 仿 solo.tw / vista.tw 的一人媒體站 | 上線的個人網站 + 部署 SOP |
| 🅱 AI 工作流 | 3 | 🎛 | Solo OS：個人作業系統建置 | 把 Calendar / Notion / Anytype / Obsidian 串成能運作的一人事業系統 | 個人化作業系統設定 + 工作流 SOP |
| 🅱 AI 工作流 | 4 | ✍️ | 內容生產 Pipeline | 研究 → 撰稿 → 去 AI 味 → 多平臺分發 | 個人化內容 pipeline + 模板包 |
| 🅱 AI 工作流 | 5 | 🧠 | 第二大腦／知識管理 | Wiki、backlink、AI 檢索 | 知識管理系統 + AI 檢索 SOP |
| 🅲 學術研究 | 6 | 📚 | AI 輔助學術寫作 | 文獻、Intro、方法、投稿，AI 是您的研究伙伴 | 學術寫作 workflow + AI prompt 模板 |
| 🅳 事業診斷 | 7 | 🎯 | 一人事業起步診斷 | 定位、產品、定價、首批客戶 | 個人化事業地圖 + 90 天行動計畫 |
| — | 8 | 🌀 | 我有別的需求 | 不在上面這七個主題裡？告訴我您的卡關 | 客製方案 |

### 3.3 階梯定價

| 方案 | 總價 | 每小時 | 適合 |
|------|------|--------|------|
| 1hr 諮詢 | NT$3,000 | 3,000 | 試水溫、單點問題 |
| 3hr 套票 | NT$8,400 | 2,800 | 入門包、一個小主題收尾 |
| 5hr 套票 | NT$13,500 | 2,700 | 一個主題深入 |
| 10hr 套票 | NT$26,000 | 2,600 | 跨主題、半年陪跑 |
| 20hr 套票 | NT$48,000 | 2,400 | 長期顧問關係 |

### 3.4 服務承諾

| 項目 | 內容 |
|------|------|
| 形式 | Google Meet 視訊 1-on-1，每場開一份共寫工作檔（Google Doc 或 GitHub repo） |
| 錄影 | 學員可自行錄影自留；Vista 不主動提供錄影檔 |
| 時數使用期限 | 自付款日起 6 個月內用完；最多可延期一次（+3 個月） |
| 退費 | 不退費，但可一次性轉讓給 1 位他人 |
| 取消／改期 | 開課前 48 小時 → 退回時數；24–48 小時 → 扣 0.5 小時；24 小時內 → 扣全時數 |

### 3.5 成交流程

```
訪客瀏覽 /consulting
   ↓
選主題 + 時數 → 填需求表單（12 欄位）
   ↓
POST /api/consulting/leads → Supabase consulting_leads；Resend 寄通知信給 Vista + 收件回條給學員
   ↓
Vista review fit
   ↓
不合適 → Vista 寄婉拒信，lead.status='rejected'
合適 → Vista 後臺一鍵寄 Recur 結帳連結，lead.status='approved'
   ↓
學員付款 → Recur webhook → 建立 consulting_enrollment、lead.status='enrolled'、寄歡迎信
   ↓
Vista 與學員 E-mail / LINE 議定首場時段
   ↓
首場 Google Meet 開課 + 共寫文件
   ↓
每堂課後 Vista 在後臺記錄 session（扣時數）+ 寄通知 E-mail
   ↓
套票時數用完 / 接近過期 → 自動觸發續購邀請信
```

### 3.6 表單欄位（12 個，必填 7）

```
一、聯絡方式
  1. 姓名 ★
  2. E-mail ★
  3. 偏好聯絡方式（E-mail / LINE / IG DM）★
     └─ 選 LINE / IG 時跳出 ID 輸入欄

二、想學什麼
  4. 主題範圍（multi-select 7 主題 + 「我有別的需求」）★
  5. 想解決的具體問題（textarea, 30 字以上）★
     placeholder：「我想用 AI 整合筆記，但不知道從哪開始？」
  6. 期待上完課後帶走什麼產出（textarea）  選填

三、了解您
  7. 目前的 AI / Coding 程度（5 級單選）★
     □ 完全新手，連 ChatGPT 都不太會用
     □ 會用 ChatGPT / Claude，能寫基本 prompt
     □ 用過 Cursor / Claude Code，做過小東西
     □ 已有作品，想升級工作流
     □ 我是工程師／研究者，要進階知識
  8. 預計開始時間（本週 / 兩週內 / 一個月內 / 還沒急）  選填

四、購買意向
  9. 我想預約的時數 ★
     ○ 1 小時諮詢（NT$3,000）
     ○ 3 小時套票（NT$8,400）
     ○ 5 小時套票（NT$13,500）
     ○ 10 小時套票（NT$26,000）
     ○ 20 小時套票（NT$48,000）
     ○ 還沒決定，想先聊聊

五、其他
  10. 怎麼知道 solo.tw（朋友 / 工作坊 / 電子報 / 社群 / 搜尋 / 其他）  選填
  11. 我了解費率，且本服務不退費 ★ checkbox
  12. 訂閱《Vista 電子報》接收後續更新  選填 checkbox
```

### 3.7 招生頁版型

**版型 B：故事先行**

```
Hero
  ↓
Why 1-on-1（工作坊 vs 1-on-1 對比）
  ↓
服務形式（Google Meet + 共寫文件 + 彈性節奏）
  ↓
主題卡網格（7 + 1）
  ↓
階梯套票表
  ↓
成交流程（5 步驟）
  ↓
需求表單
  ↓
FAQ
```

Hero CTA 提供 [填表預約 →] 與 [看 7 個主題包 ↓] 兩個錨點，照顧行動派與謹慎型訪客。

---

## 4. 文案 Final Draft

### 4.1 Hero

```
標題：不只是教您 AI，更是陪您突破卡關瓶頸
副標：Google Meet 1-on-1。從 1 小時諮詢到 20 小時長期陪跑，您的問題就是這堂課。
主 CTA：填表預約 →
副 CTA：看 7 個主題包 ↓
```

### 4.2 Why 1-on-1 段

```
段標：同樣的時間，集中在您身上

工作坊裡您是 12 位學員之一，內容是平均最大公約數。
在 1-on-1 裡，課程內容就是針對您的問題設計，按照您的節奏進行；
產出就是您要帶走的東西。

我在 solo.tw 開了一年多工作坊，反覆收到類似的訊息：
希望能單獨討論自己的狀況。
這個服務就是回應這個請求。
```

> ✅ 已採第三人稱描述（無引號）。若 Vista 後續確認有真實學員引述，再改回引號版本。

### 4.3 服務形式段

```
段標：我們怎麼一起工作

🎥 Google Meet 視訊 1-on-1
   分享螢幕、現場 demo、做到一半的東西我直接接手示範。

📝 共寫工作檔
   每場開一份 Google Doc 或 GitHub repo，
   做完當下就帶走可用的產出，不依賴錄影檔。

🔁 彈性節奏
   1 小時收一個小卡關，10 小時跨主題深耕，
   多久上一次、每次幾小時，您決定。
```

### 4.4 主題卡段

```
段標：您今天卡在哪裡？
副標：七個主題是我這一年多最常被問的方向。
      您也可以開新題目，第八張卡就是給「不在上面」的人。
```

7 + 1 張卡片內文沿用 3.2 表格；每張卡片右下角有「💬 從這題開始」按鈕，點下去自動把該主題勾選到表單第 4 欄並滑動到表單區。

### 4.5 階梯套票段

```
段標：依需求選時數，越多越划算
副標：自付款日起 6 個月內用完，可延期一次（+3 個月）

[3.3 表格]

註：套票期間 1 對 1 時段優先排程，可分次使用、不限主題；
單張套票可一次性轉讓給 1 位他人。
```

### 4.6 成交流程段

```
段標：從填表到上課，五步驟

① 填需求表單（5 分鐘）
② 我看完回信（24 小時內）
③ 確認方向後寄上付款連結
④ 付款後 E-mail / LINE 議定首場時段
⑤ Google Meet 開課，共寫文件同步交付
```

### 4.7 FAQ（9 條）

```
Q1：跟你的工作坊有什麼不同？
A：工作坊是我教大家一個系統方法論，1-on-1 是我陪您解決您的問題。
    工作坊節奏固定、內容固定；1-on-1 整堂課的時間都用來處理您所遇到的問題。

Q2：一定要先填表嗎？我已經確定要買 1 小時諮詢。
A：是的。需求表單是我判斷能不能幫您的依據，半小時內就能填完。
    填完我會 24 小時內回信，合適就寄付款連結，不合適會誠實告訴您。

Q3：不在臺灣可以嗎？
A：可以。Google Meet 跨時區沒問題，議時段時告訴我時差即可。

Q4：上完課可以加購嗎？
A：當然。可以隨時跨方案升級（如 1hr 諮詢後再買 10hr 套票），
    已付的時數獨立計算、不退費也不被吃掉。

Q5：套票可以轉讓嗎？
A：可以，單張套票可一次性轉讓給 1 位他人，請來信申請。
    建議轉讓給有類似需求的人，效率最好。

Q6：取消政策？
A：開課前 48 小時取消 → 退回時數；
    24–48 小時 → 扣 0.5 小時；
    24 小時內 → 扣該場全部時數。

Q7：我的需求不在 7 個主題裡。
A：在表單裡選「我有別的需求」並描述。
    您的題目如果剛好我有把握，我會接；不是，會誠實告訴您比較適合的人。

Q8：我怎麼知道還剩多少時數？
A：每堂課後 24 小時內，我會寄信通知。

Q9：可以錄影嗎？
A：學員可自行錄影自留，我這端不主動錄製。
```

---

## 5. 技術決策

### 5.1 路由與檔案結構

```
取代：
  src/app/consulting/page.tsx              ← 新內容（7+1 主題 / 套票 / 流程 / 表單 / FAQ）

保留：
  src/app/consulting/ai-research-system/   ← 不動

新增：
  src/app/consulting/thanks/page.tsx       ← 表單送出後感謝頁
  src/app/api/consulting/leads/route.ts    ← 表單 POST → Supabase + Resend
  src/app/admin/consulting/leads/page.tsx
  src/app/admin/consulting/enrollments/page.tsx
  src/app/admin/consulting/enrollments/[id]/page.tsx
  src/components/consulting/Hero.tsx
  src/components/consulting/WhyOneOnOne.tsx
  src/components/consulting/ServiceFormat.tsx
  src/components/consulting/ThemeGrid.tsx
  src/components/consulting/PricingLadder.tsx
  src/components/consulting/ProcessSteps.tsx
  src/components/consulting/LeadForm.tsx
  src/components/consulting/FAQ.tsx

擴充：
  src/lib/recur-product-config.ts          ← 新增 5 個 consulting productId
  src/app/api/webhooks/recur/route.ts      ← 加 consulting kind handler
  scripts/generate-llms.mjs                ← 加新 service 寫進 llms-full.txt
  src/app/sitemap.ts                       ← 確認新路徑收錄

備份：
  docs/archive/consulting-legacy-2026-05-13.md

評估廢棄：
  src/components/consulting/CalEmbed.tsx   ← 確認 ai-research-system 不引用再刪
```

### 5.2 Supabase Schema

```sql
CREATE TABLE consulting_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  contact_method text NOT NULL,        -- 'email' | 'line' | 'ig'
  contact_id text,
  topics text[] NOT NULL,              -- slug 陣列，例 {'vibe-coding','solo-os'}
  specific_problem text NOT NULL,
  expected_outcome text,
  level text NOT NULL,                 -- 'beginner' | 'basic' | 'intermediate' | 'advanced' | 'expert'
  desired_start text,                  -- 'this_week' | '2_weeks' | '1_month' | 'no_rush'
  plan text NOT NULL,                  -- '1hr' | '3hr' | '5hr' | '10hr' | '20hr' | 'undecided'
  attribution text,
  consent_terms boolean NOT NULL,
  subscribe_newsletter boolean DEFAULT false,
  status text DEFAULT 'pending',       -- 'pending' | 'approved' | 'rejected' | 'enrolled'
  vista_notes text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_consulting_leads_status ON consulting_leads(status);
CREATE INDEX idx_consulting_leads_created_at ON consulting_leads(created_at DESC);

CREATE TABLE consulting_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES consulting_leads(id),
  name text NOT NULL,
  email text NOT NULL,
  contact_method text,
  contact_id text,
  plan text NOT NULL,
  total_hours numeric NOT NULL,
  recur_product_id text,
  recur_payment_id text,
  purchased_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  extended_once boolean DEFAULT false,
  status text DEFAULT 'active',        -- 'active' | 'expired' | 'completed' | 'transferred'
  transferred_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_consulting_enrollments_status ON consulting_enrollments(status);
CREATE INDEX idx_consulting_enrollments_expires_at ON consulting_enrollments(expires_at);

CREATE TABLE consulting_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES consulting_enrollments(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  time_start time,
  time_end time,
  hours_used numeric NOT NULL,
  topic text NOT NULL,                 -- 'vibe-coding' | 'solo-os' | ... | 'custom'
  shared_doc_url text,
  vista_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_consulting_sessions_enrollment_id ON consulting_sessions(enrollment_id);
CREATE INDEX idx_consulting_sessions_date ON consulting_sessions(session_date DESC);

-- 剩餘時數計算（view）
CREATE VIEW consulting_enrollments_with_balance AS
SELECT
  e.*,
  COALESCE(SUM(s.hours_used), 0) AS hours_used,
  e.total_hours - COALESCE(SUM(s.hours_used), 0) AS hours_remaining,
  MAX(s.session_date) AS last_session_date
FROM consulting_enrollments e
LEFT JOIN consulting_sessions s ON s.enrollment_id = e.id
GROUP BY e.id;
```

### 5.3 Recur productId 對照

```typescript
// src/lib/recur-product-config.ts 新增
{
  'zimy2xm5pv24dfxx194axeev': { kind: 'consulting', plan: '1hr',  hours: 1,  amount: 3000  },
  'efmn8pw5tielzrgwffb76swd': { kind: 'consulting', plan: '3hr',  hours: 3,  amount: 8400  },
  'dwdt6ikhule9j0hs1px77rke': { kind: 'consulting', plan: '5hr',  hours: 5,  amount: 13500 },
  'mndmvwsgvevq7ogdklt7i3h6': { kind: 'consulting', plan: '10hr', hours: 10, amount: 26000 },
  'q2z9d2dd6vymycdq1b35iz2w': { kind: 'consulting', plan: '20hr', hours: 20, amount: 48000 },
}
```

> ✅ 5 個 productId 已由 Vista 於 2026-05-13 提供，已寫入 spec／plan。

Recur webhook 觸發 `consulting` kind 時：
1. 從 metadata 取 `lead_id`
2. 建立 `consulting_enrollment`，`expires_at = purchased_at + interval '6 months'`
3. 更新 `consulting_leads.status = 'enrolled'`
4. 寄歡迎信（`consulting-enrollment-welcome` 模板）

### 5.4 API Contract：POST /api/consulting/leads

**Request body**

```typescript
{
  name: string;
  email: string;
  contactMethod: 'email' | 'line' | 'ig';
  contactId?: string;
  topics: string[];           // slug array, min 1
  specificProblem: string;    // min 30 chars
  expectedOutcome?: string;
  level: 'beginner' | 'basic' | 'intermediate' | 'advanced' | 'expert';
  desiredStart?: 'this_week' | '2_weeks' | '1_month' | 'no_rush';
  plan: '1hr' | '3hr' | '5hr' | '10hr' | '20hr' | 'undecided';
  attribution?: string;
  consentTerms: true;          // 必須為 true
  subscribeNewsletter?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
```

**Response**

```typescript
// 200
{ ok: true, leadId: string }

// 400 / 422
{ ok: false, error: string, fieldErrors?: Record<string, string> }

// 429
{ ok: false, error: 'rate_limit_exceeded' }
```

**Behavior**

1. Rate limit：同 IP 每 10 分鐘 5 次
2. Zod 驗證 payload
3. 寫入 `consulting_leads`
4. 並行寄兩封信：
   - 給學員：`consulting-lead-received`（收件確認 + 預期 24 小時內回信）
   - 給 Vista：`consulting-lead-internal`（含表單內容摘要 + 後臺連結）
5. 若 `subscribeNewsletter=true`：upsert 到 `newsletter_subscribers`
6. 回 leadId，前端 redirect 到 `/consulting/thanks?lead_id=<id>`

### 5.5 Email 模板（Resend）

| 模板 ID | 觸發 | 收件人 | 內容要點 |
|---------|------|--------|---------|
| `consulting-lead-received` | 表單送出 | 學員 | 收件確認 / 24 hr 內回信 / 表單摘要 |
| `consulting-lead-internal` | 表單送出 | Vista | 完整表單內容 + 後臺 review 連結 |
| `consulting-checkout-link` | Vista 後臺點「approve」 | 學員 | 確認方向 + Recur 結帳連結 |
| `consulting-enrollment-welcome` | webhook（付款成功） | 學員 | 歡迎 + 套票方案 + 過期日 + 議時段引導 |
| `consulting-session-summary` | Vista 後臺記錄 session | 學員 | 「每堂課後 24 小時內，我會寄信通知」 |

### 5.6 SEO Metadata

```typescript
export const metadata: Metadata = {
  title: "1-on-1 量身陪跑 | solo.tw",
  description:
    "不只是教您 AI，更是陪您突破卡關瓶頸。Google Meet 1-on-1，從 1 小時諮詢到 20 小時長期陪跑，您的問題就是這堂課。",
  alternates: { canonical: "https://www.solo.tw/consulting" },
  openGraph: {
    title: "1-on-1 量身陪跑 | solo.tw",
    description: "不只是教您 AI，更是陪您突破卡關瓶頸。",
    url: "https://www.solo.tw/consulting",
    type: "website",
  },
};
```

含 JSON-LD：`serviceSchema`（service type: 1-on-1 consulting）、`breadcrumbSchema`、`faqSchema`（9 個 FAQ）。

---

## 6. 後臺 UI 規格

### 6.1 路徑與功能

| 路徑 | 功能 | 預估元件 |
|------|------|---------|
| `/admin/consulting/leads` | 待 review 表單投件清單，按時間排序，可篩 status；每列「approve / reject / view」按鈕 | LeadList table, status filter, action buttons |
| `/admin/consulting/enrollments` | 學員清單：姓名 / plan / 剩餘時數 / 過期日 / 最近上課日；可篩 status；可點進詳情 | EnrollmentList table with computed balance |
| `/admin/consulting/enrollments/[id]` | 學員詳情：基本資料 + session 歷史 + 「📝 記錄一場 session」modal 按鈕 | EnrollmentDetail, SessionTable, AddSessionModal |

### 6.2 記錄一場 Session Modal

```
[ 學員 ID（自動帶入） ]
[ 上課日期 ] (date picker, 預設今天)
[ 開始時間 ] (time picker)
[ 結束時間 ] (time picker)
[ 實際使用時數 ] (number, auto 計算 = (end - start) / hour，可手動覆寫)
[ 主題 ] (select：7 主題 slug + 'custom')
[ 共寫文件連結 ] (URL, 選填)
[ Vista 私人筆記 ] (textarea, 選填)
[ □ 同時寄通知信給學員 ] (checkbox, default true, 觸發 consulting-session-summary)
[ 取消 ] [ 儲存 ]
```

儲存後：
1. 寫入 `consulting_sessions`
2. 重新查詢 `consulting_enrollments_with_balance` 顯示新剩餘時數
3. 若勾選通知：呼叫 Resend 寄 `consulting-session-summary`
4. 若 hours_remaining ≤ 1：自動觸發續購邀請（標記 `needs_renewal_followup` 給 Vista）

### 6.3 後臺權限

複用既有 `/admin` 中介層（已有 auth check）。

---

## 7. 發布順序

| 順序 | 動作 | 預估時間 | 依賴 |
|------|------|---------|------|
| 1 | 備份舊頁 → `docs/archive/consulting-legacy-2026-05-13.md` + 截圖 | 30 min | — |
| 2 | Supabase migration（3 張新表 + view） | 1 hr | — |
| 3 | Vista 在 recur.tw 後臺手動建立 5 個 productId、提供 ID | 30 min（Vista 自做） | — |
| 4 | 後臺 UI 三頁 + modal（先做，後續測試有處看資料） | 6–10 hr | 2 |
| 5 | API endpoint `/api/consulting/leads` + Zod | 2 hr | 2 |
| 6 | 5 個 Email 模板 + Resend wiring | 3 hr | — |
| 7 | 招生頁 8 個元件 + 組裝 `page.tsx` | 8–10 hr | — |
| 8 | Webhook 擴充處理 consulting kind | 1–2 hr | 2, 3 |
| 9 | `generate-llms.mjs` 擴充 | 1 hr | — |
| 10 | Preview deploy → end-to-end smoke test（測試金額 NT$1） | 2 hr | 全部 |
| 11 | Prod deploy + 監測首 24 小時 | 1 hr | 10 |

**總計：23–37 hr，建議 1–2 週分段完成。**

---

## 8. 風險與緩解

| 風險 | 影響 | 緩解 |
|------|------|------|
| 替換 `/consulting` 後 9 篇 blog 內部連結語意失焦 | 中 | 監測首 4 週 Substack 訂閱與表單轉換率，下降顯著再 audit 內文 |
| Recur productId 設錯導致金額不對 | 高 | Preview deploy 用測試金額 NT$1 跑 end-to-end，確認 webhook 寫入正確 enrollment |
| 後臺手動紀錄遺漏 → 時數計算錯 | 中 | 列表頁顯示「上次 session > 14 天」紅色警示，提醒 Vista 補登 |
| 學員填表後 ghost 不付款 | 低 | lead.status=approved 但 7 天未付 → 自動 status=stale，後臺隱藏 |
| Vista 排不過來 → 套票過期未用完 | 中 | 到期前 30 天自動寄延期申請 E-mail，附「+3 個月」延期一鍵按鈕 |
| 共寫文件連結散落 Google Doc / GitHub | 低 | Session 表存連結，後臺學員詳情頁可一覽 |
| 既有 CalEmbed 元件保留還是刪 | 低 | 確認 ai-research-system 是否引用，無引用即刪；有引用先留 |

---

## 9. 未決問題狀態

1. ✅ **D 段 4.2 引號** — 已採第三人稱描述（2026-05-13 解決）
2. ✅ **Recur productId** — Vista 提供 5 個真實 productId（1hr/3hr/5hr/10hr/20hr，見 §5.3）（2026-05-13 解決）
3. ⏳ **`CalEmbed.tsx` 廢棄與否** — Plan Task 23 會在實作時檢查 `ai-research-system` 引用、無引用即刪
4. ✅ **後臺記錄 session「同時寄通知信」default** — 已採 default true（plan §6.2）
5. ✅ **婉拒信模板** — 已提供（見 §11 附錄）

---

## 10. 變更歷史

| 日期 | 變更 | 作者 |
|------|------|------|
| 2026-05-13 | 初版（Brainstorming session 收尾） | Sebastian + Vista |
| 2026-05-13 | 補：5 個 Recur productId 寫入；§4.2 採第三人稱；§9 未決問題 1/2/4/5 解決；新增 §11 婉拒信模板附錄 | Sebastian + Vista |

---

## 11. 附錄：婉拒信模板

Vista 用 Gmail 手動寄出，非系統發送。場景四選一替換。

```
主旨：Re: [姓名] 的 1-on-1 量身陪跑申請

[姓名] 您好，

謝謝您填寫 1-on-1 量身陪跑的需求表單。
我仔細看完您描述的卡關後，老實說，我覺得自己不是這個題目最合適的人。

[依場景四選一]

──────────────── 場景 A：程度不適配（太進階）
您的程度與想要解的問題，已經比我這一年的學員平均高一階。
與其讓您花錢但效率有限，不如建議您直接看 [推薦：specific 資源／同行]。

──────────────── 場景 B：程度不適配（太基礎）
您目前的階段比較適合先打好基礎再進到 1-on-1。
我推薦您先看 solo.tw 既有的 [推薦：specific 工作坊／免費資源]，
完成基本練習後若還有卡關，再回來找我。

──────────────── 場景 C：主題不在能力圈
這個題目其實不是我這一年多最熟的方向，
若我硬接，可能會浪費您寶貴的時間與金錢。
我推薦 [推薦：specific 同行]，他在這方面比我深。

──────────────── 場景 D：時段排不開
最近兩三個月我的 1-on-1 時段已經滿了。
若您不急，可以等到 [日期] 再開放預約，那時會優先回覆您；
若需要立即解決，建議考慮 [推薦：工作坊／同行]。

────────────────

抱歉沒能直接接您的這個題目，
但希望我的轉介對您有幫助。

祝您一切順利。

Vista
solo.tw
```
