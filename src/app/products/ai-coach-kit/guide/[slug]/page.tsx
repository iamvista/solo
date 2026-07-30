import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

// ── Guide Content ─────────────────────────────────────────────────────────────

interface GuideEntry {
  slug: string;
  title: string;
  content: string;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

const guideSlugs = [
  "choose-method",
  "desktop-setup",
  "install-claude-code",
  "install-coach",
  "first-session",
  "daily-loop",
  "build-your-own",
  "notebooklm",
];

const guideData: Record<string, { title: string; body: string }> = {
  "choose-method": {
    title: "選擇你的安裝方式",
    body: `## 兩種方式，同一套教練

AI 教練工坊支援兩種使用方式，效果完全一樣。

### 方式 A：Claude Desktop App（推薦新手）

- 不需要打開終端機
- 不需要輸入任何指令
- 用滑鼠拖拉就能完成
- 大約 10 分鐘搞定

### 方式 B：Claude Code CLI（進階用戶）

- 用終端機安裝，一行指令搞定
- 支援排程自動化
- 適合已經會用 Claude Code 的人

## 不確定選哪個？

如果你從來沒打開過「終端機」或「命令列」，選方式 A。

如果你已經在用 Claude Code，選方式 B。

兩種方式裝完的結果一樣——都能用 AI 教練。`,
  },
  "desktop-setup": {
    title: "用 Claude Desktop App 設定教練（不需要終端機）",
    body: `## 前置準備

1. 到 claude.ai/download 下載 Claude Desktop App（macOS / Windows 都有）
2. 安裝後用你的 Claude 帳號登入
3. 需要 Claude Pro（$20 USD/月）或 Max 方案
4. 解壓縮你下載的 ai-coach-kit.zip

## Step 1：建立 Project

1. 打開 Claude Desktop App
2. 點左側欄的「Projects」（專案）
3. 點「Create Project」（建立專案）
4. 取名為「AI 教練」

## Step 2：加入教練設定檔

在 Project 設定頁面，找到「Project Knowledge」區塊：

1. 點「Add Content」
2. 把以下檔案拖進去：
   - coach/vista-coach.md
   - coach/_template.md
   - coach/_progress-template.md

## Step 3：加入 Coach Skills

繼續在「Project Knowledge」加入：

1. skills/solo-coach.md
2. skills/solo-coach-morning.md
3. skills/solo-coach-checkin.md
4. skills/solo-coach-weekly.md

## Step 4：設定 Custom Instructions

在 Project 設定中找到「Custom Instructions」，貼入以下內容：

「你是一位 AI 實踐教練。請先讀取 Project Knowledge 中的教練設定檔（vista-coach.md 或其他教練設定），然後按照設定中的 Workflow 步驟執行。當使用者說『教練早安』，參考 solo-coach-morning.md 的流程。當使用者說『check-in』，參考 solo-coach-checkin.md。當使用者說『週報』，參考 solo-coach-weekly.md。所有輸出使用繁體中文。」

## Step 5：開始使用

1. 在 Project 中開啟新對話
2. 輸入：「啟動教練」
3. 教練會問你 3 個問題
4. 回答完畢，你的 AI 教練就啟動了

## 每日使用

- 早上：輸入「教練早安」
- 下午：輸入「check-in」或「回報進度」
- 週日：輸入「週報」

## 進度追蹤小技巧

每次教練產出進度報告時，複製內容貼到一個本地文字檔（例如桌面的 progress.txt）。下次對話時把最新進度貼進去，教練就能接續。

## 常見問題

Q：跟 CLI 版本有什麼差別？
A：功能一樣。CLI 版可以自動讀寫進度檔和支援排程，Desktop 版需要手動複製貼上進度。之後想升級隨時可以。`,
  },
  "install-claude-code": {
    title: "安裝 Claude Code CLI",
    body: `## 什麼是 Claude Code？

Claude Code 是 Anthropic 推出的命令列工具，讓你在終端機中直接跟 Claude AI 對話和協作。它比桌面版更強大，支援自動讀寫檔案和排程。

## 系統需求

- macOS、Windows 或 Linux
- Node.js 18 以上版本

## 安裝步驟

### 1. 打開終端機

- macOS：按 Command + 空白鍵，輸入「Terminal」，按 Enter
- Windows：按 Windows 鍵，輸入「PowerShell」，按 Enter

### 2. 確認 Node.js 已安裝

在終端機輸入：

node --version

如果看到版本號（例如 v24.14.1），就沒問題。

如果顯示「command not found」，到 nodejs.org 下載安裝。

### 3. 安裝 Claude Code

在終端機輸入：

npm install -g @anthropic-ai/claude-code

等待安裝完成。

### 4. 確認安裝成功

claude --version

看到版本號就代表安裝成功。

### 5. 登入

輸入 claude，按照畫面提示登入你的 Claude 帳號。

## 訂閱方案

使用 Claude Code 需要 Claude Pro（$20 USD/月）或 Max（$60 USD/月）方案。

## 常見問題

Q：npm install 失敗怎麼辦？
A：試試在指令前加 sudo（macOS/Linux）：sudo npm install -g @anthropic-ai/claude-code`,
  },
  "install-coach": {
    title: "安裝教練系統",
    body: `## 前置條件

- 已安裝 Claude Code（見上一篇）
- 已下載並解壓縮 ai-coach-kit.zip

## 安裝步驟

### 1. 打開終端機

### 2. 進入解壓縮後的資料夾

cd ~/Downloads/ai-coach-kit

（如果你解壓到其他位置，把路徑改成對應位置）

### 3. 執行安裝腳本

bash install.sh

### 4. 設定工作目錄

安裝程式會問你工作目錄位置，按 Enter 使用預設（~/coach-workspace）或輸入你想要的路徑。

### 5. 確認安裝成功

你會看到：

🎉 安裝完成！
已安裝的教練指令：
   /solo-coach          — 啟動教練、初始化實驗
   /solo-coach-morning  — 每日晨間覆盤
   /solo-coach-checkin  — 下午進度回報
   /solo-coach-weekly   — 每週總結與實驗設計

## 常見問題

Q：顯示「找不到 skills 資料夾」？
A：確認你在正確的目錄中。用 ls 指令看看當前目錄有沒有 skills/ 資料夾。`,
  },
  "first-session": {
    title: "第一次啟動教練",
    body: `## 前置條件

- 已完成安裝（不管是 Desktop 或 CLI 方式）

## 填寫個人設定

打開工作目錄中的 config.md（用任何文字編輯器），填寫以下欄位：

- 名稱：你的名字
- 職稱：例如「品牌設計師」
- 一句話介紹：例如「幫中小企業做視覺識別的設計師，想轉型成內容創作者」

### 好的目標寫法

「在 3 個月內建立每週電子報的習慣，從 0 成長到 500 訂閱者」

### 不好的目標寫法

「我想做個人品牌」（太模糊，教練無法幫你設計實驗）

## 啟動教練

CLI 用戶：在工作目錄中執行 claude，然後輸入 /solo-coach

Desktop 用戶：在 Project 對話中輸入「啟動教練」

## 回答校準問題

教練會問你 3 個問題：

1. 你目前最想達成的一個目標是什麼？
   - 聚焦在未來 2-4 週最想推進的事

2. 你每天有多少時間可以投入？
   - 誠實回答，1 小時和 3 小時會得到不同的實驗設計

3. 你目前最大的卡點是什麼？
   - 例如「有太多想法但不知道選哪個」

## 接下來會發生什麼

教練會：
- 從知識庫中提取 4-6 個最相關的心智模型
- 為你設計 3 個實驗
- 問你 2-3 個追蹤問題

整個過程約 5-10 分鐘。

## 常見問題

Q：教練設計的實驗太難？
A：直接告訴教練「這個太難了，請降低難度」。它會幫你拆成更小的步驟。`,
  },
  "daily-loop": {
    title: "每日使用迴圈",
    body: `## 教練的核心：每日兩次 check-in

這是最重要的部分。不需要花很多時間，但要持續。

## 早上：晨間覆盤

建議時間：早上 8:00-9:00

CLI：輸入 /solo-coach-morning
Desktop：輸入「教練早安」

教練會：
- 回顧昨天的觀察和數據
- 檢查本週實驗進度
- 設計今天的 3 個調整

## 下午：進度回報

建議時間：下午 5:00-6:00

CLI：輸入 /solo-coach-checkin
Desktop：輸入「check-in」

教練會問你今天做了什麼。

### 不好的回報（教練無法學到東西）

「今天還好，有在寫東西。」

### 好的回報（教練能給精準建議）

「今天寫了一篇 1500 字的電子報，主題是 AI 時代的個人品牌定位。寫了 2 小時。發到 Facebook 後，2 小時內有 15 個留言，比平常多 3 倍。」

重點：給數字、給具體行動、給觀察。

## 每週日：週報

CLI：輸入 /solo-coach-weekly
Desktop：輸入「週報」

教練會總結整週、分析實驗進度、設計下週實驗。

## 養成習慣的技巧

- 設手機提醒（早上和下午各一個）
- 把 check-in 綁在現有習慣後面（例如泡完咖啡就做）
- 不需要每天都完美，跳過幾天也沒關係，教練會接續

## 常見問題

Q：忘記 check-in 好幾天了？
A：沒關係。下次 check-in 時教練會從上次的進度接續，不需要補回去。`,
  },
  "build-your-own": {
    title: "建立你自己的教練",
    body: `## 為什麼要建自己的教練？

Vista Coach 是一個很好的範例，但你的產業、你的知識、你的方法論，只有你自己最懂。

用你選擇的導師或作者的內容建教練，它的建議會更貼合你的需求。

## Step 1：選擇知識來源

選一位對你影響最深的作者或導師。好的來源特徵：

- 有深度的長文章（不是短貼文）
- 有一套方法論或框架
- 你讀了之後會想「我應該照著做」
- 至少有 20-30 篇內容

## Step 2：收集文章

把那位作者的文章 URL、書摘、課程筆記收集起來。

## Step 3：建立 Gemini Notebook 知識庫

詳見下一篇教學。簡單說就是把文章灌進 Google 的 Gemini Notebook 工具。

## Step 4：複製模板

在 coach/ 資料夾中，複製 _template.md 並改名，例如 coach/james-clear.md。

## Step 5：填寫設定

- name：教練名稱（例如「Atomic Habits Coach」）
- notebook_ids：你的 Gemini Notebook 筆記本 ID
- style：教練風格（例如「簡潔、科學導向、用案例說明」）
- progress_file：進度檔路徑

## Step 6：啟動

CLI：輸入 /solo-coach
Desktop：輸入「啟動教練」

教練會自動偵測新設定並開始校準。

## 進階：多教練並行

你可以同時有多個教練，例如：
- Vista Coach → 一人創業
- James Clear Coach → 習慣養成
- 自訂教練 → 你自己的領域

每個教練有獨立的進度檔，互不干擾。

## 著作權與合理使用

用其他作者的內容建立 AI 教練時，請務必遵守以下原則：

### 僅限個人使用

你建立的教練是給你自己用的學習工具。不要把包含他人著作的教練設定檔分享、轉售、或公開散佈。這跟「買一本書自己讀」是一樣的道理——你可以用書中的觀念指導自己的行動，但不能影印整本書分給別人。

### 使用公開可取得的內容

建議使用的來源：
- 作者公開發布的部落格文章
- 免費的電子報內容
- 公開的 Podcast 逐字稿
- 作者授權分享的素材

不建議使用的來源：
- 付費課程的完整內容（除非授權條款允許）
- 付費電子書的全文
- 需要登入才能看到的會員專屬內容
- 他人的私人筆記或未公開文件

### 尊重原創者

如果你用某位作者的內容建了教練，而且覺得很有幫助：
- 考慮購買他的書或課程來支持他
- 在社群分享時標註原作者
- 如果教練引用了某篇文章，回去讀原文加深理解

### 不要做的事

- 不要把他人內容建成的教練包裝成自己的產品販售
- 不要宣稱教練的輸出是原作者的官方建議
- 不要用教練系統大量複製或重新發布他人的原創內容

簡單來說：把 AI 教練當成你的私人學習夥伴，而不是內容複製機。尊重創作者，也保護自己。

### 免責聲明

本工具包提供的是建立 AI 教練的技術框架與操作流程。使用者自行選擇灌入的知識來源內容，其著作權歸屬及合法性由使用者自行負責。

本產品的開發者與販售者（Vista / solo.tw）不對使用者灌入第三方內容所產生的任何著作權爭議、法律糾紛或損害承擔責任。

購買並使用本產品，即表示你同意：
- 你將自行確認所使用內容的著作權狀態與合法性
- 你不會將包含他人著作權內容的教練設定用於商業販售或公開散佈
- 因使用者自身行為所引起的任何法律責任，由使用者自行承擔

如對特定內容的使用是否合法有疑慮，建議諮詢專業法律人士。`,
  },
  notebooklm: {
    title: "Gemini Notebook 知識庫建立教學",
    body: `## 什麼是 Gemini Notebook？

Google 推出的免費工具，可以把文章、書摘、筆記變成 AI 可以搜尋的知識庫。

你的教練會從這個知識庫中找相關的方法和原則，給你有根據的建議。

## 建立步驟

### 1. 登入

到 notebooklm.google.com，用你的 Google 帳號登入。完全免費。

### 2. 建立筆記本

點「新增筆記本」，取一個名字（例如「James Clear Coach」）。

### 3. 加入來源

點「新增來源」，有 4 種方式：

- 網址：直接貼文章 URL，Gemini Notebook 會自動擷取內容
- 文字：複製貼上文章內容
- 檔案上傳：PDF、文字檔
- Google Drive：連結你的 Drive 文件

建議用「網址」方式最快——一篇一篇貼 URL 就好。

### 4. 逐一加入 20-30 篇文章

每加一篇，等它處理完（通常幾秒鐘）再加下一篇。

### 5. 找到筆記本 ID

看瀏覽器的網址列，格式長這樣：

notebooklm.google.com/notebook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

「notebook/」後面那串長字串就是你的筆記本 ID。

### 6. 填回教練設定

把 ID 複製到你的教練設定檔（coach/你的教練.md）中的 notebook_ids 欄位。

## 小技巧

- 每本筆記本上限 50 個來源
- 如果超過 50 篇，分成多本（例如按主題分）
- 教練設定支援多個 notebook_ids

## 常見問題

Q：Gemini Notebook 要付費嗎？
A：完全免費，只需要 Google 帳號。`,
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideData[slug];
  if (!guide) return {};
  return {
    title: `${guide.title} — AI 教練工坊教學 | solo.tw`,
    description: `AI 教練工坊零基礎教學：${guide.title}`,
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guideData[slug];
  if (!guide) notFound();

  const currentIndex = guideSlugs.indexOf(slug);
  const prevSlug = currentIndex > 0 ? guideSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < guideSlugs.length - 1 ? guideSlugs[currentIndex + 1] : null;
  const prevGuide = prevSlug ? guideData[prevSlug] : null;
  const nextGuide = nextSlug ? guideData[nextSlug] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Link
        href="/products/ai-coach-kit/guide"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        回到教學目錄
      </Link>

      <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
        {guide.title}
      </h1>

      <article className="mt-8 prose prose-stone prose-lg max-w-none prose-headings:text-stone-900 prose-p:text-stone-600 prose-li:text-stone-600 prose-strong:text-stone-900">
        {guide.body.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("### ")) {
            return (
              <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
                {block.replace("### ", "")}
              </h3>
            );
          }
          if (block.startsWith("- ")) {
            return (
              <ul key={i} className="space-y-4 my-6">
                {block.split("\n").filter(line => line.trim()).map((line, j) => (
                  <li key={j} className="flex items-start gap-3 text-base leading-relaxed">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <span>{line.replace(/^- /, "")}</span>
                  </li>
                ))}
              </ul>
            );
          }
          if (
            block.startsWith("Q：") ||
            block.startsWith("Q:") ||
            block.startsWith("A：") ||
            block.startsWith("A:")
          ) {
            return (
              <p key={i} className={`my-2 ${block.startsWith("Q") ? "font-semibold text-stone-900" : "text-stone-600"}`}>
                {block}
              </p>
            );
          }
          return (
            <p key={i} className="my-4 leading-relaxed">
              {block}
            </p>
          );
        })}
      </article>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-stone-200 pt-6">
        {prevGuide && prevSlug ? (
          <Link
            href={`/products/ai-coach-kit/guide/${prevSlug}`}
            className="flex items-center gap-2 text-base text-stone-500 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {prevGuide.title}
          </Link>
        ) : (
          <div />
        )}
        {nextGuide && nextSlug ? (
          <Link
            href={`/products/ai-coach-kit/guide/${nextSlug}`}
            className="flex items-center gap-2 text-base text-stone-500 hover:text-primary"
          >
            {nextGuide.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
