const steps = [
  "填需求表單（5 分鐘）",
  "我看完回信（24 小時內）",
  "確認方向後寄上付款連結",
  "付款後 E-mail / LINE 議定首場時段",
  "Google Meet 開課，共寫文件同步交付",
];

export function ProcessSteps() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-bold text-center">從填表到上課，五步驟</h2>
        <ol className="mt-12 space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-4 rounded-lg border bg-card p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {i + 1}
              </span>
              <span className="pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
