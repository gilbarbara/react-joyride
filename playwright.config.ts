import { defineConfig, devices, expect } from '@playwright/test';

const config = defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.025,
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
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: process.env.SLO_MO ? Number(process.env.SLO_MO) : 0,
    },
  },
  webServer: {
    command: 'pnpm website:serve',
    port: 3000,
    reuseExistingServer: !process.env.CI,
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
