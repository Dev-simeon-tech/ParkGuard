import {
  Menu,
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
import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBg from '@/assets/hero_bg.png';
import Logo from '@/assets/logo-light.svg?react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <main className="overflow-x-hidden">
      <header className="flex justify-between p-4 lg:px-8 items-center relative shadow-lg">
        <Logo />

        <div
          className={`md:flex md:flex-row md:shadow-none md:w-fit md:static gap-6  md:items-center bg-surface  left-0 top-full ${isNavOpen ? 'flex flex-col absolute p-4 shadow-2xl w-full' : 'hidden'}`}
        >
          {user ? (
            <Link className="mx-auto" to={Routes.dashboard}>
              <Button className="gap-2">
                <LayoutDashboard />
                <p className="font-bold text-white">Go to Dashboard</p>
              </Button>
            </Link>
          ) : (
            <>
              <Link className="font-semibold font-headline" to={Routes.login}>
                <Button className="w-full" variant={'outline'}>
                  Log In
                </Button>
              </Link>
              <Link className="w-full md:w-fit" to={Routes.register}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          className="md:hidden"
          aria-expanded={isNavOpen}
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <Menu />
        </Button>
      </header>
      <section className="mt-10 px-6 lg:px-8 flex justify-between gap-8 flex-col lg:flex-row ">
        <div className="flex justify-center items-center md:items-start gap-6 lg:gap-8 lg:text-left text-center max-w-180 flex-col">
          <Badge className="bg-secondary-container/30 text-secondary w-fit py-1 px-4 flex gap-0.5 items-center justify-center text-[12px]">
            <BadgeCheck size={15} />
            <span className="font-bold">THE FUTURE OF PARKING OPS</span>
          </Badge>
          <h1 className="text-primary-container text-4xl lg:text-6xl font-bold">
            Manage your Parking Lots Today
          </h1>
          <p className="lg:text-xl ">
            ParkGuard uses your smartphones to scan license plates, calculate bills automatically,
            and give you real visibility into what your parking lot actually earns — no expensive
            cameras required.
          </p>
          <Link to={user ? Routes.dashboard : Routes.register}>
            <Button className="py-6 lg:w-[20%] min-w-fit">Get Started</Button>
          </Link>
          <p className="text-outline text-left">
            <CircleCheck className="text-secondary inline mr-2" />
            Trust Line:{' '}
            <span className="font-bold">
              {' '}
              No hardware installation. No custom cameras. Just a smartphone.
            </span>
          </p>
        </div>
        <div className="relative ">
          <div className="pointer-events-none w-[120%] h-full lg:-top-9 lg:-left-20 rounded-l-full blur-xl  bg-secondary-container  absolute inset-0  opacity-20" />
          <img className="relative  max-w-full" src={HeroBg} alt="ParkGuard app and web" />
        </div>
      </section>

      <section className="mt-10  flex px-4 lg:px-8 text-center pb-5 lg:text-left flex-col lg:flex-row gap-8 *:flex-1 *:px-4 *:py-8 *:rounded-xl *:shadow-md lg:*:p-10 lg:gap-14 ">
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
                  Bills are generated by the system based on scan timestamps. No manual math
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
      </section>

      <section className="feature-list mt-10 lg:mt-15 bg-background-variant py-15 px-4 lg:px-8">
        <article className="text-center">
          <h2 className="text-3xl lg:text-4xl pb-5 font-bold text-primary-container">
            Built for Modern Operators
          </h2>
          <p className="lg:text-xl">Enterprise-grade features that fit in your pocket.</p>
        </article>

        <div className="mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <article>
            <ScanText />
            <h3>Smartphone Plate Scanning</h3>
            <p>High-speed OCR technology scans plates accurately in low light or extreme angles.</p>
          </article>
          <article>
            <Wallet />
            <h3>Automatic Bill Calculation</h3>
            <p>
              Instantly calculates exact amounts based on your custom rates and time of entry/exit.
            </p>
          </article>
          <article>
            <IdCard />
            <h3>Attendant Accountability</h3>
            <p>
              View and manage attendant activities such as scan logs and transaction records in
              real-time.
            </p>
          </article>
          <article>
            <Building2 />
            <h3>Multi-Branch Support</h3>
            <p>Manage multiple parking lots from a single unified admin panel.</p>
          </article>
          <article>
            <CircleDollarSign />
            <h3>Cashless Payment</h3>
            <p>Integrate with a POS for your organization to prevent theft and fraud.</p>
          </article>
          <article>
            <CalendarDays />
            <h3>Long-Term Parking</h3>
            <p>Supports long-term parking arrangements with by setting a maximum billing limit.</p>
          </article>
        </div>
      </section>

      <section className="mt-15 py-15 px-4 lg:px-8 bg-primary-container text-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">A Smarter Workflow</h2>
          <p className="text-lg text-on-primary-container pt-2">
            Three steps to operational excellence.
          </p>
        </div>
        <div className="workflow mt-15 flex flex-col lg:flex-row gap-8 justify-between">
          <article>
            <div>
              <Camera />
            </div>
            <h3>1. Attendant Scans Plate</h3>
            <p>
              The attendant uses the ParkGuard app to scan the license plate upon vehicle entry. The
              system captures the precise timestamp and GPS location.
            </p>
          </article>
          <article>
            <div>
              <Calculator />
            </div>
            <h3>2. System Tracks & Calculates</h3>
            <p>
              When the vehicle exits, a second scan triggers an automatic bill calculation. Billing
              rates can only me changed by the Admin.
            </p>
          </article>
          <article>
            <div>
              <ChartNoAxesCombined />
            </div>
            <h3>3. Admin Gets Full Visibility</h3>
            <p>
              Live data streams to your dashboard. Review revenue reports, peak occupancy times, and
              attendant performance from your smartphone or laptop.
            </p>
          </article>
        </div>
      </section>
      <section className="stats flex lg:justify-between justify-center text-center items-center bg-secondary flex-wrap gap-8 py-15 px-10">
        <article>
          <h3>15%+</h3>
          <p>REDUCE LEAKAGE</p>
        </article>
        <article>
          <h3>24/7</h3>
          <p>REAL-TIME REPORTING</p>
        </article>
        <article>
          <h3>₦0</h3>
          <p>HARDWARE COSTS</p>
        </article>
        <article>
          <h3>5min</h3>
          <p>SETUP IN MINUTES</p>
        </article>
      </section>

      <section className="bg-background-variant flex justify-center items-center py-15">
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
      </section>
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
