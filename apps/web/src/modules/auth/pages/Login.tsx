import { Link } from 'react-router-dom';
import Logo from '@/assets/logo-light.svg?react';
import { Routes } from '@/config/routes';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div className="space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-sm mx-auto">
      <div className="flex justify-center items-center flex-col gap-2">
        <Link to={Routes.home}>
          <Logo />
        </Link>
        <h1 className="text-xl font-semibold mt-6">Welcome Back</h1>
        <p className="text-on-surface-variant text-base">Login in to your organisation account</p>
      </div>
      <LoginForm />
      <p className="text-sm text-neutral-500 text-center">
        Don&apos;t have an account?{' '}
        <Link to={Routes.register} className="font-medium hover:underline text-secondary">
          Create one
        </Link>
      </p>
    </div>
  );
}
