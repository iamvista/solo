# 安裝 Claude Code

這篇教你什麼：從零開始安裝 Claude Code，讓你的電腦可以執行 AI 教練系統。

---

## 步驟

### 1. 了解 Claude Code 是什麼

Claude Code 是 Anthropic 公司推出的工具，讓你在自己的電腦上直接和 Claude AI 對話、執行指令。它不是網頁，而是跑在「終端機」裡的程式。你不需要懂程式碼，只需要照步驟操作即可。

### 2. 開啟終端機（或 PowerShell）

macOS 用戶：
1. 按下鍵盤上的 Command + 空白鍵，打開 Spotlight 搜尋
2. 輸入「Terminal」
3. 按下 Enter，黑色或白色的視窗就是終端機

Windows 用戶：
1. 點選左下角「開始」按鈕
2. 搜尋「PowerShell」
3. 點選「Windows PowerShell」開啟

### 3. 確認 Node.js 是否已安裝

在終端機輸入以下指令，然後按 Enter：

```
node --version
```

如果看到類似 v18.0.0 或 v20.0.0 的數字，代表已安裝，直接跳到步驟 4。

如果看到「找不到指令」或「command not found」，請前往 nodejs.org，點選綠色的「LTS」版本下載並安裝，安裝完畢後重新開啟終端機，再次執行上面的指令確認。

### 4. 安裝 Claude Code

在終端機輸入：

```
npm install -g @anthropic-ai/claude-code
```

這會花大約 1 到 3 分鐘，看到畫面停止滾動後即完成。

### 5. 確認安裝成功

輸入：

```
claude --version
```

如果出現版本號碼，代表安裝成功。

### 6. 登入帳號

輸入：

```
claude
```

第一次執行會出現登入提示，按照畫面指示選擇登入方式，完成驗證即可。

### 7. 訂閱說明

使用 AI 教練系統需要有效的 Claude 訂閱：
- Claude Pro：每月 $20 美元，適合一般使用
- Claude Max：每月 $60 美元，適合高頻使用

前往 claude.ai 可以訂閱。

---

## 常見問題

問：裝不上去怎麼辦？

答：先確認 Node.js 版本是否在 18 以上（執行 node --version 查看）。如果是 macOS 且出現權限錯誤，可以在指令前加上 sudo，變成 sudo npm install -g @anthropic-ai/claude-code，輸入電腦密碼後再試一次。

問：我不知道我的帳號密碼？

答：登入步驟通常是跳轉到瀏覽器完成 OAuth 驗證，不需要手動輸入密碼，只需在瀏覽器中用 Google 帳號或 email 登入 Anthropic 即可。

---

## 下一步

安裝完成後，請繼續閱讀 [02-install-coach.md](02-install-coach.md)：安裝教練系統。
