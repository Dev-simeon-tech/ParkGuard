import { PermissionSets } from '@parkguard/authorization';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AccessGuard } from '@/components/AccessGuard';
import { Routes } from '@/config/routes';
import { lazyImport } from '@/utils/lazyImport';

const { ParkingLogPage } = lazyImport(() => import('./pages/ParkingLog'), 'ParkingLogPage');

export const parkingLogRoutes: RouteObject[] = [
  {
    path: Routes.parkingLog,
    element: (
      <AccessGuard
        permission={PermissionSets.sessions.VIEW}
        fallback={<Navigate to={Routes.forbidden} replace />}
      >
        <ParkingLogPage />
      </AccessGuard>
    ),
  },
];
