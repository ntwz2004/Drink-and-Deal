export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface PlayingCard {
  suit: Suit;
  rank: Rank;
  id: string;
}

export const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const isRedSuit = (suit: Suit): boolean => suit === '♥' || suit === '♦';

export const DEFAULT_RULES: Record<Rank, string> = {
  'A': 'ดื่มคนเดียว 1 รอบ',
  '2': 'เลือกเพื่อนร่วมดื่ม 1 คน',
  '3': 'เลือกเพื่อนร่วมดื่ม 2 คน',
  '4': 'เพื่อนฝั่งซ้ายดื่ม',
  '5': 'ห้าเฮฮา — ทุกคนดื่มพร้อมกัน',
  '6': 'เพื่อนฝั่งขวาดื่ม',
  '7': 'บัดดี้ — เลือกคู่ดื่มไปด้วยกัน',
  '8': 'พักได้ — รอบนี้ปลอดภัย',
  '9': 'เกมนับเลข — ใครพลาดดื่ม',
  '10': 'เพื่อนฝั่งซ้ายและขวาดื่ม',
  'J': 'จับหน้า — ใครจับช้าสุดดื่ม',
  'Q': 'ควีนห้ามคุย — ใครเผลอคุยด้วยดื่ม',
  'K': 'คิงสั่งได้ — ตั้งกฎหรือสั่งเพื่อนได้ 1 อย่าง',
};

export const SPECIAL_RANKS: Rank[] = ['5', 'K', 'A'];

export function createDeck(): PlayingCard[] {
  const deck: PlayingCard[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${rank}${suit}` });
    }
  }
  return shuffle(deck);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
