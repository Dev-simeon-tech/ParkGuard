import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { InfoCard } from '@/components/InfoCard';
import { Spinner } from '@/components/Spinner';
import { Routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import { useVerifyEmail } from '../api/verifyEmail';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { isLoading, isError } = useVerifyEmail(token);
  const auth = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <InfoCard
        variant="error"
        title="This link is invalid or has expired"
        subtitle="Request a new verification email from your account."
      />
    );
  }

  return (
    <InfoCard
      title="Email verified"
      subtitle="Your email address has been verified."
      action={
        <Button asChild>
          <Link to={auth.isAuthenticated ? Routes.dashboard : Routes.login}>
            {auth.isAuthenticated ? 'Go to dashboard' : 'Go to sign in'}
          </Link>
        </Button>
      }
    />
  );
}
