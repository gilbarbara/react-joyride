/* eslint-disable testing-library/prefer-screen-queries */
import './global.d';

import React from 'react';
import { expect, test } from '@playwright/experimental-ct-react';

import { ACTIONS, CallBackProps, EVENTS, LIFECYCLE, STATUS } from '../src';
import Standard from '../test/__fixtures__/Standard';

function formatCallbackResponse(input: Partial<CallBackProps>) {
  return {
    controlled: false,
    origin: null,
    size: 6,
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
      action: ACTIONS.START,
      index: 0,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[2]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 0,
      lifecycle: LIFECYCLE.BEACON,
      type: EVENTS.BEACON,
    }),
  );

  await expect.poll(getScrollTop).toBeAround(800);

  await expect(page).toHaveScreenshot('step1-beacon.png');

  // First step
  await page.getByTestId('button-beacon').click();

  expect(callback[3]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 0,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await expect(page).toHaveScreenshot('step1-tooltip.png');

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(7);

  expect(callback[4]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  // Second step
  await expect.poll(getScrollTop).toBeAround(1605);

  await expect(page).toHaveScreenshot('step2-tooltip.png');

  expect(callback[5]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 1,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[6]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 1,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  // Since the button is behind the overlay, we need to click it through the overlay hole
  await page.$eval<any, HTMLButtonElement>('[data-test-id="mission-button"]', element =>
    element.click(),
  );

  await expect.poll(() => callback.length).toBe(10);

  expect(callback[7]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 1,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  // Third step
  await expect.poll(getScrollTop).toBeAround(2335);

  await expect(page).toHaveScreenshot('step3-tooltip.png');

  expect(callback[8]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 2,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[9]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 2,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(14);

  expect(callback[10]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 2,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[11]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 3,
      lifecycle: LIFECYCLE.INIT,
      type: EVENTS.TARGET_NOT_FOUND,
    }),
  );

  // Fourth step
  await expect.poll(getScrollTop).toBeAround(2403);

  await expect(page).toHaveScreenshot('step4-tooltip.png');

  expect(callback[12]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 4,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[13]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 4,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-back').click();

  await expect.poll(() => callback.length).toBe(18);

  expect(callback[14]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.PREV,
      index: 4,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[15]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.PREV,
      index: 3,
      lifecycle: LIFECYCLE.INIT,
      type: EVENTS.TARGET_NOT_FOUND,
    }),
  );

  // Back to the third step
  await expect(page).toHaveScreenshot('step3-tooltip-back.png');

  expect(callback[16]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 2,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[17]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 2,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(22);

  expect(callback[18]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 2,
      lifecycle: LIFECYCLE.COMPLETE,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[19]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 3,
      lifecycle: LIFECYCLE.INIT,
      type: EVENTS.TARGET_NOT_FOUND,
    }),
  );

  // go to the fourth step again
  await expect.poll(getScrollTop).toBeAround(2403);

  await expect(page).toHaveScreenshot('step4-tooltip-forward.png');

  expect(callback[20]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 4,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[21]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 4,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(25);

  expect(callback[22]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 4,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  // Fifth step
  await expect(page).toHaveScreenshot('step5-tooltip.png');

  expect(callback[23]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 5,
      lifecycle: LIFECYCLE.READY,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[24]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 5,
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  // Finish the tour
  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(29);

  expect(callback[25]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.FINISHED,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[26]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.FINISHED,
      type: EVENTS.TOUR_END,
    }),
  );

  expect(callback[27]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.RESET,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.READY,
      type: EVENTS.TOUR_STATUS,
    }),
  );

  expect(callback[28]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.STOP,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.PAUSED,
      type: EVENTS.TOUR_STATUS,
    }),
  );
});
