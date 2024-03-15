import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    include: ['test/**/*.spec.ts?(x)'],
    coverage: {
      all: true,
      include: ['src/**/*.ts?(x)'],
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
      '@testing-library/react/dont-cleanup-after-each', './test/__setup__/vitest.setup.ts',
    ],
  },
});
