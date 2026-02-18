import { expect, test } from '@playwright/test';

test('custom components', async ({ page }) => {
  const tooltip = page.getByTestId('tooltip');
  const overlay = page.locator('.react-joyride__overlay');
  const primaryButton = page.locator('[data-action="primary"]');
  const beacon = page.getByTestId('button-beacon');

  await test.step('Load page', async () => {
    await page.goto('/custom');
    await expect(page.getByText('You can use custom components!')).toBeVisible();
  });

  await test.step('Step 1 - Beacon', async () => {
    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step1-beacon.png');
  });

  await test.step('Step 1 - Tooltip', async () => {
    await beacon.click();
    await expect(tooltip).toContainText('Our awesome projects');
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Beacon', async () => {
    await primaryButton.click();
    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step2-beacon.png');
  });

  await test.step('Step 2 - Our Mission (no overlay)', async () => {
    await beacon.click();
    await expect(tooltip).toContainText('Our Mission');
    await expect(overlay).not.toBeVisible();
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Beacon', async () => {
    await primaryButton.click();
    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step3-beacon.png');
  });

  await test.step('Step 3 - The good stuff', async () => {
    await beacon.click();
    await expect(tooltip).toContainText('The good stuff');
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Beacon', async () => {
    await primaryButton.click();
    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step4-beacon.png');
  });

  await test.step('Step 4 - We are the people', async () => {
    await beacon.click();
    await expect(tooltip).toContainText('We are the people');
    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await primaryButton.click();
    await expect(overlay).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Restart the tour' })).toBeVisible();
  });
});
