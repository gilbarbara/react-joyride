/* eslint-disable testing-library/prefer-screen-queries */
import './global.d';

import { expect, test } from '@playwright/experimental-ct-react';

import { ACTIONS, CallBackProps, EVENTS, LIFECYCLE, STATUS } from '../src';
import Scroll from '../test/__fixtures__/Scroll';

function formatCallbackResponse(input: Partial<CallBackProps>) {
  return {
    controlled: false,
    origin: null,
    size: 5,
    status: STATUS.RUNNING,
    ...input,
  };
}

test.use({ viewport: { width: 1024, height: 768 } });

test('scroll', async ({ mount, page }) => {
  const callback: Array<any> = [];

  const getScrollTop = async () => {
    const scrollingElementHandle = await page.evaluateHandle(() =>
      Promise.resolve(document.querySelector('.scroll-content')?.scrollTop),
    );
    const value = scrollingElementHandle.jsonValue();

    await scrollingElementHandle.dispose();

    return value;
  };

  const waitForScrollEnd = () =>
    page.waitForFunction(() => {
      return new Promise(resolve => {
        const getPositions = () => [
          document.scrollingElement?.scrollTop ?? 0,
          document.querySelector('.scroll-content')?.scrollTop ?? 0,
        ];

        let stableCount = 0;
        let last = [-1, -1];

        const check = () => {
          const pos = getPositions();

          if (pos[0] === last[0] && pos[1] === last[1]) {
            stableCount++;

            if (stableCount >= 3) {
              resolve(true);

              return;
            }
          } else {
            stableCount = 0;
          }

          last = pos;
          setTimeout(check, 100);
        };

        setTimeout(check, 400);
      });
    });

  await test.step('Start the tour', async () => {
    await mount(
      <Scroll
        callback={({ step: _step, ...rest }) => {
          callback.push(rest);
        }}
      />,
    );

    await waitForScrollEnd();
    await expect(page).toHaveScreenshot('step1-beacon.png');
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
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  await test.step('Step 1 tooltip', async () => {
    await page.getByTestId('button-beacon').click();

    expect(callback[3]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    await waitForScrollEnd();

    await expect(page).toHaveScreenshot('step1-tooltip.png');
    await expect.poll(getScrollTop).toBeAround(0);
  });

  await test.step('Step 2', async () => {
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

    await waitForScrollEnd();
    await expect(page).toHaveScreenshot('step2-tooltip.png');
    await expect.poll(getScrollTop).toBeAround(0);

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
  });

  await test.step('Step 2 - scroll container', async () => {
    await page.evaluate(() => document.querySelector('.scroll-content')!.scrollBy(0, 100));
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('step2.1-tooltip-after-scroll.png');
  });

  await test.step('Step 3', async () => {
    // Click Next button through spotlight
    await page.getByText('Next').click();

    await expect.poll(() => callback.length).toBe(10);

    expect(callback[7]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    await waitForScrollEnd();
    await expect(page).toHaveScreenshot('step3-tooltip.png');
    await expect.poll(getScrollTop).toBeAround(411, 25);

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
  });

  await test.step('Step 4', async () => {
    await page.getByTestId('button-primary').click();

    await expect.poll(() => callback.length).toBe(13);

    expect(callback[10]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    await waitForScrollEnd();
    await expect(page).toHaveScreenshot('step4-tooltip.png');
    await expect.poll(getScrollTop).toBeAround(350, 25);

    expect(callback[11]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(callback[12]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  await test.step('Go back to Step 3', async () => {
    await page.getByTestId('button-back').click();

    await expect.poll(() => callback.length).toBe(16);

    expect(callback[13]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.PREV,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    await waitForScrollEnd();
    await expect(page).toHaveScreenshot('step3-tooltip-back.png');
    await expect.poll(getScrollTop).toBeAround(290, 25);

    expect(callback[14]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(callback[15]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  await test.step('Forward to Step 4 again', async () => {
    await page.getByTestId('button-primary').click();

    await expect.poll(() => callback.length).toBe(19);

    expect(callback[16]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    await waitForScrollEnd();
    await expect(page).toHaveScreenshot('step4-tooltip-forward.png');
    await expect.poll(getScrollTop).toBeAround(574, 25);

    expect(callback[17]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(callback[18]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  await test.step('Step 5', async () => {
    await page.getByTestId('button-primary').click();

    await expect.poll(() => callback.length).toBe(22);

    expect(callback[19]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );

    await waitForScrollEnd();
    await expect(page).toHaveScreenshot('step5-tooltip.png');
    await expect.poll(getScrollTop).toBeAround(735, 30);

    expect(callback[20]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
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
  });

  await test.step('Finish the tour', async () => {
    await page.getByTestId('button-primary').click();

    await expect.poll(() => callback.length).toBe(26);

    expect(callback[22]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.NEXT,
        index: 4,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(callback[23]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(callback[24]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(callback[25]).toEqual(
      formatCallbackResponse({
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );
  });
});
