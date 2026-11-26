import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="glass-surface w-full max-w-md rounded-2xl p-8 text-center animate-scale-in">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <Compass className="h-7 w-7" />
          </div>
          <p className="font-display text-xs font-semibold tracking-[0.25em] text-primary">
            ERROR 404
          </p>
          <h1 className="mt-2 text-2xl font-bold text-foreground">ไม่พบหน้าที่คุณต้องการ</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ลิงก์นี้อาจถูกย้ายหรือไม่มีอยู่ในระบบ กรุณากลับไปหน้าหลักเพื่อเลือกเกม
          </p>
          <Button asChild className="mt-6 gap-2 rounded-xl px-6">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้าหลัก
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
