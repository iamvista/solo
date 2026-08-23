# 任務紀錄

| 時間 | 角色 | 動作 | 檔案 | 結果 |
|------|------|------|------|------|
| 2026-03-30 | PM | 需求分析：課程列表頁重新設計 | — | 4 個 User Story (P0x2, P1x1, P2x1) |
| 2026-04-04 | PM | 需求分析：課程頁面更新與新增 | — | 5 個 User Story |
| 2026-04-04 | Tech Lead | 架構設計：sortDate 排序 + 2 新頁面 | — | 6 檔案變更清單 |
| 2026-04-04 | Frontend | 更新 workshops.ts：加 sortDate、更新 3 課程資料 | src/lib/workshops.ts | ✅ 完成 |
| 2026-04-04 | Frontend | 更新 CourseFilters.tsx：加入日期降序排列 | src/app/courses/CourseFilters.tsx | ✅ 完成 |
| 2026-04-04 | Frontend | 更新 ai-social-content：日期→5/3、報名 URL | src/app/courses/ai-social-content/page.tsx | ✅ 完成 |
| 2026-04-04 | Frontend | 新建 ai-content 課程頁面（含學員口碑） | src/app/courses/ai-content/page.tsx | ✅ 完成 |
| 2026-04-04 | Frontend | 新建 vibe-coding 課程頁面（含作品展示） | src/app/courses/vibe-coding/page.tsx | ✅ 完成 |
| 2026-04-04 | Frontend | 圖片轉換 jpg→webp | public/images/workshops/testimonial-ai-content.webp | ✅ 完成 |
| 2026-04-04 | QA | Build 驗證 | — | ✅ Build 成功 |
| 2026-03-30 | Tech Lead | 架構設計：頁面拆分 + 圖片生成策略 | — | Server + Client 組件架構 |
| 2026-03-30 | Frontend | 生成 6 張 AI 封面圖 | public/images/workshops/cover-*.webp | 6 張 WebP (22-72 KB) |
| 2026-03-30 | Frontend | 建立 CourseFilters 組件 | src/app/courses/CourseFilters.tsx | 分類篩選 + 卡片 + Featured 組件 |
| 2026-03-30 | Frontend | 重寫課程列表頁 | src/app/courses/page.tsx | 全新 Hero + 頁面結構 |
| 2026-03-30 | Frontend | 修正 turbopack root | next.config.ts | 加入 turbopack.root |
| 2026-03-30 | Tech Lead | Code Review | CourseFilters.tsx, page.tsx | 2 Critical 修正, ARIA 補強 |
| 2026-03-30 | QA | 驗收測試 | — | 16/16 標準通過 |
| 2026-03-30 | DevOps | 部署 | git push main | ca65dc5 deployed |
| 2026-03-30 | PM | 需求分析：solo.tw 首頁改版 + 商業模式評估 | docs/tasks/competitive-analysis.md | 6 個 User Story, 競品分析, 營收模型 |
| 2026-03-30 | Tech Lead | 架構設計：首頁改版 + PAYUNi 金流 + Cal.com | — | 5 Batch 分批實作計畫 |
| 2026-03-30 | Frontend | Batch 1 首頁改版：新增 5 個區塊 | PainPoint/Services/DiagnoseEntry/SocialProof/LatestContent | 9 區塊服務導向首頁 |
| 2026-03-30 | Frontend | 改寫 HeroSection + CTASection | HeroSection.tsx, CTASection.tsx | 個人品牌導向 |
| 2026-03-30 | Frontend | 新增 /consulting + /products 頁面 | src/app/consulting, src/app/products | 諮詢頁 + 產品即將推出頁 |
| 2026-03-30 | Frontend | 建立共用常數檔 | src/lib/constants.ts | 社會證明數字統一管理 |
| 2026-03-30 | Tech Lead | Code Review | 全部 Batch 1 檔案 | 移除不必要 use client, 統一 icon, aria 修復 |
| 2026-03-30 | QA | 驗收測試 | — | Desktop + Mobile 通過, 5 個 404 修復 |
| 2026-03-30 | DevOps | 部署 | git push main | 84a160d deployed |
| 2026-08-23 14:30 | PM | 確認 solo.tw SEO、AEO、GEO 優化範圍 | - | 完成 |
| 2026-08-23 14:35 | Tech Lead | 確認 sitemap、入門指南、可信度頁與 LLM 索引方案 | - | 完成 |
| 2026-08-23 14:45 | Frontend | 升級入門指南，新增內容方法與編輯政策 | `src/app/learn/`、`src/app/methodology/`、`src/app/editorial-policy/` | 完成 |
| 2026-08-23 14:45 | Backend | 精簡 sitemap 並補強 LLM 信任與引用邊界 | `src/app/sitemap.ts`、`scripts/generate-llms.mjs` | 完成 |
| 2026-08-23 14:50 | Tech Lead | Review Schema 關係、可信日期與產生器冪等性 | 全部本輪變更 | 通過，修正 WebSite 懸空參照 |
