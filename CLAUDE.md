<!-- SPECTRA:START v1.0.1 -->
# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `/spectra:*` skills when:

- A discussion needs structure before coding → `/spectra:discuss`
- User wants to plan, propose, or design a change → `/spectra:propose`
- Tasks are ready to implement → `/spectra:apply`
- There's an in-progress change to continue → `/spectra:ingest`
- User asks about specs or how something works → `/spectra:ask`
- Implementation is done → `/spectra:archive`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? Plan mode → `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `/spectra:apply` and `/spectra:ingest` skills handle parked changes automatically.
<!-- SPECTRA:END -->

---

# Harness 設定

## 啟用角色
- frontend
- backend
- qa
- devops

## 專案規則
- 使用 Spectra SDD 流程時，Harness 工作流自動跳過 PM 階段（由 Spectra 處理需求）
- 所有回覆使用繁體中文，用「臺」不用「台」

## 關鍵檔案（追加）
- openspec/specs/**
- openspec/changes/**

## 關鍵檔案（排除）
- node_modules/**
- .next/**

## 部署設定
- 方式：git push
- 自動部署：false

## 備註
- 本專案同時使用 Spectra（Spec-Driven Development）和 Harness 工程系統
- Spectra 負責需求規格管理，Harness 負責團隊角色協作和品質護欄
- 當兩者並用時：Spectra 的 propose/discuss 取代 PM 角色，後續由 Tech Lead 接手架構設計

---

# solo.tw 站臺規則

> **先讀 `~/.claude/ops/sites-shared.md`**（站臺共用規則：版控與併行紀律、部署後驗證、資產版號、中文寫作細則、視覺通則）。
> 以下只寫 solo.tw 跟其他站不一樣的地方。兩邊衝突以本檔為準，並回報衝突。

## Tech Stack

- Next.js，部署在 **Vercel**（七條線裡唯一不在 Cloudflare 的）
- `prebuild` 會跑 `scripts/generate-llms.mjs` 產生 llms.txt
- 設定在 `vercel.json`

## 🚨 付費內容不進 git

付費商品的檔案走 Vercel Blob store `solo-private`，靠 token ＋ proxy stream 供應，**絕對不要 commit 進 repo**。加新的付費教材時先確認它進的是 Blob 而不是 `public/`。

## 金流與報名

- 金流走 Recur。真的有刷卡要看 Recur 的 order，不能只看報名紀錄
- 報名狀態 `pending` 不等於已付款，判讀前先讀 `reference_solo_enrollment_pending` 那份 memory
- Recur 的三個限制：SDK 不支援 amount 覆寫、metadata 不會進 webhook、slug 建立後改不了
- **新梯次一律建新的 Recur 商品**，不要沿用舊商品改日期

## 課程資料

課程改期或改內容 MUST 同步 `src/lib/workshops.ts` 與清單頁，只改其中一邊會讓列表跟詳情對不上。

### 開新梯次的完整清單（缺一都會出事）

1. `src/lib/workshops.ts`：新增或更新該課的 `date`／`sortDate`／`status`
2. `src/lib/courses-config.ts`：新增 `cohorts[]` 期別與該期別的 `productIds`；NEVER 就地改舊期別的日期（已有人付款時會讓兩梯學員共用同一個 `cohort_key`）
3. Recur：`create_product` 建**全新商品**，slug 一次取對（`<課程代號>-<期別>-<開課日 YYYYMMDD>`），舊梯次商品設 `active: false`
4. **Google Calendar：建立該梯次的行事曆事件**（開課日、實際時段、地點；描述欄放課程頁網址與名額）

第 4 項是 2026-08-15 補的。當天早上晨間簡報才發現 Vibe Coding 第 8 班排在 `workshops.ts` 與 Recur 裡、行事曆卻空白，等於系統認為有課、人不知道。管家的晨間簡報只查行事曆，行事曆沒有的課就不會被提醒，開課日當天才發現已經來不及。

### 梯次結束後

課程日期一過，MUST 把該梯的 Recur 商品設 `active: false`。過期梯次留著 active 會讓商品列表持續累積無效品項，也可能被直接結帳。

## 追蹤

Meta 轉換追蹤走 Pixel ＋ CAPI 雙軌，動追蹤碼前確認兩邊都改到。

## Vercel 雷點

- `vercel env add preview` 之前要先把分支推上去，否則會噴 `git_branch_required`
- Ignored Build Step 會把 empty commit 判成不用建置，狀態顯示 `CANCELED`
