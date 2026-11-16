import { AlertCircleIcon } from 'lucide-react';
import { useState, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle, AlertAction } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useResendVerification } from '@/modules/auth/api/resendVerification';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Button } from '../Button';

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const resendVerification = useResendVerification();
  const { user } = useAuth();

  useLayoutEffect(() => {
    setIsSidebarOpen(isMobile ? false : true);
  }, [isMobile]);

  const handleResendVerification = async () => {
    if (!user) return;
    await resendVerification.mutateAsync(user?.email);
  };

  return (
    <div
      className={`grid min-h-screen grid-rows-[auto_1fr] transition-[grid-template-columns] duration-300 ease-in-out ${
        isSidebarOpen ? 'md:grid-cols-[16rem_1fr]' : 'grid-cols-1 md:grid-cols-[0_1fr]'
      }`}
    >
      <div className="md:col-span-2">
        <Header setIsOpen={setIsSidebarOpen} />
      </div>

      <Sidebar isOpen={isSidebarOpen} />
      <main className="p-6 relative h-full overflow-y-auto">
        <div
          onClick={() => setIsSidebarOpen(false)}
          onKeyUp={(e) => e.key === 'Enter' && setIsSidebarOpen(false)}
          tabIndex={-1}
          aria-hidden
          className={`fixed w-full h-full inset-0 z-5 md:hidden bg-black opacity-50 backdrop-blur-xl ${isSidebarOpen ? 'block' : 'hidden pointer-events-none'}`}
        ></div>
        {!user?.emailVerifiedAt && (
          <Alert variant="destructive" className=" mb-5">
            <AlertCircleIcon />
            <AlertTitle>Verification</AlertTitle>
            <AlertDescription>
              Your email is not verified, you must verify to be able to perform task. A link will be
              sent to your email, click resend if you haven&apos;t seen it
            </AlertDescription>
            <AlertAction>
              <Button size={'sm'} onClick={handleResendVerification} variant={'outline'}>
                Resend code
              </Button>
            </AlertAction>
          </Alert>
        )}
        <Outlet />
      </main>
    </div>
  );
}
