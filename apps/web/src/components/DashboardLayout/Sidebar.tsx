import { PermissionSets } from '@parkguard/authorization';
import type { PermissionKey } from '@parkguard/authorization';
import {
  LayoutDashboard,
  IdCard,
  Building2,
  ClipboardClock,
  CarFront,
  Banknote,
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
  { label: 'Dashboard', path: Routes.dashboard, icon: LayoutDashboard },
  {
    label: 'Employees',
    path: Routes.employees,
    icon: IdCard,
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
    icon: ClipboardClock,
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
    icon: Banknote,
    permission: PermissionSets.revenue.MANAGE,
  },
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const auth = useAuth();
  const links = navLinks.filter((link) => !link.permission || auth.hasPermission(link.permission));

  return (
    <aside
      className={`h-full md:w-full overflow-hidden w-[70%] z-10 absolute left-0 md:static bg-primary-container px-4 pt-6 pb-3 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      }`}
    >
      <Link to={Routes.home}>
        <Logo className="mb-10" />
      </Link>
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }: NavLinkRenderProps) =>
                cn(
                  'flex items-center gap-2 rounded-md p-3  font-bold text-sm text-on-primary-container hover:text-white',
                  isActive &&
                    'bg-secondary  text-white hover:bg-secondary-container hover:text-on-secondary-container',
                )
              }
            >
              <Icon />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
