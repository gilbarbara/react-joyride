import React from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';

import Customized from '../__fixtures__/CustomOptions';
import { callbackResponseFactory } from '../__fixtures__/test-helpers';
import { cleanup, fireEvent, render, screen, waitFor } from '../__fixtures__/test-utils';

const mockCallback = vi.fn();
const mockFinishedCallback = vi.fn();
const mockGetPopper = vi.fn();

vi.mock('~/modules/helpers', async () => {
  const helpers = await vi.importActual('~/modules/helpers');

  return {
    ...helpers,
    isLegacy: () => false,
  };
});

const getCallbackResponse = callbackResponseFactory({ size: 4 });

const props = {
  callback: mockCallback,
  finishedCallback: mockFinishedCallback,
  floaterProps: {
    getPopper: mockGetPopper,
    styles: {
      arrow: {
        color: '#fff647',
      },
    },
  },
};

describe('Joyride > Custom Options', () => {
  const { rerender } = render(<Customized {...props} />);

  afterAll(() => {
    cleanup();
  });

  it('should render STEP 1 Beacon', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('should render STEP 1 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(4);
    });

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
    expect(screen.getById('react-joyride-step-0').querySelector('div')).toMatchSnapshot('tooltip');
  });

  it('should handle clicking STEP 1 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenCalledTimes(7);
  });

  it('should render STEP 2 Tooltip', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(7);
    });

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
    expect(screen.getById('react-joyride-step-1').querySelector('div')).toMatchSnapshot('tooltip');
  });

  it('should close STEP 2 Tooltip by clicking the overlay', async () => {
    fireEvent.click(screen.getByTestId('overlay'));

    expect(mockCallback).toHaveBeenCalledTimes(10);
  });

  it('should render STEP 3 Beacon', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(10);
    });

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
  });

  it('should render STEP 3 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    expect(mockCallback).toHaveBeenCalledTimes(11);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getById('react-joyride-step-2').querySelector('div')).toMatchSnapshot();
  });

  it('should handle clicking STEP 3 Close button', () => {
    fireEvent.click(screen.getByTestId('button-close'));

    expect(mockCallback).toHaveBeenCalledTimes(14);

    expect(mockCallback).toHaveBeenNthCalledWith(
      12,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'button_close',
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      13,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      14,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.BEACON,
        status: STATUS.RUNNING,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should pause and restart the tour', () => {
    rerender(<Customized {...props} run={false} />);

    expect(mockCallback).toHaveBeenNthCalledWith(
      15,
      getCallbackResponse({
        action: ACTIONS.STOP,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    rerender(<Customized {...props} run />);

    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 3,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.RUNNING,
        type: EVENTS.TOUR_START,
      }),
    );
  });

  it('should render STEP 4 Beacon', async () => {
    expect(mockCallback).toHaveBeenNthCalledWith(
      17,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      18,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.BEACON,
        status: STATUS.RUNNING,
        type: EVENTS.BEACON,
      }),
    );

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
  });

  it('should render STEP 4 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(19);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        status: STATUS.RUNNING,
        type: EVENTS.TOOLTIP,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getById('react-joyride-step-3').querySelector('div')).toMatchSnapshot();
  });

  it('should have ended the tour', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      20,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      21,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockGetPopper).toHaveBeenCalledTimes(9);
    expect(mockFinishedCallback).toHaveBeenCalledTimes(1);
  });
});
