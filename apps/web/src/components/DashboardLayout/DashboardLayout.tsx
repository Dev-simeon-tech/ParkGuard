import { AlertCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle, AlertAction } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useResendVerification } from '@/modules/auth/api/resendVerification';
import { Button } from '../Button';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const resendVerification = useResendVerification();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarState, setSidebarState] = useState<{ isMobile: boolean; isOpen: boolean } | null>(
    null,
  );
  const isSidebarOpen = sidebarState?.isMobile === isMobile ? sidebarState.isOpen : !isMobile;
  const setIsSidebarOpen = (nextState: boolean | ((previousState: boolean) => boolean)) => {
    setSidebarState({
      isMobile,
      isOpen: typeof nextState === 'function' ? nextState(isSidebarOpen) : nextState,
    });
  };

  const handleResendVerification = async () => {
    if (!user) return;
    await resendVerification.mutateAsync(user?.email);
  };

  return (
    <div
      className={`min-h-screen bg-primary-container transition-all lg:grid ${
        isSidebarOpen ? 'lg:grid-cols-[16rem_minmax(0,1fr)]' : 'lg:grid-cols-[0_minmax(0,1fr)]'
      }`}
    >
      <div className="overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <div
        className={`min-w-0 transition-all  overflow-hidden bg-white ${isSidebarOpen ? 'lg:rounded-3xl m-3' : 'lg:rounded-none'}`}
      >
        <Header isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="relative min-h-[calc(100vh-88px)] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          {isSidebarOpen && isMobile && (
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-20 cursor-default bg-[#171511]/35 backdrop-blur-[2px]"
            />
          )}
          {!user?.emailVerifiedAt && (
            <Alert variant="destructive" className="mb-5">
              <AlertCircleIcon />
              <AlertTitle>Verification</AlertTitle>
              <AlertDescription>
                Your email is not verified, you must verify to be able to perform task. A link will
                be sent to your email, click resend if you haven&apos;t seen it
              </AlertDescription>
              <AlertAction>
                <Button
                  size="sm"
                  onClick={handleResendVerification}
                  variant="secondary"
                  className="border-2 border-black"
                  disabled={resendVerification.isPending}
                >
                  Resend code
                </Button>
              </AlertAction>
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
