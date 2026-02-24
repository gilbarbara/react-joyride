import { expect, test } from '@playwright/test';

test('controlled', async ({ page }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Load page', async () => {
    await page.goto('/controlled');
  });

  await test.step('Step 1 - Menu (spotlightClicks)', async () => {
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Click the menu above!');
    await expect(page).toHaveScreenshot('step1-menu.png');
  });

  await test.step('Step 2 - Sidebar', async () => {
    await page.getByLabel('Toggle Sidebar').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('This is our sidebar');
    await expect(page).toHaveScreenshot('step2-sidebar.png');
  });

  await test.step('Step 3 - Disclaimer', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('disclaimer of the terms of service');
    await expect(page).toHaveScreenshot('step3-disclaimer.png');
  });

  await test.step('Step 4 - Calendar', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Check the availability');
    await expect(page).toHaveScreenshot('step4-calendar.png');
  });

  await test.step('Step 5 - Growth', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Our rate is off the charts');
    await expect(page).toHaveScreenshot('step5-growth.png');
  });

  await test.step('Step 6 - Fake step (loader)', async () => {
    await page.getByTestId('button-primary').click();
    const loader = page.locator('.react-joyride__loader');

    await expect(loader).toBeVisible();
    await expect(page).toHaveScreenshot('step6-loader.png');
  });

  await test.step('Step 7 - Users (after fake step skipped)', async () => {
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Our Users');
    await expect(page).toHaveScreenshot('step7-users.png');
  });

  await test.step('Step 8 - Connections', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('awesome connections');
    await expect(page).toHaveScreenshot('step8-connections.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
  });
});
