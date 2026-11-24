import { PermissionSets } from '@parkguard/authorization';
import type { PermissionKey } from '@parkguard/authorization';
import {
  LayoutGrid,
  UserRound,
  Building2,
  CarFront,
  ChartColumnIncreasing,
  ClipboardList,
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { RefAttributes, ForwardRefExoticComponent, FunctionComponent, SVGProps } from 'react';
import { NavLink, Link } from 'react-router-dom';
import type { NavLinkRenderProps } from 'react-router-dom';
import Logo from '@/assets/logo-dark.svg?react';
import { Routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

type SidebarLink = {
  label: string;
  path: string;
  icon:
    | ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    | FunctionComponent<SVGProps<SVGSVGElement>>;
  permission?: readonly PermissionKey[];
};

const navLinks: SidebarLink[] = [
  { label: 'Dashboard', path: Routes.dashboard, icon: LayoutGrid },
  {
    label: 'Employees',
    path: Routes.employees,
    icon: UserRound,
    permission: PermissionSets.organization.MANAGE_MEMBERS,
  },
  {
    label: 'Branches',
    path: Routes.branches,
    icon: Building2,
    permission: PermissionSets.branches.MANAGE,
  },
  {
    label: 'Parking Log',
    path: Routes.parkingLog,
    icon: ClipboardList,
    permission: PermissionSets.sessions.VIEW,
  },
  {
    label: 'Vehicles',
    path: Routes.vehicles,
    icon: CarFront,
    permission: PermissionSets.sessions.VIEW,
  },
  {
    label: 'Revenue',
    path: Routes.revenue,
    icon: ChartColumnIncreasing,
    permission: PermissionSets.revenue.MANAGE,
  },
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const auth = useAuth();
  const links = navLinks.filter((link) => !link.permission || auth.hasPermission(link.permission));

  return (
    <aside
      aria-label="Main navigation"
      className={`fixed inset-y-0 left-0 z-30 flex w-[min(19rem,84vw)] flex-col bg-primary-container px-2.5 pb-5 pt-6 shadow-[0_24px_60px_-36px_rgba(55,42,25,.3)] transition-transform duration-300 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:w-full lg:translate-x-0 lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <Link to={Routes.home} aria-label="ParkGuard home" className="mb-10 px-2">
        <Logo className="h-8 w-auto" />
      </Link>
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
        Workspace
      </p>
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }: NavLinkRenderProps) =>
                cn(
                  'group flex items-center gap-3 font-heading tracking-wide rounded-full px-3.5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-secondary-variant/20 ',
                  isActive &&
                    'bg-secondary font-semibold text-white hover:bg-white hover:text-secondary ',
                )
              }
            >
              <Icon width={18} height={18} className="size-4.5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="mt-auto rounded-2xl shadow-xl text-white bg-secondary p-4">
        <p className="text-xs font-semibold text-white">Need a hand?</p>
        <p className="mt-1 text-xs leading-5 text-white">
          Your team can help with your parking operations.
        </p>
      </div>
    </aside>
  );
}
