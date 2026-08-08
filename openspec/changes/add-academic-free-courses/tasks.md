# Tasks: add-academic-free-courses

## 1. 資料

- [ ] 1.1 在 `page.tsx` 既有常數區新增 `freeMiniCourses` 陣列，欄位為 title、scale、summary、url
- [ ] 1.2 三筆資料的 url 對應 MCG 三個 Module 的公開網址

## 2. 區塊

- [ ] 2.1 在「這堂課適合你嗎？」section 之後插入新 section，沿用既有的 `border-t py-14 sm:py-16` 版式
- [ ] 2.2 標題與導言：說明這是免費、自訂進度、不需報名的入口
- [ ] 2.3 三張課程卡片，沿用既有 Card 元件與間距慣例
- [ ] 2.4 對照說明：免費課給判斷力、工作坊給模板與帶練
- [ ] 2.5 外連一律 `target="_blank" rel="noopener noreferrer"`

## 3. 驗證

- [ ] 3.1 `pnpm build` 通過，無 TypeScript 錯誤
- [ ] 3.2 用字檢查：無異體寫法的「臺」、無半形中文標點
- [ ] 3.3 確認未動到報名區、價格與梯次資訊
- [ ] 3.4 push 後以 curl 驗線上頁面含新區塊，三個外連皆回 200
