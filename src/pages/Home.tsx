import { Link } from 'react-router-dom';
import { Spade, Dices, Disc3, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import AppHeader from '@/components/AppHeader';

const GAMES = [
  {
    title: 'ไพ่ปาร์ตี้',
    subtitle: '52 ใบ · ปรับแต่งกติกาได้',
    description: 'จั่วไพ่ 52 ใบพร้อมกติกาประจำแต้ม แก้ไขกติกาให้เข้ากับวงเพื่อน และดูประวัติย้อนหลังได้ครบ',
    Icon: Spade,
    path: '/cards',
    iconClass: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/25',
    glowClass: 'group-hover:border-emerald-400/35 group-hover:shadow-[0_16px_45px_-20px_rgba(16,185,129,0.45)]',
  },
  {
    title: 'ทอยลูกเต๋า 3D',
    subtitle: '3D · ผู้เล่น 1–6 คน',
    description: 'กำหนดชื่อผู้เล่นประจำหน้าลูกเต๋า 1–6 แล้วทอยลูกเต๋าแบบ 3 มิติเพื่อสุ่มผู้โชคดีในแต่ละรอบ',
    Icon: Dices,
    path: '/dice',
    iconClass: 'bg-amber-500/15 text-amber-300 ring-amber-400/25',
    glowClass: 'group-hover:border-amber-400/35 group-hover:shadow-[0_16px_45px_-20px_rgba(245,158,11,0.45)]',
  },
  {
    title: 'วงล้อสุ่มชื่อ',
    subtitle: 'สุ่มยุติธรรม · สูงสุด 12 คน',
    description: 'เพิ่มรายชื่อผู้เล่นได้ถึง 12 คน พร้อมแสดงโอกาสออกของแต่ละคน แล้วหมุนวงล้อหาผู้ที่ถูกเลือก',
    Icon: Disc3,
    path: '/wheel',
    iconClass: 'bg-rose-500/15 text-rose-300 ring-rose-400/25',
    glowClass: 'group-hover:border-rose-400/35 group-hover:shadow-[0_16px_45px_-20px_rgba(244,63,94,0.45)]',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        {/* Hero */}
        <div className="mb-12 flex max-w-xl flex-col items-center text-center animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>พร้อมเล่นทันที ไม่ต้องสมัครสมาชิก</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            เริ่มวงปาร์ตี้ให้สนุกขึ้น
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            เลือกเกมที่อยากเล่นกับเพื่อนได้ทันที ทั้งไพ่ปาร์ตี้ ทอยลูกเต๋า 3 มิติ และวงล้อสุ่มรายชื่อ
            ใช้งานง่ายบนทุกหน้าจอ
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          {GAMES.map(({ Icon, ...game }) => (
            <Link
              key={game.path}
              to={game.path}
              className={`group glass-surface relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${game.glowClass}`}
            >
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 ${game.iconClass}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {game.subtitle}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-foreground">{game.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-primary">
                <span>เข้าเล่นเกม</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>บันทึกสถานะเกมอัตโนมัติ เล่นต่อได้ทันทีแม้รีเฟรชหน้าเว็บ</span>
        </div>
      </main>
    </div>
  );
};

export default Home;
