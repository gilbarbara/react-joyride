import React from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';
import {
  act,
  callbackResponseFactory,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '~/test-utils';

import Standard from '../__fixtures__/Standard';

const getCallbackResponse = callbackResponseFactory({ size: 7 });

const mockCallback = vi.fn();
const mockOnPosition = vi.fn();

describe('Joyride > Standard', () => {
  render(<Standard callback={mockCallback} floatingOptions={{ onPosition: mockOnPosition }} />);

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

  it('should skip STEP 1 Beacon', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      2,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
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

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
  });

  it('should render STEP 1 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should handle clicking STEP 1 Primary button', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(6);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      4,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 2 Tooltip', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(6);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      5,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      6,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-1-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should close STEP 2 Tooltip with keyboard', async () => {
    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      7,
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
    expect(screen.getById('react-joyride-step-2-beacon')).toMatchSnapshot();

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(9);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      8,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      9,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should render STEP 3 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-2-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

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

  it('should handle clicking STEP 3 Back button', () => {
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

  it('should render STEP 2 Tooltip AGAIN', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-1-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(13);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      12,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

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

  it('should handle clicking STEP 2 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      14,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: null,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 3 Tooltip AGAIN', async () => {
    expect(mockCallback).toHaveBeenNthCalledWith(
      15,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-2-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should handle clicking STEP 3 Overlay', () => {
    fireEvent.click(screen.getByTestId('spotlight').querySelector('path')!);

    expect(mockCallback).toHaveBeenNthCalledWith(
      17,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'overlay',
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 4 Beacon', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(19);
    });

    expect(screen.getById('react-joyride-step-3-beacon')).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      18,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should render STEP 4 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(20);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      20,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(screen.queryById('react-joyride-step-3-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-3')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should handle clicking STEP 4 Primary button and skip missing target', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenNthCalledWith(
        21,
        getCallbackResponse({
          action: ACTIONS.NEXT,
          index: 4,
          lifecycle: LIFECYCLE.READY,
          status: STATUS.RUNNING,
          type: EVENTS.TARGET_NOT_FOUND,
        }),
      );
    });
  });

  it('should render STEP 6 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-5-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-5')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.NEXT,
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

  it('should handle clicking STEP 6 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      24,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 7 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-6-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-6')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    expect(mockCallback).toHaveBeenNthCalledWith(
      25,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 6,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      26,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 6,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 7 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      27,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 6,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have ended the tour', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(30);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      28,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 6,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      29,
      getCallbackResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      30,
      getCallbackResponse({
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );
  });

  it('should have called onPosition', () => {
    expect(mockOnPosition).toHaveBeenCalledTimes(10);
  });

  it('should restart the tour', async () => {
    mockCallback.mockClear();

    fireEvent.click(screen.getByTestId('start'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });
});
