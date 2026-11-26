import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DEFAULT_RULES, RANKS, type Rank } from '@/lib/gameData';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

interface Props {
  rules: Record<Rank, string>;
  onSave: (rules: Record<Rank, string>) => void;
}

const RulesModal = ({ rules, onSave }: Props) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(rules);

  const handleOpen = (o: boolean) => {
    if (o) setDraft({ ...rules });
    setOpen(o);
  };

  const handleResetDefaults = () => {
    setDraft({ ...DEFAULT_RULES });
  };

  const handleSave = () => {
    onSave(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
        >
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span>ตั้งค่ากติกา</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto border-white/10 bg-popover/95 backdrop-blur-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-semibold text-foreground">
            ตั้งค่ากติกาไพ่ปาร์ตี้
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            ปรับแต่งข้อความกติกาของไพ่แต่ละแต้มให้เหมาะกับวงเพื่อนของคุณ
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-2.5">
          {RANKS.map((rank) => (
            <div key={rank} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] font-display text-sm font-bold text-primary">
                {rank}
              </span>
              <Input
                value={draft[rank]}
                onChange={(e) => setDraft({ ...draft, [rank]: e.target.value })}
                placeholder={`กติกาของไพ่ ${rank}`}
                className="h-9 rounded-lg border-white/10 bg-white/[0.04] text-sm focus-visible:ring-primary"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetDefaults}
            className="gap-1.5 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>ค่าเริ่มต้น</span>
          </Button>
          <Button type="button" onClick={handleSave} className="flex-1 rounded-xl font-semibold">
            บันทึกกติกา
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RulesModal;
