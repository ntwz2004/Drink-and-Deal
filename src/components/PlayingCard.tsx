import { isRedSuit, type PlayingCard as CardType } from '@/lib/gameData';
import CardPips from './CardPips';
import FaceCard from './FaceCard';

interface Props {
  card: CardType;
  isFlipping: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const FACE_RANKS = ['J', 'Q', 'K'] as const;

const PlayingCard = ({ card, isFlipping, onClick, disabled }: Props) => {
  const red = isRedSuit(card.suit);
  const isFace = (FACE_RANKS as readonly string[]).includes(card.rank);
  const colorClass = red ? 'text-card-red' : 'text-card-black';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={disabled ? `ไพ่ ${card.rank}${card.suit}` : `ไพ่ ${card.rank}${card.suit} แตะเพื่อจั่วใบถัดไป`}
      className={`relative h-80 w-56 sm:h-96 sm:w-64 rounded-2xl transition-transform duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        disabled ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
      }`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative h-full w-full rounded-2xl ${isFlipping ? 'animate-card-3d-flip' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
        } as React.CSSProperties}
      >
        {/* === FRONT === */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl bg-white"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
            border: '1px solid rgba(15, 23, 42, 0.14)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.18), 0 22px 44px -10px rgba(0,0,0,0.55)',
          } as React.CSSProperties}
        >
          <div
            className={`absolute inset-0 ${isFlipping ? 'animate-card-face-reveal' : ''}`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            } as React.CSSProperties}
          >
            {/* Corner index — top left */}
            <div className={`absolute top-3 left-3.5 z-20 flex flex-col items-center leading-none ${colorClass}`}>
              <span className="font-display text-xl font-bold">{card.rank}</span>
              <span className="text-base -mt-0.5">{card.suit}</span>
            </div>

            {/* Center */}
            {isFace ? (
              <FaceCard rank={card.rank} suit={card.suit} />
            ) : (
              <CardPips rank={card.rank} suit={card.suit} colorClass={colorClass} />
            )}

            {/* Corner index — bottom right */}
            <div
              className={`absolute bottom-3 right-3.5 z-20 flex rotate-180 flex-col items-center leading-none ${colorClass}`}
            >
              <span className="font-display text-xl font-bold">{card.rank}</span>
              <span className="text-base -mt-0.5">{card.suit}</span>
            </div>
          </div>
        </div>

        {/* === BACK === */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-950 via-[#0d2621] to-[#081917]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            boxShadow: '0 22px 44px -10px rgba(0,0,0,0.55)',
          } as React.CSSProperties}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent 0 9px, hsl(38 92% 58% / 0.45) 9px 10px), repeating-linear-gradient(-45deg, transparent 0 9px, hsl(160 60% 50% / 0.25) 9px 10px)',
            }}
          />
          <div className="absolute inset-3 rounded-xl border border-primary/30" />
        </div>
      </div>
    </button>
  );
};

export default PlayingCard;
