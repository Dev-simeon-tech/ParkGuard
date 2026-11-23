import { LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/modules/auth/api/logout';
import { clearSession } from '@/modules/auth/utils';
import { formatRoleName, roleBadgeVariants } from '@/modules/employees/utils';
import { Badge } from '../Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../DropdownMenu';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function Header({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const auth = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      clearSession();
    }
  };

  return (
    <header className="sticky top-0 z-10 flex bg-white/40 backdrop-blur-2xl h-16 items-center justify-between border-b px-4  sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-[#716d64] transition hover:bg-[#f5efe3] hover:text-[#211f1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="hidden size-10 shrink-0 place-items-center rounded-xl text-[#716d64] transition hover:bg-secondary-variant/20 hover:text-[#211f1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary lg:grid"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
        <div className="hidden h-7 border-l border-[#e9e1d6] sm:block" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#292721]">
            {auth.organization?.name || 'ParkGuard'}
          </p>
          <p className="hidden text-xs text-[#938b7e] sm:block">Parking operations</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden text-xs font-medium text-[#837c70] lg:block">
          {auth.user?.firstName ? `Welcome, ${auth.user.firstName}` : ''}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full  ">
            <Avatar className="size-8 cursor-pointer border-none">
              <AvatarFallback className="absolute inset-0 grid place-items-center border-none bg-secondary text-2xl text-white">
                {auth.user?.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent collisionPadding={20} className="ml-20">
            <DropdownMenuItem className="text-sm capitalize">
              {auth.user?.firstName} {auth.user?.lastName}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-neutral-400">
              {auth.user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-secondary capitalize">
              {auth.user?.role && (
                <Badge className={`${roleBadgeVariants[auth.user?.role]} text-white`}>
                  {formatRoleName(auth.user.role)}
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut strokeWidth={1.5} />
              <span className="ml-2">{logoutMutation.isPending ? 'Signing out…' : 'Sign out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
