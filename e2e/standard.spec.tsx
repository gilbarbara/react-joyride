/* eslint-disable testing-library/prefer-screen-queries */
import './global.d';

import { expect, test } from '@playwright/experimental-ct-react';

import { ACTIONS, CallBackProps, EVENTS, LIFECYCLE, STATUS } from '../src';
import Standard from '../test/__fixtures__/Standard';

function formatCallbackResponse(input: Partial<CallBackProps>) {
  return {
    controlled: false,
    origin: null,
    size: 7,
    status: STATUS.RUNNING,
    ...input,
  };
}

test.use({ viewport: { width: 1024, height: 768 } });

test('should run the tour', async ({ mount, page }) => {
  const callback: Array<any> = [];

  const getScrollTop = async () => {
    const scrollingElementHandle = await page.evaluateHandle(() =>
      Promise.resolve(document.scrollingElement?.scrollTop),
    );
    const value = scrollingElementHandle.jsonValue();

    await scrollingElementHandle.dispose();

    return value;
  };

  await mount(
    <Standard
      callback={({ step, ...rest }) => {
        callback.push(rest);
      }}
    />,
  );

  await expect(page).toHaveScreenshot('hero.png');

  await page.getByTestId('start').click();

  await expect.poll(() => callback.length).toBe(3);

  expect(callback[0]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.START,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      type: EVENTS.TOUR_START,
    }),
  );

  expect(callback[1]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 0,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[2]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 0,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await expect.poll(getScrollTop).toBeAround(0);
  await expect(page).toHaveScreenshot('step1-tooltip.png');

  /**
   * Second step
   */
  await page.getByTestId('button-primary').click();

  await expect.poll(getScrollTop).toBeAround(800);
  await expect(page).toHaveScreenshot('step2-tooltip.png');

  expect(callback[3]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[4]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 1,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[5]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 1,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(9);

  expect(callback[6]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 1,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  /**
   * Third step
   */
  await expect.poll(getScrollTop).toBeAround(1605);
  await expect(page).toHaveScreenshot('step3-tooltip.png');

  expect(callback[7]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 2,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[8]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 2,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  // Since the button is behind the overlay, we need to click it through the overlay hole
  await page.$eval<any, HTMLButtonElement>('[data-test-id="mission-button"]', element =>
    element.click(),
  );

  await expect.poll(() => callback.length).toBe(12);

  expect(callback[9]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 2,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  /**
   * Fourth step
   */
  await expect.poll(getScrollTop).toBeAround(2335);

  await expect(page).toHaveScreenshot('step4-tooltip.png');

  expect(callback[10]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 3,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[11]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 3,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(15);

  expect(callback[12]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 4,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.TARGET_NOT_FOUND,
    }),
  );

  expect(callback[13]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  /**
   * Fifth step
   */
  await expect.poll(getScrollTop).toBeAround(2403);

  await expect(page).toHaveScreenshot('step5-tooltip.png');

  expect(callback[14]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 5,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-back').click();

  await expect.poll(() => callback.length).toBe(18);

  expect(callback[16]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.PREV,
      index: 3,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[17]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 3,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  /**
   * Fourth step again
   */
  await expect(page).toHaveScreenshot('step4-tooltip-back.png');

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(21);

  expect(callback[18]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 4,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.TARGET_NOT_FOUND,
    }),
  );

  /**
   * Fifth step again
   */
  await expect.poll(getScrollTop).toBeAround(2403);

  await expect(page).toHaveScreenshot('step5-tooltip-forward.png');

  expect(callback[19]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[20]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 5,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(24);

  expect(callback[21]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  /**
   * Sixth step
   */
  await expect(page).toHaveScreenshot('step6-tooltip.png');

  expect(callback[22]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 6,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[23]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 6,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  // Finish the tour
  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(28);

  expect(callback[24]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 6,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[25]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 6,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.FINISHED,
      type: EVENTS.TOUR_END,
    }),
  );

  expect(callback[26]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.RESET,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.READY,
      type: EVENTS.TOUR_STATUS,
    }),
  );

  expect(callback[27]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.STOP,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.PAUSED,
      type: EVENTS.TOUR_STATUS,
    }),
  );
});
