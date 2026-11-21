import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { InfoCard } from '@/components/InfoCard';
import { Routes } from '@/config/routes';

export function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <InfoCard
        variant="error"
        title="You don't have permission to view this page"
        action={
          <Button asChild>
            <Link to={Routes.dashboard}>Back to dashboard</Link>
          </Button>
        }
      />
    </div>
  );
}
