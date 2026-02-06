"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            服務條款
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              最後更新日期：2024 年 2 月
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 接受條款</h2>
              <p className="text-gray-700 leading-relaxed">
                歡迎使用自由人學院（以下簡稱「本平台」）。使用本平台的任何服務，即表示您同意遵守本服務條款。如不同意這些條款，請勿使用本平台服務。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 服務說明</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本平台提供以下服務：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Solo 類型診斷工具</li>
                <li>線上學習課程與資源</li>
                <li>專家社群連結</li>
                <li>自由工作者相關工具與資訊</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                我們保留隨時修改、暫停或終止任何服務的權利，恕不另行通知。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 使用者帳戶</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                註冊帳戶時，您同意：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>提供真實、準確、完整的資訊</li>
                <li>維護並及時更新您的帳戶資訊</li>
                <li>保護您的帳戶密碼安全</li>
                <li>對帳戶下的所有活動負責</li>
                <li>發現任何未經授權使用時立即通知我們</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 使用規範</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                使用本平台時，您同意不會：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>違反任何適用法律或法規</li>
                <li>侵犯他人的智慧財產權或其他權利</li>
                <li>上傳或傳播惡意軟體、病毒或有害程式碼</li>
                <li>干擾或破壞本平台的正常運作</li>
                <li>未經授權存取他人帳戶或系統</li>
                <li>從事任何欺詐、誤導或不正當行為</li>
                <li>收集或儲存其他使用者的個人資料</li>
                <li>使用自動化工具大量存取或抓取本平台內容</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 智慧財產權</h2>
              <p className="text-gray-700 leading-relaxed">
                本平台及其內容（包括但不限於文字、圖片、標誌、設計、軟體、診斷工具）均受著作權及其他智慧財產權法律保護。未經我們書面許可，您不得複製、修改、散佈、銷售或以其他方式使用這些內容。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 使用者內容</h2>
              <p className="text-gray-700 leading-relaxed">
                您在本平台上提交或發布的內容（包括診斷回答、評論等），您保留其所有權。但您授予我們非專屬、全球性、免授權費的許可，使用、複製、修改及展示這些內容，以便提供及改善我們的服務。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 診斷結果免責聲明</h2>
              <p className="text-gray-700 leading-relaxed">
                本平台提供的 Solo 類型診斷僅供參考及自我探索之用，不構成專業的職業諮詢、心理評估或醫療建議。診斷結果不應作為重大人生決策的唯一依據。如需專業建議，請諮詢相關領域的專業人士。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 付費服務</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                部分服務可能需要付費。購買付費服務時：
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>價格以結帳時顯示的金額為準</li>
                <li>付款後將依照各課程或服務的規定提供內容</li>
                <li>除非另有說明，數位商品一經購買不予退費</li>
                <li>我們保留調整價格的權利</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 免責聲明</h2>
              <p className="text-gray-700 leading-relaxed">
                本平台及其服務按「現狀」提供。我們不對服務的準確性、完整性、可靠性或適用性作任何明示或暗示的保證。在法律允許的最大範圍內，我們不對因使用本平台而產生的任何直接、間接、附帶、特殊或後果性損害負責。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 責任限制</h2>
              <p className="text-gray-700 leading-relaxed">
                在法律允許的範圍內，本平台對您的總責任不超過您在過去 12 個月內支付給我們的金額，或新台幣 1,000 元（以較高者為準）。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. 終止</h2>
              <p className="text-gray-700 leading-relaxed">
                我們保留在任何時候、因任何原因暫停或終止您的帳戶或服務存取權的權利，包括但不限於違反本條款。終止後，您使用服務的權利將立即停止。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. 條款修改</h2>
              <p className="text-gray-700 leading-relaxed">
                我們可能會不時修改本服務條款。重大變更將透過平台公告或電子郵件通知。繼續使用服務即表示接受修改後的條款。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. 準據法與管轄</h2>
              <p className="text-gray-700 leading-relaxed">
                本條款受中華民國法律管轄。因本條款產生的任何爭議，雙方同意以台灣台北地方法院為第一審管轄法院。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. 聯絡我們</h2>
              <p className="text-gray-700 leading-relaxed">
                如對本服務條款有任何疑問，請透過以下方式聯絡我們：
              </p>
              <p className="text-gray-700 mt-4">
                <strong>自由人學院</strong><br />
                電子郵件：support@solo.tw
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
