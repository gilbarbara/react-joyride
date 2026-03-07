import './__setup__/global.d';

import { expect, test } from '@playwright/test';

import { getScrollTop, waitForScrollEnd } from './__setup__/utils';

test('controlled', async ({ page, request }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const loader = page.locator('.react-joyride__loader');

  await test.step('Warmup', async () => {
    await request.get('/demos/controlled?e2e=true');
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/controlled?e2e=true', { waitUntil: 'networkidle' });
  });

  await test.step('Initial layout', async () => {
    await expect(page).toHaveScreenshot('initial.png');
  });

  await test.step('Step 1 - Menu', async () => {
    await page.getByTestId('button-control').click();

    await expect(tooltip).toContainText('Notifications Button');

    await expect(page).toHaveScreenshot('step1-menu.png', { timeout: 10_000 });
  });

  await test.step('Step 2 - Notifications', async () => {
    await page.getByLabel('Toggle Notifications').click();

    await expect(page.locator('#notifications')).toBeInViewport();
    await expect(tooltip).toContainText('Notifications');
    await expect(page).toHaveScreenshot('step2-notifications.png');
  });

  await test.step('Step 3 - Mark as read', async () => {
    await page.getByTestId('button-primary').click();

    await waitForScrollEnd(page, '#notifications');
    await expect.poll(() => getScrollTop(page, '#notifications')).toBeAround(492);

    await expect(tooltip).toContainText('Mark as read');
    await expect(page).toHaveScreenshot('step3-mark-as-read.png');
  });

  await test.step('Step 4 - Calendar', async () => {
    await page.getByTestId('button-primary').click();

    await expect(tooltip).toContainText('The schedule');
    await expect(page).toHaveScreenshot('step4-calendar.png');
  });

  await test.step('Step 5 - Growth', async () => {
    await page.getByTestId('button-primary').click();

    await expect(tooltip).toContainText('Our Growth');
    await expect(page).toHaveScreenshot('step5-growth.png');
  });

  await test.step('Step 6 - Fake step (loader)', async () => {
    await page.getByTestId('button-primary').click();

    await expect(loader).toBeVisible();
    await expect(page).toHaveScreenshot('step6-loader.png');
  });

  await test.step('Step 7 - Users', async () => {
    await expect(tooltip).toContainText('Our Users');
    await expect(page).toHaveScreenshot('step7-users.png');
  });

  await test.step('Step 8 - Connections', async () => {
    await page.getByTestId('button-primary').click();

    await expect(tooltip).toContainText('Network connections');
    await expect(page).toHaveScreenshot('step8-connections.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();

    await expect(page).toHaveScreenshot('tour-end.png');
  });
});
