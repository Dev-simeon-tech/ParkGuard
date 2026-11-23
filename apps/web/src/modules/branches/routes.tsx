import { PermissionSets } from '@parkguard/authorization';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AccessGuard } from '@/components/AccessGuard';
import { Routes } from '@/config/routes';
import { lazyImport } from '@/utils/lazyImport';

const { BranchesPage } = lazyImport(() => import('./pages/Branches'), 'BranchesPage');

export const branchesRoutes: RouteObject[] = [
  {
    path: Routes.branches,
    element: (
      <AccessGuard
        permission={PermissionSets.branches.MANAGE}
        fallback={<Navigate to={Routes.forbidden} replace />}
      >
        <BranchesPage />
      </AccessGuard>
    ),
  },
];
