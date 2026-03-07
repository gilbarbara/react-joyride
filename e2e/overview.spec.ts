import './__setup__/global.d';

import { expect, test } from '@playwright/test';

import { getScrollTop, waitForScrollEnd } from './__setup__/utils';

test('overview', async ({ page, request }) => {
  const beacon = page.locator('.react-joyride__beacon');
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Warmup', async () => {
    await request.get('/demos/overview/?e2e=true');
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/overview/?e2e=true', { waitUntil: 'networkidle' });

    await expect(beacon).toBeVisible();

    await expect(page).toHaveScreenshot('step1-beacon.png');
  });

  await test.step('Start the tour', async () => {
    await beacon.click();
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - StarBurst (500ms delay)', async () => {
    await page
      .getByTestId('spotlight')
      .locator('path')
      .first()
      .click({
        position: { x: 10, y: 10 },
      });

    await expect(page.locator('.react-joyride__loader')).toBeVisible();
    await expect(page).toHaveScreenshot('step2-loader.png');

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(97);

    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Features', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(720);

    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Disabled interaction', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(720);

    await expect(page.getByText('Step 3 After hook')).toBeVisible();

    await expect(page).toHaveScreenshot('step4-tooltip.png');

    // Close the toast from "after" hook
    await page.getByLabel('closeButton').click();
  });

  await test.step('Step 5 - How It Works', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(1440);

    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Step 6 - Spotlight target', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(1440);

    await expect(page).toHaveScreenshot('step6-tooltip.png');
  });

  await test.step('Step 7 - About', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(2160);

    await expect(page).toHaveScreenshot('step7-tooltip.png');
  });

  await test.step('Step 8 - Fixed element', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(2160);

    await expect(page).toHaveScreenshot('step8-tooltip.png');
  });

  await test.step('Step 9 - Final', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(2160);

    await expect(page).toHaveScreenshot('step9-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();

    await expect(page).toHaveScreenshot('tour-end.png');
  });

  // Resume from Features
  await test.step('Resume from Features', async () => {
    await expect.poll(() => getScrollTop(page)).toBeAround(0);
    await page.getByRole('button', { name: 'Resume from Features' }).click();

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(720);
    await expect(tooltip).toContainText('All the building blocks');
  });

  await test.step('Resume - Step 4 - Disabled interaction', async () => {
    await page.getByTestId('button-primary').click();
    await expect.poll(() => getScrollTop(page)).toBeAround(720);

    await expect(tooltip).toContainText('blockTargetInteraction');
  });

  await test.step('Resume - Step 5 - How It Works', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(1440);

    await expect(tooltip).toContainText('Minimal setup');
  });

  await test.step('Resume - Step 6 - Spotlight target', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(1440);

    await expect(tooltip).toContainText('spotlightTarget');
  });

  await test.step('Resume - Step 7 - About', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(2160);

    await expect(tooltip).toContainText('React 16.8 through 19');
  });

  await test.step('Resume - Step 8 - Fixed element', async () => {
    await page.getByTestId('button-primary').click();
    await expect.poll(() => getScrollTop(page)).toBeAround(2160);

    await expect(tooltip).toContainText('Works with any layout');
  });

  await test.step('Resume - Step 9 - Final', async () => {
    await page.getByTestId('button-primary').click();
    await expect.poll(() => getScrollTop(page)).toBeAround(2160);

    await expect(tooltip).toContainText('Get started with React Joyride');
  });

  await test.step('Resume - Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
  });
});
