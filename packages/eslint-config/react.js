import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import { base } from './base.js';

/**
 * Flat config for Vite + React apps.
 * @type {import('eslint').Linter.Config[]}
 */
export const reactConfig = [
  ...base,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      // Explicit version, not 'detect': eslint-plugin-react's auto-detection
      // calls a `context.getFilename()` API removed in ESLint 10 and crashes.
      react: { version: '19.2' },
    },
  },
];

export default reactConfig;
