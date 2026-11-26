import { Link, useLocation } from 'react-router-dom';
import { Spade, Dices, Disc3, Home as HomeIcon } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'ไพ่ปาร์ตี้', path: '/cards', Icon: Spade },
  { label: 'ลูกเต๋า 3D', path: '/dice', Icon: Dices },
  { label: 'วงล้อสุ่ม', path: '/wheel', Icon: Disc3 },
];

const AppHeader = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.07] bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 transition-transform duration-200 group-hover:scale-105">
            <Spade className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-bold tracking-wide text-foreground sm:text-base">
              Drink &amp; Deal
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:inline">
              เกมปาร์ตี้กับเพื่อน
            </span>
          </div>
        </Link>

        <nav aria-label="เมนูเลือกเกม" className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1">
          {!isHome && (
            <Link
              to="/"
              aria-label="หน้าหลัก"
              className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground sm:px-2.5"
            >
              <HomeIcon className="h-4 w-4" />
            </Link>
          )}
          {NAV_ITEMS.map(({ label, path, Icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-white/[0.06] hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
