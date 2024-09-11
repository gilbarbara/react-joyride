import React from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';

import Customized from '../__fixtures__/CustomOptions';
import { callbackResponseFactory } from '../__fixtures__/test-helpers';
import { cleanup, fireEvent, render, screen, waitFor } from '../__fixtures__/test-utils';

const getCallbackResponse = callbackResponseFactory({ size: 4 });

const mockCallback = vi.fn();
const mockFinishedCallback = vi.fn();
const mockGetPopper = vi.fn();

describe('Joyride > Custom Options', () => {
  render(
    <Customized
      callback={mockCallback}
      finishedCallback={mockFinishedCallback}
      floaterProps={{
        getPopper: (popper, type) => {
          mockGetPopper(popper, type);
        },
        styles: {
          arrow: {
            color: '#fff647',
          },
        },
      }}
    />,
  );

  afterAll(() => {
    cleanup();
  });

  it('should start the tour', async () => {
    fireEvent.click(screen.getByTestId('start'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });

  it('should render STEP 1 Beacon', async () => {
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
  });

  it('should render STEP 1 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(4);
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

  it('should render STEP 3 Tooltip', () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    expect(mockCallback).toHaveBeenCalledTimes(11);

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getById('react-joyride-step-2').querySelector('div')).toMatchSnapshot();
  });

  it('should handle clicking STEP 3 Close button', () => {
    fireEvent.click(screen.getByTestId('button-close'));

    expect(mockCallback).toHaveBeenCalledTimes(14);
  });

  it('should render STEP 4 Beacon', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(14);
    });

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
  });

  it('should render STEP 4 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(15);
    });

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getById('react-joyride-step-3').querySelector('div')).toMatchSnapshot();
  });

  it('should have ended the tour', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      18,
      getCallbackResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockGetPopper).toHaveBeenCalledTimes(8);
    expect(mockFinishedCallback).toHaveBeenCalledTimes(1);
  });
});
