import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "跟你的工作坊有什麼不同？",
    a: "工作坊是我教大家一個系統方法論，1-on-1 是我陪您解決您的問題。工作坊節奏固定、內容固定；1-on-1 整堂課的時間都用來處理您所遇到的問題。",
  },
  {
    q: "一定要先填表嗎？我已經確定要買 1 小時諮詢。",
    a: "是的。需求表單是我判斷能不能幫您的依據，半小時內就能填完。填完我會 24 小時內回信，合適就寄付款連結，不合適會誠實告訴您。",
  },
  {
    q: "不在臺灣可以嗎？",
    a: "可以。Google Meet 跨時區沒問題，議時段時告訴我時差即可。",
  },
  {
    q: "上完課可以加購嗎？",
    a: "當然。可以隨時跨方案升級（如 1hr 諮詢後再買 10hr 套票），已付的時數獨立計算、不退費也不被吃掉。",
  },
  {
    q: "套票可以轉讓嗎？",
    a: "可以，單張套票可一次性轉讓給 1 位他人，請來信申請。建議轉讓給有類似需求的人，效率最好。",
  },
  {
    q: "取消政策？",
    a: "開課前 48 小時取消 → 退回時數；24–48 小時 → 扣 0.5 小時；24 小時內 → 扣該場全部時數。",
  },
  {
    q: "我的需求不在 7 個主題裡。",
    a: "在表單裡選「我有別的需求」並描述。您的題目如果剛好我有把握，我會接；不是，會誠實告訴您比較適合的人。",
  },
  {
    q: "我怎麼知道還剩多少時數？",
    a: "每堂課後 24 小時內，我會寄信通知。",
  },
  {
    q: "可以錄影嗎？",
    a: "學員可自行錄影自留，我這端不主動錄製。",
  },
];

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-bold text-center">常見問題</h2>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
