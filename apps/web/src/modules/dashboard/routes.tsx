import type { RouteObject } from 'react-router-dom';
import { Routes } from '@/config/routes';
import { lazyImport } from '@/utils/lazyImport';

const { DashboardPage } = lazyImport(() => import('./pages/Dashboard'), 'DashboardPage');
const { ForbiddenPage } = lazyImport(() => import('./pages/Forbidden'), 'ForbiddenPage');

export const dashboardRoutes: RouteObject[] = [
  { path: Routes.dashboard, element: <DashboardPage /> },
  { path: Routes.forbidden, element: <ForbiddenPage /> },
];
