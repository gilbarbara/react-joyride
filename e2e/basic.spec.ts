import './__setup__/global.d';

import { expect, test } from '@playwright/test';

import { getScrollTop, waitForScrollEnd } from './__setup__/utils';

test('basic', async ({ page }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Load page', async () => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('hero.png');
  });

  await test.step('Start the tour', async () => {
    await page.getByRole('button', { name: 'Start' }).click();
    await expect(tooltip).toContainText("Let's begin our journey!");
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2', async () => {
    await page.getByTestId('button-primary').click();

    await expect(page.locator('.react-joyride__loader')).toBeVisible();
    await expect(page).toHaveScreenshot('step2-loader.png');

    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(109);
    await expect(tooltip).toContainText('A step with delay (500ms)');
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Our projects', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(658);

    await expect(tooltip).toContainText('Our projects');
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Fixed elements', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(658);

    await expect(tooltip).toContainText('Fixed elements and no arrow');
    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Step 5 - Our Mission', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(1175);

    await expect(tooltip).toContainText('Our Mission');
    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Step 6 - All about us', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);
    await expect.poll(() => getScrollTop(page)).toBeAround(2051);

    await expect(tooltip).toContainText('All about us');
    await expect(page).toHaveScreenshot('step6-tooltip.png');
  });

  await test.step('Step 7 - Final', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page);

    await expect(tooltip).toContainText("Let's all folks");
    await expect(page).toHaveScreenshot('step7-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
  });
});
