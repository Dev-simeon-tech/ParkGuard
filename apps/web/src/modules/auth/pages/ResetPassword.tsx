import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { InfoCard } from '@/components/InfoCard';
import { Spinner } from '@/components/Spinner';
import { Routes } from '@/config/routes';
import { useVerifyResetPasswordToken } from '../api/verifyResetPasswordToken';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { data, isLoading, isError } = useVerifyResetPasswordToken(token);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <InfoCard
        title="Password reset"
        subtitle="Your password has been updated. Please sign in."
        action={
          <Button asChild>
            <Link to={Routes.login}>Go to sign in</Link>
          </Button>
        }
      />
    );
  }

  if (isError || !data) {
    return (
      <InfoCard
        variant="error"
        title="This link is invalid or has expired"
        subtitle="Please request a new password reset link."
        action={
          <Button asChild>
            <Link to={Routes.forgotPassword}>Request new link</Link>
          </Button>
        }
      />
    );
  }

  return <ResetPasswordForm token={token} email={data.email} onSuccess={() => setIsSuccess(true)} />;
}
