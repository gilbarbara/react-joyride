import React from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';

import Controlled from '../__fixtures__/Controlled';
import { callbackResponseFactory } from '../__fixtures__/test-helpers';
import { act, cleanup, fireEvent, render, screen } from '../__fixtures__/test-utils';

vi.useFakeTimers();

const getCallbackResponse = callbackResponseFactory({
  controlled: true,
  size: 6,
});

const mockCallback = vi.fn();

describe('Joyride > Controlled', () => {
  render(<Controlled callback={mockCallback} />);

  afterAll(() => {
    cleanup();
  });

  it('should start the tour', async () => {
    expect(screen.getByTestId('controlled')).toMatchSnapshot();

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(3);

    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      1,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.TOUR_START,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      2,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 0,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      3,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 1 menu button', async () => {
    fireEvent.click(screen.getByTestId('menu'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      4,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.PAUSED,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should pause and restart the tour while opening the sidebar', async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(8);

    expect(mockCallback).toHaveBeenNthCalledWith(
      5,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      6,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 1,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.TOUR_STATUS,
      }),
    );
  });

  it('should have rendered STEP 2 Tooltip', async () => {
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot();
    expect(screen.getByTestId('sidebar')).toHaveClass('open');

    expect(mockCallback).toHaveBeenNthCalledWith(
      7,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      8,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 2 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      9,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should pause and restart the tour while hiding the sidebar', async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(13);

    expect(mockCallback).toHaveBeenNthCalledWith(
      10,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      11,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.TOUR_STATUS,
      }),
    );
  });

  it('should have rendered STEP 3 Tooltip', async () => {
    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      12,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      13,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 3 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenCalledTimes(16);

    expect(mockCallback).toHaveBeenNthCalledWith(
      14,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
    expect(mockCallback).toHaveBeenNthCalledWith(
      15,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );
    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should have rendered STEP 4 Tooltip', async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(16);

    expect(screen.getById('react-joyride-step-3')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      15,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 4 Back button', () => {
    fireEvent.click(screen.getByTestId('button-back'));

    expect(mockCallback).toHaveBeenCalledTimes(19);

    expect(mockCallback).toHaveBeenNthCalledWith(
      17,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
    expect(mockCallback).toHaveBeenNthCalledWith(
      18,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );
    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should have rendered STEP 3 Tooltip AGAIN', async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(19);

    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      18,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 3 Primary button AGAIN', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenCalledTimes(22);

    expect(mockCallback).toHaveBeenNthCalledWith(
      20,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      21,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );
    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should have rendered STEP 4 Tooltip AGAIN', async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(22);

    expect(screen.getById('react-joyride-step-3')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      21,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 4 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenCalledTimes(25);

    expect(mockCallback).toHaveBeenNthCalledWith(
      23,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      24,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 4,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );
    expect(mockCallback).toHaveBeenNthCalledWith(
      25,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should have rendered STEP 5 Tooltip', async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(25);

    expect(screen.getById('react-joyride-step-4')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      24,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 4,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      25,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 5 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenCalledTimes(28);

    expect(mockCallback).toHaveBeenNthCalledWith(
      26,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 4,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      27,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );
    expect(mockCallback).toHaveBeenNthCalledWith(
      28,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should have rendered STEP 6 Tooltip', async () => {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(mockCallback).toHaveBeenCalledTimes(28);

    expect(screen.getById('react-joyride-step-5')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      27,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      28,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 6 Primary button and ended the tour', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenCalledTimes(30);

    expect(mockCallback).toHaveBeenNthCalledWith(
      29,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      30,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );
  });
});
