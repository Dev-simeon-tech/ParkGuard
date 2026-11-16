/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(configDirectory, './src'),
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_PORT) || 9280,
    },
    build: {
      outDir: 'build',
      manifest: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.spec.{ts,tsx}',
          'src/**/__tests__/**',
          'src/test/**',
          'src/**/*.d.ts',
          'src/main.tsx',
        ],
      },
    },
  };
});
