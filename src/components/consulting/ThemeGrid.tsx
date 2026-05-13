"use client";
import { CONSULTING_TOPICS } from "@/lib/consulting-config";
import { Button } from "@/components/ui/button";

interface Props {
  onSelectTopic?: (slug: string) => void;
}

export function ThemeGrid({ onSelectTopic }: Props) {
  return (
    <section id="themes" className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center">您今天卡在哪裡？</h2>
        <p className="mt-3 text-center text-muted-foreground">
          七個主題是我這一年多最常被問的方向。您也可以開新題目，第八張卡就是給「不在上面」的人。
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CONSULTING_TOPICS.map((t) => (
            <div key={t.slug} className="flex flex-col rounded-lg border bg-card p-6">
              <div className="text-4xl">{t.emoji}</div>
              <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.oneLiner}</p>
              <p className="mt-4 text-sm">
                <span className="font-medium">帶走：</span>{t.takeaway}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 self-end"
                onClick={() => {
                  onSelectTopic?.(t.slug);
                  document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                💬 從這題開始 →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
