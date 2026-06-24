# AI 家教班招生頁設計

> 日期：2026-06-24
> 倉庫：solo（Next.js App Router，Vercel，push main 自動部署）
> 分支：feat/ai-tutor-page

## 1. 背景與目標

Vista 已實際開設一對一的「AI 家教班」，教過電商公司創辦人、上市公司獨立董事、心理諮商師三位資深學員。屬高價、長時數、客製化的一對一服務。需要在 solo.tw 新增一個**獨立招生頁**，主走「預約免費諮詢、洽談客製內容」，而非現有 `/courses` 的固定梯次、團體、線上刷卡邏輯。

**目標**：用一頁清楚傳達定位與價值、降低觀望、收下高品質預約 lead，由 Vista 私下洽談客製課綱與報價後成交。

## 2. 關鍵決策（已與 Vista 對齊）

1. **產品關係**：獨立招生頁 + 共用後端。新做 bespoke landing page，但預約表單寫進既有 `consulting_leads` 表（以 `attribution` 區分），沿用既有寄信流程與 `/admin/consulting/leads` 後台。不重建後端、不新增 Supabase 表、不新增 email 範本。
2. **定價呈現**：公開三級套餐降低觀望，但成交一律先走免費諮詢洽談，頁面不放線上刷卡。
3. **命名**：保留「AI 家教班」。
4. **導覽列**：Header `navigation` 加第 8 項「AI 家教班」→ `/ai-tutor`（Vista 已同意「先這樣做」）。

## 3. 定位與命名

- **產品名**：AI 家教班
- **一句話定位**：給資深決策者的一對一 AI 私人家教：不是聽課，是有人坐在你旁邊，用你自己的真實業務，把你從不會帶到會用。
- **受眾**：老闆、上市公司獨立董事、教授、專業人士等資深決策者（時間貴、要客製、重隱私）。
- **與既有產品區隔**：
  - `/courses`：固定梯次、團體、刷卡即報名的工作坊。
  - `/consulting`：解某個具體問題的一對一諮詢（偏顧問）。
  - **AI 家教班**：由淺到深、客製課綱、長期陪學的一對一（偏教練／家教），走預約洽談。

## 4. 路由與資訊架構

- **新頁網址**：`/ai-tutor`（頂層獨立頁，與 `/consulting`、`/diagnose` 平行）。
- **預約成功頁**：`/ai-tutor/thanks`（輕量，沿用 consulting/thanks 版型精神）。
- **導覽列**：`src/components/layout/Header.tsx` 的 `navigation` 陣列加 `{ name: "AI 家教班", href: "/ai-tutor" }`。
- **不**進 `/courses` 列表，**不**加入 `src/lib/workshops.ts`（它是固定梯次課程的資料源，諮詢制產品進去會混淆邏輯）。

## 5. 頁面結構（由上而下）

1. **Hero**：主標 + 副標 + 雙 CTA（主：「預約免費諮詢」錨到表單；次：「看課程方案」錨到定價）。信任條：已陪伴電商創辦人、上市公司獨董、心理諮商師等資深決策者。
2. **痛點共鳴**：資深決策者學 AI 的三個卡點（沒時間從零摸索、課程太通用學不到自己要的、想用自己的真實業務練）。
3. **這不是課程，是私人家教**：與團體課／線上課的對照表（客製課綱、用你的真實專案、進度你決定、一對一隱私）。
4. **怎麼上**：四步流程（預約諮詢 → 客製課綱 → 一對一陪學 → 帶走可用成果）。
5. **適合誰**：三種真實學員情境（去識別化，無姓名、無照片）：電商創辦人、上市公司獨董、心理諮商師，各一段「他們帶走了什麼」。
6. **課綱是客製的**：列出常見可教方向（沿用既有主題池概念：Vibe Coding、內容流水線、第二大腦、AI 決策輔助等），強調最終依目標客製。
7. **方案與定價**（見 §6）。
8. **常見問題 FAQ**：隱私、時數效期、線上／實體、可否報公司帳、退費、線上刷卡為何要先諮詢。
9. **預約表單** + 結尾 CTA。

## 6. 方案與定價

公開三級套餐（參考方案，諮詢後客製）。頁面標註「實際課綱與時數於諮詢後客製」，保留彈性。

| 方案 | 時數 | 價格 | 約／小時 | 適合 |
|---|---|---|---|---|
| 啟航 | 6 小時 | NT$19,800 | 3,300 | 想先試、單一明確目標 |
| 進階（主推） | 12 小時 | NT$34,800 | 2,900 | 完整帶上手、做出可用成果 |
| 深掘陪跑 | 24 小時 | NT$64,800 | 2,700 | 長期陪跑、團隊或多專案 |

- 與 `/consulting`（時數諮詢、2,400–3,000/hr）價格帶相容但略高，反映客製課綱與資深定位。
- 不放線上刷卡按鈕，每張卡的 CTA 都導到預約表單。

## 7. 預約流程與後端（共用）

```
/ai-tutor 預約表單
  → POST（見下方 API 決策）
     payload 對齊既有 leadSchema：
       topics = ["ai-tutor:<選的方向>", ...]（topics 是自由 string[]，免改 enum；
                ai-tutor: 前綴即「家教班 lead」的識別標記）
       plan   = "undecided"（schema enum 已含 undecided，符合先諮詢不刷卡）
       attribution = 使用者選的「從哪裡認識」管道（保留欄位原意）
       其餘照既有欄位（name/email/contactMethod/level/specificProblem 等）
  → 寫入 consulting_leads（createServiceClient）
  → after()：寄確認信給學員（consulting-lead-received）
              + 通知信給 iamvista@gmail.com（consulting-lead-internal，
                主旨帶「AI 家教班」字樣）
  → 導向 /ai-tutor/thanks
  → Vista 在 /admin/consulting/leads 以 topics 含 ai-tutor: 前綴辨識家教班 lead
  → Vista 私下回信／約時間，洽談客製內容與報價後成交
```

### API 決策

- **採用**：新增極薄的 `src/app/api/ai-tutor/leads/route.ts`，內部重用 `validateLeadPayload` / `insertLead` / `sendEmail` / 既有兩個 email 元件，唯一差異是內部通知信主旨帶「AI 家教班」字樣，讓 Vista 一眼分辨（直接重用 `/api/consulting/leads` 會讓主旨顯示 `（undecided）`，辨識度差）。
- rate limit、Zod 驗證、`after()` 寄信模式完全照 `/api/consulting/leads` 既有寫法。

### 共用既有資產

- **零新增 Supabase 表**：沿用 `consulting_leads`。
- **零新增 email 範本**：沿用 `consulting-lead-received`、`consulting-lead-internal`。
- **後台沿用**：`/admin/consulting/leads` 已可看到並依 attribution 區分。

## 8. 表單欄位（沿用 leadSchema，家教語氣重寫標籤）

- 姓名（必填）
- Email（必填）
- 偏好聯絡方式：email／LINE／IG + 聯絡 ID
- 想學的方向（可複選，對應 `topics`，含「我有別的需求」）
- 目前程度（對應 `CONSULTING_LEVELS` 五級）
- 想解決的問題／想達成的目標（最少 30 字，對應 `specificProblem`）
- 希望開始時間（對應 `desiredStart`，選填）
- 從哪裡認識（對應 `attribution`，選填，沿用既有來源選項）
- 同意條款（必勾）

> Lead 來源識別不靠 `attribution`，而是靠 `topics` 帶 `ai-tutor:` 前綴（見 §7）。`attribution` 維持原意（使用者填的認識管道），不被佔用。

## 9. 視覺與素材

- 沿用 solo.tw 設計系統：primary 紅 `#E63946`、Geist 字體、shadcn/ui 元件、Lucide 圖示，與站體一致。
- Hero 封面圖：用既有 OpenRouter 生圖慣例產一張，存 `public/images/ai-tutor/hero.webp`。
- 三位學員情境用文字卡 + icon，不放真人照片（保護隱私）。

## 10. 新增／修改檔案

**新增**
- `src/app/ai-tutor/page.tsx`：bespoke landing。
- `src/app/ai-tutor/thanks/page.tsx`：預約成功頁。
- `src/lib/ai-tutor-config.ts`：方案、課綱方向、FAQ、學員情境資料。
- `src/components/ai-tutor/*`：Hero、對照表、流程、定價卡、預約表單等（表單大量參考 `src/components/consulting/LeadForm.tsx`）。
- `src/app/api/ai-tutor/leads/route.ts`：薄 API（重用 consulting lib + 客製內部信主旨）。
- `public/images/ai-tutor/hero.webp`。

**修改**
- `src/components/layout/Header.tsx`：`navigation` 加「AI 家教班」。

## 11. 部署

- solo.tw = push `main` → Vercel 自動部署。
- 本任務先在 `feat/ai-tutor-page` 分支開發，本機驗證（含 `/ai-tutor` 頁面渲染、表單 POST 端對端寫入 lead、信件寄出）後再合併 main。

## 12. 非目標（YAGNI）

- 不做線上刷卡（高客單刻意走諮詢成交）。
- 不做時數套票 Recur 產品（成交後若要收款，沿用 consulting enrollment 流程，不在本頁範圍）。
- 不做 AI 家教班專屬後台（沿用 `/admin/consulting/leads`）。
- 不做廣告投放、Email 自動化序列（屬漏斗後續工作，另案）。

## 13. 成功標準

- `/ai-tutor` 上線、行動裝置與桌機渲染正確、與站體視覺一致。
- 預約表單端對端：送出 → 寫入 `consulting_leads`（topics 帶 `ai-tutor:` 前綴）→ 學員與 Vista 各收到一封信（內部信主旨含「AI 家教班」）→ 導向 thanks 頁。
- `/admin/consulting/leads` 能辨識出家教班 lead（topics 前綴）。
- 導覽列出現「AI 家教班」入口。
