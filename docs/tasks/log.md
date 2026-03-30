# 任務紀錄

| 時間 | 角色 | 動作 | 檔案 | 結果 |
|------|------|------|------|------|
| 2026-03-30 | PM | 需求分析：課程列表頁重新設計 | — | 4 個 User Story (P0x2, P1x1, P2x1) |
| 2026-03-30 | Tech Lead | 架構設計：頁面拆分 + 圖片生成策略 | — | Server + Client 組件架構 |
| 2026-03-30 | Frontend | 生成 6 張 AI 封面圖 | public/images/workshops/cover-*.webp | 6 張 WebP (22-72 KB) |
| 2026-03-30 | Frontend | 建立 CourseFilters 組件 | src/app/courses/CourseFilters.tsx | 分類篩選 + 卡片 + Featured 組件 |
| 2026-03-30 | Frontend | 重寫課程列表頁 | src/app/courses/page.tsx | 全新 Hero + 頁面結構 |
| 2026-03-30 | Frontend | 修正 turbopack root | next.config.ts | 加入 turbopack.root |
| 2026-03-30 | Tech Lead | Code Review | CourseFilters.tsx, page.tsx | 2 Critical 修正, ARIA 補強 |
| 2026-03-30 | QA | 驗收測試 | — | 16/16 標準通過 |
| 2026-03-30 | DevOps | 部署 | git push main | ca65dc5 deployed |
