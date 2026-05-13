import { CONSULTING_PLANS } from "@/lib/consulting-config";

export function PricingLadder() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold text-center">依需求選時數，越多越划算</h2>
        <p className="mt-3 text-center text-muted-foreground">
          自付款日起 6 個月內用完，可延期一次（+3 個月）
        </p>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted">
                <th className="p-4 text-left">方案</th>
                <th className="p-4 text-right">總價</th>
                <th className="p-4 text-right">每小時</th>
                <th className="p-4 text-left">適合</th>
              </tr>
            </thead>
            <tbody>
              {CONSULTING_PLANS.map((p) => (
                <tr key={p.slug} className="border-b">
                  <td className="p-4 font-medium">{p.label}</td>
                  <td className="p-4 text-right">NT${p.totalPrice.toLocaleString()}</td>
                  <td className="p-4 text-right text-muted-foreground">NT${p.pricePerHour.toLocaleString()}</td>
                  <td className="p-4 text-muted-foreground">{p.suitedFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          註：套票期間 1 對 1 時段優先排程，可分次使用、不限主題；單張套票可一次性轉讓給 1 位他人。
        </p>
      </div>
    </section>
  );
}
