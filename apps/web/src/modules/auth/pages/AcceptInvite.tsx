import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Logo from '@/assets/logo-light.svg?react';
import { Button } from '@/components/Button';
import { InfoCard } from '@/components/InfoCard';
import { Spinner } from '@/components/Spinner';
import { Routes } from '@/config/routes';
import { useVerifyInvite } from '../api/verifyInvite';
import { AcceptInviteForm } from '../components/AcceptInviteForm';

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { data, isLoading, isError } = useVerifyInvite(token);
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
        title="You're in"
        subtitle="Your password has been set. Please sign in to continue."
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
        title="This invite link is invalid or has expired"
        subtitle="Ask an organization admin to send you a new invite."
      />
    );
  }

  return (
    <div className="w-full mx-auto max-w-sm flex items-center gap-8 flex-col">
      <Logo />
      <AcceptInviteForm
        token={token}
        email={data.email}
        organizationName={data.organizationName}
        onSuccess={() => setIsSuccess(true)}
      />
    </div>
  );
}
