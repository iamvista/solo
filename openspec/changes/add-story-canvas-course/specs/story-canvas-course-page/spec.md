## ADDED Requirements

### Requirement: 故事骨架工作坊擁有可獨立成交的銷售頁

系統 SHALL 在 `/courses/story-canvas` 提供這門課的銷售頁。該頁 MUST 讓一位從未讀過培育序列的訪客，只看這一頁就能判斷要不要報名：課程解決什麼問題、上完帶走什麼、誰適合來、誰不適合、時間地點價格、以及如何報名。

頁面 MUST 沿用站上既有課頁的區塊與元件慣例，不另建一套視覺系統。

#### Scenario: 訪客直接開啟銷售頁

- **WHEN** 訪客未經任何 E-mail 直接開啟 `/courses/story-canvas`
- **THEN** 頁面回應 200，且依序呈現課程定位、要解決的問題、課程內容與課綱、講師、適合與不適合的對象、常見問題、報名區

#### Scenario: 梯次資訊只有單一來源

- **WHEN** 頁面需要顯示日期、時間、地點、名額、原價與早鳥價
- **THEN** 這些值 MUST 取自 `src/lib/workshops.ts` 的 `story-canvas` 條目，頁面 MUST NOT 另行寫死一份

##### Example: 本梯數值

- **GIVEN** `story-canvas` 的 `date` 為 `2026 年 10 月 18 日（日）`、`time` 為 `9:00–12:00`、`capacity` 為 `20`
- **AND** `price.original` 為 `5000`、`price.earlyBird` 為 `3600`、`price.earlyBirdDeadline` 為 `2026/9/18`
- **THEN** 頁面顯示的梯次資訊與上述值一致，換梯時只需改 `workshops.ts` 一處

### Requirement: 課程主軸是敘事成交，不是定位收斂

站上已有一堂以定位收斂為主軸的工作坊。本課程 MUST 以「故事如何帶來詢價與成交」為主軸，SHALL NOT 以產出一句話定位為課程賣點或結業產出，避免兩門課互相排擠。

課綱 SHALL 由四個模組構成：挑出成交故事、把故事放進四個賣點位置、讓敘事有感的改寫、雙層轉述測試。《一人公司的故事骨架卡》的五欄 MAY 作為第一個模組的工作表出現，但 MUST NOT 成為整堂課的架構。

頁面 SHALL NOT 提及另一堂課的名稱或講師。

#### Scenario: 讀者比較兩堂課

- **WHEN** 一位同時看過站上定位收斂工作坊的讀者閱讀本頁
- **THEN** 本頁的對象、產出與驗收方式都指向成交，讀者辨認得出兩堂課解決的不是同一個問題
- **AND** 本頁沒有出現另一堂課的名稱或講師

#### Scenario: 課綱說明現場產出

- **WHEN** 讀者閱讀任一課綱模組
- **THEN** 該模組說明現場會完成什麼具體產出，且四個模組合起來涵蓋開場鉤子、見證改寫、報價說明與售後追單四個位置

### Requirement: 驗收判準有兩層，第二層對準成交

頁面 SHALL 把課程驗收寫成兩層：聽者能否用自己的話複述，以及聽者聽完是否會想詢問價格。第二層 MUST 被明確標示為真正的過關條件，第一層 MUST 被標示為僅是及格。

#### Scenario: 讀者理解驗收方式

- **WHEN** 讀者閱讀判準區塊
- **THEN** 兩層判準同時呈現，且文字明確指出只過第一層不算過關

##### Example: 判準文字

- **GIVEN** 判準區塊
- **THEN** 內容包含「他能不能用自己的話再講一次」與「他聽完會不會想問多少錢」兩問，並說明第一層只算及格

### Requirement: 銷售頁誠實標示本期報名方式

本期 SHALL NOT 提供線上刷卡。報名區 MUST 明確告知報名尚未開放、留下 E-mail 會在開放時第一批通知，MUST NOT 出現任何暗示可立即付款的按鈕文案。

報名按鈕 SHALL 導向既有的候補表單元件，且 MUST 集中在單一位置，使日後接上金流時只需替換該處。

#### Scenario: 訪客按下報名

- **WHEN** 訪客點擊報名區的主要行動按鈕
- **THEN** 系統呈現候補表單，收下 E-mail 並寫入 `course_waitlist`
- **AND** 頁面 MUST NOT 顯示付款欄位、匯款帳號或「立即付款」類文案

#### Scenario: 日後接上金流

- **WHEN** 這一期決定開賣並建立付款連結
- **THEN** 只需替換報名區的行動按鈕去處，頁面其餘區塊 MUST NOT 需要改動

### Requirement: 銷售頁具備與其他課頁一致的機器可讀資料

頁面 SHALL 輸出 `courseSchema`、`breadcrumbSchema` 與 `faqSchema` 結構化資料，並 SHALL 提供專屬 OG 圖路由 `/courses/story-canvas/og`。

#### Scenario: 搜尋引擎解析頁面

- **WHEN** 檢索器抓取 `/courses/story-canvas`
- **THEN** 頁面含有課程、麵包屑與常見問題三種結構化資料，且欄位值與 `workshops.ts` 一致

#### Scenario: 連結被分享到社群

- **WHEN** 頁面網址被貼到社群平臺
- **THEN** 平臺取得 `/courses/story-canvas/og` 產生的預覽圖，圖上含課程名稱與梯次日期

### Requirement: 課程的公開與隱藏由單一旗標決定

在銷售頁尚未定稿前，`story-canvas` SHALL 維持 `hidden: true`，此時該課 MUST NOT 出現在 `/courses` 列表、講師頁、`sitemap.xml` 與 `llms.txt`，但 `/courses/story-canvas` 與 `/courses/story-canvas/notify` 兩個網址 MUST 可直接開啟以供審閱。

銷售頁定稿後，取消 `hidden` SHALL 是唯一需要的公開動作。

#### Scenario: 審閱期間

- **WHEN** `story-canvas` 的 `hidden` 為 `true`
- **THEN** `/courses` 列表、`/teachers/vista`、`sitemap.xml`、`llms.txt` 都不含這門課
- **AND** 直接開啟 `/courses/story-canvas` 仍回應 200

#### Scenario: 正式公開

- **WHEN** 將 `hidden` 移除且 `status` 改為 `open`
- **THEN** 四個露出面同時收錄這門課，無須改動其他檔案
