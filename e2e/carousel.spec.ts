import { expect, test } from '@playwright/test';

test('carousel', async ({ page, request }) => {
  const tooltip = page.getByTestId('carousel-tooltip');
  const overlay = page.locator('.react-joyride__overlay');

  await test.step('Warmup', async () => {
    await request.get('/demos/carousel?e2e=true');
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/carousel?e2e=true', { waitUntil: 'networkidle' });

    await expect(page).toHaveScreenshot('initial.png');
  });

  await test.step('Step 1 - Image 1', async () => {
    await page.getByTestId('button-control').click();

    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step1-image-1.png');
  });

  await test.step('Step 1 - Image 1', async () => {
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step1-image-1.png');
  });

  await test.step('Step 2 - Image 2 (via next)', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step2-image-2.png');
  });

  await test.step('Step 3 - Image 5 (via thumb)', async () => {
    await page.getByTestId('carousel-thumb-4').click();
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step3-image-5.png');
  });

  await test.step('Step 4 - Loop forward - Image 1 (via next)', async () => {
    await page.getByTestId('button-primary').click();
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step4-loop-forward.png');
  });

  await test.step('Step 5 - Loop backward - Image 5 (via back)', async () => {
    await page.getByTestId('button-back').click();
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step5-loop-backward.png');
  });

  await test.step('Step 6 - Image 3 (via thumb)', async () => {
    await page.getByTestId('carousel-thumb-2').click();
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step6-image-3.png');
  });

  await test.step('Step 7 - Close the tour', async () => {
    await page.getByTestId('button-close').click();
    await expect(overlay).not.toBeVisible();
    await expect(page).toHaveScreenshot('step7-closed.png');
  });

  await test.step('Step 8 - Reopen - resumes at Image 3', async () => {
    await page.getByTestId('button-control').click();

    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step8-reopened.png');
  });

  await test.step('Step 9 - Image 4 (via thumb)', async () => {
    await page.getByTestId('carousel-thumb-3').click();
    await expect(tooltip).toBeVisible();
    await expect(page).toHaveScreenshot('step9-image-4.png');
  });

  await test.step('Step 10 - Close the tour again', async () => {
    await page.getByTestId('button-close').click();
    await expect(overlay).not.toBeVisible();

    await expect(page).toHaveScreenshot('tour-end.png');
  });
});
