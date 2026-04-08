# 安裝教練系統

這篇教你什麼：把下載的 AI Coach Kit 解壓縮並完成安裝，讓教練系統在你的電腦上就位。

---

## 步驟

### 1. 找到下載的壓縮檔

你應該已經下載了一個名為 ai-coach-kit.zip 的檔案，通常會在「下載」資料夾（Downloads）裡。

### 2. 解壓縮

macOS 用戶：
1. 前往「下載」資料夾
2. 找到 ai-coach-kit.zip
3. 雙擊它，系統會自動解壓縮成一個叫做 ai-coach-kit 的資料夾

Windows 用戶：
1. 在檔案上按右鍵
2. 選擇「全部解壓縮」
3. 選擇目的地（預設就是下載資料夾），點選「解壓縮」

### 3. 開啟終端機

參考第一篇教學開啟 Terminal（macOS）或 PowerShell（Windows）。

### 4. 切換到 ai-coach-kit 資料夾

在終端機輸入以下指令並按 Enter：

```
cd ~/Downloads/ai-coach-kit
```

如果你把壓縮檔解壓縮到其他地方，請將 ~/Downloads/ai-coach-kit 換成實際路徑。例如解壓縮到桌面，就輸入 cd ~/Desktop/ai-coach-kit。

確認是否在正確資料夾，輸入：

```
ls
```

應該會看到 install.sh、coach/、config.md 等檔案和資料夾。

### 5. 執行安裝腳本

輸入以下指令並按 Enter：

```
bash install.sh
```

安裝過程約需 30 秒到 1 分鐘。安裝成功後，你會看到類似這樣的訊息：

```
AI Coach Kit 安裝完成！
已安裝以下技能：
  - solo-coach（核心教練）
  - solo-coach-morning（晨間覆盤）
  - solo-coach-checkin（下午 check-in）
  - solo-coach-weekly（週報總結）
工作空間已建立：~/solo-workspace
```

### 6. 切換到工作空間

安裝完成後，往後你都要在工作空間資料夾裡使用教練：

```
cd ~/solo-workspace
```

這就是你和教練每天互動的根據地。

---

## 常見問題

問：install.sh 跑不動，出現錯誤怎麼辦？

答：最常見的原因是你不在正確的資料夾裡。請確認你已經執行了 cd ~/Downloads/ai-coach-kit（步驟 4），然後再試一次 bash install.sh。可以用 pwd 指令確認目前所在路徑，它會顯示你現在在哪個資料夾。

問：安裝完之後 ~/solo-workspace 在哪裡？

答：它在你的使用者根目錄下，也就是 /Users/你的名字/solo-workspace（macOS）或 C:\Users\你的名字\solo-workspace（Windows）。你也可以直接在終端機輸入 cd ~/solo-workspace 就能切換過去。

---

## 下一步

安裝完成後，請繼續閱讀 [03-first-session.md](03-first-session.md)：第一次啟動教練。
