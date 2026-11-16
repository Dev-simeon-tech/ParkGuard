import { ArrowLeft, BadgeCheck, Building2, ScanLine, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoDark from '@/assets/logo-dark.svg?react';
import LogoLight from '@/assets/logo-light.svg?react';
import { Routes } from '@/config/routes';
import { RegisterForm } from '../components/RegisterForm';

const benefits = [
  { icon: ScanLine, label: 'Record every vehicle entry and exit' },
  { icon: Wallet, label: 'Calculate parking charges automatically' },
  { icon: Building2, label: 'Manage branches from one place' },
];

export function RegisterPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-outline-variant/50 bg-white shadow-[0_32px_90px_-42px_rgba(19,27,46,0.4)] lg:min-h-170 lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary-container p-10 text-white lg:flex xl:p-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'linear-gradient(to bottom right, black, transparent 85%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-28 top-28 size-80 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 top-40 size-56 rounded-full border border-white/10"
        />

        <div className="relative z-10 flex items-center justify-between">
          <Link
            to={Routes.home}
            className="inline-flex items-center gap-3"
            aria-label="ParkGuard home"
          >
            <LogoDark />
          </Link>
          <Link
            to={Routes.home}
            aria-label="Back to home"
            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="relative z-10 py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary-fixed/20 bg-secondary/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-secondary-fixed">
            <BadgeCheck size={15} />
            BUILT FOR PARKING OPERATORS
          </span>
          <h2 className="mt-6 max-w-md text-4xl font-bold leading-[1.08] tracking-tight text-white xl:text-5xl">
            A clearer view of every parking day.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-on-primary-container">
            Keep vehicle activity, parking charges, and your team together in one simple workspace.
          </p>

          <div className="mt-9 space-y-4">
            {benefits.map(({ icon: Icon, label }) => (
              <div
                className="flex items-center gap-3 text-sm font-medium text-white/90"
                key={label}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-secondary-fixed">
                  <Icon size={17} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-white/60">YOUR OPERATIONS, CONNECTED</p>
              <p className="mt-1 font-semibold text-white">From first scan to final report</p>
            </div>
            <div className="flex -space-x-1.5" aria-hidden="true">
              {[0, 1, 2, 3].map((item) => (
                <span
                  className="size-3 rounded-full border-2 border-primary-container bg-secondary-fixed"
                  key={item}
                  style={{ opacity: 1 - item * 0.16 }}
                />
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden="true">
            {['Scan', 'Calculate', 'Review'].map((step, index) => (
              <div className="flex items-center gap-2" key={step}>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary/25 text-[10px] font-bold text-secondary-fixed">
                  {index + 1}
                </span>
                <span className="text-xs font-medium text-white/75">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="px-6 py-8 sm:px-10 sm:py-10 lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <Link
            to={Routes.home}
            className="inline-flex items-center gap-2.5"
            aria-label="ParkGuard home"
          >
            <LogoLight />
          </Link>
          <Link
            to={Routes.home}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-secondary"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>

        <header className="mb-7">
          <p className="text-sm font-semibold text-secondary">GET STARTED</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-container sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant sm:text-base">
            Set up your workspace and bring your parking operations into view.
          </p>
        </header>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link
            to={Routes.login}
            className="font-semibold text-secondary hover:text-secondary-variant hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
