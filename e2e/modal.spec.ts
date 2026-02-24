import { expect, test } from '@playwright/test';

test('modal', async ({ page }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Load page', async () => {
    await page.goto('/modal');
    await expect(page.getByText('It works with modals')).toBeVisible();
    await expect(page).toHaveScreenshot('hero.png');
  });

  await test.step('Open modal', async () => {
    await page.getByRole('button', { name: 'Open Modal' }).click();
    await expect(page.getByText('A react-modal example')).toBeVisible();
  });

  await test.step('Step 1 - Beacon', async () => {
    const beacon = page.locator('.react-joyride__beacon');

    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step1-beacon.png');
    await beacon.click();
  });

  await test.step('Step 1 - Input (spotlightClicks)', async () => {
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('input inside a modal');
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Tab navigation', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Tabs or spaces?');
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Button', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("A button! That's rare");
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Inside', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("what's inside my mind");
    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Step 5 - The modal', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Modal, Portal, Quintal!');
    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
  });
});
