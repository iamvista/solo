import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "退款政策 | solo.tw",
  description: "solo.tw 的退款政策，說明數位產品、線上課程、工作坊與諮詢服務的退款規則。",
  alternates: { canonical: "https://www.solo.tw/refund" },
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
        退款政策
      </h1>

      <div className="mt-8 space-y-8">
        <p className="text-base text-muted-foreground">最後更新日期：2026 年 4 月</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            1. 總則
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            感謝您購買 solo.tw（以下簡稱「本平臺」）的產品與服務。我們希望您對每一筆購買都感到滿意。本政策說明各類產品與服務的退款規則，請在購買前詳閱。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            2. 數位產品（工具包、模板、Prompt 套件等）
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            數位產品屬於一經交付即可使用的無形商品，依據《消費者保護法》第 19 條第 1 項但書規定，數位內容經下載或啟用後，不適用七日猶豫期：
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
            <li>購買後即提供下載連結或存取權限，恕不接受退款</li>
            <li>如因技術問題導致無法下載或存取，請於購買後 7 日內聯繫我們，我們將協助排除問題或安排退款</li>
            <li>如產品內容與銷售頁面描述有重大不符，請於購買後 7 日內提出，經查證屬實將全額退款</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            3. 線上課程（錄播課程）
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            線上錄播課程屬於數位內容商品：
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
            <li>課程開通後即可觀看全部內容，恕不接受退款</li>
            <li>如課程尚未開通且未觀看任何內容，可於購買後 7 日內申請全額退款</li>
            <li>如因平臺技術問題導致無法觀看，請聯繫我們協助處理</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            4. 工作坊（實體或線上直播）
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            工作坊為限定日期與名額的活動：
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
            <li>
              <strong className="text-foreground">活動開始 14 日前取消：</strong>
              全額退款
            </li>
            <li>
              <strong className="text-foreground">活動開始 7～13 日前取消：</strong>
              退款 50%
            </li>
            <li>
              <strong className="text-foreground">活動開始 7 日內取消：</strong>
              恕不退款，但可將名額轉讓給他人（需提前通知）
            </li>
            <li>
              <strong className="text-foreground">主辦方取消或延期：</strong>
              提供全額退款或保留至下一場次的選擇
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            5. 諮詢與陪跑服務
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            諮詢服務採預約制：
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
            <li>
              <strong className="text-foreground">諮詢開始 48 小時前取消：</strong>
              全額退款
            </li>
            <li>
              <strong className="text-foreground">諮詢開始 48 小時內取消：</strong>
              恕不退款，但可免費改期一次（需於 30 日內完成）
            </li>
            <li>
              <strong className="text-foreground">陪跑方案：</strong>
              尚未使用的諮詢次數可依比例退款；已使用的次數以單次定價計算
            </li>
            <li>
              <strong className="text-foreground">未出席（No-show）：</strong>
              視為已完成，不予退款或補課
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            6. 退款方式
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
            <li>退款將退回原付款方式（信用卡退刷或匯款）</li>
            <li>退款處理時間約 7～14 個工作日，視金融機構作業時間而定</li>
            <li>如使用優惠碼或折扣購買，退款金額以實際支付金額為準</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            7. 如何申請退款
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            如需申請退款，請透過以下方式聯繫我們，並提供：
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
            <li>您的訂單編號或購買時使用的 Email</li>
            <li>購買的產品或服務名稱</li>
            <li>退款原因</li>
          </ul>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            我們將於收到申請後 3 個工作日內回覆處理結果。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            8. 特殊情況
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            以下情況我們將個案處理：
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-muted-foreground">
            <li>重複扣款或金額錯誤：經查證後全額退還多收金額</li>
            <li>不可抗力因素（天災、重大事故等）：彈性處理，不受上述時限限制</li>
            <li>對退款結果有異議，可再次聯繫我們協商</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            9. 政策修改
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            本平臺保留隨時修改退款政策的權利。修改後的政策將公告於本頁面，並以購買當下適用的版本為準。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            10. 聯絡我們
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            如對退款政策有任何疑問，請透過以下方式聯絡我們：
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            <strong className="text-foreground">solo.tw</strong>
            <br />
            電子郵件：iamvista@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
