/* eslint-disable testing-library/prefer-screen-queries */
import './global.d';

import { expect, test } from '@playwright/experimental-ct-react';

import { ACTIONS, CallBackProps, EVENTS, LIFECYCLE, STATUS } from '../src';
import Controlled from '../test/__fixtures__/Controlled';

function formatCallbackResponse(input: Partial<CallBackProps>) {
  return {
    controlled: true,
    origin: null,
    size: 6,
    status: STATUS.RUNNING,
    ...input,
  };
}

test.use({ viewport: { width: 1024, height: 768 } });

test('should run the tour', async ({ mount, page }) => {
  const callback: Array<any> = [];

  await mount(
    <Controlled
      callback={({ step, ...rest }) => {
        callback.push(rest);
      }}
    />,
  );

  await expect.poll(() => callback.length).toBe(3);

  await expect(page).toHaveScreenshot('step1-tooltip.png');

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
      lifecycle: LIFECYCLE.TOOLTIP,
      type: EVENTS.TOOLTIP,
    }),
  );

  // Since the button is behind the overlay, we need to click it through the overlay hole
  await page.$eval<any, HTMLButtonElement>('.controlled-menu', element => element.click());

  await expect.poll(() => callback.length).toBe(8);

  expect(callback[3]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.PAUSED,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[4]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 1,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.PAUSED,
      type: EVENTS.TOUR_STATUS,
    }),
  );

  expect(callback[5]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.START,
      index: 1,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.RUNNING,
      type: EVENTS.TOUR_STATUS,
    }),
  );

  expect(callback[6]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.START,
      index: 1,
      lifecycle: LIFECYCLE.READY,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[7]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 1,
      lifecycle: LIFECYCLE.TOOLTIP,
      status: STATUS.RUNNING,
      type: EVENTS.TOOLTIP,
    }),
  );

  await expect(page).toHaveScreenshot('step2-tooltip.png');

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(13);

  expect(callback[8]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 1,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[9]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 2,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.PAUSED,
      type: EVENTS.TOUR_STATUS,
    }),
  );

  expect(callback[10]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.START,
      index: 2,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.RUNNING,
      type: EVENTS.TOUR_STATUS,
    }),
  );

  expect(callback[11]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.START,
      index: 2,
      lifecycle: LIFECYCLE.READY,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[12]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 2,
      lifecycle: LIFECYCLE.TOOLTIP,
      status: STATUS.RUNNING,
      type: EVENTS.TOOLTIP,
    }),
  );

  await expect(page).toHaveScreenshot('step3-tooltip.png');

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(16);

  expect(callback[13]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 2,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[14]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 3,
      lifecycle: LIFECYCLE.READY,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[15]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 3,
      lifecycle: LIFECYCLE.TOOLTIP,
      status: STATUS.RUNNING,
      type: EVENTS.TOOLTIP,
    }),
  );

  await expect(page).toHaveScreenshot('step4-tooltip.png');

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(19);

  expect(callback[16]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 3,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[17]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 4,
      lifecycle: LIFECYCLE.READY,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[18]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 4,
      lifecycle: LIFECYCLE.TOOLTIP,
      status: STATUS.RUNNING,
      type: EVENTS.TOOLTIP,
    }),
  );

  await expect(page).toHaveScreenshot('step5-tooltip.png');

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(22);

  expect(callback[19]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 4,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[20]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.READY,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_BEFORE,
    }),
  );

  expect(callback[21]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.UPDATE,
      index: 5,
      lifecycle: LIFECYCLE.TOOLTIP,
      status: STATUS.RUNNING,
      type: EVENTS.TOOLTIP,
    }),
  );

  await expect(page).toHaveScreenshot('step6-tooltip.png');

  await page.getByTestId('button-primary').click();

  await expect.poll(() => callback.length).toBe(24);

  expect(callback[22]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.COMPLETE,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
    }),
  );

  expect(callback[23]).toEqual(
    formatCallbackResponse({
      action: ACTIONS.NEXT,
      index: 5,
      lifecycle: LIFECYCLE.INIT,
      status: STATUS.FINISHED,
      type: EVENTS.TOUR_END,
    }),
  );

  await expect(page).toHaveScreenshot('tour-ended.png');
});
