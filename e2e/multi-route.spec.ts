import { expect, test } from '@playwright/test';

test('multi-route', async ({ page }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Load page', async () => {
    await page.goto('/multi-route');
    await expect(page).toHaveScreenshot('home.png');
  });

  await test.step('Start the tour', async () => {
    await page.getByRole('button', { name: 'Start the tour' }).click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('This is the home page');
    await expect(page).toHaveScreenshot('step1-home.png');
  });

  await test.step('Step 2 - Route A', async () => {
    await page.getByTestId('button-primary').click();
    await page.waitForURL('**/multi-route/a');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('This is Route A');
    await expect(page).toHaveScreenshot('step2-route-a.png');
  });

  await test.step('Step 3 - Route B', async () => {
    await page.getByTestId('button-primary').click();
    await page.waitForURL('**/multi-route/b');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('This is Route B');
    await expect(page).toHaveScreenshot('step3-route-b.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
    await expect(page).toHaveScreenshot('step3-route-b-after.png');
  });
});
