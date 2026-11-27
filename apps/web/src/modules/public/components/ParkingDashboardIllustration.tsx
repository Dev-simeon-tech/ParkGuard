import {
  ArrowUpRight,
  BadgeCheck,
  CarFront,
  CircleCheck,
  CircleDollarSign,
  Menu,
  Camera,
  Shield,
  Wallet,
} from 'lucide-react';

export function ParkingDashboardIllustration() {
  return (
    <div
      className="relative mx-auto w-full max-w-2xl lg:ml-auto lg:mr-0"
      role="img"
      aria-label="Illustration of the ParkGuard parking dashboard and attendant app"
    >
      <div className="pointer-events-none absolute -inset-5 rounded-[3rem] bg-linear-to-br from-secondary-container/70 via-surface/20 to-primary-fixed/70 blur-2xl" />
      <div className="relative rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_32px_80px_-28px_rgba(19,27,46,0.38)] sm:rounded-3xl sm:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-container text-secondary-fixed">
              <Shield size={18} />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-primary-container">
                ParkGuard
              </span>
              <span className="block text-[10px] font-medium text-slate-500">OPERATIONS</span>
            </span>
          </div>
          <div className="hidden items-center gap-5 text-xs font-medium text-slate-500 sm:flex">
            <span className="font-semibold text-primary-container">Overview</span>
            <span>Vehicles</span>
            <span>Reports</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Menu size={15} />
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
              JD
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 py-4">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Live operations · Main branch</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-primary-container sm:text-xl">
              Good morning, James
            </h2>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-medium sm:text-[11px]">Today&apos;s revenue</span>
              <CircleDollarSign size={15} className="text-secondary" />
            </div>
            <p className="mt-2 text-sm font-bold tracking-tight text-primary-container sm:text-base">
              ₦248,500
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <ArrowUpRight size={12} /> 12.8%
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-medium sm:text-[11px]">Vehicles on site</span>
              <CarFront size={15} className="text-secondary" />
            </div>
            <p className="mt-2 text-sm font-bold tracking-tight text-primary-container sm:text-base">
              48 <span className="text-[10px] font-medium text-slate-400">/ 80</span>
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-3/5 rounded-full bg-secondary" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-medium sm:text-[11px]">Entries today</span>
              <Camera size={15} className="text-secondary" />
            </div>
            <p className="mt-2 text-sm font-bold tracking-tight text-primary-container sm:text-base">
              126
            </p>
            <p className="mt-1 text-[10px] text-slate-400">Across 2 branches</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-medium sm:text-[11px]">Awaiting payment</span>
              <Wallet size={15} className="text-secondary" />
            </div>
            <p className="mt-2 text-sm font-bold tracking-tight text-primary-container sm:text-base">
              ₦32,000
            </p>
            <p className="mt-1 text-[10px] text-slate-400">8 active sessions</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1.55fr_1fr]">
          <div className="rounded-xl border border-slate-100 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-primary-container">Revenue overview</h3>
                <p className="mt-1 text-[10px] text-slate-400">Weekly performance</p>
              </div>
              <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500">
                This week
              </span>
            </div>
            <svg
              className="mt-3 h-28 w-full overflow-visible"
              viewBox="0 0 440 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity=".22" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 94H440M0 59H440M0 24H440" stroke="#e9eef2" strokeDasharray="4 5" />
              <path
                d="M0 91 C24 85 34 71 60 77 S93 94 124 67 S164 70 186 53 S221 64 246 43 S281 55 310 36 S343 49 370 24 S410 31 440 10 V120 H0 Z"
                fill="url(#revenue-fill)"
              />
              <path
                d="M0 91 C24 85 34 71 60 77 S93 94 124 67 S164 70 186 53 S221 64 246 43 S281 55 310 36 S343 49 370 24 S410 31 440 10"
                fill="none"
                stroke="#0d9488"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
              <circle cx="370" cy="24" r="4" fill="white" stroke="#0d9488" strokeWidth="3" />
            </svg>
            <div className="flex justify-between px-1 text-[9px] font-medium text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-primary-container">Recent activity</h3>
              <span className="text-[10px] font-medium text-secondary">View all</span>
            </div>
            <div className="mt-3 space-y-3">
              {[
                { plate: 'KJA 204 AB', time: 'Just now', status: 'Entry' },
                { plate: 'LND 591 XY', time: '2 min ago', status: 'Paid' },
                { plate: 'ABJ 882 CD', time: '5 min ago', status: 'Exit' },
              ].map(({ plate, time, status }) => (
                <div className="flex items-center justify-between gap-2" key={plate}>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary-container/35 text-secondary">
                      <CarFront size={14} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-bold text-primary-container">
                        {plate}
                      </span>
                      <span className="block text-[9px] text-slate-400">{time}</span>
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 right-2 hidden w-36 rounded-[2rem] border-[5px] border-primary-container bg-primary-container p-1.5 shadow-[0_24px_50px_-18px_rgba(19,27,46,0.55)] sm:block lg:-right-4 lg:bottom-5 lg:w-40">
        <div className="overflow-hidden rounded-[1.45rem] bg-white">
          <div className="bg-primary-container px-3 pb-4 pt-3 text-white">
            <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-white/25" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-white/65">PARKGUARD ATTENDANT</p>
                <p className="mt-1 text-xs font-bold">New entry</p>
              </div>
              <BadgeCheck size={16} className="text-secondary-fixed" />
            </div>
          </div>
          <div className="p-3 text-center">
            <p className="text-[9px] font-semibold tracking-wider text-secondary">PLATE DETECTED</p>
            <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-extrabold tracking-widest text-primary-container">
              KJA 204 AB
            </p>
            <div className="my-3 flex items-center justify-center gap-1 text-[9px] text-slate-500">
              <CircleCheck size={12} className="text-secondary" />
              Ready to record
            </div>
            <div className="rounded-lg bg-secondary px-2 py-2 text-[9px] font-bold text-white">
              Confirm vehicle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
