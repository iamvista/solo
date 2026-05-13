const items = [
  {
    icon: "🎥",
    title: "Google Meet 視訊 1-on-1",
    desc: "分享螢幕、現場 demo，做到一半的東西我直接接手示範。若有需要，可約實體教學，但租借教室或咖啡館等費用另計。",
  },
  {
    icon: "📝",
    title: "共寫工作檔",
    desc: "每場開一份 Google Doc 或 GitHub repo，做完當下就帶走可用的產出，不依賴錄影檔。",
  },
  {
    icon: "🔁",
    title: "彈性節奏",
    desc: "1 小時收一個小卡關，10 小時跨主題深耕，多久上一次、每次幾小時，您決定。",
  },
];

export function ServiceFormat() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold text-center">我們怎麼一起工作</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-lg border bg-card p-6">
              <div className="text-4xl">{it.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
