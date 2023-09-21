import React from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';

import Standard from '../__fixtures__/Standard';
import { callbackResponseFactory } from '../__fixtures__/test-helpers';
import { cleanup, fireEvent, render, screen, waitFor } from '../__fixtures__/test-utils';

const getCallbackResponse = callbackResponseFactory();

const mockCallback = jest.fn();

describe('Joyride > Standard', () => {
  render(<Standard callback={mockCallback} />);

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    cleanup();
  });

  it('should render the content', () => {
    expect(screen.getByTestId('demo')).toMatchSnapshot();
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it('should start the tour', async () => {
    fireEvent.click(screen.getByTestId('start'));

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
  });

  it('should have rendered the STEP 1 Beacon', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        2,
        getCallbackResponse({
          action: ACTIONS.START,
          index: 0,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      3,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should be able to click STEP 1 Beacon', () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      4,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 1 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      5,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 2 Tooltip', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        6,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 1,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      7,
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
      8,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 3 Tooltip', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        9,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 2,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      10,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 3 Back button', () => {
    fireEvent.click(screen.getByTestId('button-back'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      11,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 2 Tooltip and advance AGAIN', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        12,
        getCallbackResponse({
          action: ACTIONS.PREV,
          index: 1,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      13,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 2 Primary button AGAIN', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      14,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 3 Tooltip AGAIN', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        15,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 2,
          lifecycle: LIFECYCLE.READY,
          type: EVENTS.STEP_BEFORE,
        }),
      );
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
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

    expect(mockCallback).toHaveBeenNthCalledWith(
      17,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have skipped the unmounted STEP 4', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        18,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 3,
          lifecycle: LIFECYCLE.INIT,
          type: EVENTS.TARGET_NOT_FOUND,
        }),
      );
    });
  });

  it('should have rendered the STEP 4 Tooltip', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(20);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      20,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 4 Primary button', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        21,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 4,
          lifecycle: LIFECYCLE.COMPLETE,
          status: STATUS.RUNNING,
          type: EVENTS.STEP_AFTER,
        }),
      );
    });
  });

  it('should have rendered the STEP 5 Tooltip', () => {
    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      23,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 5 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      24,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have ended the tour', async () => {
    expect(mockCallback).toHaveBeenNthCalledWith(
      25,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      26,
      getCallbackResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      27,
      getCallbackResponse({
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );
  });
});
