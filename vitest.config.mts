import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['test/**/*.spec.ts?(x)'],
    coverage: {
      include: ['src/**/*.ts?(x)'],
      exclude: ['src/types/**', 'src/global.d.ts', 'src/modules/dom.ts'],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: [
      '@testing-library/react/dont-cleanup-after-each',
      './test/__setup__/vitest.setup.ts',
    ],
  },
});
