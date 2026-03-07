import './__setup__/global.d';

import { expect, test } from '@playwright/test';

import { getScrollTop, waitForScrollEnd } from './__setup__/utils';

test('scroll', async ({ page, request }) => {
  const overlay = page.locator('.react-joyride__overlay');
  const primaryButton = page.getByTestId('button-primary');
  const container = '.app__scroller';

  await test.step('Warmup', async () => {
    await request.get('/demos/scroll?e2e=true');
  });

  await test.step('Load page', async () => {
    await page.goto('/demos/scroll?e2e=true', { waitUntil: 'networkidle' });

    await expect(page.getByText('Works with custom scrolling parents!')).toBeVisible();
  });

  await test.step('Step 1 - Custom Scroll Parent', async () => {
    const beacon = page.getByTestId('button-beacon');

    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(0);
    await expect(page).toHaveScreenshot('step1-beacon.png');
    await beacon.click();

    await waitForScrollEnd(page, container);
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Typography', async () => {
    await primaryButton.click();
    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(0);

    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Color Palette', async () => {
    await primaryButton.click();
    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(360);

    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - Spacing Scale', async () => {
    await primaryButton.click();
    await waitForScrollEnd(page, container);

    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Step 5 - Button Variants', async () => {
    await primaryButton.click();
    await waitForScrollEnd(page, container);

    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await primaryButton.click();
    await expect(overlay).not.toBeVisible();
    await expect(page).toHaveScreenshot('tour-end.png');
  });
});
