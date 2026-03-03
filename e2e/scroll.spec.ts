import './__setup__/global.d';

import { expect, test } from '@playwright/test';

import { getScrollTop, waitForScrollEnd } from './__setup__/utils';

test('scroll', async ({ page }) => {
  const tooltip = page.locator('.react-joyride__tooltip');
  const overlay = page.locator('.react-joyride__overlay');
  const container = '.app__scroller';

  await test.step('Load page', async () => {
    await page.goto('/scroll');
    await expect(page.getByText('Works with custom scrolling parents!')).toBeVisible();
  });

  await test.step('Step 1 - Beacon', async () => {
    const beacon = page.locator('.react-joyride__beacon');

    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(0);
    await expect(page).toHaveScreenshot('step1-beacon.png');
    await beacon.click();
  });

  await test.step('Step 1 - New Features in React 18', async () => {
    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(0);

    await expect(tooltip).toContainText('The latest version of React!');
    await expect(page).toHaveScreenshot('step1-tooltip.png');
  });

  await test.step('Step 2 - Server Components', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(0);

    await expect(tooltip).toContainText('Yay! Server components');
    await expect(page).toHaveScreenshot('step2-tooltip.png');
  });

  await test.step('Step 3 - Suspense SSR', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(332);

    await expect(tooltip).toContainText('This is the way.');
    await expect(page).toHaveScreenshot('step3-tooltip.png');
  });

  await test.step('Step 4 - React Refresh', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(247);

    await expect(tooltip).toContainText('Code, Debug, Repeat.');
    await expect(page).toHaveScreenshot('step4-tooltip.png');
  });

  await test.step('Step 5 - In Conclusion', async () => {
    await page.getByTestId('button-primary').click();
    await waitForScrollEnd(page, container);
    await expect.poll(() => getScrollTop(page, container)).toBeAround(600);

    await expect(tooltip).toContainText('Several exciting features');
    await expect(page).toHaveScreenshot('step5-tooltip.png');
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();
    await expect(overlay).not.toBeVisible();
    await expect(page).toHaveScreenshot('step5-after.png');
  });
});
