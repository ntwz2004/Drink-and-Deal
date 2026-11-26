import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Dices, RotateCcw, Sparkles, Trophy, Users } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import Dice3D from '@/components/Dice3D';
import { useGameSession } from '@/hooks/useGameSession';

interface DiceState {
  players: Record<number, string>;
  result: number | null;
  displayFace: number;
}

const EMPTY_PLAYERS: Record<number, string> = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' };

const DiceGame = () => {
  const [players, setPlayers] = useState<Record<number, string>>({ ...EMPTY_PLAYERS });
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [displayFace, setDisplayFace] = useState(1);
  const [diceSize, setDiceSize] = useState(176);
  const [popupOpen, setPopupOpen] = useState(false);

  const { loaded, initial, save, clear } = useGameSession<DiceState>('dice_state');

  // Restore saved state
  useEffect(() => {
    if (loaded && initial) {
      setPlayers({ ...EMPTY_PLAYERS, ...(initial.players ?? {}) });
      setResult(initial.result ?? null);
      setDisplayFace(initial.displayFace ?? 1);
    }
  }, [loaded, initial]);

  // Persist state
  useEffect(() => {
    if (!loaded || isRolling) return;
    save({ players, result, displayFace });
  }, [loaded, isRolling, players, result, displayFace, save]);

  // Responsive dice size
  useEffect(() => {
    const update = () => setDiceSize(window.innerWidth < 380 ? 136 : window.innerWidth < 640 ? 160 : 184);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const roll = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    setResult(null);
    setPopupOpen(false);

    const final = Math.floor(Math.random() * 6) + 1;
    setDisplayFace(final);

    setTimeout(() => {
      setResult(final);
      setIsRolling(false);
      setPopupOpen(true);
    }, 1750);
  }, [isRolling]);

  const resetGame = () => {
    setResult(null);
    setIsRolling(false);
    setDisplayFace(1);
    setPlayers({ ...EMPTY_PLAYERS });
    setPopupOpen(false);
    clear();
  };

  const winner = result ? players[result]?.trim() : null;
  const filledCount = Object.values(players).filter((v) => v.trim().length > 0).length;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {/* Heading */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300">
            <Sparkles className="h-3 w-3" />
            <span>ลูกเต๋า 3 มิติ</span>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ทอยลูกเต๋า
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            กำหนดชื่อผู้เล่นประจำหมายเลข 1–6 (หรือไม่ใส่ชื่อก็ได้) แล้วกดทอยลูกเต๋า
          </p>
        </div>

        {/* Main 2-column layout */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Dice Stage */}
          <section className="glass-surface relative flex flex-col items-center justify-center rounded-2xl p-8 sm:p-10 lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 blur-3xl"
            />

            <div className="my-4 flex flex-col items-center">
              <Dice3D face={displayFace} isRolling={isRolling} onClick={roll} size={diceSize} />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {isRolling ? 'กำลังทอยลูกเต๋า...' : 'แตะที่ลูกเต๋าหรือกดปุ่มด้านล่างเพื่อทอย'}
            </p>

            <Button
              onClick={roll}
              disabled={isRolling}
              size="lg"
              className="mt-5 h-12 w-full max-w-xs gap-2 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
            >
              <Dices className="h-5 w-5" />
              <span>{isRolling ? 'กำลังทอย...' : 'ทอยลูกเต๋า'}</span>
            </Button>

            {/* Latest Result Banner */}
            {result && !isRolling && (
              <button
                type="button"
                onClick={() => setPopupOpen(true)}
                className="mt-6 flex w-full max-w-sm items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3.5 text-left transition-colors hover:bg-primary/15 animate-scale-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display text-xl font-bold shadow-sm">
                    {result}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-primary">ผลลัพธ์รอบล่าสุด</p>
                    <p className="truncate text-base font-semibold text-foreground">
                      {winner ? `${winner} (หมายเลข ${result})` : `ออกแต้มหมายเลข ${result}`}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-primary">ดูผล</span>
              </button>
            )}
          </section>

          {/* Player Inputs Panel */}
          <section className="glass-surface rounded-2xl p-6 lg:col-span-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">รายชื่อผู้เล่น</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                ใส่แล้ว {filledCount}/6 คน · หน้าละ 16.7%
              </span>
            </div>

            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const isWinnerSlot = result === num && !isRolling;
                return (
                  <div
                    key={num}
                    className={`flex items-center gap-3 rounded-xl border p-1.5 pr-2 transition-colors ${
                      isWinnerSlot
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-white/[0.07] bg-white/[0.02]'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${
                        isWinnerSlot
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/[0.06] text-muted-foreground'
                      }`}
                    >
                      {num}
                    </span>
                    <Input
                      placeholder={`ผู้เล่นหมายเลข ${num}`}
                      value={players[num]}
                      onChange={(e) => setPlayers({ ...players, [num]: e.target.value })}
                      className="h-9 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                <span>ล้างข้อมูลและเริ่มใหม่</span>
              </Button>
            </div>
          </section>
        </div>

        {/* Result Dialog */}
        <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
          <DialogContent className="max-w-xs rounded-2xl border-white/10 bg-popover/95 text-center backdrop-blur-xl">
            <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Trophy className="h-7 w-7" />
            </div>
            <DialogTitle className="text-xs font-medium tracking-wider text-muted-foreground">
              ผลการทอยลูกเต๋า · ออกแต้ม {result}
            </DialogTitle>
            <DialogDescription className="sr-only">
              แสดงผลการทอยลูกเต๋าและผู้เล่นที่ตรงกับหมายเลขที่ออก
            </DialogDescription>
            <p className="mt-1 break-words text-3xl font-bold text-primary">
              {winner || `หมายเลข ${result}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {winner ? 'ถึงตาของคุณแล้วในรอบนี้!' : `ลูกเต๋าออกหน้า ${result} ในรอบนี้`}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPopupOpen(false)}
                className="flex-1 rounded-xl border-white/10 bg-white/[0.03]"
              >
                ปิด
              </Button>
              <Button onClick={roll} className="flex-1 rounded-xl font-semibold">
                ทอยอีกครั้ง
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DiceGame;
