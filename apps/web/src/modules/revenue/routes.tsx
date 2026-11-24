import { PermissionSets } from '@parkguard/authorization';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AccessGuard } from '@/components/AccessGuard';
import { Routes } from '@/config/routes';
import { lazyImport } from '@/utils/lazyImport';

const { RevenuePage } = lazyImport(() => import('./pages/RevenuePage'), 'RevenuePage');

export const revenueRoutes: RouteObject[] = [
  {
    path: Routes.revenue,
    element: (
      <AccessGuard
        permission={PermissionSets.revenue.MANAGE}
        fallback={<Navigate to={Routes.forbidden} replace />}
      >
        <RevenuePage />
      </AccessGuard>
    ),
  },
];
