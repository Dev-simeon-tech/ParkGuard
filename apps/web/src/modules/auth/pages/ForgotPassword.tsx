import { Link } from 'react-router-dom';
import Logo from '@/assets/logo-light.svg?react';
import { Routes } from '@/config/routes';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg md:w-110 w-full mx-auto">
      <Link className="flex justify-center w-fit mx-auto mb-8" to={Routes.home}>
        <Logo />
      </Link>
      <h1 className="text-xl font-semibold">Forgot your password?</h1>
      <ForgotPasswordForm />
      <p className="text-sm text-neutral-500">
        Remembered it?{' '}
        <Link to={Routes.login} className="font-medium text-secondary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
