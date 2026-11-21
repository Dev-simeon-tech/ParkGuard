import { PermissionSets } from '@parkguard/authorization';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AccessGuard } from '@/components/AccessGuard';
import { Routes } from '@/config/routes';
import { lazyImport } from '@/utils/lazyImport';

const { EmployeesPage } = lazyImport(() => import('./pages/Employees'), 'EmployeesPage');

export const employeesRoutes: RouteObject[] = [
  {
    path: Routes.employees,
    element: (
      <AccessGuard
        permission={PermissionSets.organization.MANAGE_MEMBERS}
        fallback={<Navigate to={Routes.forbidden} replace />}
      >
        <EmployeesPage />
      </AccessGuard>
    ),
  },
];
