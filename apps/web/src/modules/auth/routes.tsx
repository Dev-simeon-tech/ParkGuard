import type { RouteObject } from 'react-router-dom';
import { Routes } from '@/config/routes';
import { lazyImport } from '@/utils/lazyImport';

const { AcceptInvitePage } = lazyImport(() => import('./pages/AcceptInvite'), 'AcceptInvitePage');
const { ForgotPasswordPage } = lazyImport(() => import('./pages/ForgotPassword'), 'ForgotPasswordPage');
const { LoginPage } = lazyImport(() => import('./pages/Login'), 'LoginPage');
const { RegisterPage } = lazyImport(() => import('./pages/Register'), 'RegisterPage');
const { ResetPasswordPage } = lazyImport(() => import('./pages/ResetPassword'), 'ResetPasswordPage');
const { VerifyEmailPage } = lazyImport(() => import('./pages/VerifyEmail'), 'VerifyEmailPage');

export const authRoutes: RouteObject[] = [
  { path: Routes.login, element: <LoginPage /> },
  { path: Routes.register, element: <RegisterPage /> },
  { path: Routes.forgotPassword, element: <ForgotPasswordPage /> },
];

export const authPublicRoutes: RouteObject[] = [
  { path: Routes.resetPassword, element: <ResetPasswordPage /> },
  { path: Routes.verifyEmail, element: <VerifyEmailPage /> },
  { path: Routes.acceptInvite, element: <AcceptInvitePage /> },
];
