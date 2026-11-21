import { createBrowserRouter } from 'react-router-dom';
import { CenteredLayout } from '@/components/CenteredLayout';
import { authPublicRoutes } from '@/modules/auth/routes';
import { guestRoutes } from './auth';
import { commonRoutes } from './common';
import { protectedRoutes } from './protected';

const wrappedPublicRoutes = authPublicRoutes.map((route) => ({
  ...route,
  element: <CenteredLayout>{route.element}</CenteredLayout>,
}));

export const router = createBrowserRouter([
  ...guestRoutes,
  ...protectedRoutes,
  ...wrappedPublicRoutes,
  ...commonRoutes,
]);
