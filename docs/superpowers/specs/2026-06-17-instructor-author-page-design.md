# 作者專屬頁（Instructor Author Page）設計

- 日期：2026-06-17
- 專案：solo.tw（Next.js 15 App Router / Supabase / Vercel）
- 狀態：設計定案，待寫實作計畫
- 緣起：合作老師建議「作者應該有一個專屬銷售頁，把所有課程放上面，讓忠實粉絲能存著、隨時回來看，留得住回頭客」。Vista 的核心痛點：有人私訊問會不會再開課，但訊息過幾天就不見、聯絡不到人。

## 目標（這份 spec 的範圍）

建立一個**可重用、多老師**的作者專屬頁系統，把「過去開過的課＋正在招生的課」永久陳列在一個可加書籤的網址上，並提供三種留客機制接住有意願的粉絲，解決「訊息會不見、聯絡不到回頭客」的結構性問題。

**不在這份範圍**（另開 spec）：線上課堂運營設計（進場／分組討論／出場／課後作業連結）。

## 非目標（YAGNI）

- 不做老師自助後台 CMS（老師資料先由 `workshops.ts` 維護，工程改一筆即可）。
- 不做課程回顧／集錦頁的內容（Phase 2；本期過去課只放灰階卡＋候補鈕，回顧頁先占位）。
- 不做付費訂閱、不串金流（作者頁只負責導流到既有的 `/courses/[course]/register`）。

## 網址與路由

- 作者頁：`solo.tw/t/[slug]`，例 `solo.tw/t/vista`。
  - 選 `/t/` 前綴的理由（實證,非偏好）：solo.tw **已有單字母前綴房規**——`/m/[slug]`(名單磁鐵)、`/r/[id]`、`/u/[username]`，`/t/[slug]` 完全融入;短、好記、適合口說/簡報/QR/加書籤;與根路徑那二十幾個既有頁面(about/blog/courses/community…)及 `@username` vanity 系統**零碰撞**。
  - 不選 `/vista`(根路徑)：根命名空間已擠滿真實頁面,且與 `@username` 個人檔案系統衝突,需保留字守門,風險最高。
  - 不選 `/teachers/vista`：語意較透明但變長、破壞單字母房規;透明度改由頁面大標補回即可。
- 檔案：`src/app/t/[slug]/page.tsx`（Server Component，靜態生成 + `generateStaticParams` 列出所有有 slug 的老師）。
- `generateMetadata`：標題＝「{老師名}｜{定位}」，含 OG 圖（沿用 `/og` 路由模式）。

### 與 `@username` 個人檔案（`/u/[username]`）的分工

solo.tw 已有 `solo.tw/@username`（rewrite 到 `/u/[username]`）的個人檔案系統。本作者頁**與它並存、職責切開**，避免「兩個 Vista 頁」造成混淆：

| | `@vista`（`/u/[username]`） | `/t/vista`（本 spec） |
|---|---|---|
| 本質 | solo.tw **社群帳號身分卡** | **策展式作者銷售頁** |
| 資料來源 | `profiles` 表（帳號驅動） | `workshops.ts`（編輯維護） |
| 內容 | 等級/經驗值、一人事業主階段、會員徽章、加入日期 | 過去＋現在課程、候補捕捉、追蹤、LINE |
| 誰有 | **任何註冊用戶**都有一個 | **只有老師**才有 |
| 目的 | 社群身分、遊戲化、歸屬感 | 行銷、留客、回購 |
| 維護者 | 用戶自己（設定頁） | 平台/老師（改 `workshops.ts`） |

**互連（選配,Phase 2 可做）**：`/t/vista` 頁尾可放一個低調連結「Vista 的 solo.tw 社群檔案 →`@vista`」；反向 `@vista` 若是老師,個人檔案可加「我的課程頁 →`/t/vista`」。本期不強制,先讓 `/t/vista` 獨立完整。

**未來若要合一**：可在 `profiles` 加 `instructor_slug` 欄位把兩者綁定,但屬 YAGNI,本期不做。

## 資料模型

### 1. 擴充 `src/lib/workshops.ts`

`Instructor` 介面新增（皆選填，向後相容既有資料）：

```ts
export interface Instructor {
  name: string;
  title: string;
  avatar?: string;
  url?: string;
  // 新增：
  slug?: string;        // 有 slug 才會生成作者頁，例 "vista"
  bio?: string;         // 一句定位（Hero 副標）
  longBio?: string;     // 段落式自我介紹（支援換行）
  links?: { label: string; url: string }[];  // 社群／官網連結
  lineOaUrl?: string;   // 加 LINE 好友連結，預設沿用站台 LINE OA
}
```

`Workshop.status` 擴充一個值：

```ts
status: "open" | "filling" | "full" | "coming_soon" | "ended";
```

**關鍵行為改變**：過去開過的課**不再從 `WORKSHOPS` 陣列刪除**，改標 `status: "ended"`。這是讓作者頁能長期陳列「社會證明」的前提。新增選填欄位：

```ts
cohort?: string;        // 梯次標示，例 "第 8 班"
endedNote?: string;     // 結束課的補充，例 "已開 7 梯、結訓 90+ 人"
recapUrl?: string;      // Phase 2：課程回顧頁連結（本期留空）
```

### 2. 新增資料表 `course_waitlist`（候補名單，收手機）

Supabase migration。欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | uuid PK default gen_random_uuid() | |
| course_slug | text not null | 對應 workshop id / course slug |
| instructor_slug | text | 冗餘存一份，方便依老師匯出 |
| name | text not null | |
| email | text not null | |
| phone | text | 選填但表單有欄位（normalizePhone 驗證，比照報名表） |
| source_page | text | 來源頁 |
| created_at | timestamptz default now() | |

- 唯一鍵：`(course_slug, email)` → upsert 去重。
- RLS：關閉公開讀；寫入走 service client（比照 `lead_captures` 模式）。
- 索引：`(instructor_slug)`、`(course_slug)`、`(created_at)`。

### 3. 「追蹤這位老師」重用 `newsletter_subscribers`

不新建表。呼叫既有 `/api/newsletter/subscribe`，帶：

- `source: "instructor-follow"`
- `tags: ["instructor:{slug}"]`
- email-only（低摩擦，與付費／候補的高意願表單區隔）。

## 頁面結構（`/t/[slug]`，由上到下）

1. **老師 Hero**：`avatar` 大頭照、`name`、`bio` 一句定位、`longBio` 段落、`links` 社群鈕。右側／下方一組行動：
   - 「追蹤這位老師」訂閱（email 一欄，送 → newsletter）。
   - 「加 LINE」按鈕（`lineOaUrl`）。
2. **正在招生**（`status` ∈ open/filling/full）：醒目大卡，CTA →`/courses/[id]/register`（沿用上週打通的報名流程）。`full` 顯示「已額滿」並改顯示候補鈕。
3. **即將開課**（`coming_soon`）：預告卡 +「開賣通知我」（→候補表單，course_slug 帶 coming_soon 課）。
4. **過去開過的課**（`ended`）：灰階卡，標 `cohort`／`endedNote` 當社會證明，每張附「**通知我下一梯**」候補鈕（→`WaitlistForm`）。`recapUrl` 有值才顯示「課程回顧」連結（本期都沒有）。

空狀態：某分組沒有課則整段不渲染。

## 元件拆分（每個單一職責）

- `src/app/t/[slug]/page.tsx` — 取老師＋篩課＋分組，組裝頁面（Server）。
- `src/components/instructor/InstructorHero.tsx` — Hero 區（Server，內含兩個 client 行動元件）。
- `src/components/instructor/FollowButton.tsx` — Client；email 一欄 → POST `/api/newsletter/subscribe`。
- `src/components/instructor/CourseCard.tsx` — 單張課程卡，依 status 切換樣式與 CTA（Server，候補鈕內嵌 client）。
- `src/components/instructor/WaitlistForm.tsx` — Client；名字＋Email＋手機（手機 onBlur 即時驗證，比照 `CourseRegistrationForm`）→ POST `/api/courses/waitlist`。可用 modal 或 inline 展開。

## API

### 新增 `POST /api/courses/waitlist`

- 公開、免登入；rate limit（比照 `lead-magnets/capture`：每 IP 每分鐘 10 次）。
- body：`{ course_slug, instructor_slug?, name, email, phone?, source_page? }`。
- 驗證：email regex；phone 有填則過 `normalizePhone`（`@/lib/phone`），不合法回 400。
- 寫入：`course_waitlist` upsert（onConflict `course_slug,email`）。
- 同步：也寫一筆 `newsletter_subscribers`（`source: "waitlist"`, `tags: ["waitlist:{course_slug}"]`），讓候補者進電子報池。
- 回應統一訊息避免 email 枚舉。
- （選配）寄一封確認信「已記下你，下一梯開課第一個通知你」——可 Phase 2。

### 重用 `POST /api/newsletter/subscribe`（追蹤老師，不改後端）

## 後台檢視

- 既有 `/admin/enrollments` 是付費名單。候補名單需要能看：
  - 新增 `/admin/waitlist` 頁（isAdmin gated，比照 enrollments 頁），可依 `instructor`／`course` 篩選，顯示 name/email/phone/course/建立時間。
  - 新增 `/api/admin/waitlist/export` CSV（UTF-8 BOM，比照 enrollments export）。
- `/admin` 首頁加一條連結「📋 候補名單」。

## 老師資料初始化（本期）

- `vista` 補上 `slug: "vista"` + bio + longBio + links（從 about 頁既有文案取）。
- 既有過去課（已從陣列刪除的）本期**不回溯重建**；先讓現有四堂課中已結束者標 `ended`，未來課程結束就改標而非刪除（寫進 workshops.ts 的維護註解）。
- 其他老師（余文皓／駱潤生／研究院三師）本期可選擇性補 slug；至少先讓 vista 頁完整可動。

## 錯誤處理

- 表單：rate limit 429、欄位驗證 400、寫入失敗 500，皆回中文訊息；前端顯示 inline 錯誤（紅字），成功顯示確認態。
- 手機 inline 驗證沿用 `CourseRegistrationForm` 的 onBlur + `normalizePhone` 模式。
- `/t/[slug]` 找不到老師 → `notFound()`（404）。

## 測試

- 單元：`/api/courses/waitlist` 的驗證分支（缺欄位、email 格式、phone 不合法、upsert 去重、rate limit）。比照既有 `consulting-db.test.ts` 風格。
- 整合／手動：build 後 headless 開 `/t/vista`，驗證三分組渲染、候補表單送出寫入 Supabase、追蹤鈕寫入 newsletter、admin 看得到、CSV 匯得出。
- 驗證後才 push（部署沿用 solo 既有流程：`git push origin main` → Vercel 自動部署）。

## 分期

- **Phase 1（本期）**：資料模型擴充 + `course_waitlist` 表 + `/t/[slug]` 頁 + 三留客機制 + admin 候補頁/匯出 + vista 頁上線。
- **Phase 2（之後）**：課程回顧／集錦頁（`recapUrl`）、候補確認信、其他老師頁、回溯補歷史課。

## 開放問題（實作前確認）

- vista 的 `longBio`／社群連結文案，是沿用 `/about` 還是另寫精簡版？（實作時先抓 about 草擬，給 Vista 過目）
- 既有四堂課目前是否有「已結束」的要先標 `ended`？（實作時對照日期，2026-06-17 之前者標 ended）
