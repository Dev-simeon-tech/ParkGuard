import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { CenteredLayout } from '@/components/CenteredLayout';
import { Routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import { authRoutes as authModuleRoutes } from '@/modules/auth/routes';

export function GuestRoute() {
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  if (auth.isAuthenticated) {
    return <Navigate to={redirect ? decodeURIComponent(redirect) : Routes.dashboard} replace />;
  }

  return (
    <CenteredLayout>
      <Outlet />
    </CenteredLayout>
  );
}

export const guestRoutes: RouteObject[] = [
  {
    element: <GuestRoute />,
    children: authModuleRoutes,
  },
];
