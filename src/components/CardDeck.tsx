import { Spade } from 'lucide-react';

interface Props {
  remaining: number;
  total: number;
  onClick: () => void;
  disabled: boolean;
}

const CardDeck = ({ remaining, total, onClick, disabled }: Props) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Subtle stacked deck layers */}
      {!disabled && remaining > 2 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-80 w-56 sm:h-96 sm:w-64 translate-x-2.5 translate-y-2.5 rotate-[2.5deg] rounded-2xl border border-white/[0.08] bg-emerald-950/60"
        />
      )}
      {!disabled && remaining > 1 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-80 w-56 sm:h-96 sm:w-64 -translate-x-1.5 translate-y-1.5 -rotate-[1.5deg] rounded-2xl border border-white/[0.1] bg-emerald-950/80"
        />
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="แตะเพื่อจั่วไพ่"
        className={`
          group relative h-80 w-56 sm:h-96 sm:w-64 overflow-hidden rounded-2xl
          border border-emerald-400/25 bg-gradient-to-br from-emerald-950 via-[#0d2621] to-[#081917]
          transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary
          ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:-translate-y-1 hover:border-primary/45 active:scale-[0.98] animate-float'}
        `}
        style={{ boxShadow: '0 20px 44px -12px rgba(0,0,0,0.65)' }}
      >
        {/* Subtle lattice pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent 0 9px, hsl(38 92% 58% / 0.45) 9px 10px), repeating-linear-gradient(-45deg, transparent 0 9px, hsl(160 60% 50% / 0.25) 9px 10px)',
          }}
        />
        {/* Inner decorative border */}
        <div className="absolute inset-3 rounded-xl border border-primary/25 transition-colors duration-300 group-hover:border-primary/45" />
        <div className="absolute inset-4 rounded-lg border border-white/[0.06]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/35 transition-transform duration-300 group-hover:scale-110">
            <Spade className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">แตะเพื่อจั่วไพ่</p>
            <p className="mt-1 text-xs text-muted-foreground">เปิดดูไพ่และกติการอบนี้</p>
          </div>
          <span className="mt-1 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-foreground/90 tabular-nums backdrop-blur-sm">
            เหลือ {remaining} / {total} ใบ
          </span>
        </div>
      </button>
    </div>
  );
};

export default CardDeck;
