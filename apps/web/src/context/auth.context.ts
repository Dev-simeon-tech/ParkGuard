import type { PermissionKey } from '@parkguard/authorization';
import type { AuthResponse } from '@parkguard/types';
import { createContext } from 'react';

export type AuthContextValue = {
  branches: AuthResponse['branches'];
  user: AuthResponse['user'] | null;
  organization: AuthResponse['organization'] | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: readonly PermissionKey[]) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
