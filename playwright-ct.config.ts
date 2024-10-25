import { resolve } from 'path';

import { defineConfig, devices, expect } from '@playwright/experimental-ct-react';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['scroll.spec.tsx'],
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  snapshotDir: './e2e/__snapshots__',
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}-{projectName}{ext}',
  testDir: './e2e',
  timeout: 10 * 1000,
  use: {
    ctPort: 3100,
    ctViteConfig: {
      resolve: {
        alias: {
          '~': resolve(__dirname, './src'),
        },
      },
    },
    testIdAttribute: 'data-test-id',
    trace: 'on-first-retry',
  },
  workers: process.env.CI ? 1 : undefined,
});

expect.extend({
  toBeAround(expected: number, actual: number, precision = 10) {
    const pass = expected - precision <= actual && actual <= expected + precision;

    if (pass) {
      return {
        message: () => `expected ${actual} not to be around ${expected}`,
        pass: true,
      };
    }

    return {
      message: () => `expected ${actual} to be around ${expected}`,
      pass: false,
    };
  },
});

export default config;
