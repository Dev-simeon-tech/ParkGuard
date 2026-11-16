import { ArrowLeft, House } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo-light.svg?react';
import { Button } from '@/components/Button';
import { Routes } from '@/config/routes';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen">
      <header className="flex justify-between p-4 lg:px-8 items-center relative shadow-lg">
        <Logo />
      </header>
      <section className="flex  flex-col items-center mt-10 text-center gap-4">
        <div className="relative w-60 h-60 flex items-center justify-center">
          <div className="pointer-events-none w-full h-full rounded-full blur-xl bg-secondary-container  absolute inset-0  opacity-20" />
          <p className="text-8xl text-primary-container font-bold">404</p>
        </div>
        <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
        <p className="text-xl max-w-[60ch]">
          The page you are looking for doesn&apos;t exist, has been relocated, or is unavailable.
        </p>
        <div className="flex gap-2 mt-4 items-center">
          <Link to={Routes.home}>
            <Button className="gap-2">
              <House />
              <p className="text-white">Go Home</p>
            </Button>
          </Link>
          <Button className="gap-2" variant={'outline'} onClick={() => navigate(-1)}>
            <ArrowLeft />
            <p>Go to previous</p>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
