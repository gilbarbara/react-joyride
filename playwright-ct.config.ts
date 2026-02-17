import { resolve } from 'path';

import { defineConfig, devices, expect } from '@playwright/experimental-ct-react';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  snapshotDir: './e2e/__snapshots__',
  snapshotPathTemplate: '{testDir}/__snapshots__/{testName}/{arg}-{projectName}{ext}',
  testDir: './e2e',
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
    launchOptions: {
      slowMo: process.env.SLO_MO ? Number(process.env.SLO_MO) : 0,
    },
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
