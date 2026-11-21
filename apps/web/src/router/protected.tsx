import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import { dashboardRoutes } from '@/modules/dashboard/routes';
import { employeesRoutes } from '@/modules/employees/routes';

export function ProtectedRoute() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`${Routes.login}?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }

  return <Outlet />;
}

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [...dashboardRoutes, ...employeesRoutes],
      },
    ],
  },
];
