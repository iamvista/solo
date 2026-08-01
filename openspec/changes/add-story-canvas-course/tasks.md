# Tasks: add-story-canvas-course

## 1. 頁面骨架與資料來源

- [ ] 1.1 〔需求：故事骨架工作坊擁有可獨立成交的銷售頁〕建立 `src/app/courses/story-canvas/page.tsx`，區塊順序為 Hero、問題、課程內容、課綱、講師、適合對象、FAQ、報名區。行為：直接開啟 `/courses/story-canvas` 回應 200 並依序呈現七個區塊。驗收：`npm run build` 通過，且本機 `curl -s localhost:3000/courses/story-canvas | grep` 找得到七個區塊各自的標題文字。
- [ ] 1.2 頁面所有梯次數值改讀 `getWorkshopBySlug("story-canvas")`，不在頁面內寫死日期、時間、名額與價格。行為：改 `workshops.ts` 的日期或價格後，頁面顯示同步變動。驗收：把 `capacity` 暫時改成 21 重建，頁面顯示 21，改回後顯示 20。

## 2. 課程內容

- [ ] 2.1 〔需求：課綱以骨架卡的五欄為骨幹〕撰寫課綱五段，對應骨架卡的對象切片、轉折點、定位句骨架、證據欄、轉述測試，每段寫明現場產出什麼。行為：已下載骨架卡的讀者能一一對應。驗收：與 `stories-tw/content/magnet/一人公司的故事骨架卡_v1.md` 的五個欄位標題逐項比對，五項全中。
- [ ] 2.2 撰寫「適合／不適合」兩欄，不適合欄 MUST 真的勸退（例如只想要範本、不願意當場唸出來的人）。行為：讀者看得出這堂課會要求他開口。驗收：內容審閱，不適合欄至少三條且每條都是具體行為而非態度形容。
- [ ] 2.3 撰寫 FAQ 至少六題，MUST 含「沒填完卡可以來嗎」「一個人做不行嗎」「額滿怎麼辦」「可以退費嗎」。行為：常見疑慮在頁面上得到回答。驗收：內容審閱，六題到齊且退費規則與站上其他課頁一致。
- [ ] 2.4 全頁用字過 `zhtw` 規範：臺不用台、禁單線 em dash、雙線破折號全篇上限 3 處、中文段落不用半形標點。驗收：對檔案跑用字檢查，零違規。

## 3. 報名動線

- [ ] 3.1 〔需求：銷售頁誠實標示本期報名方式〕報名區接上 `CourseNotifyEntry` 與 `CourseNotifyFooter`，`sourcePage` 分別標示銷售頁與頁尾兩個入口。行為：送出 E-mail 後寫入 `course_waitlist`，後臺分得出來自哪個入口。驗收：本機送一筆測試候補，查 D1 確認 `source_page` 為 `/courses/story-canvas` 與 `/courses/story-canvas#footer`，驗完刪除該筆。
- [ ] 3.2 報名區文案明講本期尚未開放報名、留 E-mail 會第一批通知，頁面不得出現付款欄位或「立即付款」類文案。驗收：全頁搜尋「付款」「匯款」「立即報名」零命中。

## 4. 機器可讀資料

- [ ] 4.1 〔需求：銷售頁具備與其他課頁一致的機器可讀資料〕掛上 `courseSchema`、`breadcrumbSchema`、`faqSchema`，欄位值取自 `workshops.ts`。驗收：本機頁面原始碼含三段 `application/ld+json`，且課程日期與 `workshops.ts` 一致。
- [ ] 4.2 建立 `src/app/courses/story-canvas/og/route.tsx`，比照現有課頁 OG 路由。行為：分享連結時取得含課名與梯次日期的預覽圖。驗收：本機開啟 `/courses/story-canvas/og` 回傳圖片，肉眼確認課名與日期正確。

## 5. 審閱與公開

- [ ] 5.1 〔需求：課程的公開與隱藏由單一旗標決定〕保持 `story-canvas` 的 `hidden: true` 推上線，交 Vista 審閱文案。行為：`/courses/story-canvas` 可直接開啟，但 `/courses`、`/teachers/vista`、`sitemap.xml`、`llms.txt` 都不含這門課。驗收：線上以 `curl -H "Cache-Control: no-cache"` 逐一確認，銷售頁 200、四個露出面零命中。
- [ ] 5.2 Vista 核可文案後移除 `hidden`、`status` 改 `open`、`url` 改回 `/courses/story-canvas`。驗收：線上四個露出面都出現這門課，且 `/courses` 列表的課程數加一。
- [ ] 5.3 更新 stories.tw 序列第 4、5 封的 CTA 為銷售頁網址，並以 `REPLACE()` 對 D1 `automation_steps` 同步（主檔是 `INSERT OR IGNORE`，重跑不生效）。驗收：查 D1 兩列，通知頁網址 0 處、銷售頁網址各 1 處。
