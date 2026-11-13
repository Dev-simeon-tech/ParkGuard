import js from '@eslint/js';
import importXPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

/**
 * Shared base flat-config, extended by react.js and node.js.
 * @type {import('eslint').Linter.Config[]}
 */
export const base = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: { 'import-x': importXPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    // Ambient .d.ts files often need `interface` for declaration merging
    // (e.g. augmenting Vite's `ImportMetaEnv`) — `type` can't do that.
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  {
    ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**', '.turbo/**'],
  },
];

export default base;
