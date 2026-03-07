import { expect, test } from '@playwright/test';

test('custom components', async ({ page, request }) => {
  const tooltip = page.getByTestId('tooltip');
  const overlay = page.locator('.react-joyride__overlay');
  const primaryButton = page.locator('[data-action="primary"]');
  const beacon = page.getByTestId('button-beacon');

  await test.step('Warmup', async () => {
    await request.get('/demos/custom-components?e2e=true');
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/custom-components?e2e=true', { waitUntil: 'networkidle' });

    await expect(page.getByText('Custom Components & Controls')).toBeVisible();
  });

  await test.step('Step 1 - Beacon', async () => {
    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step1-beacon.png');
  });

  await test.step('Step 1 - Tooltip', async () => {
    await beacon.hover({ force: true });

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Custom Beacon');
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Beacon', async () => {
    await primaryButton.click();

    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step2-beacon.png');
  });

  await test.step('Step 2 - Tooltip', async () => {
    await beacon.click();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Custom Tooltip');
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 2 - Switch to continuous', async () => {
    await page.getByTestId('continuous-toggle').click();

    await expect(page).toHaveScreenshot('step2a-tooltip-continuous.png');
  });

  await test.step('Step 3 - Tooltip', async () => {
    await primaryButton.click();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('ESC is disabled');
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Tooltip', async () => {
    await primaryButton.click();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Programmatic Control');
    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await primaryButton.click();

    await expect(overlay).not.toBeVisible();
    await expect(page).toHaveScreenshot('tour-end.png');
  });
});
