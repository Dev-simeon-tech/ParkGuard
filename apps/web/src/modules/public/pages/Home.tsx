import {
  Menu,
  ArrowRight,
  CircleCheck,
  DollarSign,
  EyeOff,
  CctvOff,
  Calculator,
  LayoutDashboard,
  Smartphone,
  Slash,
  ScanText,
  Wallet,
  Building2,
  CircleDollarSign,
  CalendarDays,
  IdCard,
  ChartNoAxesCombined,
  Camera,
  Shield,
  BadgeCheck,
} from 'lucide-react';
import { domAnimation, LazyMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/assets/logo-light.svg?react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FeatureCard, type FeatureCardData } from '@/components/ui/grid-feature-cards';
import { Routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import { MetricCounter, AnimatedContainer, RevealSection } from '../components/AnimationComponents';
import { ParkingDashboardIllustration } from '../components/ParkingDashboardIllustration';

const features: FeatureCardData[] = [
  {
    title: 'Smartphone Based Capture',
    icon: Camera,
    description: "Capture and record license plates from an attendant's phone.",
  },
  {
    title: 'Automatic Bill Calculation',
    icon: Wallet,
    description: 'Turn entry and exit captures into accurate parking charges.',
  },
  {
    title: 'Attendant Accountability',
    icon: IdCard,
    description: "Keep a clear record of every attendant's activity.",
  },
  {
    title: 'Multi-Branch Support',
    icon: Building2,
    description: 'Oversee every parking location from one dashboard.',
  },
  {
    title: 'Cashless Payment',
    icon: CircleDollarSign,
    description: 'Track digital payments and parking revenue in one place.',
  },
  {
    title: 'Long-Term Parking',
    icon: CalendarDays,
    description: 'Set maximum billing limits for extended stays.',
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <main className="overflow-x-clip">
      <header
        className={`sticky z-30 mx-auto border px-4 py-3 transition-all duration-300 ease-out motion-reduce:transition-none lg:px-8 ${
          isScrolled
            ? 'top-3 w-[calc(100%-2rem)] max-w-7xl rounded-full border-outline-variant/50 bg-surface/75 shadow-lg shadow-primary-container/10 backdrop-blur-xl'
            : 'top-0 w-full border-outline-variant/60 bg-surface/95'
        }`}
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" aria-label="ParkGuard home">
            <Logo className="h-8 w-auto" />
          </Link>
          <nav
            id="mobile-navigation"
            aria-label="Main navigation"
            className={`${isNavOpen ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-5 border border-outline-variant/60 bg-surface p-5 shadow-xl md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          >
            <a
              className="font-medium text-on-surface-variant transition-colors hover:text-secondary"
              href="#workflow"
              onClick={() => setIsNavOpen(false)}
            >
              How it works
            </a>
            <a
              className="font-medium text-on-surface-variant transition-colors hover:text-secondary"
              href="#features"
              onClick={() => setIsNavOpen(false)}
            >
              Features
            </a>
            <a
              className="font-medium text-on-surface-variant transition-colors hover:text-secondary"
              href="#solution"
              onClick={() => setIsNavOpen(false)}
            >
              The solution
            </a>
            <div className="flex flex-col gap-3 md:hidden">
              {user ? (
                <Link to={Routes.dashboard} onClick={() => setIsNavOpen(false)}>
                  <Button className="w-full gap-2">
                    <LayoutDashboard />
                    <span className="font-bold text-white">Go to Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to={Routes.login} onClick={() => setIsNavOpen(false)}>
                    <Button className="w-full" variant="outline">
                      Log In
                    </Button>
                  </Link>
                  <Link to={Routes.register} onClick={() => setIsNavOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <Link to={Routes.dashboard}>
                <Button className="gap-2">
                  <LayoutDashboard />
                  <span className="font-bold text-white">Go to Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link to={Routes.login}>
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to={Routes.register}>
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
          <Button
            className="md:hidden"
            aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <Menu />
          </Button>
        </div>
      </header>
      <RevealSection className="bg-radial px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 lg:flex-row lg:gap-4">
          <div className="z-10 flex w-full max-w-2xl flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <Badge className="w-fit items-center gap-2 border border-secondary/15 bg-secondary-container/30 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-secondary">
              <BadgeCheck size={15} />
              SMART PARKING, MADE SIMPLE
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-primary-container sm:text-5xl lg:text-6xl">
              Every vehicle accounted for.
              <span className="text-secondary"> Every dollar visible.</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
              Turn a smartphone into your parking control center. Record plates, calculate charges
              automatically, and track every entry, exit, and payment in one live dashboard.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link to={user ? Routes.dashboard : Routes.register}>
                <Button className="w-full gap-2 px-7 py-6 text-base font-semibold shadow-lg shadow-secondary/20 sm:w-auto">
                  Get started
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-outline-variant bg-surface/80 px-6 font-semibold text-primary-container transition-colors hover:bg-white"
                href="#features"
              >
                Explore features
              </a>
            </div>
            <div className="flex flex-col gap-3 pt-1 text-left text-sm text-on-surface-variant sm:flex-row sm:flex-wrap sm:gap-x-6">
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="shrink-0 text-secondary" size={18} />
                No dedicated cameras
              </span>
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="shrink-0 text-secondary" size={18} />
                Start with a smartphone
              </span>
            </div>
          </div>
          <ParkingDashboardIllustration />
        </div>
      </RevealSection>
      <RevealSection
        aria-label="ParkGuard platform highlights"
        className="border-y border-outline-variant/50 bg-white px-5 py-6 sm:px-8 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-3">
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start">
            <Camera className="shrink-0 text-secondary" size={22} />
            <span className="text-sm font-semibold text-primary-container sm:text-base">
              Smartphone Based Capture
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 border-outline-variant/60 text-center sm:border-x sm:px-3">
            <Calculator className="shrink-0 text-secondary" size={22} />
            <span className="text-sm font-semibold text-primary-container sm:text-base">
              Automatic bill calculation
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-center sm:justify-end">
            <ChartNoAxesCombined className="shrink-0 text-secondary" size={22} />
            <span className="text-sm font-semibold text-primary-container sm:text-base">
              Live operational visibility
            </span>
          </div>
        </div>
      </RevealSection>

      <RevealSection
        id="solution"
        className="mt-10 flex scroll-mt-24 flex-col gap-8 px-4 pb-5 text-center *:flex-1 *:rounded-xl *:px-4 *:py-8 *:shadow-md lg:flex-row lg:gap-14 lg:px-8 lg:text-left lg:*:p-10"
      >
        <div className="bg-error-container/10">
          <h2 className="text-error font-bold text-2xl lg:text-3xl">The Problem</h2>
          <ul className="problem-list ">
            <li>
              <div className="relative">
                <DollarSign />
                <Slash className="absolute top-1/2 -translate-y-1/2 -rotate-90 z-10" />
              </div>
              <article>
                <h3>Under-reporting Cash</h3>
                <p>
                  Attendants take payments but don&apos;t record entries, leading to massive revenue
                  leakage.
                </p>
              </article>
            </li>
            <li>
              <div>
                <EyeOff />
              </div>
              <article>
                <h3>Zero Visibility</h3>
                <p>
                  No real-time way to know how many cars are in your lot or what your current
                  balance is.
                </p>
              </article>
            </li>
            <li>
              <div>
                <CctvOff />
              </div>
              <article>
                <h3>Expensive Hardware</h3>
                <p>
                  Traditional camera systems (LPR) cost thousands in installation and maintenance.
                </p>
              </article>
            </li>
          </ul>
        </div>
        <div className="bg-secondary-container/10">
          <h2 className="text-secondary font-bold text-2xl lg:text-3xl">The ParkGuard Solution</h2>
          <ul className="solution-list">
            <li>
              <div>
                <Calculator />
              </div>
              <article>
                <h3>Automatic Calculation</h3>
                <p>
                  Bills are generated by the system based on capture timestamps. No manual math
                  allowed.
                </p>
              </article>
            </li>
            <li>
              <div>
                <LayoutDashboard />
              </div>
              <article>
                <h3>Real-time Dashboard</h3>
                <p>Monitor every entry, exit, and payment instantly from any device, anywhere.</p>
              </article>
            </li>
            <li>
              <div>
                <Smartphone />
              </div>
              <article>
                <h3>Smartphone-Based</h3>
                <p>
                  Runs on existing phones. Download the app and start managing your lot in 5
                  minutes.
                </p>
              </article>
            </li>
          </ul>
        </div>
      </RevealSection>

      <section
        id="features"
        aria-labelledby="features-heading"
        className="feature-list mt-10 scroll-mt-24 bg-white px-4 py-14 sm:px-8 md:py-20 lg:mt-15 lg:px-8"
      >
        <LazyMotion features={domAnimation}>
          <div className="mx-auto w-full max-w-7xl space-y-10">
            <AnimatedContainer className="mx-auto max-w-3xl text-center">
              <h2
                id="features-heading"
                className="text-4xl font-extrabold tracking-tight text-black text-balance sm:text-5xl lg:text-6xl"
              >
                Features
              </h2>
              <p className="mt-4 text-base tracking-wide text-muted-foreground text-balance md:text-lg">
                Everything you need to run a modern parking operation, all in one place.
              </p>
            </AnimatedContainer>

            <AnimatedContainer
              delay={0.4}
              className="grid grid-cols-1 divide-y divide-dashed divide-outline-variant/60 border border-dashed border-outline-variant/60 sm:grid-cols-2 sm:divide-x lg:grid-cols-3"
            >
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </AnimatedContainer>
          </div>
        </LazyMotion>
      </section>

      <section
        id="workflow"
        className="mt-15 scroll-mt-24 bg-primary-container px-4 py-15 text-center lg:px-8"
      >
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">A Smarter Workflow</h2>
          <p className="text-lg text-on-primary-container pt-2">
            Three steps to operational excellence.
          </p>
        </div>
        <LazyMotion features={domAnimation}>
          <div className="workflow mt-15 flex flex-col justify-between gap-8 lg:flex-row">
            <AnimatedContainer className="flex-1" delay={0.1}>
              <article>
                <div>
                  <Camera />
                </div>
                <h3>1. Attendant Captures Plate</h3>
                <p>
                  The attendant uses the ParkGuard app to capture the license plate upon vehicle
                  entry. The system captures the precise timestamp and GPS location.
                </p>
              </article>
            </AnimatedContainer>
            <AnimatedContainer className="flex-1" delay={0.35}>
              <article>
                <div>
                  <Calculator />
                </div>
                <h3>2. System Tracks & Calculates</h3>
                <p>
                  When the vehicle exits, a second capture triggers an automatic bill calculation.
                  Billing rates can only me changed by the Admin.
                </p>
              </article>
            </AnimatedContainer>
            <AnimatedContainer className="flex-1" delay={0.6}>
              <article>
                <div>
                  <ChartNoAxesCombined />
                </div>
                <h3>3. Admin Gets Full Visibility</h3>
                <p>
                  Live data streams to your dashboard. Review revenue reports, peak occupancy times,
                  and attendant performance from your smartphone or laptop.
                </p>
              </article>
            </AnimatedContainer>
          </div>
        </LazyMotion>
      </section>
      <LazyMotion features={domAnimation}>
        <section className="stats flex lg:justify-between justify-center text-center items-center bg-secondary flex-wrap gap-8 py-15 px-10">
          <article>
            <h3>
              <MetricCounter value={15} suffix="%+" />
            </h3>
            <p>REDUCE LEAKAGE</p>
          </article>
          <article>
            <h3>
              <MetricCounter value={24} suffix="/7" />
            </h3>
            <p>REAL-TIME REPORTING</p>
          </article>
          <article>
            <h3>
              <MetricCounter value={0} prefix="₦" />
            </h3>
            <p>HARDWARE COSTS</p>
          </article>
          <article>
            <h3>
              <MetricCounter value={5} suffix="min" />
            </h3>
            <p>SETUP IN MINUTES</p>
          </article>
        </section>
      </LazyMotion>

      <RevealSection className="bg-background-variant flex justify-center items-center py-15">
        <div className="bg-primary-container lg:rounded-3xl p-8 lg:p-15 py-20 flex flex-col gap-8 text-center">
          <h3 className="text-white text-3xl lg:text-5xl lg:max-w-[30ch] mx-auto font-bold">
            Ready to Take Control of Your Parking Revenue?
          </h3>
          <p className="text-on-primary-container text-lg">
            Join hundreds of operators who have eliminated revenue leakage and modernized their
            operations.
          </p>
          <Link to={Routes.register}>
            <Button className="px-12 py-6">Create your Account</Button>
          </Link>
        </div>
      </RevealSection>
      <footer className="bg-white border border-outline-variant pt-15 pb-4 px-4 lg:px-8">
        <Logo />
        <p className="pt-8 pb-12 max-w-[40ch]">
          The Nigeria&apos;s first smartphone-based parking management system designed to eliminate
          attendant dishonesty and maximize operator revenue.
        </p>
        <div className=" flex justify-between flex-col lg:flex-row gap-2 text-center">
          <p>&copy;2026 ParkGuard. All rights reserved.</p>
          <p>
            <Shield className="inline" />
            <span className="pl-2">SSL Secured</span>
          </p>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
