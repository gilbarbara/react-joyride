import { expect, test } from '@playwright/test';

const urls = [
  '/demos/multi-route?e2e=true',
  '/demos/multi-route/a?e2e=true',
  '/demos/multi-route/b?e2e=true',
  '/demos/multi-route/c?e2e=true',
];

test('multi-route', async ({ page, request }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Warmup', async () => {
    for (const url of urls) {
      await request.get(url);
    }
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/multi-route?e2e=true', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('initial.png');
  });

  await test.step('Start the tour', async () => {
    await page.getByRole('button', { name: 'Start the tour' }).click();
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step1-home.png');
  });

  await test.step('Step 2 - Route A', async () => {
    await page.getByTestId('button-primary').click();
    await page.waitForURL('/demos/multi-route/a?e2e=true');

    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step2-route-a.png');
  });

  await test.step('Step 3 - Route B', async () => {
    await page.getByTestId('button-primary').click();
    await page.waitForURL('/demos/multi-route/b?e2e=true');

    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step3-route-b.png');
  });

  await test.step('Step 3 - Route B - New step', async () => {
    await expect(page.getByTestId('button-primary')).toHaveText('Last');

    await page.locator('#learn-more').click();

    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step3-route-b-with-extra-step.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();

    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step4-route-c.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();

    await expect(page).toHaveScreenshot('tour-end.png');
  });
});
