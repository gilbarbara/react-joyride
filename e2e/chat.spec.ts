import './__setup__/global.d';

import { expect, test } from '@playwright/test';

test('chat', async ({ page, request }) => {
  const overlay = page.locator('.react-joyride__overlay');
  const primaryButton = page.getByTestId('button-primary');

  await test.step('Warmup', async () => {
    await request.get('/demos/chat?e2e=true');
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/chat?e2e=true', { waitUntil: 'networkidle' });

    await expect(page.getByText('Chat App')).toBeVisible();
  });

  await test.step('Step 1 - Workspace', async () => {
    const beacon = page.getByTestId('button-beacon');

    await expect(beacon).toBeVisible();
    await expect(page).toHaveScreenshot('step1-beacon.png');
    await beacon.click();

    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Search', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Channels', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Direct Messages', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Step 5 - Channel Info', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Step 6 - Reactions', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step6-tooltip.png');
  });

  await test.step('Step 7 - Message Composer', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step7-tooltip.png');
  });

  await test.step('Step 8 - Create New', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step8-tooltip.png');
  });

  await test.step('Step 9 - Your Profile', async () => {
    await primaryButton.click();

    await expect(page).toHaveScreenshot('step9-tooltip.png');
  });

  await test.step('Step 9 - Your Profile', async () => {
    await primaryButton.click();

    await expect(overlay).not.toBeVisible();
    await expect(page).toHaveScreenshot('tour-end.png');
  });
});
