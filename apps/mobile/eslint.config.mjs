import { base } from '@parkguard/eslint-config/base.js';
import expoConfig from 'eslint-config-expo/flat.js';

export default [
  ...base,
  ...expoConfig,
  {
    settings: { react: { version: '19.2' } },
  },
  {
    files: ['metro.config.js', 'tailwind.config.js', 'babel.config.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  { ignores: ['.expo/**', 'ios/**', 'android/**'] },
];
