import { expect, test } from '@playwright/test';

test('modal-react', async ({ page, request }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');
  const beacon = page.getByTestId('button-beacon');

  await test.step('Warmup', async () => {
    await request.get('/demos/modal?e2e=true');
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/modal?e2e=true', { waitUntil: 'networkidle' });

    await expect(page).toHaveScreenshot('initial.png');
  });

  await test.step('Open modal', async () => {
    await page.getByRole('button', { name: 'Open React Modal' }).click();
    await expect(overlay).not.toBeVisible();

    await expect(page.getByText('User Management')).toBeVisible();
  });

  await test.step('Step 1 - Beacon', async () => {
    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step1-beacon.png');
  });

  await test.step('Step 1 - Toolbar', async () => {
    await beacon.click();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Search and filter');
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Data table', async () => {
    await page.getByTestId('button-primary').click();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Column headers');
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Table options', async () => {
    await page.getByTestId('button-primary').click();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Toggle switches');
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Actions', async () => {
    await page.getByTestId('button-primary').click();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('z-index stacking');

    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
  });

  await test.step('Close settings modal', async () => {
    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByText('It works with modals')).toBeVisible();
    await expect(page).toHaveScreenshot('tour-end.png');
  });
});

test('modal-heroui', async ({ page, request }) => {
  const beacon = page.getByTestId('button-beacon');
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Warmup', async () => {
    await request.get('/demos/modal?e2e=true');
  });

  await test.step('Load page and open HeroUI Modal', async () => {
    await page.goto('/demos/modal?e2e=true');
    await expect(page).toHaveScreenshot('initial.png');
  });

  await test.step('Open modal', async () => {
    await page.getByRole('button', { name: 'Open HeroUI Modal' }).click();
    await expect(page.getByText('Settings', { exact: true })).toBeVisible();
  });

  await test.step('Step 1 - Beacon', async () => {
    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step1-beacon.png');
  });

  await test.step('Step 1 - Settings navigation', async () => {
    await beacon.click();
    await expect(tooltip).toBeVisible();

    await expect(tooltip).toContainText('Navigate between settings');

    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Display Name', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('display name');
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Language', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('preferred language');
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Private Profile', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('public searches');
    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Step 5 - Notifications sidebar', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('switch to the notifications');
    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Step 6 - Mobile Push', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('mobile device');
    await expect(page).toHaveScreenshot('step6-tooltip.png');
  });

  await test.step('Step 7 - Email & Communication', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('email and communication');
    await expect(page).toHaveScreenshot('step7-tooltip.png');
  });

  await test.step('Step 8 - Marketing & Social', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('marketing and social');
    await expect(page).toHaveScreenshot('step8-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
  });

  await test.step('Close settings modal', async () => {
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('It works with modals')).toBeVisible();
    await expect(page).toHaveScreenshot('tour-end.png');
  });
});
