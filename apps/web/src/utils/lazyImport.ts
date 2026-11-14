import { lazy } from 'react';
import type { ComponentType } from 'react';

export function lazyImport<T extends Record<string, ComponentType>, K extends keyof T>(
  factory: () => Promise<T>,
  name: K,
): T {
  return {
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  } as unknown as T;
}
