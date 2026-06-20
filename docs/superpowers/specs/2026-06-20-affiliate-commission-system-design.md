# 聯盟行銷分潤系統設計（Affiliate Commission System）

- 日期：2026-06-20
- 專案：solo.tw（`/Users/vista/06_VibeCoding/01_Code_Products/solo`）
- 狀態：設計已對齊，待寫實作計畫
- 首發綁定課程：概念變現陪跑營（`concept-monetization-bootcamp`）

## 1. 目標與範圍

讓 Vista 能發給不同人／單位專屬代碼，由他們協助銷售課程；確實透過代碼帶入的「已付款」訂單，依代碼設定的比例計算分潤，並在後台管理代碼、檢視訂單與分潤、月結對帳。

### 已對齊的關鍵決策（來自 brainstorming）

1. **分潤模式**：每個代碼各自設定「百分比」（如 20%）。
2. **代碼追蹤**：專屬連結 `?ref=代碼` 自動帶（cookie 歸因）+ 報名表單可手動補填代碼。
3. **系統範圍**：自動算分潤 + 後台報表 + 手動標記已付款 + 月結對帳單 CSV 匯出。**不**做自動匯款。
4. **夥伴後台**：本版只有 admin 看得到，**不**做夥伴自助登入。
5. **歸因規則**：首觸歸因（cookie 已存在就不覆蓋），歸因窗 30 天。
6. **代碼適用範圍**：預設全站適用；可選擇性限定特定課程。
7. **分潤計算基礎**：以「實付金額」（折扣後）計算，雙人／VIP／舊生方案自然吃到正確金額。

### 明確不做（YAGNI，預留未來）

夥伴自助登入後台、自動匯款、多層分潤（MLM）、Recur 折扣碼綁定、固定金額分潤、買家端折扣。

## 2. 架構決策

**分潤資料採獨立 ledger 表**，而非在 `course_enrollments` 加分潤欄位。理由：分潤狀態（待結算→已核准→已付款→作廢）有自己的生命週期，與報名／付款狀態無關；獨立表才能乾淨支援月結對帳、出款標記、退費作廢，也避免報名表持續膨脹。`course_enrollments` 僅加一個 `referral_code` 欄位記錄「誰帶來的」。

資料庫沿用既有 **Supabase（Postgres）**；後台沿用既有 **Supabase Auth + email 白名單**（`src/lib/supabase/admin.ts`，白名單 `iamvista@gmail.com`）；金流事件沿用既有 **Recur webhook**（`src/app/api/webhooks/recur/route.ts`）。本版不需要新增任何環境變數。

## 3. 資料模型

### 3.1 新表 `affiliates`（夥伴／代碼）

```sql
create table if not exists affiliates (
  id uuid primary key default gen_random_uuid(),
  code text not null,                       -- 代碼本體，存正規化後的大寫（如 VISTA20）
  name text not null,                       -- 夥伴／單位名稱
  email text,                               -- 聯絡與出款用
  commission_rate numeric(5,4) not null,    -- 分潤比例，0.2000 = 20%（0 < rate <= 1）
  course_ids text[],                        -- 適用課程 slug 陣列；null 或空＝全站適用
  status text not null default 'active',    -- active / disabled
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 代碼唯一（大小寫不敏感已由存大寫保證；用 unique index 防重複）
create unique index if not exists idx_affiliates_code on affiliates(code);
create index if not exists idx_affiliates_status on affiliates(status);

alter table affiliates enable row level security;
-- 不開任何 policy → 僅 service role 可存取（後台 API route 介接）
```

### 3.2 新表 `affiliate_referrals`（分潤明細 ledger）

```sql
create table if not exists affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references affiliates(id),
  enrollment_id uuid not null references course_enrollments(id),
  course_id text not null,                  -- 冗餘存一份，方便報表不必 join
  order_amount integer not null,            -- 實付金額（NT$ 整數）
  commission_rate numeric(5,4) not null,    -- 下單當下的比例快照
  commission_amount integer not null,       -- round(order_amount * commission_rate)
  status text not null default 'pending',   -- pending / approved / paid / void
  recur_order_id text,                      -- 對應 Recur 訂單，退費比對與去重用
  payout_note text,                         -- 出款備註（轉帳日期／方式）
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz,
  voided_at timestamptz
);

-- 一筆報名最多一筆分潤（webhook 重送冪等）
create unique index if not exists idx_affiliate_referrals_enrollment on affiliate_referrals(enrollment_id);
create index if not exists idx_affiliate_referrals_affiliate on affiliate_referrals(affiliate_id);
create index if not exists idx_affiliate_referrals_status on affiliate_referrals(status);
create index if not exists idx_affiliate_referrals_created on affiliate_referrals(created_at desc);
create index if not exists idx_affiliate_referrals_recur_order on affiliate_referrals(recur_order_id);

alter table affiliate_referrals enable row level security;
-- 不開任何 policy → 僅 service role 可存取
```

### 3.3 `course_enrollments` 新增欄位

```sql
alter table course_enrollments add column if not exists referral_code text;
create index if not exists idx_course_enrollments_referral on course_enrollments(referral_code);
```

> 註：`course_enrollments.status` 列舉已含 `pending / paid / failed / cancelled / refunded`，無需變更。

Migration 檔名：`supabase/migrations/20260620_affiliate_commission.sql`（三段合一）。

## 4. 代碼追蹤流程

### 4.1 連結進站 → cookie 歸因（middleware）

夥伴分享 `https://www.solo.tw/courses/concept-monetization-bootcamp?ref=VISTA20`。

於 `src/middleware.ts`（若已存在則擴充，不新建衝突）攔截帶 `?ref=` 的請求：

- 正規化 `ref`（trim + 轉大寫）。
- **首觸歸因**：若 cookie `solo_ref` 尚未存在才寫入；已存在則不覆蓋。
- cookie 設定：`httpOnly`、`sameSite=lax`、`path=/`、`maxAge = 30 天`。
- middleware 只負責「記下來源」，**不**在此查 DB 驗證代碼（避免每個請求打 DB）；驗證延到報名時。

### 4.2 報名表單手動補填欄位

`src/app/courses/[course]/register/CourseRegistrationForm.tsx` 新增一個選填欄位「推薦代碼（選填）」。送出時連同既有欄位 POST 到 `/api/courses/register`，欄位名 `referralCode`。

### 4.3 register API 驗證與寫入

`src/app/api/courses/register/route.ts`：

1. 解析來源代碼：`raw = body.referralCode`（手動，優先）`?? cookie solo_ref`（自動）。route handler 透過 `next/headers` 的 `cookies()` 讀 `solo_ref`。
2. 若有 `raw`：正規化大寫後查 `affiliates`，條件 `code = raw AND status = 'active'`，且（`course_ids` 為空 **或** 含本次 `course.slug`）。
3. 驗證通過 → 將正規化代碼寫入 insert 的 `referral_code` 欄位；同時加進回傳的 `metadata.referral_code`（增加 webhook 韌性）。
4. 驗證失敗（不存在／停用／不適用此課）→ `referral_code` 寫 `null`，買家端完全無感，照常完成報名。

> 報名此時 `status='pending'`，**尚未產生任何分潤**。分潤只在付款成功才生。

## 5. 分潤計算（Recur webhook）

`src/app/api/webhooks/recur/route.ts` 的 `handleOrderPaid` → 既有 `markEnrollmentPaid` 標記報名 `paid` 之後，新增一步 `recordAffiliateCommission`：

1. 以 `enrollmentId` 讀回該報名的 `referral_code`、`course_id`、`amount`。
2. 若 `referral_code` 為空 → 結束（無分潤）。
3. 查 `affiliates`（`code = referral_code AND status = 'active'`）；查無或已停用 → 結束（記 log）。
4. 計算：
   - `order_amount` = webhook 的 `data.amount`（實付）；缺值則 fallback 用 `enrollment.amount`。
   - `commission_rate` = 該 affiliate 當下的 `commission_rate`（快照）。
   - `commission_amount` = `Math.round(order_amount * commission_rate)`。
5. `insert` 一筆 `affiliate_referrals`（`status='pending'`，帶 `recur_order_id`）。
   - 靠 `enrollment_id` 的 unique index 保證**冪等**：webhook 重送時 `on conflict do nothing`，不重複計分潤。
6. 任何錯誤只 `console.error`、**不擋** webhook 主流程（與既有錯誤處理風格一致，webhook 永遠回 200）。

## 6. 退費／作廢處理

`course_enrollments.status` 已預留 `refunded / cancelled`，但目前 webhook 無對應 handler。

- **若 Recur 有推退款事件**（如 `order.refunded` / `order.cancelled`）：在 webhook 新增 handler，依 `recur_order_id` 找對應 `affiliate_referrals`，將 `status` 設為 `void`、寫 `voided_at`，並把 `course_enrollments.status` 標 `refunded`。
- **若 Recur 不推此事件**：admin 後台明細頁提供「作廢」按鈕，手動把該筆分潤標 `void`。
- 對帳與報表計算一律排除 `void`。

> 實作前需確認 Recur SDK 實際會發出的退款事件型別；查不到就先採「admin 手動作廢」路徑，事件 handler 列為後續增強。

## 7. 後台（/admin/affiliates）

沿用既有 admin 版面與 `requireAdmin` 守門（同 `/admin/enrollments` 等模組）。

### 7.1 代碼列表頁 `/admin/affiliates`

表格每列：代碼、夥伴名稱、比例、狀態、適用課程、帶單數、累計分潤（**待結算 / 已核准 / 已付款** 三欄分開加總，排除 void）。頁面頂部「新增代碼」。

### 7.2 新增／編輯代碼

表單欄位：`code`、`name`、`email`、`commission_rate`（以 % 輸入，存成小數）、`course_ids`（多選，可留空＝全站）、`status`、`note`。

- 新增時檢查 `code` 不重複（大寫正規化後）。
- 「刪除」採**停用**（`status='disabled'`）而非真刪，保留歷史明細的外鍵完整。

### 7.3 夥伴明細頁 `/admin/affiliates/[id]`

- 上方：該夥伴彙總（帶單數、各狀態分潤合計）。
- 下方：分潤明細表（每筆：日期、課程、學員 email、實付金額、比例、分潤、狀態、Recur 訂單）。
- 逐筆或批次操作：`pending → approved`、`approved → paid`（填 `payout_note`）、任意 → `void`。

### 7.4 月結對帳單匯出

夥伴明細頁提供「匯出對帳單」：選月份 → 匯出 CSV（該月每筆訂單明細 + 分潤合計），欄位含訂單日期、課程、實付金額、比例、分潤金額、狀態。供每月寄給夥伴核對。

### 7.5 後台 API 路由（service client + requireAdmin）

- `POST /api/admin/affiliates`：建立代碼
- `PATCH /api/admin/affiliates/[id]`：更新代碼（比例、狀態、適用課程等）
- `PATCH /api/admin/affiliates/referrals/[id]`：更新單筆分潤狀態（approve / paid / void + payout_note）
- `GET /api/admin/affiliates/[id]/export?month=YYYY-MM`：月結 CSV 匯出

## 8. 分潤狀態機

```
pending ──approve──▶ approved ──pay──▶ paid
   │                    │
   └────void───────────┴────────▶ void（退費或人工作廢；報表一律排除）
```

- `pending`：付款成功自動建立，待 admin 審核。
- `approved`：admin 確認可出款。
- `paid`：已實際轉帳給夥伴（填 `payout_note`）。
- `void`：退費或人工作廢。

## 9. 邊界情況與驗證

- **折扣方案**：分潤以實付 `amount` 計，雙人 / VIP / 舊生折扣自動正確。
- **無效／停用代碼**：報名照常，不產生分潤，買家無感。
- **webhook 重送**：`enrollment_id` unique index + `on conflict do nothing` 保證冪等。
- **代碼比例事後調整**：只影響之後的新訂單；舊明細用 `commission_rate` 快照，不回溯。
- **自我推薦／濫用**：本版不做防呆（信任名單制），僅在 `note` 記錄；列為未來增強。
- **歸因覆蓋**：首觸優先，避免後到的連結搶走最初介紹者的功勞。

## 10. 安全

- 兩張新表 RLS 啟用且不開 policy → 僅 service role 可存取。
- 所有 `/admin/affiliates*` 頁面與 `/api/admin/affiliates*` 路由都過既有 `requireAdmin`（Supabase Auth + email 白名單）。
- webhook 寫入用既有 service role client。
- 無新增環境變數。

## 11. 變更檔案清單

**新增**

- `supabase/migrations/20260620_affiliate_commission.sql`
- `src/lib/affiliates.ts`（代碼正規化、驗證、分潤計算、CRUD 與報表查詢的共用函式）
- `src/app/admin/affiliates/page.tsx`（列表）
- `src/app/admin/affiliates/[id]/page.tsx`（明細）
- `src/app/admin/affiliates/AffiliateForm.tsx` 等必要的 client 組件
- `src/app/api/admin/affiliates/route.ts`（建立）
- `src/app/api/admin/affiliates/[id]/route.ts`（更新）
- `src/app/api/admin/affiliates/[id]/export/route.ts`（月結匯出）
- `src/app/api/admin/affiliates/referrals/[id]/route.ts`（單筆分潤狀態）

**修改**

- `src/middleware.ts`（擴充或新建：`?ref=` → `solo_ref` cookie 首觸歸因）
- `src/app/api/courses/register/route.ts`（解析 + 驗證 referral_code，寫入 enrollment 與 metadata）
- `src/app/courses/[course]/register/CourseRegistrationForm.tsx`（新增「推薦代碼」選填欄位）
- `src/app/api/webhooks/recur/route.ts`（`order.paid` 後 `recordAffiliateCommission`；退款事件作廢 handler）
- `src/app/admin/page.tsx`（儀表板加入聯盟分潤入口／摘要，可選）

## 12. 測試策略

- **單元**：`src/lib/affiliates.ts` 的代碼正規化、`course_ids` 範圍判定、`commission_amount` 取整、狀態轉移合法性。
- **整合**：register API 帶有效／無效／停用代碼三路徑；webhook `order.paid` 建立分潤、重送冪等、無代碼不建分潤。
- **後台**：CRUD、狀態流轉、月結 CSV 欄位與合計正確。
- **手動驗收**：建一個測試代碼 → 帶 `?ref=` 走報名 → sandbox 付款 → 確認後台出現待結算分潤 → approve → paid → 匯出對帳單。

## 13. 上線步驟（概要）

1. 跑 migration（Supabase）。
2. 部署程式碼（Vercel，沿用既有流程）。
3. 後台建立首批代碼，先綁 `concept-monetization-bootcamp`。
4. Sandbox 走一次完整付款驗收，再對外發代碼。
