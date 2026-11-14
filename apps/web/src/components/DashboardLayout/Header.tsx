import { PanelLeft } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/modules/auth/api/logout';
import { clearSession } from '@/modules/auth/utils';
import { Badge } from '../Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../DropdownMenu';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function Header({ setIsOpen }: { setIsOpen: Dispatch<SetStateAction<boolean>> }) {
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
    <header className="flex items-center justify-between border-b border-neutral-200 px-3 py-3">
      <div className="flex items-center gap-5">
        <div className="pr-3 border-r">
          <PanelLeft onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer" />
        </div>
        <span className="text-sm font-medium">{auth.organization?.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="text-xl text-secondary">
                {auth.user?.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-sm capitalize">
              {auth.user?.firstName} {auth.user?.lastName}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-neutral-400">
              {auth.user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-secondary capitalize">
              <Badge variant={`${auth.user?.role === 'admin' ? 'success' : 'default'}`}>
                {auth.user?.role}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
