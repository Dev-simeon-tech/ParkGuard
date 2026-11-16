import globals from 'globals';
import { base } from './base.js';

/**
 * Flat config for Node/Express apps.
 * @type {import('eslint').Linter.Config[]}
 */
export const nodeConfig = [
  ...base,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
    },
    rules: {
      'no-console': 'warn',
    },
  },
];

export default nodeConfig;
