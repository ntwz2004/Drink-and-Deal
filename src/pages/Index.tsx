import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';
import PlayingCard from '@/components/PlayingCard';
import CardDeck from '@/components/CardDeck';
import RulesModal from '@/components/RulesModal';
import HistoryPanel from '@/components/HistoryPanel';
import {
  createDeck,
  DEFAULT_RULES,
  isRedSuit,
  type PlayingCard as CardType,
  type Rank,
} from '@/lib/gameData';
import { RotateCcw, Sparkles, Shuffle } from 'lucide-react';
import { useGameSession } from '@/hooks/useGameSession';

interface CardState {
  deck: CardType[];
  drawnCard: CardType | null;
  history: CardType[];
  rules: Record<Rank, string>;
}

const TOTAL = 52;

const Index = () => {
  const [deck, setDeck] = useState<CardType[]>(() => createDeck());
  const [drawnCard, setDrawnCard] = useState<CardType | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<CardType[]>([]);
  const [rules, setRules] = useState<Record<Rank, string>>({ ...DEFAULT_RULES });

  const { loaded, initial, save } = useGameSession<CardState>('card_state');

  // Restore saved state
  useEffect(() => {
    if (loaded && initial?.deck) {
      setDeck(initial.deck);
      setDrawnCard(initial.drawnCard ?? null);
      setHistory(initial.history ?? []);
      setRules({ ...DEFAULT_RULES, ...(initial.rules ?? {}) });
    }
  }, [loaded, initial]);

  // Persist state
  useEffect(() => {
    if (!loaded) return;
    save({ deck, drawnCard, history, rules });
  }, [loaded, deck, drawnCard, history, rules, save]);

  const remaining = deck.length;
  const progressPercent = (remaining / TOTAL) * 100;

  const drawCard = useCallback(() => {
    if (deck.length === 0 || isFlipping) return;
    setIsFlipping(true);
    const [card, ...rest] = deck;
    setDrawnCard(card);
    setDeck(rest);
    setHistory((h) => [...h, card]);
    setTimeout(() => setIsFlipping(false), 850);
  }, [deck, isFlipping]);

  const resetDeck = useCallback(() => {
    setDeck(createDeck());
    setDrawnCard(null);
    setHistory([]);
    setIsFlipping(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        {/* Title & progress */}
        <div className="mb-7 flex w-full flex-col items-center text-center">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
            <Sparkles className="h-3 w-3" />
            <span>เกมไพ่ 52 ใบ</span>
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ไพ่ปาร์ตี้
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            แตะที่ไพ่หรือกดปุ่มเพื่อจั่วทีละใบ และทำตามกติกาประจำแต้ม
          </p>

          {/* Progress indicator */}
          <div className="mt-5 flex w-full max-w-xs flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {remaining > 0 ? 'ไพ่คงเหลือในสำรับ' : 'จั่วครบทั้งสำรับแล้ว'}
              </span>
              <span className="font-semibold text-foreground tabular-nums">
                {remaining} / {TOTAL} ใบ
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Stage */}
        <div className="relative flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl"
          />

          {drawnCard ? (
            <>
              <PlayingCard
                card={drawnCard}
                isFlipping={isFlipping}
                onClick={drawCard}
                disabled={remaining === 0 || isFlipping}
              />

              {/* Rule Panel */}
              <div
                key={drawnCard.id}
                className="glass-surface w-full rounded-2xl p-5 text-center animate-fade-up"
              >
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 font-display text-xs font-bold shadow-sm ${
                      isRedSuit(drawnCard.suit) ? 'text-card-red' : 'text-card-black'
                    }`}
                  >
                    {drawnCard.rank} {drawnCard.suit}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    กติการอบนี้
                  </span>
                </div>
                <p className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
                  {rules[drawnCard.rank]}
                </p>
              </div>
            </>
          ) : (
            <CardDeck
              remaining={remaining}
              total={TOTAL}
              onClick={drawCard}
              disabled={remaining === 0}
            />
          )}

          {/* Primary Action */}
          <div className="flex w-full max-w-xs flex-col items-center gap-2">
            {remaining > 0 ? (
              <Button
                onClick={drawCard}
                disabled={isFlipping}
                size="lg"
                className="h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
              >
                {isFlipping
                  ? 'กำลังเปิดไพ่...'
                  : drawnCard
                    ? 'จั่วไพ่ใบถัดไป'
                    : 'จั่วไพ่ใบแรก'}
              </Button>
            ) : (
              <Button
                onClick={resetDeck}
                size="lg"
                className="h-12 w-full gap-2 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
              >
                <Shuffle className="h-4 w-4" />
                <span>สับไพ่เริ่มรอบใหม่</span>
              </Button>
            )}
          </div>
        </div>

        {/* Secondary Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <HistoryPanel history={history} rules={rules} />
          <RulesModal rules={rules} onSave={setRules} />
          <Button
            onClick={resetDeck}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
          >
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            <span>สับไพ่ใหม่</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
