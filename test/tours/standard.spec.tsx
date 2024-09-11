import React from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';

import Standard from '../__fixtures__/Standard';
import { callbackResponseFactory } from '../__fixtures__/test-helpers';
import { act, cleanup, fireEvent, render, screen, waitFor } from '../__fixtures__/test-utils';

const getCallbackResponse = callbackResponseFactory();

const mockCallback = vi.fn();
const mockGetPopper = vi.fn();

describe('Joyride > Standard', () => {
  render(
    <Standard
      callback={mockCallback}
      floaterProps={{
        getPopper: (popper, type) => {
          mockGetPopper(popper, type);
        },
      }}
    />,
  );

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
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

  it('should render STEP 1 Beacon', async () => {
    expect(screen.getById('react-joyride-step-0-wrapper')).toMatchSnapshot();

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

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
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should render STEP 1 Tooltip', () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot();
    expect(screen.getById('react-joyride-step-0-wrapper')).toHaveStyle('visibility: hidden');

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

  it('should handle clicking STEP 1 Primary button', () => {
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

  it('should render STEP 2 Tooltip', async () => {
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot();
    expect(screen.getById('react-joyride-step-1-wrapper')).toHaveStyle('visibility: hidden');

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(7);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      6,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

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

  it('should close STEP 2 Tooltip with keyboard', async () => {
    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      8,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'keyboard',
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 3 Beacon', async () => {
    expect(screen.getById('react-joyride-step-2-wrapper')).toMatchSnapshot();

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(10);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      9,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      10,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should render STEP 3 Tooltip', () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot();
    expect(screen.getById('react-joyride-step-2-wrapper')).toHaveStyle('visibility: hidden');

    expect(mockCallback).toHaveBeenNthCalledWith(
      11,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 3 Back button', () => {
    fireEvent.click(screen.getByTestId('button-back'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      12,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 2 Tooltip AGAIN', async () => {
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot();
    expect(screen.getById('react-joyride-step-1-wrapper')).toHaveStyle('visibility: hidden');

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(14);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      13,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      14,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 2 Overlay', () => {
    fireEvent.click(screen.getByTestId('overlay'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      15,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'overlay',
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 3 Beacon AGAIN', async () => {
    expect(screen.getById('react-joyride-step-2-wrapper')).toMatchSnapshot();

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(17);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      17,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should render STEP 3 Tooltip AGAIN', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot();
    expect(screen.getById('react-joyride-step-2-wrapper')).toHaveStyle('visibility: hidden');

    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        18,
        getCallbackResponse({
          action: ACTIONS.UPDATE,
          index: 2,
          lifecycle: LIFECYCLE.TOOLTIP,
          type: EVENTS.TOOLTIP,
        }),
      );
    });
  });

  it('should handle clicking STEP 3 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should skip the unmounted STEP 4', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        20,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 3,
          lifecycle: LIFECYCLE.INIT,
          type: EVENTS.TARGET_NOT_FOUND,
        }),
      );
    });
  });

  it('should render STEP 5 Tooltip', async () => {
    expect(screen.getById('react-joyride-step-4')).toMatchSnapshot();
    expect(screen.getById('react-joyride-step-4-wrapper')).toHaveStyle('visibility: hidden');

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(22);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      21,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 5 Primary button', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        23,
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

  it('should render STEP 6 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getById('react-joyride-step-5')).toBeInTheDocument();
    });
    expect(screen.getById('react-joyride-step-5')).toMatchSnapshot();
    expect(screen.getById('react-joyride-step-5-wrapper')).toHaveStyle('visibility: hidden');

    expect(mockCallback).toHaveBeenNthCalledWith(
      24,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      25,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 6 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      26,
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
      27,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      28,
      getCallbackResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      29,
      getCallbackResponse({
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockGetPopper).toHaveBeenCalledTimes(12);
  });

  it('should restart the tour', async () => {
    mockCallback.mockClear();
    mockGetPopper.mockClear();

    fireEvent.click(screen.getByTestId('start'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    expect(screen.getByTestId('button-beacon')).toMatchSnapshot('beacon');

    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(4);
    });

    expect(screen.getById('react-joyride-step-0').querySelector('div')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });
});
