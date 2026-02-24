import { expect, test } from '@playwright/test';

test('carousel', async ({ page }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Load page', async () => {
    await page.goto('/carousel');
  });

  await test.step('Step 1 - Intro', async () => {
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('You can control external widgets');
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Image Two', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Black and white photos');
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Image Three', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Also known as grayscale');
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Image Four', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Desaturate, Obfuscate');
    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Step 5 - Image Five', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Dark days and lonely nights');
    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
  });
});
