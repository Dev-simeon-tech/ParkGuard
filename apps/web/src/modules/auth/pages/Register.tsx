import { Link } from 'react-router-dom';
import { Routes } from '@/config/routes';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <div className="space-y-6 bg-white p-8 rounded-lg shadow-md md:w-120 w-full mx-auto">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <RegisterForm />
      <p className="text-sm text-neutral-500 text-center">
        Already have an account?{' '}
        <Link to={Routes.login} className="font-medium hover:underline text-secondary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
