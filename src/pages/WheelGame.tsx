import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Plus, X, Sparkles, Trophy, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AppHeader from '@/components/AppHeader';
import { useGameSession } from '@/hooks/useGameSession';

interface WheelState {
  names: string[];
  angle: number;
  result: string | null;
}

const SEGMENT_COLORS = [
  { fill: 'hsl(350 74% 52%)', text: '#ffffff' },
  { fill: 'hsl(162 62% 38%)', text: '#ffffff' },
  { fill: 'hsl(38 92% 54%)', text: '#111827' },
  { fill: 'hsl(232 68% 58%)', text: '#ffffff' },
  { fill: 'hsl(192 72% 42%)', text: '#ffffff' },
  { fill: 'hsl(276 62% 54%)', text: '#ffffff' },
];

const MAX_NAMES = 12;

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
};

const WheelGame = () => {
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { loaded, initial, save, clear } = useGameSession<WheelState>('wheel_state');

  useEffect(() => {
    if (loaded && initial) {
      setNames(initial.names ?? []);
      setAngle(initial.angle ?? 0);
      setResult(initial.result ?? null);
    }
  }, [loaded, initial]);

  useEffect(() => {
    if (!loaded || spinning) return;
    save({ names, angle, result });
  }, [loaded, spinning, names, angle, result, save]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const addName = () => {
    const v = draft.trim();
    if (!v || names.length >= MAX_NAMES) return;
    setNames((n) => [...n, v]);
    setDraft('');
  };

  const removeName = (i: number) => {
    if (spinning) return;
    setNames((n) => n.filter((_, idx) => idx !== i));
  };

  const spin = useCallback(() => {
    if (spinning || names.length < 2) return;
    setSpinning(true);
    setResult(null);
    setPopupOpen(false);

    const seg = 360 / names.length;
    const winner = Math.floor(Math.random() * names.length);
    const target = 360 * (Math.floor(Math.random() * 3) + 5) - (winner * seg + seg / 2);
    const next = angle + (((target - (angle % 360)) + 360) % 360) + 360 * 5;
    setAngle(next);

    timer.current = setTimeout(() => {
      setResult(names[winner]);
      setWinnerIndex(winner);
      setSpinning(false);
      setPopupOpen(true);
    }, 4200);
  }, [spinning, names, angle]);

  const removeWinnerFromWheel = () => {
    if (winnerIndex === null) return;
    setNames((prev) => prev.filter((_, idx) => idx !== winnerIndex));
    setWinnerIndex(null);
    setResult(null);
    setPopupOpen(false);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setNames([]);
    setDraft('');
    setAngle(0);
    setResult(null);
    setWinnerIndex(null);
    setPopupOpen(false);
    setSpinning(false);
    clear();
  };

  const seg = names.length ? 360 / names.length : 360;
  const chanceValue = names.length ? 100 / names.length : 0;
  const chance = Number.isInteger(chanceValue) ? String(chanceValue) : chanceValue.toFixed(1);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {/* Heading */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-[11px] font-medium text-rose-300">
            <Sparkles className="h-3 w-3" />
            <span>สุ่มรายชื่อแบบยุติธรรม</span>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            วงล้อสุ่มชื่อ
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            เพิ่มรายชื่อผู้เล่นตั้งแต่ 2–{MAX_NAMES} คน แล้วหมุนวงล้อเพื่อเลือกผู้โชคดีในรอบนี้
          </p>
        </div>

        {/* Main 2-column layout */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Wheel Stage */}
          <section className="glass-surface relative flex flex-col items-center rounded-2xl p-6 sm:p-8 lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/12 blur-3xl"
            />

            {/* Wheel Interactive Area */}
            <div
              role="button"
              tabIndex={0}
              onClick={spin}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && spin()}
              aria-label="หมุนวงล้อสุ่มชื่อ"
              className={`relative aspect-square w-[min(86vw,350px)] select-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full ${
                spinning || names.length < 2
                  ? 'cursor-default'
                  : 'cursor-pointer transition-transform active:scale-[0.985]'
              }`}
            >
              {/* Top Pointer */}
              <div className="absolute left-1/2 -top-2 z-20 -translate-x-1/2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]">
                <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-primary" />
              </div>

              {/* Outer ring bezel */}
              <div className="h-full w-full rounded-full bg-gradient-to-b from-white/15 to-white/[0.03] p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]">
                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full rounded-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transition: spinning ? 'transform 4.2s cubic-bezier(0.12, 0.72, 0.14, 1)' : 'none',
                  }}
                >
                  {names.length < 2 ? (
                    <>
                      <circle cx="100" cy="100" r="98" fill="hsl(223 26% 13%)" stroke="hsl(220 18% 24%)" strokeWidth="1.5" />
                      <circle cx="100" cy="100" r="76" fill="none" stroke="hsl(220 18% 22%)" strokeDasharray="4 4" strokeWidth="1" />
                    </>
                  ) : (
                    names.map((n, i) => {
                      const start = i * seg;
                      const end = start + seg;
                      const [x1, y1] = polar(100, 100, 98, start);
                      const [x2, y2] = polar(100, 100, 98, end);
                      const large = seg > 180 ? 1 : 0;
                      const palette = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
                      return (
                        <g key={`${n}-${i}`}>
                          <path
                            d={`M100 100 L${x1} ${y1} A98 98 0 ${large} 1 ${x2} ${y2} Z`}
                            fill={palette.fill}
                            stroke="hsl(224 32% 9%)"
                            strokeWidth="1.2"
                          />
                          <text
                            x="100"
                            y="44"
                            fill={palette.text}
                            fontSize={names.length > 8 ? '6.5' : '8'}
                            fontWeight="600"
                            dominantBaseline="middle"
                            transform={`rotate(${start + seg / 2} 100 100)`}
                            textAnchor="middle"
                          >
                            {n.length > 11 ? `${n.slice(0, 11)}…` : n}
                          </text>
                          <text
                            x="100"
                            y="55"
                            fill={palette.text}
                            opacity="0.75"
                            fontSize="5"
                            dominantBaseline="middle"
                            transform={`rotate(${start + seg / 2} 100 100)`}
                            textAnchor="middle"
                          >
                            {chance}%
                          </text>
                        </g>
                      );
                    })
                  )}

                  {/* Center Hub */}
                  <circle cx="100" cy="100" r="18" fill="hsl(224 32% 9%)" stroke="hsl(38 92% 58%)" strokeWidth="2" />
                  <circle cx="100" cy="100" r="6" fill="hsl(38 92% 58%)" />
                </svg>

                {names.length < 2 && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                    <span className="rounded-full bg-background/85 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                      เพิ่มรายชื่ออย่างน้อย 2 คน
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={spin}
              disabled={spinning || names.length < 2}
              size="lg"
              className="mt-6 h-12 w-full max-w-xs rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
            >
              {spinning ? 'กำลังหมุนวงล้อ...' : 'หมุนวงล้อ'}
            </Button>

            <p className="mt-2.5 text-xs text-muted-foreground">
              {names.length < 2
                ? 'กรุณาเพิ่มรายชื่อผู้เล่นอย่างน้อย 2 คนทางด้านขวา'
                : 'แตะที่วงล้อหรือกดปุ่มด้านบนเพื่อเริ่มหมุน'}
            </p>

            {/* Latest Result Banner */}
            {result && !spinning && (
              <button
                type="button"
                onClick={() => setPopupOpen(true)}
                className="mt-6 flex w-full max-w-sm items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3.5 text-left transition-colors hover:bg-primary/15 animate-scale-in"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-primary">ผลการสุ่มรอบล่าสุด</p>
                  <p className="truncate text-lg font-bold text-foreground">{result}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-primary">ดูผล</span>
              </button>
            )}
          </section>

          {/* Players Management Panel */}
          <section className="glass-surface rounded-2xl p-6 lg:col-span-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">รายชื่อบนวงล้อ</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                {names.length} / {MAX_NAMES} คน
              </span>
            </div>

            {/* Add input */}
            <div className="flex gap-2">
              <Input
                placeholder="พิมพ์ชื่อผู้เล่นแล้วกด Enter"
                value={draft}
                disabled={names.length >= MAX_NAMES || spinning}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addName()}
                className="h-10 rounded-xl border-white/10 bg-white/[0.04] text-sm focus-visible:ring-primary"
              />
              <Button
                onClick={addName}
                disabled={!draft.trim() || names.length >= MAX_NAMES || spinning}
                className="h-10 shrink-0 gap-1 rounded-xl px-4 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>เพิ่ม</span>
              </Button>
            </div>

            {/* List */}
            {names.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground/90">ยังไม่มีรายชื่อผู้เล่น</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  พิมพ์ชื่อเพื่อนด้านบนเพื่อเพิ่มเข้าสู่วงล้อ
                </p>
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-2">
                {names.map((n, i) => {
                  const dotColor = SEGMENT_COLORS[i % SEGMENT_COLORS.length].fill;
                  return (
                    <span
                      key={`${n}-${i}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-2 text-xs font-medium text-foreground"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className="max-w-[140px] truncate">{n}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {chance}%
                      </span>
                      <button
                        type="button"
                        onClick={() => removeName(i)}
                        disabled={spinning}
                        aria-label={`ลบ ${n}`}
                        className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-destructive disabled:opacity-40"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {names.length > 0 && (
              <div className="mt-6 flex justify-end border-t border-white/[0.07] pt-4">
                <Button
                  onClick={reset}
                  variant="outline"
                  size="sm"
                  disabled={spinning}
                  className="gap-2 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>ล้างรายชื่อทั้งหมด</span>
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Result Dialog */}
        <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
          <DialogContent className="max-w-xs rounded-2xl border-white/10 bg-popover/95 text-center backdrop-blur-xl">
            <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Trophy className="h-7 w-7" />
            </div>
            <DialogTitle className="text-xs font-medium tracking-wider text-muted-foreground">
              ผู้ที่ถูกสุ่มได้ในรอบนี้
            </DialogTitle>
            <DialogDescription className="sr-only">
              แสดงรายชื่อผู้เล่นที่วงล้อสุ่มเลือกได้
            </DialogDescription>
            <p className="mt-1 break-words text-3xl font-bold text-primary">{result}</p>
            <p className="text-sm text-muted-foreground">ถึงตาของคุณแล้วในรอบนี้!</p>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPopupOpen(false)}
                  className="flex-1 rounded-xl border-white/10 bg-white/[0.03]"
                >
                  ปิด
                </Button>
                <Button
                  onClick={spin}
                  disabled={names.length < 2}
                  className="flex-1 rounded-xl font-semibold"
                >
                  หมุนอีกครั้ง
                </Button>
              </div>
              {winnerIndex !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeWinnerFromWheel}
                  className="gap-1.5 rounded-xl text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>ลบชื่อนี้ออกจากวงล้อ</span>
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default WheelGame;
