import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TicketTypeWithCount } from "@/lib/supabase/types";

export default function TicketTypeList({ ticketTypes }: { ticketTypes: TicketTypeWithCount[] }) {
  if (ticketTypes.length === 0) {
    return <p className="text-muted-foreground">尚未設定票種</p>;
  }

  return (
    <div className="space-y-3">
      {ticketTypes.map((ticket) => {
        const isFull = ticket.capacity > 0 && ticket.confirmed_count >= ticket.capacity;
        const remaining = ticket.capacity > 0 ? ticket.capacity - ticket.confirmed_count : null;
        const progress = ticket.capacity > 0 ? (ticket.confirmed_count / ticket.capacity) * 100 : 0;

        return (
          <Card key={ticket.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{ticket.name}</h4>
                  {ticket.description && <p className="text-sm text-muted-foreground">{ticket.description}</p>}
                </div>
                <div className="text-right">
                  {ticket.price > 0 ? (
                    <p className="font-bold">NT$ {ticket.price.toLocaleString()}</p>
                  ) : (
                    <Badge variant="secondary">免費</Badge>
                  )}
                </div>
              </div>
              {ticket.capacity > 0 && (
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>{ticket.confirmed_count} / {ticket.capacity} 人</span>
                    <span>{isFull ? "已額滿（候補中）" : `剩餘 ${remaining} 名`}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className={`h-2 rounded-full transition-all ${isFull ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
