import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { History, Layers } from 'lucide-react';
import { isRedSuit, type PlayingCard as CardType, type Rank } from '@/lib/gameData';

interface Props {
  history: CardType[];
  rules: Record<Rank, string>;
}

const HistoryPanel = ({ history, rules }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
        >
          <History className="h-4 w-4 text-muted-foreground" />
          <span>ประวัติการจั่ว</span>
          {history.length > 0 && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary tabular-nums">
              {history.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[88vw] sm:max-w-md border-white/10 bg-background/95 backdrop-blur-xl overflow-y-auto"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-semibold text-foreground">ประวัติการจั่วไพ่</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            แสดงรายการไพ่ที่จั่วไปแล้ว เรียงจากใบล่าสุด ({history.length} ใบ)
          </SheetDescription>
        </SheetHeader>

        {history.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-muted-foreground ring-1 ring-white/10">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-foreground">ยังไม่มีประวัติการจั่วไพ่</p>
            <p className="mt-1 text-xs text-muted-foreground">
              เริ่มจั่วไพ่ใบแรกเพื่อบันทึกประวัติในรอบนี้
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-2.5 pb-6">
            {history
              .map((card, i) => ({ card, order: i + 1 }))
              .reverse()
              .map(({ card, order }, idx) => (
                <li
                  key={`${card.id}-${order}`}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${
                    idx === 0
                      ? 'border-primary/30 bg-primary/[0.08]'
                      : 'border-white/[0.08] bg-white/[0.03]'
                  }`}
                >
                  <span className="w-7 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                    #{order}
                  </span>
                  <span
                    className={`flex h-12 w-9 shrink-0 flex-col items-center justify-center rounded-md border border-black/10 bg-white leading-none shadow-sm ${
                      isRedSuit(card.suit) ? 'text-card-red' : 'text-card-black'
                    }`}
                  >
                    <span className="font-display text-sm font-bold">{card.rank}</span>
                    <span className="text-xs">{card.suit}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {rules[card.rank]}
                    </p>
                    {idx === 0 && (
                      <span className="mt-0.5 inline-block text-[11px] font-medium text-primary">
                        ใบล่าสุด
                      </span>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default HistoryPanel;
