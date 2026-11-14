import type { RouteObject } from 'react-router-dom';
import { Routes } from '@/config/routes';
import HomePage from '@/modules/public/pages/Home';
import NotFoundPage from '@/modules/public/pages/NotFound';

export const commonRoutes: RouteObject[] = [
  {
    path: Routes.home,
    element: <HomePage />,
  },
  {
    path: Routes.notFound,
    element: <NotFoundPage />,
  },
];
