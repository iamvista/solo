# Solo.tw 開發日誌

## [2026-02-06] 部落格圖片修復與架構整理

### 時間戳記
- 開始時間：2026-02-06 17:00 (UTC+8)
- 完成時間：2026-02-06 18:20 (UTC+8)

### 部署架構確認
- **正式環境**：Vercel（專案名稱：`solo`）
- **網域**：www.solo.tw / solo.tw
- **本地專案**：`/Users/vista/Documents/My_AI_Projects/solo-tw`

### 本次變更

#### 1. 圖片修復
從 vista-official-site 複製 30 張缺失的圖片到 `public/images/blog/`：

**小船創業系列 (9張)**
- littleboat-5th-anniversary-hero.webp
- littleboat-5th-time-freedom.webp
- littleboat-5th-idea-blueprint.webp
- littleboat-5th-value-threshold.webp
- littleboat-5th-positioning.webp
- littleboat-5th-reverse-marketing.webp
- littleboat-5th-consulting-close.webp
- littleboat-5th-auto-sales.webp
- littleboat-5th-product-manager.webp

**利潤覺醒系列 (10張)**
- profit-awakening-*.webp

**其他圖片 (11張)**
- cheng-junde-speaking.webp
- honnold-career-ladder-hero.webp
- vibe-coding-manifesto.webp
- 一人企業模型.webp
- 你就是利基的市場.webp
- 兩個時代的典範對比.webp
- 兩種創業路徑對比.webp
- 創意博物館系統.webp
- 創意密度篩選流程.webp
- 多種興趣的價值轉化.webp
- 知識複利效應.webp
- 通才型人才的競爭優勢.webp

#### 2. 文章修改
- 重新命名：`littleboat-5th-anniversary-online-business.md` → `littleboat-startup.md`
- 修復 14 篇文章的空 `heroImage: >-` 格式問題

#### 3. 清理錯誤設定
- 刪除錯誤創建的 Cloudflare Pages 專案 `solo-tw`
- 確認 Vercel 專案連結正確（專案：`solo`）

### 驗證結果
- ✅ 本地圖片：94 張
- ✅ 線上圖片：全部正常 (HTTP 200)
- ✅ 文章頁面：全部正常
- ✅ Vercel 部署：成功

### 部署指令
```bash
cd /Users/vista/Documents/My_AI_Projects/solo-tw
npx vercel --prod
```

### 注意事項
1. **不要使用 Cloudflare Pages 部署此專案**，solo.tw 已綁定 Vercel
2. 確保 `.vercel/project.json` 指向正確專案 `solo`
3. 新增圖片時，放在 `public/images/blog/` 目錄

---

## 開發環境資訊
- Node.js: 24.x
- Next.js: 16.1.6
- 套件管理：pnpm
- 部署平台：Vercel (付費方案)
