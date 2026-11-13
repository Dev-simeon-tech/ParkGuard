import { Permissions } from './permissions';

type NestedValue<T> = T extends object ? NestedValue<T[keyof T]> : T;

export type PermissionKey = NestedValue<typeof Permissions>;
